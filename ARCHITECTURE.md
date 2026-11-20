# The New Me — Architecture & Maintenance Guide

Static, framework-free site. No build step. Deployable to Netlify (or Vercel) as-is.

---

## 1. Stack

| Layer | What | Notes |
|---|---|---|
| Markup | 21 static `.html` pages | hand-written, semantic |
| Styling | `style.css` (global) + page-scoped CSS | design tokens in `:root` of `style.css` |
| Motion | GSAP 3.12.5 + ScrollTrigger (vendored `vendor/gsap/`) | local copies; CDN fallback via `onerror` |
| Smooth scroll | Lenis 1.3.26 (vendored `vendor/lenis/`) | drives scroll-linked animation |
| Fonts | Google Fonts (Inter, Playfair Display, Newsreader) | loaded per page via `<link>` |
| App | Netlify Forms (contact), static hosting | no backend server required |

---

## 2. The scroll-film system (homepage)

**Files**
- `index.html` — the film section (`#book-page-film`) + text chapters
- `book-scroll.js` — **the engine** (GSAP + Lenis + canvas frame scrub)
- `book-page.css` — film/white-page typography, paper texture, mobile editorial rules
- `book-film.css`, `scroll-video.css` — shared viewport/poster/canvas mechanics
- `fade-content.js` — React Bits FadeContent port (word-level mist reveal)
- `frames/book-page/` — 306 WebP frames + `manifest.json`

**Mental model (don't break it)**
- The pin scroll range is built from a **step map** (`book-scroll.js` → `buildUniverse()`).
  Steps → frames → phases (film → white hold → next film).
- **Phases** (`PHASES`) define which segment plays and whether a white paper phase follows.
- Text is **word-split** by `mistWords()` and revealed via `FadeContent` (mist + opacity ramp).
- The **white pages** are the paper moments: centered headline + one-liner with brand-green lead.
- `on-white` class toggles film/paper text appearance; paper texture lives on `#book-page-whiteout`.

**Tuning knobs (one place)**
- `holdSteps` — how long the white page holds (desktop/mobile)
- `HEAD_HOLD` — hard scroll-stop over a film headline
- `FILM_SEGMENTS` — which frame ranges play, in what order
- `PHASES` — per-scroll phase mapping (currently 3 scrolls)
- `WINDOWS`-equivalent para timing — inside `buildUniverse()` `paras` array

**Adding a new scroll/phase**
1. Add/edit a segment in `FILM_SEGMENTS` (start/end frames).
2. Add an entry in `PHASES` (films + hold + paras count).
3. Add matching `<article data-chapter="…">` in `index.html`.

---

## 3. Protein page

- `protein-powder.html` + `protein-scroll.js` + `protein-scroll.css`
- Uses the same Lenis + GSAP engine concept but is **self-contained** (its own controller).
- Frames: `frames/protein/` (mobile 9:16) and `frames/protein_16x9/` (desktop 16:9).
  **Keep both folders on deploy** — the desktop reel is required.

---

## 4. Netlify

- `netlify.toml` — publish root, redirects, cache + security headers.
- `_redirects` — legacy mirror of the protein/typo redirects.
- **Forms:** `contact.html` uses Netlify Forms (`data-netlify`, honeypot `bot-field`).
- `robots.txt`, `sitemap.xml` — canonical domain is `https://thenewme.com`.

---

## 5. Maintenance rules

- **Never delete `frames/protein_16x9/`** (desktop reel).
- If you regenerate frames, keep names `frame_XXX.webp` zero-padded and update `manifest.json`.
- Version tags (`?v=`) on CSS/JS links: bump when files change to defeat caching.
- Keep author copy **em-dash free** (project rule) and one-liner page copy short.
- Reduced-motion is respected (`prefers-reduced-motion`) — preserve the static fallbacks.

---

## 6. Local dev

```bash
npm start            # python3 -m http.server 8000 (repo root)
npm run clean        # purge macOS ._* AppleDouble junk
```

No build step needed. Open `http://localhost:8000/`.

---

## 7. Deploy

1. Push this folder to GitHub (`gh auth login` → create repo).
2. Netlify → Import from Git → build command `npm run build` (no-op), publish dir `.`.
3. Verify: film scrolls, contact form lands in Forms, `curl -I` shows HSTS.

---

## 8. Known open items (tracked in `ERRORS-UNRESOLVED.md`)
- Confirm production domain vs `thenewme.com` canonicals.
- Edge hardware acceleration must be ON for smoothest scroll on the client's machine.
