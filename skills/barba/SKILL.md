---
name: barba
description: Master Barba.js v2 fluid PJAX page transitions and SPA-like lifecycles. Covers wrapper/container DOM contracts, async transition hooks (leave, enter, once), curtain wipes, crossfades, reinitializing GSAP ScrollTrigger & Lenis, views system, and prefetching.
---

# Barba.js v2 Fluid Page Transitions

> The definitive engineering guide for building seamless, single-page application (SPA) style transitions between static or multi-page HTML sites using **Barba.js v2**.
> Covers DOM contracts, GSAP animation orchestration, script reinitialization, and smooth-scroll synchronicity.

---

## 1. THE BARBA HTML CONTRACT

Barba intercepts link clicks, fetches the next page via asynchronous fetch, parses the DOM, swaps the inner container, and plays enter/leave animations without a full browser reload.

To work, every HTML page must declare this exact structural contract:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <title>Current Page | Brand</title>
</head>
<body data-barba="wrapper">

  <!-- Static persistent UI stays OUTSIDE the container (Header, Nav, Cursor, Transition Curtain) -->
  <header class="header">...</header>
  <div class="transition-curtain"></div>

  <!-- Dynamic Content Container -->
  <main data-barba="container" data-barba-namespace="home">
    <!-- Page specific sections -->
  </main>

  <!-- Static persistent Footer (or place inside container if page-specific) -->
  <footer class="footer">...</footer>

</body>
</html>
```

### Key Attributes:
- `data-barba="wrapper"`: Placed once on `<body>` or outer root element.
- `data-barba="container"`: The swappable element containing the unique page markup.
- `data-barba-namespace="<name>"`: Identifies the page type (e.g. `home`, `about`, `product`) for tailored transitions and view hooks.

---

## 2. INSTALLATION & BUNDLE SETUP

### NPM / Bundler:
```bash
npm install @barba/core @barba/prefetch
```

### CDN Script Tags:
```html
<script src="https://unpkg.com/@barba/core"></script>
<script src="https://unpkg.com/@barba/prefetch"></script>
```

---

## 3. MASTER INITIALIZATION & LIFECYCLE HOOKS

Barba's lifecycle executes in a predictable async sequence:

```
[User clicks link]
  ↓
1. before(data)
2. beforeLeave(data)
3. leave(data)         <-- Old page animates OUT
4. afterLeave(data)
  ↓ [DOM swapped: old container removed, new container inserted]
5. beforeEnter(data)   <-- Update document.title, scroll reset
6. enter(data)         <-- New page animates IN
7. afterEnter(data)    <-- Reinitialize GSAP ScrollTrigger, Lenis, trackers
8. after(data)
```

### Basic GSAP Transition Setup:
```javascript
import barba from '@barba/core';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

barba.init({
  transitions: [
    {
      name: 'default-fade',
      
      // Initial page load animation
      once({ next }) {
        gsap.from(next.container, {
          opacity: 0,
          y: 20,
          duration: 0.8,
          ease: 'power2.out'
        });
      },

      // Leaving current page
      async leave({ current }) {
        return gsap.to(current.container, {
          opacity: 0,
          y: -20,
          duration: 0.5,
          ease: 'power2.in'
        });
      },

      // Entering new page
      enter({ next }) {
        window.scrollTo(0, 0); // Reset scroll position
        
        return gsap.fromTo(next.container,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
        );
      }
    }
  ]
});
```

---

## 4. CRITICAL REINITIALIZATION PIPELINE (PREVENTING ZOMBIE CODE)

In traditional multi-page websites, scripts re-run on full page refresh. Under Barba.js, your JavaScript environment persists across navigations.

**You MUST reinitialize components after page swap in `afterEnter`:**

```javascript
barba.hooks.afterEnter((data) => {
  // 1. Update document title
  const nextHtml = data.next.html;
  const titleMatch = nextHtml.match(/<title>([^<]*)<\/title>/);
  if (titleMatch && titleMatch[1]) {
    document.title = titleMatch[1];
  }

  // 2. Update active navbar classes
  updateActiveNavigation(data.next.url.path);

  // 3. Reset Lenis smooth scroll
  if (window.lenis) {
    window.lenis.scrollTo(0, { immediate: true });
  }

  // 4. Kill stale ScrollTriggers and recreate page animations
  if (typeof ScrollTrigger !== 'undefined') {
    ScrollTrigger.getAll().forEach(st => st.kill());
    initCurrentPageAnimations(data.next.namespace);
    ScrollTrigger.refresh();
  }

  // 5. Fire analytics / tag manager pageview
  if (window.dataLayer) {
    window.dataLayer.push({ event: 'pageview', path: window.location.pathname });
  }
});
```

---

## 5. BATTLE-TESTED TRANSITION RECIPES

### 5.1 The Architectural Curtain Wipe (Awwwards Style)
Uses a persistent fullscreen curtain overlay that sweeps down to cover the screen, swaps the DOM while covered, and wipes away:

```javascript
const curtain = document.querySelector('.transition-curtain');

