# Netlify Deploy Checklist — The New Me (verified 2026-11-19)

All items verified against the deploy folder content. Status: **READY**.

## Build config
- [x] `netlify.toml` — `publish = "."` (repo root)
- [x] Redirects: `/protein*`, `/protien*` → `protein-powder.html`; `/about`, `/blog`, `/contact` → pages
- [x] Cache headers: `/frames/*`, `/images/*`, `/fonts/*` → immutable 1y; `/` global security headers
- [x] Security headers on all responses: X-Frame-Options, nosniff, Permissions-Policy, HSTS, Referrer-Policy
- [x] `_redirects` mirrors the rewrites (legacy support)
- [x] `package.json` — `dev/start/serve` = `python3 -m http.server 8000`; `build` = no-op (static); `clean` = ghost purger

## Forms (working backend on Netlify)
- [x] `contact.html`: `#contactForm` → `name="contact"`, `method="POST"`, `data-netlify="true"`, honeypot `bot-field`, hidden `form-name`
- [x] Handler = AJAX POST to `/` (`Accept: application/json`); success panel only after Netlify accepts; honeypot submissions silently ignored

## Content & SEO
- [x] 24 pages (25 – demo removed), all crawl-tested locally: 0 fetch errors, 0 missing local assets
- [x] `sitemap.xml` — 21 URLs, all exist on disk (homepage = domain root), `book.html` removed
- [x] `robots.txt` — allow all + sitemap ref
- [x] Canonicals + OG + JSON-LD present on core pages
- [x] Favicon set (`favicon.ico`, `favicon.png`)

## Media
- [x] Book film = 306 frames + poster (frames 77–101 removed), manifest totalFrames 306
- [x] All referenced frames exist; no AppleDouble junk (`._*` purged, 0 remaining)
- [x] Protein frames (mobile/desktop) present

## Code health
- [x] `node --check` passes on all site JS
- [x] No secrets: grep over all sources for PAT/API-key/private-key patterns → 0 hits
- [x] No `book.html` references anywhere; no dead demo page; dead `book-film.js` removed
- [x] No `localhost` usage in code (only in a dev comment)

## Deploy steps
1. Push this folder to your GitHub repo (`gh auth login` first; never embed a token).
2. Netlify: **Add new site → Import from Git** → pick repo → build command `npm run build` (no-op), publish directory `.`.
3. Netlify will auto-detect forms on `contact.html` (check Site → Forms after deploy).
4. Verify: homepage film scrolls, contact form submits to Netlify, `/protein-powder.html` resolves, security headers present (`curl -I`).

## Notes
- Domain: canonicals/sitemap use `https://thenewme.com` — if the live domain differs, update sitemap + canonicals before pushing.
- Search drawer forms GET to `https://ilovenewme.com/` (existing third-party behavior; not a Netlify form).
- If deploying via Git, keep the repo ≤ ~250MB (frames dominate); Netlify free tier handles this.
