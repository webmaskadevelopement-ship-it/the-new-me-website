/**
 * GSAP Scroll Video Controller
 * -------------------------------------------------------------
 * High-performance canvas frame scrubbing + HTML5 video sync
 * Powered by GSAP & ScrollTrigger.
 */

(function (global) {
  'use strict';

  // Default configuration
  const DEFAULTS = {
    trigger: '#scroll-video-experience',
    pinViewport: '#scroll-video-viewport',
    canvas: '#scroll-video-canvas',
    video: '#scroll-video-native',
    hudFrame: '#hud-frame-counter',
    hudTime: '#hud-time-counter',
    hudPercent: '#hud-progress-percent',
    scrubberTrack: '#scrubber-track',
    scrubberFill: '#scrubber-fill',
    engineToggleBtn: '#engine-toggle-btn',
    engineLabel: '#engine-label',
    autoplayBtn: '#autoplay-flight-btn',
    chapterBtns: '.scroll-chapter-btn',
    narrativePanels: '.scroll-narrative-panel',

    // Frame sequence settings
    totalFrames: 144,
    framePath: (index) => `frames/frame_${String(index).padStart(3, '0')}.webp`,
    scrollDistance: 3200, // Pixels of scroll travel while pinned
    scrubSmooth: 0.6,     // Smoothing factor (seconds)
    videoDuration: 6.0,   // Approximated length of frame sequence in seconds
    defaultEngine: 'canvas', // 'canvas' or 'video'
    onFrame: null,        // Optional callback(frameIndex, progress) fired from applyProgress
    deferPreload: false,  // When true, caller must invoke controller.preloadFrames() themselves
    pinType: 'fixed',     // 'fixed' (default) or 'transform' (seamless in/out)
    expandPx: 0,          // Scroll distance reserved for a hero "expand" reveal
    expandZoom: 1.3,      // Media start scale during the expand reveal (→ 1)
    // Memory-safe streaming: full-res decoded bitmaps are ~8MB each
    // (1920×1080×4). Keeping all 359 alive ≈ 3GB — the cause of real-device
    // jank. We keep a small window (behind/ahead) of downscaled bitmaps and
    // close the rest; drawing falls back to the loaded Image until a bitmap
    // is ready, so there is never a blank frame.
    windowBehind: 8,
    windowAhead: 20,
    // Paint budget: draw at most maxFps canvas frames per second and render
    // at dprCap× (1 = CSS pixels). Measured in Edge: full-res 60Hz repaints
    // ran at ~22fps/38% long frames; these two knobs get smooth scrub.
    dprCap: 1,
    maxFps: 30
  };

  class ScrollVideoController {
    constructor(options = {}) {
      this.cfg = Object.assign({}, DEFAULTS, options);

      // Verify GSAP & ScrollTrigger availability
      const gsap = global.gsap || (typeof window !== 'undefined' ? window.gsap : null);
      const ScrollTrigger = global.ScrollTrigger || (typeof window !== 'undefined' ? window.ScrollTrigger : null);

      if (!gsap || !ScrollTrigger) {
        console.error('[ScrollVideo] GSAP or ScrollTrigger is missing. Ensure gsap.min.js and ScrollTrigger.min.js are loaded before scroll-video.js.');
        return;
      }

      this.gsap = gsap;
      this.ScrollTrigger = ScrollTrigger;
      this.gsap.registerPlugin(this.ScrollTrigger);

      // DOM Elements
      this.triggerEl = document.querySelector(this.cfg.trigger);
      this.pinViewportEl = document.querySelector(this.cfg.pinViewport);
      this.canvas = document.querySelector(this.cfg.canvas);
      this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
      this.video = document.querySelector(this.cfg.video);

      // HUD & Controls DOM
      this.hudFrame = document.querySelector(this.cfg.hudFrame);
      this.hudTime = document.querySelector(this.cfg.hudTime);
      this.hudPercent = document.querySelector(this.cfg.hudPercent);
      this.scrubberTrack = document.querySelector(this.cfg.scrubberTrack);
      this.scrubberFill = document.querySelector(this.cfg.scrubberFill);
      this.engineToggleBtn = document.querySelector(this.cfg.engineToggleBtn);
      this.engineLabel = document.querySelector(this.cfg.engineLabel);
      this.autoplayBtn = document.querySelector(this.cfg.autoplayBtn);
      this.chapterBtns = document.querySelectorAll(this.cfg.chapterBtns);
      this.narrativePanels = document.querySelectorAll(this.cfg.narrativePanels);

      // State
      this.currentEngine = this.cfg.defaultEngine;
      this.images = [];
      this.loadedFrames = 0;
      this.isAutoplaying = false;
      this.autoplayTween = null;
      this.triggerInstance = null;
      // Trailing repaint: when the paint rate-limiter skips a frame, we still
      // owe the canvas that paint once scrolling settles — otherwise the film
      // freezes on a stale frame after a fast flick (no further scroll events
      // ever arrive to trigger the missing paint).
      this.trailingTimer = null;
      this.trailingFrame = null;

      // Performance: coalesce scroll updates into one draw per animation
      // frame, and never re-draw an identical frame index. High-frequency
      // trackpad/wheel events were causing redundant canvas paints (the
      // source of visible stutter on some devices).
      this.rafPending = false;
      this.pendingProgress = null;
      this.lastDrawnFrame = -1;
      this.canvasExpandActive = false;

      // Sliding bitmap window (see DEFAULTS.windowBehind/windowAhead)
      this.bitmaps = new Map();   // index -> ImageBitmap
      this.maxBitmapW = 0;        // max decode width (set on resize)
      this.bitmapTick = 0;        // throttle async decode scheduling
      this.nextPaintAt = 0;       // paint rate-limit (maxFps)

      this.init();
    }

    init() {
      if (!this.canvas && !this.video) {
        console.warn('[ScrollVideo] Neither canvas nor video element was found.');
        return;
      }

      // 1. Preload image sequence for canvas (unless caller defers it)
      if (!this.cfg.deferPreload) {
        this.preloadFrames();
      }

      // 2. Initial canvas dimensions setup
      this.resizeCanvas = this.resizeCanvas.bind(this);
      this.resizeCanvas();
      window.addEventListener('resize', this.resizeCanvas);

      // 3. Setup GSAP ScrollTrigger
      this.initScrollTrigger();

      // 4. Bind interactive UI events
      this.bindControls();
    }

    // Preload all frames into Image objects for instant hardware rendering
    preloadFrames() {
      for (let i = 0; i < this.cfg.totalFrames; i++) {
        const img = new Image();
        img.src = this.cfg.framePath(i);
        img.onload = () => {
          this.loadedFrames++;
          if (this.loadedFrames === 1 && this.currentEngine === 'canvas') {
            if (this.drawFrame(0)) {
              this.lastDrawnFrame = 0;
            }
          }
        };
        this.images.push(img);
      }
    }

    // Map a raw trigger progress (0..1 over the whole pin span, expand phase
    // included) to the frame index the scrub would show at that progress.
    // Single source of truth — used by renderProgress AND resizeCanvas so a
    // resize can never pick a different frame than the scrub itself would.
    frameForProgress(rawProgress) {
      const total = this.cfg.scrollDistance || 1;
      const ex = this.cfg.expandPx || 0;
      const norm = ex > 0
        ? Math.max(0, (rawProgress * total - ex) / (total - ex))
        : rawProgress;
      return Math.min(this.cfg.totalFrames - 1, Math.max(0, Math.floor(norm * (this.cfg.totalFrames - 1))));
    }

    // Resize canvas with devicePixelRatio awareness
    resizeCanvas() {
      if (!this.canvas || !this.ctx) return;
      // Render at (at most) dprCap× device pixels. The source frames are
      // 1920px wide; painting at 2–3× DPR only added GPU/CPU fill with no
      // visible sharpness on motion — the dominant cost of scroll jank.
      const dpr = Math.min(window.devicePixelRatio || 1, this.cfg.dprCap);
      // measure the UNTRANSFORMED box: during the expand phase the canvas
      // carries a scale() transform and getBoundingClientRect() would report
      // the scaled (wrong) size.
      const style = window.getComputedStyle(this.canvas);
      const cssW = parseFloat(style.width) || this.canvas.clientWidth;
      const cssH = parseFloat(style.height) || this.canvas.clientHeight;
      const newW = Math.max(1, Math.round(cssW * dpr));
      const newH = Math.max(1, Math.round(cssH * dpr));

      const curProg = this.triggerInstance ? this.triggerInstance.progress : 0;
      const frameIdx = this.frameForProgress(curProg);

      // No-op guard: mobile URL-bar show/hide fires resize continuously during
      // scroll. If the backing size and target frame are unchanged, clearing
      // and repainting the canvas only adds flicker and jank.
      if (newW === this.canvas.width && newH === this.canvas.height && frameIdx === this.lastDrawnFrame) return;

      this.canvas.width = newW;
      this.canvas.height = newH;
      // Reset the transform before applying DPR scaling: scale() alone compounds
      // on every resize/rotation and progressively shrinks the drawn frame.
      this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // Bitmaps never need to exceed the canvas backing width + small headroom.
      this.maxBitmapW = Math.max(320, Math.min(1600, this.canvas.width + 64));

      // Redraw current frame at new aspect ratio
      if (this.drawFrame(frameIdx)) {
        this.lastDrawnFrame = frameIdx;
      }
    }

    // Draw frame keeping aspect ratio (cover mode).
    // Returns true when a paint actually happened. When the paint rate-limiter
    // skips, it returns false AND schedules a single trailing repaint of the
    // most recent requested frame — so the film always settles on the frame
    // the scroll position says, even when scrolling stops right after a skip.
    drawFrame(index) {
      if (!this.canvas || !this.ctx) return false;
      const img = this.images[index];
      if (!img || !img.complete || img.naturalWidth === 0) return false;

      // Keep the decoded-bitmap window near the frame being drawn.
      this.scheduleWindow(index);

      // Paint rate-limit: film motion reads fine at maxFps, and skipping
      // intermediate paints is what turns a choppy scrub smooth on weaker
      // devices. (The frame index still advances every scroll tick.)
      const now = performance.now();
      if (now < this.nextPaintAt) {
        this.scheduleTrailingPaint(index);
        return false;
      }
      this.nextPaintAt = now + (1000 / this.cfg.maxFps);

      // Prefer the downscaled bitmap (cheap memory + draw); fall back to
      // the loaded Image until its bitmap is ready — never a blank frame.
      const src = this.bitmaps.get(index) || img;
      const sW = src.width;
      const sH = src.height;

      const style = window.getComputedStyle(this.canvas);
      const cWidth = parseFloat(style.width) || this.canvas.clientWidth;
      const cHeight = parseFloat(style.height) || this.canvas.clientHeight;

      const imgRatio = sW / sH;
      const canvasRatio = cWidth / cHeight;
      let sWidth, sHeight, sx, sy;

      if (canvasRatio > imgRatio) {
        sWidth = sW;
        sHeight = sW / canvasRatio;
        sx = 0;
        sy = (sH - sHeight) / 2;
      } else {
        sHeight = sH;
        sWidth = sH * canvasRatio;
        sx = (sW - sWidth) / 2;
        sy = 0;
      }

      this.ctx.clearRect(0, 0, cWidth, cHeight);
      this.ctx.drawImage(src, sx, sy, sWidth, sHeight, 0, 0, cWidth, cHeight);
      return true;
    }

    // One-shot deferred repaint for rate-limited frames. Only the newest
    // requested frame is kept; the timer fires once, after the current
    // rate-limit budget expires.
    scheduleTrailingPaint(index) {
      this.trailingFrame = index;
      if (this.trailingTimer !== null) return;
      const wait = Math.max(4, this.nextPaintAt - performance.now());
      this.trailingTimer = setTimeout(() => {
        this.trailingTimer = null;
        const frame = this.trailingFrame;
        if (frame === null || frame === this.lastDrawnFrame) return;
        if (this.drawFrame(frame)) {
          this.lastDrawnFrame = frame;
        }
      }, wait);
    }

    // ----------------------------------------------------------------
    // Sliding decoded-bitmap window
    // ----------------------------------------------------------------
    createBitmapFor(index) {
      if (this.bitmaps.has(index)) return;
      if (typeof createImageBitmap !== 'function') return;
      const img = this.images[index];
      if (!img || !img.complete || img.naturalWidth === 0) return;
      const targetW = Math.max(1, Math.min(this.maxBitmapW, img.naturalWidth));
      createImageBitmap(img, { resizeWidth: targetW })
        .then((bmp) => {
          // Store only if this frame is still inside the active window.
          const center = this.lastDrawnFrame;
          const lo = Math.max(0, center - this.cfg.windowBehind);
          const hi = Math.min(this.cfg.totalFrames - 1, center + this.cfg.windowAhead);
          if (index >= lo && index <= hi) {
            this.bitmaps.set(index, bmp);
          } else {
            try { bmp.close(); } catch (e) { /* noop */ }
          }
        })
        .catch(() => { /* decode failure → fall back to Image */ });
    }

    scheduleWindow(center) {
      const total = this.cfg.totalFrames;
      const lo = Math.max(0, center - this.cfg.windowBehind);
      const hi = Math.min(total - 1, center + this.cfg.windowAhead);
      const keep = new Set();
      for (let i = lo; i <= hi; i++) keep.add(i);

      // Release far-away bitmaps — this is what keeps peak memory bounded.
      for (const [idx, bmp] of this.bitmaps) {
        if (!keep.has(idx)) {
          try { bmp.close(); } catch (e) { /* noop */ }
          this.bitmaps.delete(idx);
        }
      }

      // Decode a small batch ahead (async; throttled per tick).
      let batched = 0;
      for (let i = lo; i <= hi && batched < 6; i++) {
        if (!this.bitmaps.has(i)) {
          this.createBitmapFor(i);
          batched++;
        }
      }
    }

    // Synchronize frame and UI telemetry with normalized scroll progress (0.0 to 1.0)
    applyProgress(progress) {
      const safe = Math.min(1, Math.max(0, progress));
      this.pendingProgress = safe;
      if (this.rafPending) return;
      this.rafPending = true;
      requestAnimationFrame(() => {
        this.rafPending = false;
        if (this.pendingProgress === null) return;
        const latest = this.pendingProgress;
        this.pendingProgress = null;
        this.renderProgress(latest);
      });
    }

    // Actual render pass — runs at most once per animation frame, using the
    // most recent scroll progress (coalesced).
    renderProgress(safe) {
      // "Expand" phase (optional): a hero reveal where the media starts
      // zoomed and unzooms to 1 as the reader scrolls into the pin — the
      // same ScrollExpand handoff the protein page uses. Frames only start
      // scrubbing after the reveal hands the stage over.
      const total = this.cfg.scrollDistance;
      const dist = safe * total;
      const ex = this.cfg.expandPx;

      if (ex > 0 && dist < ex) {
        const e = 1 - dist / ex; // 1 at enter → 0 at handoff
        if (this.currentEngine === 'canvas') {
          if (this.lastDrawnFrame !== 0) {
            if (this.drawFrame(0)) {
              this.lastDrawnFrame = 0;
            }
          }
          const z = 1 + (this.cfg.expandZoom - 1) * e;
          this.canvas.style.transform = `scale(${z.toFixed(4)})`;
          this.canvasExpandActive = true;
        }
        if (typeof this.cfg.onFrame === 'function') {
          this.cfg.onFrame(0, safe, { expanding: true, e: e });
        }
        return;
      }

      if (this.canvasExpandActive) {
        this.canvas.style.transform = '';
        this.canvasExpandActive = false;
      }

      const normSafe = ex > 0 ? Math.max(0, (dist - ex) / (total - ex)) : safe;
      const frameIndex = Math.min(this.cfg.totalFrames - 1, Math.max(0, Math.floor(normSafe * (this.cfg.totalFrames - 1))));
      const currentTime = (normSafe * this.cfg.videoDuration).toFixed(2);
      const percent = Math.round(normSafe * 100);

      // Render to active engine (skip when frame unchanged — no redundant paints)
      if (this.currentEngine === 'canvas') {
        if (frameIndex !== this.lastDrawnFrame) {
          // Commit the frame index ONLY when the paint really happened;
          // otherwise a rate-limited skip would mark an unpainted frame as
          // drawn and the canvas would stay stale after scrolling stops.
          if (this.drawFrame(frameIndex)) {
            this.lastDrawnFrame = frameIndex;
          }
        }
      } else if (this.video && this.video.duration) {
        this.video.currentTime = safe * this.video.duration;
      }

      // HUD Telemetry
      if (this.hudFrame) {
        this.hudFrame.textContent = `FRAME ${String(frameIndex + 1).padStart(3, '0')} / ${this.cfg.totalFrames}`;
      }
      if (this.hudTime) {
        this.hudTime.textContent = `${currentTime}s`;
      }
      if (this.hudPercent) {
        this.hudPercent.textContent = `${percent}%`;
      }
      if (this.scrubberFill) {
        this.scrubberFill.style.width = `${(normSafe * 100).toFixed(1)}%`;
      }

      // Narrative panels based on progress quadrant
      let activeStep = 1;
      if (normSafe >= 0.75) activeStep = 4;
      else if (normSafe >= 0.50) activeStep = 3;
      else if (normSafe >= 0.25) activeStep = 2;
      else activeStep = 1;

      if (this.narrativePanels.length > 0) {
        this.narrativePanels.forEach(panel => {
          const step = parseInt(panel.getAttribute('data-step'), 10);
          panel.classList.toggle('active', step === activeStep);
        });
      }

      // Chapter buttons
      if (this.chapterBtns.length > 0) {
        this.chapterBtns.forEach(btn => {
          const target = parseFloat(btn.getAttribute('data-progress'));
          const isClosest = (
            (activeStep === 1 && target <= 0.2) ||
            (activeStep === 2 && target > 0.2 && target <= 0.5) ||
            (activeStep === 3 && target > 0.5 && target <= 0.75) ||
            (activeStep === 4 && target > 0.75)
          );
          btn.classList.toggle('active', isClosest);
        });
      }

      // Optional per-frame hook for page-specific choreography
      if (typeof this.cfg.onFrame === 'function') {
        this.cfg.onFrame(frameIndex, normSafe);
      }
    }

    // Initialize ScrollTrigger pin and scrub
    initScrollTrigger() {
      if (!this.triggerEl || !this.pinViewportEl) return;

      this.triggerInstance = this.ScrollTrigger.create({
        trigger: this.triggerEl,
        start: 'top top',
        end: `+=${this.cfg.scrollDistance}`,
        pin: this.pinViewportEl,
        pinType: this.cfg.pinType,
        scrub: this.cfg.scrubSmooth,
        onUpdate: (self) => {
          if (!this.isAutoplaying) {
            this.applyProgress(self.progress);
          }
        }
      });
    }

    // UI Controls (Scrubber, Waypoints, Engine switch, Autoplay)
    bindControls() {
      // 1. Scrubber Click to jump
      if (this.scrubberTrack) {
        this.scrubberTrack.addEventListener('click', (e) => {
          if (!this.triggerInstance) return;
          const rect = this.scrubberTrack.getBoundingClientRect();
          const clickX = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
          const targetProg = clickX / rect.width;
          const targetScroll = this.triggerInstance.start + targetProg * (this.triggerInstance.end - this.triggerInstance.start);

          window.scrollTo({
            top: targetScroll,
            behavior: 'smooth'
          });
          this.applyProgress(targetProg);
        });
      }

      // 2. Engine switch: Canvas vs HTML5 Video
      if (this.engineToggleBtn) {
        this.engineToggleBtn.addEventListener('click', () => {
          if (this.currentEngine === 'canvas') {
            this.currentEngine = 'video';
            if (this.canvas) this.canvas.style.opacity = '0';
            if (this.video) this.video.style.opacity = '1';
            if (this.engineLabel) this.engineLabel.textContent = 'Engine: Native Video';
            if (this.video && this.video.duration && this.triggerInstance) {
              this.video.currentTime = this.triggerInstance.progress * this.video.duration;
            }
          } else {
            this.currentEngine = 'canvas';
            if (this.canvas) this.canvas.style.opacity = '1';
            if (this.video) this.video.style.opacity = '0';
            if (this.engineLabel) this.engineLabel.textContent = 'Engine: Canvas Sequence';
            const curProg = this.triggerInstance ? this.triggerInstance.progress : 0;
            const frameIdx = this.frameForProgress(curProg);
            if (this.drawFrame(frameIdx)) {
              this.lastDrawnFrame = frameIdx;
            }
          }
        });
      }

      // 3. Chapter Waypoint jump buttons
      if (this.chapterBtns.length > 0) {
        this.chapterBtns.forEach(btn => {
          btn.addEventListener('click', () => {
            const targetProg = parseFloat(btn.getAttribute('data-progress'));
            if (!this.triggerInstance || isNaN(targetProg)) return;
            const targetScroll = this.triggerInstance.start + targetProg * (this.triggerInstance.end - this.triggerInstance.start);
            window.scrollTo({
              top: targetScroll,
              behavior: 'smooth'
            });
          });
        });
      }

      // 4. Auto-Play Flight button
      if (this.autoplayBtn) {
        this.autoplayBtn.addEventListener('click', () => {
          if (!this.triggerInstance) return;

          if (this.isAutoplaying) {
            this.isAutoplaying = false;
            if (this.autoplayTween) this.autoplayTween.kill();
            this.autoplayBtn.textContent = '▶ Fly Through';
          } else {
            this.isAutoplaying = true;
            this.autoplayBtn.textContent = '⏸ Pause';

            if (window.scrollY < this.triggerInstance.start || window.scrollY >= this.triggerInstance.end) {
              window.scrollTo({ top: this.triggerInstance.start, behavior: 'instant' });
            }

            const startProg = this.triggerInstance.progress >= 0.98 ? 0 : this.triggerInstance.progress;
            const sim = { progress: startProg };

            this.autoplayTween = this.gsap.to(sim, {
              progress: 1,
              duration: 8 * (1 - startProg),
              ease: 'none',
              onUpdate: () => {
                this.applyProgress(sim.progress);
                const targetScroll = this.triggerInstance.start + sim.progress * (this.triggerInstance.end - this.triggerInstance.start);
                window.scrollTo({ top: targetScroll, behavior: 'instant' });
              },
              onComplete: () => {
                this.isAutoplaying = false;
                this.autoplayBtn.textContent = '▶ Fly Through';
              }
            });
          }
        });
      }
    }

    destroy() {
      if (this.triggerInstance) this.triggerInstance.kill();
      if (this.autoplayTween) this.autoplayTween.kill();
      if (this.trailingTimer !== null) {
        clearTimeout(this.trailingTimer);
        this.trailingTimer = null;
      }
      window.removeEventListener('resize', this.resizeCanvas);
    }
  }

  // Export to global scope
  global.ScrollVideoController = ScrollVideoController;

  // Auto-init on DOMContentLoaded if default elements exist
  document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('#scroll-video-experience')) {
      global.activeScrollVideo = new ScrollVideoController();
    }
  });

})(typeof window !== 'undefined' ? window : this);
