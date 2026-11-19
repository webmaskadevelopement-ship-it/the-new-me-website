/**
 * THE NEW ME — Book Film v2 (Home)
 * Scroll-scrubbed film from curated ranges of the two BOOK VIDEO reels,
 * with mystical white hard-bloom transitions at every shot join.
 *
 * Architecture (v2 — REQ-2026-11-18-03):
 * - The ScrollTrigger pin is created IMMEDIATELY on DOMContentLoaded, so the
 *   pin spacer exists in the very first layout. Creating it lazily (v1)
 *   mutated document height mid-scroll and made the page jump while the
 *   user was still scrolling the section above.
 * - Only the 359-frame preload stays lazy (IntersectionObserver, 150%),
 *   decoupled from trigger creation. The poster covers the canvas until
 *   the first frame is ready.
 * - Chapter typography is driven by frame-accurate windows from
 *   frames/book/manifest.json (export_book_reel.py): each chapter holds
 *   through its segment, then releases into the bloom so every white
 *   transition is pure, text-free light.
 */
(function () {
  'use strict';

  var SECTION = '#book-film-experience';
  var TOTAL_FRAMES = 359; // 24fps curated reel incl. 4 x 24-frame hard blooms
  // Hero "expand" phase (protein ScrollExpand pattern): the first 520px of
  // the pin open the film from a zoomed still into full stage, then hand
  // over to the scrub. The film only starts moving after the handoff.
  var EXPAND_PX = 520;
  var FRAME_PATH = function (i) {
    return 'frames/book/frame_' + String(i).padStart(3, '0') + '.webp';
  };

  // Segment map — mirrors frames/book/manifest.json
  var CHAPTERS = [
    { id: 'prologue',  start: 0,   end: 57 },
    { id: 'chapter-1', start: 82,  end: 139 },
    { id: 'chapter-2', start: 164, end: 211 },
    { id: 'chapter-3', start: 236, end: 288 },
    { id: 'epilogue',  start: 313, end: 358 }
  ];
  var BLOOMS = [
    { start: 58,  end: 81 },
    { start: 140, end: 163 },
    { start: 212, end: 235 },
    { start: 289, end: 312 }
  ];

  // Editorial text windows — hand-timed to each segment's calmest sub-frames
  // so the type never fights the films' radiant climaxes, and always lifts
  // away before a bloom so every transition is pure white light.
  var WINDOWS = {
    'prologue':  { start: 3,   end: 46 },
    'chapter-1': { start: 92,  end: 132 },
    'chapter-2': { start: 172, end: 205 },
    'chapter-3': { start: 242, end: 268 },
    'epilogue':  { start: 318, end: 358 }
  };

  function isReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function initFilm() {
    if (!window.ScrollVideoController || !window.ScrollTrigger || !window.gsap) return;

    window.ScrollTrigger.config({ ignoreMobileResize: true });

    var isMobile = window.innerWidth < 768;

    // Hardening — real-device scroll modes:
    // 1) Never restore a stale mid-page scroll position into the pin region
    //    on reload (it can land "inside" the film and behave as a jump).
    //    Scoped: only when the restored position actually falls inside (or
    //    at the edge of) the film's pin span. Resetting unconditionally made
    //    EVERY refresh yank the reader back to the top of the page.
    // 2) Kill the macOS/Windows trackpad rubber-band at the page bottom so
    //    overscroll cannot visibly shift the pinned film at the OUT seam.
    (function guardReloadedPosition() {
      // Document offset of the film viewport BEFORE the pin spacer exists.
      // The spacer occupies exactly the element's space, so this equals the
      // pin start ScrollTrigger will compute a moment later.
      var vp = document.querySelector('#book-film-viewport');
      var top = 0;
      for (var el = vp; el; el = el.offsetParent) top += el.offsetTop;
      var span = (isMobile ? 2800 : 3600) + EXPAND_PX;
      var dangerStart = top - window.innerHeight;
      var dangerEnd = top + span + window.innerHeight;

      function resetIfInsideFilm() {
        var y = window.scrollY || document.documentElement.scrollTop || 0;
        if (y >= dangerStart && y <= dangerEnd && y > 0) {
          // Position lands inside (or right at) the pinned film — the reload
          // "jump" case. Reset so the film plays from its opening.
          window.scrollTo(0, 0);
          return true;
        }
        return false;
      }

      // Immediate check first…
      resetIfInsideFilm();
      // …then a sustained guard: the browser can restore the previous scroll
      // position AFTER DOMContentLoaded, and it lands in SEVERAL steps (~0.5s)
      // that each override a one-shot reset. For a short arming window, keep
      // re-asserting the reset whenever the position is inside the film.
      // After the window, DISARM completely — a scroll into the film is then
      // a reader scrolling normally and must never be reset.
      // scrollRestoration is deliberately LEFT ALONE: mutating it here could
      // suppress legitimate restores (e.g. a refresh while reading the
      // footer) in real browsers.
      var armed = true;
      var poll = null;
      var lateCheck = function () {
        if (!armed) return;
        resetIfInsideFilm();
      };
      var disarm = function () {
        armed = false;
        clearInterval(poll);
      };
      window.addEventListener('scroll', lateCheck, { passive: true });
      window.addEventListener('pageshow', lateCheck);
      poll = setInterval(lateCheck, 100);
      setTimeout(function () {
        window.removeEventListener('scroll', lateCheck);
        window.removeEventListener('pageshow', lateCheck);
        disarm();
      }, 2000);
    })();
    document.body.classList.add('has-scroll-film');
    // Disable the global CSS `scroll-behavior: smooth` for this scroll-
    // scrubbed page: programmatic smooth-scroll animations can run
    // concurrently with the pinned transform and cause seam jitter.
    document.documentElement.style.scrollBehavior = 'auto';

    var chapterEls = {};
    document.querySelectorAll(SECTION + ' .book-chapter').forEach(function (el) {
      chapterEls[el.getAttribute('data-chapter')] = el;
    });
    var bloomEl = document.querySelector('.book-film-bloom');
    var scrimEl = document.querySelector('.book-film-scrim');
    var windows = CHAPTERS.map(function (ch) {
      return { id: ch.id, el: chapterEls[ch.id], win: WINDOWS[ch.id] };
    });

    var controller = new window.ScrollVideoController({
      // Pin exactly when the film viewport reaches the top of the window —
      // full-bleed at its natural position, never early, never floating.
      trigger: '#book-film-viewport',
      pinViewport: '#book-film-viewport',
      canvas: '#book-film-canvas',
      totalFrames: TOTAL_FRAMES,
      framePath: FRAME_PATH,
      // The pin reserves extra travel for the hero expand reveal; the scrub
      // only begins after the handoff.
      scrollDistance: (isMobile ? 2800 : 3600) + EXPAND_PX,
      expandPx: EXPAND_PX,
      expandZoom: 1.30,
      // Tighter scrub = film feels glued to the finger/wheel; 0.75 lag
      // made the reel trail the scroll and read as a glitch on fast input.
      scrubSmooth: 0.5,
      // Snap the pin in ~1px early so engaging/releasing the film does not
      // visibly "jump" at the seam between sections.
      anticipatePin: 1,
      // Transform pinning keeps the film in normal flow and slides it with a
      // transform instead of toggling position:fixed — this removes the
      // micro-jump browsers repaint at the IN and OUT seams.
      pinType: 'transform',
      videoDuration: 15,
      defaultEngine: 'canvas',
      deferPreload: true, // we preload eagerly below (only ~6.9MB; kills pop-in stutter)
      onFrame: function (frameIndex, safe, opts) {
        // Hero expand phase — no text yet; white bloom + dark scrim carry
        // the open, and the frame hands the stage to the film.
        if (opts && opts.expanding) {
          if (bloomEl) bloomEl.classList.add('is-blooming');
          if (scrimEl) scrimEl.style.opacity = String((opts.e * 0.55).toFixed(3));
          for (var e = 0; e < windows.length; e++) {
            if (windows[e].el) windows[e].el.classList.remove('is-active');
          }
          return;
        }
        if (scrimEl) scrimEl.style.opacity = '0';
        for (var i = 0; i < windows.length; i++) {
          var w = windows[i];
          if (!w.el) continue;
          var active = frameIndex >= w.win.start && frameIndex <= w.win.end;
          w.el.classList.toggle('is-active', active);
        }
        // Mystical white bloom — breathe a soft light over the join frames.
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
      }
    });
    window.bookFilm = controller;

    // Eager preload: 359 frames ≈ 6.9MB. Loading immediately (instead of only
    // when the section nears the viewport) means the very first scrub frame is
    // already decoded — no blank canvas, no late pop-in mid-scroll.
    controller.preloadFrames();

    // Debug overlay — open http://localhost:8000/?debug for a live readout
    // of FPS, frame index, live bitmaps, and pin start/end. This lets us
    // see the exact bottleneck on your machine instead of guessing.
    if (/[?&]debug(?:=|&|$)/.test(location.search)) {
      var badge = document.createElement('div');
      badge.id = 'bf-debug';
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
            'version v13 debug\n' +
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

    // Re-measure trigger positions once the page is fully settled. Without
    // this, unpainted below-fold content (images/fonts) can make ScrollTrigger
    // think the film's start is earlier than it is, engaging it while the
    // reader is still inside the section above — the "starts mid-scroll" bug.
    var refreshTriggers = function () {
      window.ScrollTrigger.refresh();
    };
    if (document.readyState === 'complete') {
      refreshTriggers();
    } else {
      window.addEventListener('load', refreshTriggers, { once: true });
    }
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(refreshTriggers);
    }

    // Fade the poster out once the first film frame is ready to draw, and
    // mark the viewport live so the canvas entry-settle animation plays once.
    var poster = document.querySelector('.book-film-poster');
    if (poster) {
      var checkPoster = setInterval(function () {
        var first = controller.images && controller.images[0];
        if (first && first.complete && first.naturalWidth > 0) {
          poster.classList.add('is-hidden');
          var vp = document.querySelector(SECTION + ' #book-film-viewport');
          if (vp) vp.classList.add('is-live');
          clearInterval(checkPoster);
        }
      }, 200);
      setTimeout(function () { clearInterval(checkPoster); }, 60000);
    }

  }

  function onReady() {
    var section = document.querySelector(SECTION);
    if (!section) return;

    if (isReducedMotion()) {
      section.classList.add('reduced-motion');
      return; // static poster + stacked readable chapters, no pin, no scrub
    }

    initFilm(); // immediately — pin spacer must exist in first layout
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', onReady);
  } else {
    onReady();
  }
})();
