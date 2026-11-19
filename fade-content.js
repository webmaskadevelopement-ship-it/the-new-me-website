/**
 * FadeContent — vanilla port of the React Bits <FadeContent> component
 * (DavidHDev/react-bits, content/Animations/FadeContent).
 *
 * The site is static HTML/CSS/JS + GSAP, so the component's exact motion is
 * implemented natively here: same SVG feTurbulence noise mask, same sigmoid
 * alpha table (33 levels), same smoothstep reveal window, same decaying blur,
 * same stagger-across-children and the same ScrollTrigger start math.
 *
 * Declarative use (the static-site equivalent of the JSX snippet):
 *
 *   <div data-fade="mist" data-fade-duration="1.8" data-fade-ease="power2.out"
 *        data-fade-stagger="0.1" data-fade-threshold="0.1">
 *     <h2>Slow light over the bay</h2>
 *     <p>Every child fades in turn.</p>
 *   </div>
 *
 * …which is exactly:
 *
 *   <FadeContent effect="mist" duration={1.8} ease="power2.out"
 *                stagger={0.1} threshold={0.1}> … </FadeContent>
 *
 * Imperative use (film drivers):
 *
 *   var fx = window.FadeContent(el, { effect: 'mist', trigger: 'mount' });
 *   fx.play();      // run the reveal
 *   fx.clear();     // fast clean exit (opacity), mask rewound for replay
 *
 * Effects: 'fade' (default), 'mist', 'dissolve', 'pixel', 'focus', 'develop'.
 */
