/**
 * THE BOOK — "The Book" page scroll film (book.html)
 * Scroll-scrubbed reel cut from the seedance BOOK VIDEO source with the
 * t=0 flash frame removed (see scripts/export_book_page_reel.py), opened
 * with the protein-page ScrollExpand pattern and closed by a scroll-driven
 * white bloom that hands the stage to the testimonial section below.
 *
 * Chapter typography is revealed by the vanilla port of React Bits
 * <FadeContent effect="mist" duration={1.8} ease="power2.out" stagger={0.1}>:
 * every chapter's children mist-in, staggered, exactly when the scroll
 * enters that chapter's frame window — and lift away before each white
 * bloom so every transition stays pure light.
 */
(function () {
  'use strict';

  var SECTION = '#book-page-film';
  var TOTAL_FRAMES = 331; // 24fps seedance reel incl. 4 x 24-frame hard blooms
  // Protein-style hero expand: the first 520px of the pin open the film from
  // a zoomed still into the full stage; the scrub starts after the handoff.
  var EXPAND_PX = 520;
  var FRAME_PATH = function (i) {
    return 'frames/book-page/frame_' + String(i).padStart(3, '0') + '.webp';
  };

  // Segment map — mirrors frames/book-page/manifest.json
  var CHAPTERS = [
    { id: 'epigraph',     start: 0,   end: 45 },
    { id: 'chapter-one',  start: 70,  end: 116 },
    { id: 'chapter-two',  start: 141, end: 188 },
    { id: 'chapter-three',start: 213, end: 260 },
    { id: 'finale',       start: 285, end: 330 }
  ];
  var BLOOMS = [
    { start: 46,  end: 69 },
    { start: 117, end: 140 },
    { start: 189, end: 212 },
    { start: 261, end: 284 }
  ];

  // Text windows — inside each segment, lifted before every bloom so each
  // white transition is pure, text-free light. The finale window ends early
  // so the closing whiteout dissolve never washes over readable type.
  var WINDOWS = {
    'epigraph':      { start: 4,   end: 40 },
    'chapter-one':   { start: 74,  end: 112 },
    'chapter-two':   { start: 145, end: 184 },
    'chapter-three': { start: 217, end: 256 },
    'finale':        { start: 291, end: 312 }
  };

  // Closing white bloom: dissolves the last wide shot into the white
  // testimonial stage. Driven by scrub progress (not frames) so it stays
  // perfectly reversible while scrolling back up.
  var WHITEOUT = { start: 0.930, end: 0.985 };

  // FadeContent props — the exact snippet from the brief.
  var FADE_PROPS = {
    effect: 'mist',
    duration: 1.8,
    ease: 'power2.out',
    stagger: 0.1,
    trigger: 'mount'
  };

  function isReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  // Duplicate the reader-card set once so the -50% CSS marquee loop is
  // seamless (the clone is aria-hidden; the original carries semantics).
  function duplicateMarquee() {
    var tracks = document.querySelectorAll('.reviews-marquee-track');
    Array.prototype.forEach.call(tracks, function (track) {
      if (track.dataset.cloned === '1') return;
      track.dataset.cloned = '1';
      var cards = Array.prototype.slice.call(track.children);
      cards.forEach(function (card) {
        var clone = card.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        track.appendChild(clone);
      });
    });
  }

  function initFilm() {
    if (!window.ScrollVideoController || !window.ScrollTrigger || !window.gsap) return;

    window.ScrollTrigger.config({ ignoreMobileResize: true });

    var isMobile = window.innerWidth < 768;

    // Hardening — same real-device scroll discipline as the home film:
    // never restore a stale scroll position into the pin region on reload.
    (function guardReloadedPosition() {
      var vp = document.querySelector('#book-page-viewport');
      var top = 0;
      for (var el = vp; el; el = el.offsetParent) top += el.offsetTop;
      var span = (isMobile ? 2800 : 3600) + EXPAND_PX;
      var dangerStart = top - window.innerHeight;
      var dangerEnd = top + span + window.innerHeight;

      function resetIfInsideFilm() {
        var y = window.scrollY || document.documentElement.scrollTop || 0;
        if (y >= dangerStart && y <= dangerEnd && y > 0) {
          window.scrollTo(0, 0);
          return true;
        }
        return false;
      }

      resetIfInsideFilm();
      var armed = true;
      var poll = null;
      var lateCheck = function () { if (armed) resetIfInsideFilm(); };
      window.addEventListener('scroll', lateCheck, { passive: true });
      window.addEventListener('pageshow', lateCheck);
      poll = setInterval(lateCheck, 100);
      setTimeout(function () {
        window.removeEventListener('scroll', lateCheck);
        window.removeEventListener('pageshow', lateCheck);
        armed = false;
        clearInterval(poll);
      }, 2000);
    })();

    document.body.classList.add('has-scroll-film');
    document.documentElement.style.scrollBehavior = 'auto';

    // One FadeContent instance per chapter, driven by the frame windows.
    var windows = [];
    document.querySelectorAll(SECTION + ' .book-page-chapter').forEach(function (el) {
      var id = el.getAttribute('data-chapter');
      var fx = window.FadeContent ? window.FadeContent(el, FADE_PROPS) : null;
      windows.push({ id: id, el: el, fx: fx, win: WINDOWS[id], active: false });
    });
    var bloomEl = document.querySelector(SECTION + ' .book-film-bloom');
    var scrimEl = document.querySelector(SECTION + ' .book-film-scrim');
    var whiteoutEl = document.querySelector(SECTION + ' .book-page-whiteout');

    function setChapterActive(w, active) {
      if (w.active === active) return;
      w.active = active;
      w.el.classList.toggle('is-active', active);
      if (!w.fx) return;
      if (active) w.fx.play();
      else w.fx.clear();
    }

    var controller = new window.ScrollVideoController({
      trigger: '#book-page-viewport',
      pinViewport: '#book-page-viewport',
      canvas: '#book-page-canvas',
      totalFrames: TOTAL_FRAMES,
      framePath: FRAME_PATH,
      scrollDistance: (isMobile ? 2800 : 3600) + EXPAND_PX,
      expandPx: EXPAND_PX,
      expandZoom: 1.30,
      scrubSmooth: 0.5,
      anticipatePin: 1,
      pinType: 'transform',
      videoDuration: 13.8,
      defaultEngine: 'canvas',
      deferPreload: true,
      onFrame: function (frameIndex, progress, opts) {
        // Hero expand phase — no text; bloom + scrim carry the open.
        if (opts && opts.expanding) {
          if (bloomEl) bloomEl.classList.add('is-blooming');
          if (scrimEl) scrimEl.style.opacity = String((opts.e * 0.55).toFixed(3));
          windows.forEach(function (w) { setChapterActive(w, false); });
          if (whiteoutEl) whiteoutEl.style.opacity = '0';
          return;
        }
        if (scrimEl) scrimEl.style.opacity = '0';

        // Chapters — mist in when the scroll enters the window, clear before
        // the next bloom.
        for (var i = 0; i < windows.length; i++) {
          var w = windows[i];
          setChapterActive(w, frameIndex >= w.win.start && frameIndex <= w.win.end);
        }

        // Mystical white bloom over every shot join.
        if (bloomEl) {
          var inBloom = false;
          for (var b = 0; b < BLOOMS.length; b++) {
            if (frameIndex >= BLOOMS[b].start && frameIndex <= BLOOMS[b].end) {
              inBloom = true;
              break;
            }
          }
          bloomEl.classList.toggle('is-blooming', inBloom);
        }

        // Closing dissolve — the film becomes light and hands off to the
        // white testimonial stage below.
        if (whiteoutEl) {
          var t = (progress - WHITEOUT.start) / (WHITEOUT.end - WHITEOUT.start);
          var o = t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t);
          whiteoutEl.style.opacity = o.toFixed(3);
        }
      }
    });
    window.bookPageFilm = controller;

    // Eager preload: 331 frames ≈ 15.2MB — first scrub frame already decoded.
    controller.preloadFrames();

    if (/[?&]debug(?:=|&|$)/.test(location.search)) {
      var badge = document.createElement('div');
      badge.id = 'bp-debug';
      badge.style.cssText = 'position:fixed;right:10px;bottom:10px;z-index:9999;' +
        'background:rgba(0,0,0,.78);color:#7ef0a8;font:11px/1.5 ui-monospace,monospace;' +
        'padding:6px 9px;border-radius:8px;pointer-events:none;white-space:pre;';
      document.body.appendChild(badge);
      var last = performance.now(), framesLast = 0, fps = 0;
      (function tick(now) {
        var dt = now - last;
        if (dt >= 500) {
          fps = Math.round(1000 * (framesLast / dt));
          framesLast = 0;
          last = now;
          var st = controller.triggerInstance;
          badge.textContent =
            'book-page v1 debug\n' +
            'fps ' + fps + '\n' +
            'scrollY ' + Math.round(window.scrollY) + '\n' +
            'pin ' + Math.round(st ? st.start : 0) + '→' + Math.round(st ? st.end : 0) + '\n' +
            'frame ' + controller.lastDrawnFrame + '/' + (controller.cfg.totalFrames - 1) + '\n' +
            'bitmaps ' + controller.bitmaps.size;
        }
        framesLast++;
        requestAnimationFrame(tick);
      })(performance.now());
    }

    var refreshTriggers = function () { window.ScrollTrigger.refresh(); };
    if (document.readyState === 'complete') refreshTriggers();
    else window.addEventListener('load', refreshTriggers, { once: true });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(refreshTriggers);

    // Poster out once the first film frame is ready.
    var poster = document.querySelector(SECTION + ' .book-film-poster');
    if (poster) {
      var checkPoster = setInterval(function () {
        var first = controller.images && controller.images[0];
        if (first && first.complete && first.naturalWidth > 0) {
          poster.classList.add('is-hidden');
          var vp = document.querySelector(SECTION + ' #book-page-viewport');
          if (vp) vp.classList.add('is-live');
          clearInterval(checkPoster);
        }
      }, 200);
      setTimeout(function () { clearInterval(checkPoster); }, 60000);
    }
  }

  function onReady() {
    duplicateMarquee();

    var section = document.querySelector(SECTION);
    if (!section) return;

    if (isReducedMotion()) {
      section.classList.add('reduced-motion');
      return; // static poster + stacked readable chapters, no pin, no scrub
    }

    initFilm();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', onReady);
  } else {
    onReady();
  }
})();