barba.init({
  sync: false,
  transitions: [
    {
      name: 'curtain-wipe',
      async leave() {
        // Sweep curtain DOWN from top to cover screen
        return gsap.fromTo(curtain, 
          { scaleY: 0, transformOrigin: 'top center' },
          { scaleY: 1, duration: 0.6, ease: 'power4.inOut' }
        );
      },
      enter({ next }) {
        // Reset scroll while fully covered
        window.scrollTo(0, 0);

        // Sweep curtain AWAY towards bottom
        return gsap.fromTo(curtain,
          { transformOrigin: 'bottom center' },
          { scaleY: 0, duration: 0.6, ease: 'power4.inOut', delay: 0.1 }
        );
      }
    }
  ]
});
```

### 5.2 Simultaneous Sync Mode Crossfade
In `sync: true` mode, the leaving and entering containers coexist in the DOM simultaneously:
```javascript
barba.init({
  transitions: [
    {
      name: 'sync-crossfade',
      sync: true,
      leave({ current }) {
        return gsap.to(current.container, {
          opacity: 0,
          scale: 0.98,
          duration: 0.6,
          ease: 'power2.inOut',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%'
        });
      },
      enter({ next }) {
        return gsap.fromTo(next.container,
          { opacity: 0, scale: 1.02 },
          { opacity: 1, scale: 1, duration: 0.6, ease: 'power2.inOut' }
        );
      }
    }
  ]
});
```

---

## 6. PREVENTING BARBA INTERCEPTION ON SPECIAL LINKS

Not every click should trigger a Barba PJAX transition. Use `prevent` rules:

```javascript
barba.init({
  prevent: ({ el }) => {
    // 1. Ignore anchor links on the same page
    if (el.getAttribute('href')?.startsWith('#')) return true;

    // 2. Ignore cart drawer triggers, modals, or download links
    if (el.classList.contains('no-barba') || el.classList.contains('cart-trigger')) return true;

    // 3. Ignore external links
    if (el.hostname !== window.location.hostname) return true;

    // 4. Ignore target="_blank"
    if (el.target === '_blank') return true;

    return false;
  }
});
```

---

## 7. PRE-FLIGHT CHECKLIST
Before deploying Barba.js:
- [ ] Every page contains `data-barba="wrapper"` and `data-barba="container"`.
- [ ] Unique `data-barba-namespace` specified per template.
- [ ] Header, mobile drawer, and transition curtains reside OUTSIDE the container.
- [ ] Scroll position explicitly reset on page transition (`window.scrollTo(0, 0)` or `lenis.scrollTo(0)`).
- [ ] `ScrollTrigger.kill()` and `ScrollTrigger.refresh()` wired in `afterEnter`.
- [ ] External and anchor links protected via `prevent` configuration.
- [ ] Document `<title>` and active navigation state updated dynamically.
