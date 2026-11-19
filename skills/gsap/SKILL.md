---
name: gsap
description: Master GSAP (GreenSock Animation Platform) and ScrollTrigger animation engineering. Covers high-performance timelines, tweens, ScrollTrigger pinning, scrubbing, snapping, matchMedia responsiveness, Flip, SplitText, Observer, and memory leak prevention in Vanilla JS, React, and Next.js.
---

# GSAP & ScrollTrigger Animation Engineering

> The definitive guide to award-winning (Awwwards / FWA / Webby grade) web motion using GSAP 3.x and ScrollTrigger.
> Optimized for zero layout thrashing, 60fps/120fps GPU compositing, responsive matchMedia, and strict lifecycle memory cleanup.

---

## 1. CORE GSAP ARCHITECTURE & FOUNDATIONS

### 1.1 The Golden Rules of Web Motion
1. **Never animate layout properties (`top`, `left`, `margin`, `width`, `height`).** Always animate CSS transforms:
   - `x`, `y`, `xPercent`, `yPercent`, `scale`, `scaleX`, `scaleY`, `rotation`, `skewX`, `skewY`.
2. **Promote active elements to independent GPU layers** using `will-change: transform, opacity;` or `force3D: true`.
3. **Prevent Flash of Unstyled Content (FOUC):** Use `gsap.set()` or CSS `visibility: hidden` / `opacity: 0` before running `.from()` or `.to()` reveals.
4. **Always clean up animations on unmount or navigation:** A running GSAP ticker or uncleaned ScrollTrigger instance creates zombie listeners and memory leaks.

### 1.2 Core Tween Syntax
```javascript
// High-performance tween
gsap.to('.hero-card', {
  y: -20,
  opacity: 1,
  duration: 0.8,
  ease: 'power3.out',
  stagger: 0.08,
  force3D: true
});

// fromTo pattern for explicit boundary control
gsap.fromTo('.badge', 
  { opacity: 0, scale: 0.85, y: 15 },
  { opacity: 1, scale: 1, y: 0, duration: 0.6, ease: 'back.out(1.7)' }
);
```

### 1.3 Master Timelines
Timelines synchronize sequences, handle relative offsets, and can be scrubbed or reversed as a single cohesive unit:
```javascript
const tl = gsap.timeline({
  defaults: { duration: 0.7, ease: 'power2.out' },
  onComplete: () => console.log('Sequence done')
});

tl.from('.header-nav', { y: -30, opacity: 0 })
  .from('.hero-headline', { y: 40, opacity: 0 }, '-=0.4') // Overlap by 0.4s
  .from('.hero-subtext', { y: 25, opacity: 0 }, '-=0.3')
  .from('.hero-cta-group', { scale: 0.95, opacity: 0 }, '<0.2'); // 0.2s after previous start
```

---

## 2. PROFESSIONAL EASING CURVES & EMOTIONAL WEIGHT

Standard browser `ease-in-out` feels robotic and sluggish. Award-winning interfaces demand calibrated mathematical curves:

| Ease | Typical Usage | Character |
|---|---|---|
| `'power2.out'` | Standard UI entry, tooltips, buttons | Smooth, subtle deceleration |
| `'power3.out'` | Modal dialogs, drawer panels | Snappy, decisive stop |
| `'power4.out'` | Dramatic hero entrances, large cards | Cinematic deceleration |
| `'expo.out'` | Luxury hero typography reveals | Ultra-crisp finish |
| `'back.out(1.7)'` | Badges, tags, micro-interactions | Playful overshoot and settle |
| `'circ.out'` | Quick toggle indicators | Immediate burst into soft landing |
| `'none'` (Linear) | Video scrub, infinite tickers, progress tracks | Constant velocity |

---

## 3. SCROLLTRIGGER MASTERY

GSAP's `ScrollTrigger` turns scroll position into an interactive timeline driver.

### 3.1 Canonical ScrollTrigger Skeleton
```javascript
gsap.registerPlugin(ScrollTrigger);

gsap.to('.animated-element', {
  scrollTrigger: {
    trigger: '.section-container',
    start: 'top 80%',         // [trigger top] hits [viewport 80%]
    end: 'bottom 20%',        // [trigger bottom] hits [viewport 20%]
    toggleActions: 'play none none reverse', // onEnter, onLeave, onEnterBack, onLeaveBack
    markers: false            // Set to true only in development
  },
  y: 0,
  opacity: 1,
  duration: 0.9,
  ease: 'power3.out'
});
```

### 3.2 Pinning & Scrubbing (Cinematic Sequences)
When pinning an element while scrubbing an animation:
```javascript
const scrubTl = gsap.timeline({
  scrollTrigger: {
    trigger: '#pin-section',
    start: 'top top',
    end: '+=3000',           // 3,000px of scroll travel
    pin: true,               // Pins the container in place
    anticipatePin: 1,        // Prevents minor frame jump on quick scroll
    scrub: 0.8,              // 0.8s smooth interpolation catch-up
    invalidateOnRefresh: true // Recalculates dimensions on window resize
  }
});

scrubTl.to('.visual-target', { scale: 1.2, rotation: 5, ease: 'none' })
       .to('.caption-step-1', { opacity: 0, y: -20 }, 0)
       .fromTo('.caption-step-2', { opacity: 0, y: 20 }, { opacity: 1, y: 0 }, 0.5);
```

