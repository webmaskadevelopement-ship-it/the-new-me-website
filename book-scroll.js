/**
 * THE BOOK — Protein-Engine Scroll Film v3 (Home page)
 * -------------------------------------------------------------
 * The protein page's scroll system (Lenis + dual-engine scrub + RAF render)
 * driving the book reel, with the user's editorial choreography:
 *
 *  - GLITCH CUTS: the AI-morph frames (93-101, 119-139, 189-212) are never
 *    shown; the whiteout flood covers each jump (close-up scene -> bloom ->
 *    page-tunnel scene, per the brief).
 *  - 15-20s READ TIME PER PHASE: film segments play in slow motion and each
 *    white page holds ~620 steps; the open-book spreads reveal paragraph by
 *    paragraph, scroll-linked (opacity is scrubbed, not timed).
 *  - TEXT TRANSFORM: white type over film turns ink as the flood rises (the
 *    on-white class starts at the ramp, never white-on-white).
 *  - TITLE CRAFT: line-mask rise for the display title, letter-spacing
 *    settle on the running head, staggered paragraph rise on white.
 */

(function () {
  'use strict';

  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }
  window.scrollTo(0, 0);

  const SECTION_SEL = '#book-page-film';
  const VIEWPORT_SEL = '#book-page-viewport';
  const CANVAS_SEL = '#book-page-canvas';

  const TOTAL_FRAMES = 306; // 331 - 25 removed (77..101), rebased
  const FRAME_PATH = (i) => `frames/book-page/frame_${String(i).padStart(3, '0')}.webp`;

  const HERO_PHASE_FRACTION = 0.13;
  // Hard scroll-stop over film headlines: after the headline shot settles,
  // the same frame is held briefly so the heading can be read before the
  // bloom arrives.
  const HEAD_HOLD = 56;
  const HERO_ZOOM = 1.30;
  const SCRIM_MAX = 0.55;

  // Clean scenes only — the AI-glitch morphs (93-101, 119-139, 189-212) are
  // never mapped; the whiteout flood covers each jump.
  // Post-rebase indices (frames 77..101 of the original export removed).
  const FILM_SEGMENTS = [
    { id: 't1',     from: 14,  to: 45,  spf: 2.2, holdAfter: true  }, // the book, opened mid-motion
    { id: 't2a',    from: 46,  to: 64,  spf: 2.0, holdAfter: false }, // close-up drops (tear frame cut)
    { id: 't2b',    from: 68,  to: 76,  spf: 2.0, holdAfter: true  }, // drops close the scene
    { id: 't3a',    from: 77,  to: 93,  spf: 2.0, holdAfter: false }, // the tunnel forms
    { id: 't3b',    from: 115, to: 163, spf: 2.0, holdAfter: true  }, // the heart in the tunnel
    { id: 'quote',  from: 188, to: 259, spf: 2.0, holdAfter: true  }, // heart close-up -> leaf-heart opening
    { id: 'finale', from: 260, to: 305, spf: 2.2, holdAfter: false }  // aperture opens to the wide shot
  ];

  function isReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  // Duplicate every marquee track once so the -50% CSS loop is seamless
  function duplicateMarquee() {
    const tracks = document.querySelectorAll('.reviews-marquee-track');
    Array.prototype.forEach.call(tracks, function (track) {
      if (track.dataset.cloned === '1') return;
      track.dataset.cloned = '1';
      const cards = Array.prototype.slice.call(track.children);
      cards.forEach(function (card) {
        const clone = card.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        track.appendChild(clone);
      });
    });
  }

  class BookScrollAnimation {
    constructor() {
      const gsap = window.gsap;
      const ScrollTrigger = window.ScrollTrigger;
      if (!gsap || !ScrollTrigger) {
        console.error('[BookScroll] GSAP/ScrollTrigger missing.');
        return;
      }
      this.gsap = gsap;
      this.ScrollTrigger = ScrollTrigger;
      gsap.registerPlugin(ScrollTrigger);

      this.section = document.querySelector(SECTION_SEL);
      this.viewport = document.querySelector(VIEWPORT_SEL);
      this.canvas = document.querySelector(CANVAS_SEL);
      this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
      if (!this.section || !this.viewport || !this.canvas || !this.ctx) return;

      this.isDesktop = window.innerWidth > 768;
      this.images = new Array(TOTAL_FRAMES);
      // Per-frame luminance (adaptive ink: bright frames flip the title to ink)
      this.lum = new Array(TOTAL_FRAMES).fill(120);
      this.dpr = Math.min(window.devicePixelRatio || 1, 2);
      this.currentStep = 0;
      this.scrollDirection = 1;
      this.renderPending = false;
      this.lastRenderedImage = null;
      this.heroActive = true;
      this.animState = { step: 0 };

      window.bookAnim = this;

      document.body.classList.add('has-scroll-film');
      document.documentElement.style.scrollBehavior = 'auto';

      // ---- Choreography universe (step -> frame + text phases) ----
      this.universe = this.buildUniverse();
      this.totalSteps = this.universe.map.length;

      // Text blocks in DOM order: t1, t2, t3 (spreads), quote, finale
      this.blocks = [];
      const els = document.querySelectorAll(SECTION_SEL + ' .book-page-chapter');
      const phaseFor = { a: 0, b: 1, finale: 2 };
      const paras = Array.prototype.slice.call(
        document.querySelectorAll(SECTION_SEL + ' .book-page-chapter .bp-page p')
      );
      let paraCursor = 0;
      els.forEach((el) => {
        const id = el.getAttribute('data-chapter');
        const phaseIdx = phaseFor[id];
        const phase = this.universe.phases[phaseIdx] || null;
        const count = phase && phase.paras ? phase.paras.length : 0;
        const block = { id: id, el: el, phase: phase, state: '', paras: [] };
        for (let i = 0; i < count; i++) {
          const pEl = paras[paraCursor++];
          if (pEl) block.paras.push({ el: pEl, win: phase.paras[i] });
        }
        this.blocks.push(block);
      });

      this.scrimEl = document.querySelector(SECTION_SEL + ' .book-film-scrim');
      this.whiteoutEl = document.querySelector(SECTION_SEL + ' .book-page-whiteout');

      this.resizeCanvas = this.resizeCanvas.bind(this);
      this.resizeCanvas();
      window.addEventListener('resize', this.resizeCanvas, { passive: true });

      // SplitText-style line reveal state (split after fonts settle)
      this.splitReady = false;
      this.lineWins = [];
      this.paraTweens = []; // FadeContent mist faders per paragraph (word-by-word)

      document.documentElement.classList.add('js-splitting');

      this.initLenis();
      this.preloadFrames();
      this.initScrollTrigger();
      this.renderStep(0, true);

      // Skip-film escape hatch must go through Lenis (native anchor jumps
      // get pulled back by the ticker)
      const skip = document.querySelector(SECTION_SEL + ' .skip-film-link');
      if (skip) {
        skip.addEventListener('click', (e) => {
          e.preventDefault();
          const target = document.querySelector(skip.getAttribute('href'));
          if (target && window.bookLenis) {
            window.bookLenis.scrollTo(target, { immediate: true });
          } else if (target) {
            window.scrollTo(0, target.getBoundingClientRect().top + window.scrollY);
          }
        });
      }
    }

    // ---- Step universe: slow film + long white holds, glitch-free ----
    buildUniverse() {
      const isDesktop = this.isDesktop;
      const spfScale = isDesktop ? 1 : 0.72;
      const holdSteps = isDesktop ? 120 : 90;
      const map = [];
      const phases = [];

      const segSteps = (seg) => {
        const spf = seg.spf * spfScale;
        const count = seg.to - seg.from + 1;
        const steps = Math.max(8, Math.round(count * spf));
        const frames = [];
        for (let s = 0; s < steps; s++) {
          frames.push(seg.from + Math.min(count - 1, Math.floor((s / steps) * count)));
        }
        return frames;
      };

      const addSegment = (seg) => {
        const start = map.length;
        segSteps(seg).forEach((f) => map.push(f));
        return { start: start, end: map.length, lastFrame: seg.to };
      };

      // Phase plan: t3's film is the two clean tunnel runs (102-118 + 140-188)
      // spliced with a hard cut; the flare morphs stay on the cutting floor.
      const PHASES = [
        // Client: max 3 scrolls, text = one-liners.
        { id: 'a', segIdx: 0, extra: null, hold: holdSteps, paras: 1, headHold: HEAD_HOLD },
        { id: 'b', segIdx: 3, extra: 4, hold: holdSteps, paras: 1, headHold: HEAD_HOLD },
        { id: 'finale', segIdx: 6, extra: null, hold: 0, paras: 0, headHold: 0 }
      ];

      PHASES.forEach((ph) => {
        const filmStart = map.length;
        const s1 = addSegment(FILM_SEGMENTS[ph.segIdx]);
        let filmEnd = s1.end;
        let lastFrame = s1.lastFrame;
        if (ph.extra !== null) {
          const s2 = addSegment(FILM_SEGMENTS[ph.extra]);
          filmEnd = s2.end;
          lastFrame = s2.lastFrame;
        }
        // Hard stop on the headline: hold the settled last frame briefly.
        const headHoldSteps = Math.round((ph.headHold || 0) * (isDesktop ? 1 : 0.7));
        for (let h = 0; h < headHoldSteps; h++) map.push(lastFrame);
        const holdStart = map.length;
        for (let h = 0; h < ph.hold; h++) map.push(lastFrame);
        const holdEnd = map.length;

        phases.push({
          id: ph.id,
          filmStart: filmStart,
          filmEnd: filmEnd,
          holdEnd: holdEnd,
          white: ph.hold > 8
            ? { upStart: holdStart - 8, upEnd: holdStart + 2, downStart: holdEnd, downEnd: holdEnd + 8 }
            : null,
          paras: ph.paras
            ? [0, 1, 2, 3].map((p) => [
                holdStart + 6 + p * 8,
                holdStart + 32 + p * 8,
                holdEnd - 18 + p * 4,
                holdEnd - 6 + p * 4
              ])
            : null
        });
      });

      const totalSteps = map.length;
      // No final whiteout: the last frame (330) sticks to the canvas and
      // the pin releases straight into the page flow.
      return { map: map, phases: phases, totalSteps: totalSteps };
    }

    // ---- Protein-verbatim canvas sizing ----
    resizeCanvas() {
      if (!this.canvas || !this.ctx || !this.viewport) return;
      const rect = this.viewport.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;

      this.canvas.width = Math.round(w * this.dpr);
      this.canvas.height = Math.round(h * this.dpr);
      this.canvas.style.width = `${w}px`;
      this.canvas.style.height = `${h}px`;

      this.ctx.imageSmoothingEnabled = true;
      this.ctx.imageSmoothingQuality = 'high';

      const imgW = 1920;
      const imgH = 1080;
      const scale = Math.max(this.canvas.width / imgW, this.canvas.height / imgH);
      const renderW = imgW * scale;
      const renderH = imgH * scale;

      this.cachedDims = {
        renderW: renderW,
        renderH: renderH,
        offsetX: (this.canvas.width - renderW) / 2,
        offsetY: (this.canvas.height - renderH) / 2
      };

      this.renderStep(Math.round(this.currentStep), true);
    }

    // ---- Protein-style preload ----
    preloadFrames() {
      const firstImg = new Image();
      firstImg.src = FRAME_PATH(0);
      const renderFirst = () => {
        this.images[0] = firstImg;
        this.sampleLuminance(firstImg, 0);
        this.renderStep(0, true);
        this.dismissPoster();
      };
      if ('decode' in firstImg) {
        firstImg.decode().then(renderFirst).catch(() => {
          if (firstImg.complete && firstImg.naturalWidth > 0) renderFirst();
          else firstImg.onload = renderFirst;
        });
      } else {
        firstImg.onload = renderFirst;
      }

      let idx = 1;
      const loadBatch = () => {
        const batchSize = 12;
        for (let b = 0; b < batchSize && idx < TOTAL_FRAMES; b++, idx++) {
          const i = idx;
          if (this.images[i]) continue;
          const img = new Image();
          img.src = FRAME_PATH(i);
          img.onload = () => {
            this.images[i] = img;
            this.sampleLuminance(img, i);
          };
        }
        if (idx < TOTAL_FRAMES) setTimeout(loadBatch, 25);
      };
      setTimeout(loadBatch, 40);
    }

    // 16x9 thumbnail sample -> mean luminance for adaptive ink
    sampleLuminance(img, i) {
      if (!this.lum || this.lum[i] === undefined) return;
      try {
        const c = document.createElement('canvas');
        c.width = 16; c.height = 9;
        const cx = c.getContext('2d');
        cx.drawImage(img, 0, 0, 16, 9);
        const d = cx.getImageData(0, 0, 16, 9).data;
        let sum = 0;
        for (let j = 0; j < d.length; j += 4) sum += d[j] * 0.299 + d[j + 1] * 0.587 + d[j + 2] * 0.114;
        this.lum[i] = sum / (d.length / 4);
      } catch (e) { /* tainted canvas impossible here; keep default */ }
    }

    dismissPoster() {
      const poster = document.querySelector(SECTION_SEL + ' .book-film-poster');
      if (poster && !poster.classList.contains('is-hidden')) {
        poster.classList.add('is-hidden');
        this.viewport.classList.add('is-live');
      }
    }

    // ---- Protein-verbatim direction-aware ready-image chain ----
    getReadyImage(targetIndex) {
      let safeIdx = Math.max(0, Math.min(TOTAL_FRAMES - 1, targetIndex));
      if (this.images[safeIdx] && this.images[safeIdx].complete && this.images[safeIdx].naturalWidth > 0) {
        return this.images[safeIdx];
      }
      const isReverse = this.scrollDirection === -1;
      const scanLimit = 35;
      for (let offset = 1; offset < scanLimit; offset++) {
        const primary = isReverse ? safeIdx + offset : safeIdx - offset;
        if (primary >= 0 && primary < TOTAL_FRAMES && this.images[primary] && this.images[primary].complete && this.images[primary].naturalWidth > 0) {
          return this.images[primary];
        }
        const secondary = isReverse ? safeIdx - offset : safeIdx + offset;
        if (secondary >= 0 && secondary < TOTAL_FRAMES && this.images[secondary] && this.images[secondary].complete && this.images[secondary].naturalWidth > 0) {
          return this.images[secondary];
        }
      }
      if (this.lastRenderedImage && this.lastRenderedImage.complete && this.lastRenderedImage.naturalWidth > 0) {
        return this.lastRenderedImage;
      }
      for (let i = 0; i < this.images.length; i++) {
        if (this.images[i] && this.images[i].complete && this.images[i].naturalWidth > 0) {
          return this.images[i];
        }
      }
      return null;
    }

    // ---- Render pass ----
    renderStep(step, force) {
      if (!this.ctx || !this.cachedDims) return;
      const stepIdx = Math.max(0, Math.min(this.totalSteps - 1, Math.round(step)));
      this.currentStep = stepIdx;
      const frameIndex = this.universe.map[stepIdx];

      const img = this.getReadyImage(frameIndex);
      if (img) {
        const dims = this.cachedDims;
        this.ctx.drawImage(img, dims.offsetX, dims.offsetY, dims.renderW, dims.renderH);
        this.lastRenderedImage = img;
        if (frameIndex === 0) this.dismissPoster();
      }

      this.updateChoreography(stepIdx);
    }

    smoothstepRamp(step, a, b) {
      const t = (step - a) / (b - a);
      return t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t);
    }

    updateChoreography(stepIdx) {
      const U = this.universe;

      // White page floods — per-phase ramps + the closing dissolve
      if (this.whiteoutEl) {
        let o = 0;
        let hit = false;
        for (let p = 0; p < U.phases.length; p++) {
          const ph = U.phases[p];
          if (!ph || !ph.white) continue;
          if (stepIdx >= ph.white.upStart && stepIdx <= ph.white.downEnd) {
            const oUp = this.smoothstepRamp(stepIdx, ph.white.upStart, ph.white.upEnd);
            const oDown = 1 - this.smoothstepRamp(stepIdx, ph.white.downStart, ph.white.downEnd);
            o = Math.max(o, Math.min(oUp, oDown));
            hit = true;
          }
        }
        // stretch the last phase's white through the previous one's down ramp
        this.whiteoutEl.style.opacity = (hit ? o : 0).toFixed(3);
      }

      // Text blocks
      for (let i = 0; i < this.blocks.length; i++) {
        const b = this.blocks[i];
        const ph = b.phase;
        if (!ph) continue;

        const hasWhite = !!ph.white;
        const isQuoteOrFinale = b.id === 'quote' || b.id === 'finale';
        const activeEnd = b.id === 'finale' ? U.totalSteps : (hasWhite ? ph.white.downStart : ph.filmEnd);
        // Activation begins at the paper (white) phase — the opening film
        // carries no text at all.
        const activeStart = hasWhite ? ph.white.upStart : ph.filmStart;
        const active = stepIdx >= activeStart && stepIdx < activeEnd;
        const inWhite = hasWhite && stepIdx >= ph.white.upStart + 1 && stepIdx < ph.white.downStart;

        const state = active ? (inWhite ? 'white' : 'film') : '';
        if (state !== b.state) {
          b.state = state;
          b.el.classList.toggle('is-active', !!state);
          b.el.classList.toggle('on-white', state === 'white');
        }

        // Adaptive ink: on bright frames (lum >= 150) the white type flips to
        // ink, like print on a bright page. Kills the grey wash permanently.
        if (state === 'film') {
          const frame = this.universe.map[stepIdx];
          const bright = (this.lum[frame] || 120) >= 150;
          b.el.classList.toggle('ink-title', bright);
        } else if (state === 'white') {
          b.el.classList.add('ink-title');
        } else {
          b.el.classList.remove('ink-title');
        }
      }

      // Paragraph-driven reveals — FadeContent mist, word by word.
      if (this.splitReady) {
        for (let i = 0; i < this.paraTweens.length; i++) {
          const pt = this.paraTweens[i];
          const win = pt.win;
          let state;
          if (stepIdx < win[0]) state = 'hidden';
          else if (stepIdx > win[3]) state = 'hidden';
          else if (stepIdx > win[2]) state = 'out';
          else state = 'in';
          // Deterministic clamp: once a paragraph is fully past its window,
          // it is hidden — no ghost words can linger from previous blocks.
          if (stepIdx > win[3] + 40 && pt.state !== 'hidden') {
            pt.state = 'hidden';
            if (pt.fader) pt.fader.clear();
            this.gsap.set(pt.words, { autoAlpha: 0, visibility: 'hidden' });
          }

          if (state !== pt.state) {
            pt.state = state;
            if (pt.fader) {
              if (state === 'in') {
                this.gsap.set(pt.words, { visibility: 'visible' });
                pt.fader.play();
                // Guarantee a perceivable react-bits-style fade: per-word
                // opacity+blur ramp on top of the mist mask.
                this.gsap.fromTo(pt.words,
                  { opacity: 0, filter: 'blur(4px)' },
                  { opacity: 1, filter: 'blur(0px)', stagger: 0.045, duration: 0.9, ease: 'power2.out', overwrite: true,
                    onComplete: () => this.gsap.set(pt.words, { clearProps: 'transform,filter' }) }
                );
                // Safety: never allow a blank block — if the mist reveal is
                // stalled (~1.5s) force words visible.
                if (pt.guard) clearTimeout(pt.guard);
                pt.guard = setTimeout(() => {
                  const visible = pt.words.filter((w) => {
                    const cs = getComputedStyle(w);
                    return cs.visibility === 'visible' && +cs.opacity > 0.2;
                  }).length;
                  if (visible < pt.words.length * 0.6) {
                    this.gsap.set(pt.words, { autoAlpha: 1, visibility: 'visible' });
                  }
                }, 1500);
              } else {
                pt.fader.clear();
                if (pt.guard) { clearTimeout(pt.guard); pt.guard = null; }
                if (state === 'hidden') {
                  this.gsap.set(pt.words, { autoAlpha: 0, visibility: 'hidden' });
                }
              }
            }
          }
        }
      }
    }

    // ---- Lenis inertia manager (protein verbatim) ----
    initLenis() {
      if (typeof Lenis === 'undefined') return;
      const isMobile = window.innerWidth <= 768;

      const lenis = new Lenis({
        duration: isMobile ? 0.55 : 1.25,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: isMobile ? 0.30 : 0.40,
        touchMultiplier: isMobile ? 0.10 : 0.55,
        syncTouch: false,
        infinite: false,
        autoResize: true
      });

      lenis.on('scroll', this.ScrollTrigger.update);
      this.gsap.ticker.add((time) => { lenis.raf(time * 1000); });
      this.gsap.ticker.lagSmoothing(0);
      lenis.scrollTo(0, { immediate: true });
      window.bookLenis = lenis;
    }

    // ---- Dual-engine ScrollTrigger (protein structure) ----
    initScrollTrigger() {
      const self = this;

      if (this.mm) this.mm.revert();
      this.mm = this.gsap.matchMedia();

      this.mm.add({
        isDesktop: '(min-width: 769px)',
        isMobile: '(max-width: 768px)',
        reduceMotion: '(prefers-reduced-motion: reduce)'
      }, (context) => {
        const { isMobile } = context.conditions;

        if (window.bookLenis && window.bookLenis.options) {
          if (isMobile) {
            window.bookLenis.options.duration = 0.55;
            window.bookLenis.options.wheelMultiplier = 0.30;
            window.bookLenis.options.touchMultiplier = 0.10;
            window.bookLenis.options.syncTouch = false;
          } else {
            window.bookLenis.options.duration = 1.25;
            window.bookLenis.options.wheelMultiplier = 0.40;
            window.bookLenis.options.touchMultiplier = 0.55;
            window.bookLenis.options.syncTouch = false;
          }
        }

        const pxPerStep = isMobile ? 8 : 9;
        const pinDistance = Math.max(3600, Math.round(self.totalSteps * pxPerStep));
        const scrubCatchup = isMobile ? 0.08 : 0.25;

        const tl = self.gsap.timeline({
          scrollTrigger: {
            id: 'bookScrollTrigger',
            trigger: self.section,
            start: () => 'top ' + (document.querySelector('.header') ? document.querySelector('.header').offsetHeight : 65) + 'px',
            end: () => `+=${Math.round(pinDistance / (1 - (isMobile ? 0 : HERO_PHASE_FRACTION)))}`,
            pin: true,
            scrub: scrubCatchup,
            anticipatePin: isMobile ? 0 : 1,
            fastScrollEnd: isMobile ? true : false,
            invalidateOnRefresh: true,
            onUpdate: (trigger) => {
              self.scrollDirection = trigger.direction;
              const p = trigger.progress;

              if (!isMobile && p < HERO_PHASE_FRACTION) {
                const e = 1 - p / HERO_PHASE_FRACTION;
                self.canvas.style.transform = `scale(${(1 + (HERO_ZOOM - 1) * e).toFixed(4)})`;
                self.canvas.style.willChange = 'transform';
                if (self.scrimEl) self.scrimEl.style.opacity = (SCRIM_MAX * e).toFixed(3);
                self.heroActive = true;
                if (self.currentStep !== 0) self.renderStep(0);
                for (let i = 0; i < self.blocks.length; i++) {
                  const b = self.blocks[i];
                  if (b.state) {
                    b.state = '';
                    b.el.classList.remove('is-active');
                    b.el.classList.remove('on-white');
                    b.paras.forEach((pp) => {
                      pp.el.style.opacity = '0';
                      pp.el.style.transform = 'translateY(16px)';
                    });
                  }
                }
                if (self.whiteoutEl) self.whiteoutEl.style.opacity = '0';
                return;
              }

              if (self.heroActive) {
                self.heroActive = false;
                self.canvas.style.transform = 'none';
                self.canvas.style.willChange = '';
                if (self.scrimEl) self.scrimEl.style.opacity = '0';
              }

              const canvasProgress = isMobile ? p : (p - HERO_PHASE_FRACTION) / (1 - HERO_PHASE_FRACTION);
              const step = canvasProgress * (self.totalSteps - 1);
              const clamped = Math.max(0, Math.min(self.totalSteps - 1, step));

              if (!self.renderPending) {
                self.renderPending = true;
                requestAnimationFrame(() => {
                  self.renderPending = false;
                  self.renderStep(clamped);
                });
              }
            }
          }
        });
        self.scrollTrigger = tl.scrollTrigger;

        tl.to(self.animState, {
          step: self.totalSteps - 1,
          duration: 1.0,
          ease: 'none'
        }, 0);
      });

      window.addEventListener('load', () => {
        if (window.bookLenis) window.bookLenis.scrollTo(0, { immediate: true });
        this.ScrollTrigger.refresh();
      });

      // React Bits SplitText port: split titles + paragraphs into rendered
      // LINES once the real fonts are loaded (lazy @font-face faces only
      // start loading on first use, so fonts.ready alone is not enough —
      // measuring on fallback metrics produces wrong line breaks).
      const ensureFonts = () => {
        if (!(document.fonts && document.fonts.load)) return Promise.resolve();
        const wants = [
          '400 16px "Newsreader"',
          'italic 400 16px "Newsreader"',
          '600 32px "Playfair Display"',
          '500 16px Inter'
        ];
        return Promise.all(wants.map((f) => document.fonts.load(f, 'Ag')))
          .then(() => document.fonts.ready)
          .catch(() => {});
      };
      const doSplit = () => {
        this.buildLineReveals();
        this.ScrollTrigger.refresh();
      };
      if (document.fonts && document.fonts.ready) {
        ensureFonts().then(doSplit);
      } else {
        doSplit();
      }
      // Last-resort fallback: reveal raw paragraphs if split never finished
      setTimeout(() => {
        if (this.splitReady) return;
        document.querySelectorAll(SECTION_SEL + ' .book-page-chapter .bp-page p').forEach((pEl) => {
          pEl.style.opacity = '1';
          pEl.style.visibility = 'visible';
        });
        document.documentElement.classList.remove('js-splitting');
      }, 3000);

      // Re-split on width change (line breaks depend on column width)
      let lastW = window.innerWidth;
      let rszTimer = null;
      window.addEventListener('resize', () => {
        if (window.innerWidth === lastW) return;
        clearTimeout(rszTimer);
        rszTimer = setTimeout(() => {
          lastW = window.innerWidth;
          if (this.splitReady) {
            this.lineWins = [];
            this.splitReady = false;
            ensureFonts().then(doSplit);
          }
        }, 300);
      });
    }

    // Wrap words, group by rendered offsetTop -> line wrappers
    splitIntoLines(el, dropcap) {
      const raw = (el.textContent || '').trim().replace(/\s+/g, ' ');
      if (!raw) return { lines: [], cap: null };
      const cap = dropcap && /[A-Za-z]/.test(raw.charAt(0)) ? raw.charAt(0) : null;
      const text = cap ? raw.slice(1) : raw;
      const words = text.split(' ');
      const capHtml = cap ? `<span class="bp-dropcap">${cap}</span> ` : '';
      el.innerHTML = capHtml + words.map((w) => `<span class="bp-w">${w}</span>`).join(' ');
      const spans = Array.from(el.querySelectorAll('.bp-w'));
      const lines = [];
      let cur = [];
      let top = null;
      spans.forEach((sp) => {
        const t = sp.offsetTop;
        if (top === null || Math.abs(t - top) < 5) {
          cur.push(sp.textContent);
          if (top === null) top = t;
        } else {
          lines.push(cur.join(' '));
          cur = [sp.textContent];
          top = t;
        }
      });
      if (cur.length) lines.push(cur.join(' '));
      return { lines: lines, cap: cap };
    }

    applyLines(el, lines, cap) {
      el.innerHTML = lines
        .map((l, i) => {
          const content = i === 0 && cap ? `<span class="bp-dropcap">${cap}</span>${l.charAt(0) ? l : l}` : l;
          return `<span class="bp-line"><span class="bp-line-inner">${content}</span></span>`;
        })
        .join('');
      return Array.from(el.querySelectorAll('.bp-line-inner'));
    }

    // Wrap every word in an inline span (children = words for FadeContent).
    // The instruct clause (span.bp-lead) keeps its words tagged so the
    // brand-green lead-in survives the word split.
    mistWords(el, dropcap) {
      const lead = el.querySelector('span.bp-lead');
      const leadText = lead ? (lead.textContent || '').trim() : '';
      const leadWords = leadText ? leadText.split(/\s+/).length : 0;

      const raw = (el.textContent || '').trim().replace(/\s+/g, ' ');
      if (!raw) return [];
      const cap = dropcap && /[A-Za-z]/.test(raw.charAt(0)) ? raw.charAt(0) : null;
      const text = cap ? raw.slice(1) : raw;
      const words = text.split(' ');

      let html = cap ? `<span class="bp-dropcap">${cap}</span> ` : '';
      words.forEach((w, i) => {
        const cls = i < leadWords ? 'bp-w bp-lead-w' : 'bp-w';
        html += `<span class="${cls}">${w}</span> `;
      });
      el.innerHTML = html.trim();
      return Array.from(el.querySelectorAll('.bp-w'));
    }

    buildLineReveals() {
      // Titles: line masks with staggered CSS delays (class-driven rise)
      this.blocks.forEach((b) => {
        const tEl = b.el.querySelector('.bp-title, .bp-finale-title');
        if (tEl) {
          const built = this.splitIntoLines(tEl, false);
          const inners = this.applyLines(tEl, built.lines, built.cap);
          inners.forEach((inner, i) => {
            inner.style.transitionDelay = (0.08 + i * 0.09).toFixed(2) + 's';
          });
        }
      });

      // Spread paragraphs: each paragraph is ONE gsap tween (protein-style).
      // Lines exist only for wrap quality + the title masks; the scrub no
      // longer writes per-line styles every frame — the tween does it in
      // one compositor-friendly pass, reversible with .reverse().
      this.lineWins = [];
      this.paraTweens = [];
      this.blocks.forEach((b) => {
        if (!b.phase || !b.phase.paras) return;
        const ph = b.phase;
        const paraEls = Array.from(b.el.querySelectorAll('.bp-page p'));
        paraEls.forEach((pEl, pi) => {
          const win = ph.paras[Math.min(pi, ph.paras.length - 1)];
          const dropcap = b.id === 't1' && pi === 0;
          pEl.style.opacity = '1';

          // Word-by-word FadeContent (React Bits spec): children = words,
          // effect = mist, duration 1.8, ease power2.out, stagger 0.1.
          const words = this.mistWords(pEl, dropcap);
          const fader = window.FadeContent ? window.FadeContent(pEl, {
            effect: 'mist',
            blur: 0,
            duration: 1.1,
            ease: 'power2.out',
            stagger: 0.05,
            threshold: 0.1,
            trigger: 'mount'
          }) : null;
          // FadeContent hides the paragraph (visibility hidden) until play;
          // the spread is a child of a display:none .bp-spread until the
          // white phase, so force measurement layout first (mirror CSS).
          b.el.classList.add('bp-measure');
          void pEl.offsetWidth; // force reflow while measuring
          b.el.classList.remove('bp-measure');
          this.paraTweens.push({
            el: pEl,
            words: words,
            fader: fader,
            win: win,
            state: 'hidden',
            phase: ph,
            pi: pi,
            guard: null
          });
        });
      });
      this.splitReady = true;
      document.documentElement.classList.remove('js-splitting');
    }
  }

  function onReady() {
    duplicateMarquee();
    if (isReducedMotion()) {
      const section = document.querySelector(SECTION_SEL);
      if (section) section.classList.add('reduced-motion');
      return;
    }
    if (document.querySelector(SECTION_SEL)) {
      new BookScrollAnimation();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', onReady);
  } else {
    onReady();
  }
})();
