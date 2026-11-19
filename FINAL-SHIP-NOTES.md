# The New Me — Homepage Book Film · Final Ship Notes

Build verified 2026-11-19 (Edge, headless). Status: **READY**.

## What ships
- **Engine:** protein-page replica (Lenis 1.3.26 vendored + GSAP ScrollTrigger dual-engine scrub, 0.25/0.08 catch-up, full 2× DPR cached-dims cover draw, RAF-coalesced render, direction-aware frame fallback). `book-scroll.js?v=protein_v17`.
- **Choreography:** 5 phases — t1 (16.2s), t2 (15.9s), t3 (16.9s), quote (4.6s), finale + closing dissolve. Glitch/torn frames (66, 93–101, 119–139, 189–212) never mapped; jumps happen under the white flood.
- **Text system:** SplitText-style, line-masked titles (0.75s rise, per-line delays); spread paragraphs arrive line-by-line via **GSAP paragraph tweens** (12 total, staggered, reversible — batched, compositor-friendly).
- **Adaptive ink:** per-frame luminance flips white type to ink on bright scenes (lum ≥ 150).
- **White moments:** paper-flood whiteouts (z 4, below text) with progressive line reveals, then ink out-cascade.
- **CTA:** finale „Get Your Copy" → Amazon (https://www.amazon.in/dp/9364115511/).

## Verified numbers
| Check | Result |
|---|---|
| Scrubbed FPS (Edge) | 61 fps, 0% frames > 33 ms |
| Glitch-frame audit (100-step sweep) | 0 bad frames drawn |
| Progressive reveal (desktop) | 8 → 14 lines visible across scroll |
| Mobile (390×844) | engine live, t2 white phase, 0 errors |
| Reduced motion | static, fully readable |
| Console/page/request errors | 0 |

## Known environment caveat (NOT a code issue)
If a live machine still stutters: enable **Edge → Settings → System → Use graphics acceleration** and restart. Without GPU compositing every animated page janks.
Run `http://localhost:8000/?debug` for live fps/frame/pin readout.

## Files
`book-scroll.js`, `index.html` (section, v17 include), `book-page.css`, `book-film.css`, `fade-content.js`, `vendor/lenis/lenis.min.js`, `frames/book-page/`, `ANIMATION-SYSTEM.md`.