(function () {
  'use strict';

  var SVG_NS = 'http://www.w3.org/2000/svg';
  var NOISE_EFFECTS = ['dissolve', 'mist', 'pixel'];
  var LEVELS = [];
  for (var i = 0; i < 33; i++) LEVELS.push(1 / (1 + Math.exp(-10.8 * (i / 32 - 0.5))));
  var maskCount = 0;

  function toSeconds(value) {
    return typeof value === 'number' && value > 10 ? value / 1000 : value;
  }
  function clamp01(value) {
    return Math.min(Math.max(value, 0), 1);
  }
  function smoothstep(from, to, value) {
    var t = clamp01((value - from) / (to - from));
    return t * t * (3 - 2 * t);
  }

  function noiseFor(kind, size) {
    if (kind === 'mist') {
      return {
        frequency: Math.min(Math.max(4 / size, 0.004), 0.02),
        octaves: 3, edge: 0.35, blur: 10, block: 0
      };
    }
    if (kind === 'pixel') {
      var block = 2 * Math.round(Math.min(Math.max(size / 32, 6), 24) / 2);
      return { frequency: 0.5 / block, octaves: 1, edge: 0.06, blur: 0, block: block };
    }
    return { frequency: 0.6, octaves: 1, edge: 0.15, blur: 0, block: 0 };
  }

  function createNoiseMask(target, kind, floor, extraBlur) {
    var box = target.getBoundingClientRect();
    var spec = noiseFor(kind, Math.sqrt(Math.max(box.width * box.height, 1)));
    function node(name, attrs, parent) {
      var child = document.createElementNS(SVG_NS, name);
      for (var key in attrs) child.setAttribute(key, String(attrs[key]));
      parent.appendChild(child);
      return child;
    }
    var svg = node('svg', { width: 0, height: 0, 'aria-hidden': 'true' }, document.body);
    svg.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden;pointer-events:none';
    var id = 'fade-content-mask-' + (++maskCount);
    var filter = node('filter',
      { id: id, x: '-10%', y: '-10%', width: '120%', height: '120%', 'color-interpolation-filters': 'sRGB' },
      svg);
    node('feTurbulence', {
      type: 'fractalNoise',
      baseFrequency: spec.frequency,
      numOctaves: spec.octaves,
      seed: Math.floor(Math.random() * 1000),
      result: 'noise'
    }, filter);
    var source = 'noise';
    if (spec.block > 0) {
      var dot = spec.block / 2 - 1;
      node('feColorMatrix', {
        in: 'noise', type: 'matrix',
        values: '1 0 0 0 0 1 0 0 0 0 1 0 0 0 0 0 0 0 0 1', result: 'gray'
      }, filter);
      node('feFlood', { x: dot, y: dot, width: 2, height: 2, 'flood-color': '#000', result: 'dot' }, filter);
      node('feComposite', { in: 'dot', in2: 'dot', width: spec.block, height: spec.block, result: 'cell' }, filter);
      node('feTile', { in: 'cell', result: 'grid' }, filter);
      node('feComposite', { in: 'gray', in2: 'grid', operator: 'in', result: 'samples' }, filter);
      node('feMorphology', { in: 'samples', operator: 'dilate', radius: dot, result: 'blocks' }, filter);
      source = 'blocks';
    }
    node('feColorMatrix', {
      in: source, type: 'matrix',
      values: '0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1.43 0 0 0 -0.21'
    }, filter);
    var transfer = node('feComponentTransfer', { result: 'mask' }, filter);
    var curve = node('feFuncA', { type: 'table' }, transfer);
    node('feComposite', { in: 'SourceGraphic', in2: 'mask', operator: 'in' }, filter);

    var url = 'url(#' + id + ')';
    var blurFrom = spec.blur + extraBlur;
    var state = { progress: 0 };
    var drawn = -1;

    function render() {
      var progress = state.progress;
      if (progress === drawn) return;
      drawn = progress;
      if (progress >= 1) {
        target.style.filter = '';
        target.style.visibility = 'inherit';
        return;
      }
      var front = progress * (1 + 2 * spec.edge) - spec.edge;
      var parts = [];
      for (var i = 0; i < LEVELS.length; i++) {
        var level = LEVELS[i];
        parts.push((floor + (1 - floor) * (1 - smoothstep(front - spec.edge, front + spec.edge, level))).toFixed(3));
      }
      curve.setAttribute('tableValues', parts.join(' '));
      target.style.filter = blurFrom > 0
        ? url + ' blur(' + (blurFrom * (1 - progress)).toFixed(2) + 'px)'
        : url;
      target.style.visibility = progress <= 0 && floor <= 0 ? 'hidden' : 'inherit';
    }

    render();
    return {
      state: state,
      render: render,
      remove: function () {
        svg.remove();
        target.style.filter = '';
      }
    };
  }

  function getLooks(effect, blur, initialOpacity) {
    var soften = function (amount) { return 'blur(' + amount + 'px)'; };
    if (effect === 'focus') {
      return [
        { from: { autoAlpha: initialOpacity }, to: { autoAlpha: 1 }, share: 0.6 },
        { from: { filter: soften(12 + blur), scale: 0.97 }, to: { filter: soften(0), scale: 1 }, share: 1 }
      ];
    }
    if (effect === 'develop') {
      return [
        { from: { autoAlpha: initialOpacity }, to: { autoAlpha: 1 }, share: 0.5 },
        {
          from: { filter: 'grayscale(1) contrast(0.55) brightness(1.3) ' + soften(blur) },
          to: { filter: 'grayscale(0) contrast(1) brightness(1) ' + soften(0) }, share: 1
        }
      ];
    }
    if (blur > 0) {
      return [{
        from: { autoAlpha: initialOpacity, filter: soften(blur) },
        to: { autoAlpha: 1, filter: soften(0) }, share: 1
      }];
    }
    return [{ from: { autoAlpha: initialOpacity }, to: { autoAlpha: 1 }, share: 1 }];
  }

  /**
   * FadeContent(el, options) — returns { play, clear, destroy }.
   * Options mirror the React props: effect, blur, duration, ease, delay,
   * threshold, initialOpacity, stagger, staggerFrom, trigger ('scroll'|'mount'),
   * once (default true).
   */
  function FadeContent(el, options) {
    if (!el || !window.gsap) return null;
    var opts = options || {};
    var effect = opts.effect || 'fade';
    var blur = opts.blur === true ? 10 : Math.max(Number(opts.blur) || 0, 0);
    var duration = Math.max(toSeconds(opts.duration != null ? opts.duration : 1) || 0, 0.01);
    var ease = opts.ease || 'power2.out';
    var delay = Math.max(toSeconds(opts.delay) || 0, 0);
    var threshold = clamp01(Number(opts.threshold != null ? opts.threshold : 0.1));
    var initialOpacity = clamp01(Number(opts.initialOpacity) || 0);
    var stagger = Number(opts.stagger) || 0;
    var staggerFrom = opts.staggerFrom || 'start';
    var trigger = opts.trigger || 'scroll';
    var once = opts.once !== false;

    var reduce = window.matchMedia
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false;

    var masks = [];
    var targets = stagger > 0 && el.children.length ? Array.prototype.slice.call(el.children) : [el];
    el.style.visibility = 'hidden';

    if (reduce) {
      el.style.visibility = 'visible';
      return { play: function () {}, clear: function () {}, destroy: function () {} };
    }

    var noisy = NOISE_EFFECTS.indexOf(effect) !== -1;
    var looks = noisy ? [] : getLooks(effect, blur, initialOpacity);
    if (noisy) {
      masks = targets.map(function (target) {
        return createNoiseMask(target, effect, initialOpacity, blur);
      });
    }
    var proxies = masks.map(function (mask) { return mask.state; });
    var draw = function () { masks.forEach(function (mask) { mask.render(); }); };
    var staggerVars = stagger > 0 ? { stagger: { each: toSeconds(stagger), from: staggerFrom } } : {};

    var tl = gsap.timeline({ paused: true });
    if (noisy) {
      tl.fromTo(proxies, { progress: 0 },
        Object.assign({ progress: 1, duration: duration, ease: ease, onUpdate: draw }, staggerVars),
        delay);
    } else {
      looks.forEach(function (look) {
        tl.fromTo(targets, look.from,
          Object.assign({}, look.to, { duration: duration * look.share, ease: ease }, staggerVars),
          delay);
      });
    }

    gsap.set(el, { visibility: 'visible' });

    var st = null;
    if (trigger === 'scroll' && window.ScrollTrigger) {
      st = ScrollTrigger.create({
        trigger: el,
        start: function () {
          var view = window.innerHeight;
          var box = el.getBoundingClientRect();
          var limit = document.documentElement.scrollHeight - window.innerHeight;
          var top = box.top + window.scrollY;
          var start = top - view * (1 - threshold);
          return start > limit ? limit - 1 : start;
        },
        once: once,
        onEnter: function () { tl.play(); }
      });
    }

    return {
      play: function () { tl.play(); },
      progress: function (value) { tl.progress(value); },
      clear: function () {
        // Fast clean exit for scroll-film windows: fade out quickly, rewind
        // the mask so the entry mist can replay on the next pass.
        gsap.to(targets, {
          autoAlpha: 0, duration: 0.28, ease: 'power2.in', overwrite: true,
          onComplete: function () {
            gsap.set(targets, { clearProps: 'opacity,visibility' });
            tl.pause(0);
            if (noisy) {
              proxies.forEach(function (p) { p.progress = 0; });
              draw();
            }
          }
        });
      },
      destroy: function () {
        if (st) st.kill();
        tl.kill();
        masks.forEach(function (mask) { mask.remove(); });
        el.style.visibility = '';
        gsap.set(targets, { clearProps: 'filter,transform,opacity,visibility' });
      }
    };
  }

  // Declarative auto-init: data-fade / data-fade-* attributes
  function autoInit() {
    var nodes = document.querySelectorAll('[data-fade]');
    nodes.forEach(function (el) {
      var num = function (name, fallback) {
        var raw = el.getAttribute(name);
        return raw == null ? fallback : Number(raw);
      };
      FadeContent(el, {
        effect: el.getAttribute('data-fade') || 'fade',
        blur: num('data-fade-blur', 0),
        duration: num('data-fade-duration', 1),
        ease: el.getAttribute('data-fade-ease') || 'power2.out',
        delay: num('data-fade-delay', 0),
        threshold: num('data-fade-threshold', 0.1),
        stagger: num('data-fade-stagger', 0),
        trigger: el.getAttribute('data-fade-trigger') || 'scroll'
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', autoInit);
  } else {
    autoInit();
  }

  window.FadeContent = FadeContent;
})();