### 3.3 Horizontal Scroll Track
Pin a wrapper while translating an inner row horizontally:
```javascript
const container = document.querySelector('.horizontal-track');
const totalScroll = container.scrollWidth - window.innerWidth;

gsap.to(container, {
  x: () => -totalScroll,
  ease: 'none',
  scrollTrigger: {
    trigger: '.horizontal-wrapper',
    start: 'top top',
    end: () => `+=${totalScroll}`,
    pin: true,
    scrub: 0.5,
    invalidateOnRefresh: true
  }
});
```

### 3.4 Sequential Text Scrub Reveal
Reveal words or spans sequentially as user scrolls:
```javascript
const words = document.querySelectorAll('.scrub-text span');

gsap.fromTo(words, 
  { opacity: 0.15, y: 10 },
  {
    opacity: 1,
    y: 0,
    stagger: 0.05,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.scrub-text-section',
      start: 'top 75%',
      end: 'bottom 40%',
      scrub: true
    }
  }
);
```

---

## 4. RESPONSIVE MOTION WITH `gsap.matchMedia()`

Never use `window.innerWidth` in static GSAP initialization. Use `gsap.matchMedia()` which automatically cleans up and recreates timelines when breakpoints switch:

```javascript
const mm = gsap.matchMedia();

mm.add({
  isDesktop: '(min-width: 1024px)',
  isMobile: '(max-width: 1023px)',
  reduceMotion: '(prefers-reduced-motion: reduce)'
}, (context) => {
  const { isDesktop, isMobile, reduceMotion } = context.conditions;

  if (reduceMotion) {
    // Accessible fallback
    gsap.set('.card', { opacity: 1, y: 0 });
    return;
  }

  if (isDesktop) {
    // Multi-column pin & complex parallax
    gsap.to('.sticky-column', {
      scrollTrigger: { trigger: '.split-wrap', pin: true, start: 'top top', end: 'bottom bottom' }
    });
  } else {
    // Mobile linear sequential fade
    gsap.from('.card', {
      y: 30,
      opacity: 0,
      stagger: 0.15,
      scrollTrigger: { trigger: '.card-grid', start: 'top 85%' }
    });
  }
});
```

---

## 5. FRAMEWORK INTEGRATION & MEMORY LEAK PREVENTION

### 5.1 React & Next.js (`useGSAP` or `gsap.context()`)
Always wrap GSAP code in `useGSAP` (from `@gsap/react`) or a strict `gsap.context()` cleanup inside `useEffect`:

```tsx
'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Any tweens or ScrollTriggers created here are automatically reverted on unmount!
    gsap.from('.hero-title', {
      y: 50,
      opacity: 0,
      duration: 1,
      ease: 'power3.out'
    });

    ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top top',
      pin: true
    });
  }, { scope: containerRef }); // Scope selectors to containerRef

  return (
    <section ref={containerRef}>
      <h1 className="hero-title">Awwwards Grade Motion</h1>
    </section>
  );
}
```

### 5.2 Vanilla JavaScript / Multi-Page SPA Cleanup
When navigating without full reload (e.g. Barba.js, Turbo):
```javascript
let ctx;

function initPageAnimations() {
  // 1. Revert previous context and kill stale ScrollTriggers
  if (ctx) ctx.revert();
  ScrollTrigger.getAll().forEach(t => t.kill());

  // 2. Spawn new scoped context
  ctx = gsap.context(() => {
    gsap.to('.box', { rotation: 360, scrollTrigger: '.box' });
  });

  ScrollTrigger.refresh();
}
```

---

## 6. INTEGRATION WITH LENIS SMOOTH SCROLL

When pairing GSAP ScrollTrigger with Lenis, keep them on a single synchronized requestAnimationFrame loop:

```javascript
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true
});

// Update ScrollTrigger on Lenis scroll event
lenis.on('scroll', ScrollTrigger.update);

// Drive Lenis via GSAP ticker for unified frame sync
gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});

// Disable lag smoothing to prevent visual stutter after heavy operations
gsap.ticker.lagSmoothing(0);
```

---

## 7. PRE-FLIGHT CHECKLIST
Before committing any GSAP animation:
- [ ] No `top`, `left`, `margin`, or `padding` animated (transforms only).
- [ ] Easing is tailored (`power3.out`, `expo.out`), not default CSS ease.
- [ ] Responsive behavior tested via `gsap.matchMedia()`.
- [ ] `prefers-reduced-motion` honored.
- [ ] Unmount/cleanup handler registered (`ctx.revert()` or `useGSAP()`).
- [ ] `ScrollTrigger.refresh()` called after dynamic images or async components load.
- [ ] 60fps/120fps smooth performance verified with zero layout thrashing.
