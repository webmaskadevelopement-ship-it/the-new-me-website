# Animation System — The New Me (Home)

Where the react-bits components you provided are used, and how they were ported to this static (vanilla JS + GSAP) site.

> The site is not a React app — it is static HTML/CSS/JS deployed to Netlify. The three components (`AnimatedContent`, `ScrollExpand`, `FadeContent`) are React components; I implemented **their exact motion** natively on the existing GSAP engine so the same feel ships without pulling React into the stack.

## Usage map

| Your component | Motion it provides | Ported implementation (file) | Where it runs |
|---|---|---|---|
| `<ScrollExpand src=… useWindowScroll>` | Frame opens up as you scroll (zoom 1.30→1, scrim fades, hands stage to media) | `scroll-video.js` → `expandPx` / `expandZoom` render phase; `book-film.js` (config) + `book-film.css` (`.book-film-scrim`) | **Book film IN** — first 520px of the pin |
| `<FadeContent effect="mist" duration={1.8} stagger={0.1}>` | Slow light fade + rise, staggered children | `book-film.css` → `.fx-mist` keyframes + `.fx-mist-d1..d4`; tiny bootstrap script at the end of `index.html` | **Home hero** (headline, subheading, actions) |
| `<AnimatedContent distance={100} direction="vertical" stagger={0.08}>` | Children animate in turn, vertical rise | `book-film.css` → `.book-chapter-eyebrow/.title/.copy/.cta` transitions with `transition-delay` 0.06/0.16/0.26/0.36s | **Book film text** — every chapter's type |
| `blur={0}` + white bloom (protein reference) | No blur (compositing-heavy → flicker); white light joins | `book-film.css` → `.book-film-bloom` (`mix-blend-mode: screen`); `book-film.js` → onFrame bloom windows | **Book film** — every shot join + entry |

## THE BOOK page — `book.html` (2026-11-18)

A second film on the dedicated The Book page, cut entirely from the seedance
reel (`scripts/export_book_page_reel.py` → `frames/book-page/`, 331 frames,
15.2 MB q80). The source's t=0.000 duplicated flash frame (a fully formed
floating heart — a seedance first-frame artifact) is cut so the film opens
smooth; the reel starts at source frame 3 (0.125 s).

| Your component | Motion it provides | Ported implementation (file) | Where it runs |
|---|---|---|---|
| `<FadeContent effect="mist" duration={1.8} ease="power2.out" stagger={0.1} threshold={0.1}>` | The real react-bits mist: SVG `feTurbulence` fractal-noise alpha mask (33-level sigmoid table, smoothstep reveal window, 10 px blur that decays with progress), staggered across children, ScrollTrigger threshold start | **`fade-content.js`** — full vanilla port of the React component. Declarative: `data-fade="mist" data-fade-duration="1.8" data-fade-ease="power2.out" data-fade-stagger="0.1" data-fade-threshold="0.1"`. Imperative: `FadeContent(el, opts)` → `.play()/.clear()` | **Book page film chapters** (driven by frame windows in `book-page.js`), **reader heading**, **purchase block** |
| `<FadeContent trigger="mount">` + `.clear()` | Same mist, replayable: mist-in when a chapter's frame window enters, fast clean fade when it leaves, mask rewound so it can re-mist on the next pass | `book-page.js` → `setChapterActive()` calling `fx.play()/fx.clear()` | **All five film chapters** |
| Scroll-scrubbed film + hard blooms | Same engine as home: pin 520 px expand (zoom 1.30→1) → 331-frame scrub → white bloom at each of the 4 shot joins | `scroll-video.js` + `book-page.js` (windows mirror `frames/book-page/manifest.json`) | **`#book-page-film`** |
| Closing white bloom | Scroll-driven whiteout (smoothstep over the last ~7% of pin travel) dissolves the film into the white reader stage; fully reversible on scrub-back | `book-page.js` → `WHITEOUT` + `.book-page-whiteout` (CSS) | **Film OUT → `#book-readers`** |
| Infinite testimonial marquee | Same react-bits marquee pattern as the protein page; margin-based (not gap) so the JS-duplicated set makes the −50 % loop land pixel-perfect; hover pause; reduced-motion → snap scroller | `book-page.css` → `.reviews-marquee-*`, `book-page.js` → `duplicateMarquee()` | **`#book-readers`** |

Typography for the film's textbook chapters: Playfair Display (titles, drop
caps, principle numerals) + Newsreader (reading serif) + Inter (running
heads, eyebrows) — all Google Fonts, loaded on `book.html` only.

## Performance notes (chop fixing)
- Canvas backing resolution capped at **1.5× DPR** (`scroll-video.js` `resizeCanvas`) — source is 1920px; 2–3× fills only added GPU cost.
- Drawing is **rAF-coalesced** and skips identical frames (`lastDrawnFrame`), and the frame index is committed **only when the paint really happened** — a rate-limited skip schedules one trailing repaint so the film always settles on the frame the scroll says (v13; fixes freeze-a-few-frames-behind after a fast flick).
- `resizeCanvas` maps progress → frame through the **same expand-aware math as the scrub** (`frameForProgress`), and no-ops when neither backing size nor frame changed — the URL-bar resize storm on phones no longer desyncs or repaints the film (v13; fixes the film jumping ~45 frames ahead on every mobile URL-bar transition).
- Pin uses **transform** (no `position: fixed` toggle) → seamless in/out.
- `scroll-behavior: auto`, `overscroll-behavior-y: none`, eager 359-frame preload.
- Reload position: the page resets to top **only** when the restored scroll position would land inside the film's pin span; everywhere else the browser's native restore (refresh/back) is kept (v13; fixes every-refresh-jumps-to-top).
- The mobile story strip (`.story-slider-mobile`) is a **clip window + JS-dragged track**, not a native `overflow-x` scroller — native horizontal scrollers axis-lock fast vertical flicks that start on them, which read as "the page stopped scrolling" on phones (`script.js` `initStorySliderDrag`, v13).

## To re-tune
- Expand zoom: `expandZoom` in `book-film.js` (currently 1.30).
- Expand length: `EXPAND_PX` (currently 520).
- Text stagger: delays in `book-film.css` under `.book-chapter.is-active …`.
- Mist timing: `fx-mist-in` keyframes + `.fx-mist-d*` delays.
