# The New Me — Website (Ship-Ready Codebase)

Static marketing site for **The New Me** — plant-based protein + the *Reverse Aging* book.

This folder (`the_new_me_website`) is the clean, production-ready evolution of the legacy `tnm-deploy` folder. The legacy folder was left untouched as a backup; everything below was rebuilt from it with the following improvements:

## What changed vs. the legacy codebase

| Area | Before | After |
|---|---|---|
| Tailwind | Play CDN (runtime compiler, 18 pages) | Static compiled CSS (`vendor/tailwind.prod.css`, Tailwind 3.4.17, same config/classes → same visuals) |
| Product page twin | `protein.html` + `protein-powder.html` byte-identical | Single canonical `protein-powder.html`; `/protein` etc. rewrite via `_redirects`/`netlify.toml` |
| Contact form | Showed success but **never sent data** | Wired to Netlify Forms (AJAX POST) with honeypot; same UI |
| Git credentials | **GitHub PAT embedded in remote URL** | Remote removed. Use `gh auth` or an env-injected credential (rotate the old token!) |
| Images | 1 JPG (hero packshot, 548 KB) + heavy WebP/1 | All WebP; hero converted (214 KB); frames + DATA recompressed @q85/method6 (~30–40 MB saved) with identical dimensions |
| SEO | No canonicals, no OG, no structured data | Canonical + Open Graph on all 22 pages; JSON-LD (Organization/Product/Blog) on core pages; fresh sitemap |
| Missing metadata | `workout-tight-schedule.html` had no `<title>`/description | Added |
| Security headers | `X-Frame-Options`, `nosniff`, `Referrer-Policy` | + `Permissions-Policy`, `Strict-Transport-Security` (Netlify & Vercel configs) |
| Dev server | `server.mjs` at repo root | Moved to `scripts/dev-server.mjs` (never published/executed by platform builds) |
| Layout shift (CLS) | Most `<img>` lacked dimensions/lazy-loading | `width`/`height` + `loading="lazy"` added on core pages |

## Stack

- Plain HTML/CSS/JS (no framework), GSAP 3.12.5 (vendored `vendor/gsap/` + CDN fallback)
- Netlify (primary: `netlify.toml`, `_redirects`) · Vercel (`vercel.json`) ready
- Google Fonts, local `@font-face` (BBH Hegarty/Bogle)

## Commands

```bash
npm start          # local static dev server → http://localhost:8000
npm run build:css  # regenerate vendor/tailwind.prod.css from scripts/tailwind.config.js (Tailwind 3.4.17)
npm run build       # static production: no build step required
```

To regenerate Tailwind locally you need `tailwindcss@3.4.17` available:

```bash
npx tailwindcss@3.4.17 -c scripts/tailwind.config.js -i scripts/tailwind.input.css -o vendor/tailwind.prod.css --minify
```

## Deploy

Static site — publish the repo root. Netlify (or Vercel) builds from the repo.

```bash
# 1. (once) auth + set remote — never embed a token in the URL
gh auth login
git remote add origin git@github.com:<you>/<repo>.git   # or gh repo create

# 2. deploy
./deploy.sh   # commits changes (if any) and pushes → platform auto-deploys
```

> ⚠️ Security: the old repo's remote contained a live GitHub PAT. **Revoke/rotate it** in GitHub settings → Developer settings → Tokens. The new repo has no token anywhere.

## Image pipeline

`scripts/optimize-images.py` recompresses every WebP @ quality 85 / method 6 (identical dimensions, atomic writes). Run from the repo root:

```bash
python3 scripts/optimize-images.py .
```

## Structure

```
index.html, about.html, blog.html, contact.html, protein-powder.html   core pages
<guid>-guide.html  (16)                                             article pages
style.css / script.js / site-loader.js                                shared styles & behavior
protein-scroll.css / protein-scroll.js                                GSAP frame-scrub animation (protein page)
vendor/tailwind.prod.css                                              compiled Tailwind utilities
vendor/gsap/                                                          vendored GSAP
frames/  DATA/  images/  fonts/                                       media (all WebP except favicon/svg)
scripts/dev-server.mjs, optimize-images.py, tailwind.*               tooling
netlify.toml, vercel.json, _redirects, robots.txt, sitemap.xml       platform config
```

## Notes

- Domain in `sitemap.xml`/canonicals: `https://thenewme.com` (matches legacy sitemap). Search forms link to `https://ilovenewme.com/` — confirm the live domain and align both if needed.
- YouTube thumbnails on the home page use `img.youtube.com` (`hqdefault.jpg`) — remote, intentionally not self-hosted.
- AppleDouble `._*` metadata files may reappear on this external volume during local writes; they are gitignored (`.gitignore`).
