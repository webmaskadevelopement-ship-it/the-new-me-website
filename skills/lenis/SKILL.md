---
name: lenis
description: Master Lenis smooth scroll engineering by Darkroom Engineering. Covers normalized high-performance smooth scrolling, GSAP ScrollTrigger ticker integration, anchor jump handling, programmatic scroll control, modal scroll locking, and React/Next.js wrappers.
---

# Lenis Smooth Scroll Engineering

> The definitive engineering guide for implementing silky, high-performance smooth scrolling with **Lenis** (by Darkroom Engineering).
> Covers native scroll preservation, zero-latency GSAP ScrollTrigger synchronization, mobile handling, and robust memory management.

---

## 1. CORE PHILOSOPHY & WHY LENIS
Unlike legacy libraries (like Locomotive Scroll v4 or iScroll) that hijacked the DOM with artificial `transform: translateY()` on body wrappers—breaking `position: sticky`, native keyboard scrolling, anchor jumps, and browser accessibility—**Lenis runs on top of native browser scrolling**.

- Native `position: sticky` continues working out-of-the-box.
- Browser accessibility tools and keyboard keys (Page Down, Space, Arrow keys) operate normally.
- Hardware-accelerated subpixel smooth interpolation.
- Lightweight footprint (~3KB gzipped) with zero external dependencies.

---

## 2. INSTALLATION & SCRIPT TAGS

### NPM / Yarn / PNPM:
```bash
npm install lenis
# For React / Next.js
npm install lenis @studio-freight/react-lenis # or lenis/react
```

### CDN / Vanilla Script Tag:
```html
<script src="https://unpkg.com/lenis@1.3.26/dist/lenis.min.js"></script>
```

---

## 3. MASTER CONFIGURATION & INITIALIZATION

### 3.1 Standard Modern Setup (Vanilla JS)
```javascript
import Lenis from 'lenis';

const lenis = new Lenis({
  // Duration of scroll glide in seconds (default: 1.2)
  duration: 1.2,
  
  // Custom exponential easing curve for luxury deceleration
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  
  // Direction: 'vertical' or 'horizontal'
  orientation: 'vertical',
  
  // Gesture direction: 'vertical' | 'horizontal' | 'both'
  gestureOrientation: 'vertical',
  
  // Enable smooth mouse wheel scrolling
  smoothWheel: true,
  
  // Wheel multiplier (fine-tunes speed sensitivity)
  wheelMultiplier: 1.0,
  
  // Touch multiplier (by default touch smooth scroll is disabled for native iOS/Android feel)
  touchMultiplier: 2.0,
  
  // Infinite looping (false by default)
  infinite: false,
  
  // Auto-resize on DOM mutations
  autoResize: true
});

// Self-driven requestAnimationFrame loop
function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);
```

---

## 4. GSAP & SCROLLTRIGGER SYNCHRONIZATION (THE GOLD STANDARD)

When pairing Lenis with GSAP ScrollTrigger, **never run two independent requestAnimationFrame loops**. Delegate Lenis's frame tick to GSAP's internal ticker to guarantee 100% frame synchronization without micro-stuttering:

```javascript
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// 1. Initialize Lenis
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true
});

// 2. Synchronize ScrollTrigger on Lenis scroll event
lenis.on('scroll', ScrollTrigger.update);

// 3. Drive Lenis via GSAP ticker
gsap.ticker.add((time) => {
  lenis.raf(time * 1000); // Convert seconds to milliseconds
});

// 4. Disable lagSmoothing so GSAP does not jump after heavy thread work
gsap.ticker.lagSmoothing(0);
```

---

## 5. PROGRAMMATIC API & SCROLL CONTROL

### 5.1 Smooth Scroll to Target (`lenis.scrollTo`)
```javascript
// Scroll to selector or DOM node
lenis.scrollTo('#product-specifications', {
  offset: -80,        // Useful for offset sticky headers
  duration: 1.5,      // Custom duration for this specific jump
  easing: (t) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t),
  immediate: false,   // Set to true to snap instantly without animation
  lock: false,        // If true, user cannot override scroll until target reached
  onComplete: () => {
    console.log('Arrived at target');
  }
});

// Scroll to top
lenis.scrollTo(0, { duration: 1.0 });
```

### 5.2 Locking & Unlocking Scroll (Modals / Drawers)
When opening a modal or cart drawer, prevent background page scrolling cleanly:
```javascript
function openModal() {
  lenis.stop(); // Stops Lenis processing wheel and touch events
  document.body.classList.add('overflow-hidden');
}

function closeModal() {
  lenis.start(); // Resumes smooth scrolling
  document.body.classList.remove('overflow-hidden');
}
```

---

## 6. REACT & NEXT.JS IMPLEMENTATION

Using `ReactLenis`:

```tsx
'use client';

import { ReactLenis, useLenis } from 'lenis/react';
import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function SmoothScrollLayout({ children }: { children: React.ReactNode }) {
  const lenis = useLenis(({ scroll }) => {
    // Optional continuous scroll callback
  });

  useEffect(() => {
    if (!lenis) return;
    
    // Bind ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
    };
  }, [lenis]);

  return (
    <ReactLenis root options={{ duration: 1.2, smoothWheel: true }}>
      {children}
    </ReactLenis>
  );
}
```

---

## 7. CRITICAL TROUBLESHOOTING & GOTCHAS

1. **Conflict with CSS `scroll-behavior: smooth`:**
   Always remove `html { scroll-behavior: smooth; }` from CSS when using Lenis! Having both enabled causes conflicting interpolation fights and jittery scrolling.
2. **`overscroll-behavior`:**
   Add `html.lenis, html.lenis body { height: auto; }` and avoid `overflow: hidden` on `html` or `body` unless explicitly locking scroll.
3. **Anchor Links:**
   Intercept standard `<a href="#section">` clicks and pass them to `lenis.scrollTo(target)` to avoid abrupt default browser jumps.
4. **Reduced Motion:**
   Respect accessibility:
   ```javascript
   if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
     lenis.destroy();
   }
   ```
