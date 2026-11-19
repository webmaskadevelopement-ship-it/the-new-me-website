# THE NEW ME (TNM) — MASTER PROJECT HANDOVER & TECHNICAL SPECIFICATION

> **Document Classification:** Production Master Handover & Engineering Context  
> **Project:** "The New Me" (TNM) — Bio-Pure Cellular Botanical Protein Experience  
> **Repository:** `/Volumes/DISK 1/web dev/TNM`  
> **Primary Surfaces:** [`TNM WEBSITE/protein-powder.html`](file:///Volumes/DISK%201/web%20dev/TNM/TNM%20WEBSITE/protein-powder.html), [`TNM WEBSITE/protein.html`](file:///Volumes/DISK%201/web%20dev/TNM/TNM%20WEBSITE/protein.html), [`TNM WEBSITE/protein-scroll.js`](file:///Volumes/DISK%201/web%20dev/TNM/TNM%20WEBSITE/protein-scroll.js), [`TNM WEBSITE/protein-scroll.css`](file:///Volumes/DISK%201/web%20dev/TNM/TNM%20WEBSITE/protein-scroll.css)  
> **Deployment Target:** Netlify & Vercel (Edge-hosted static with WebP frame pipeline)

---

## TABLE OF CONTENTS
1. [Executive Summary & Brand Philosophy](#1-executive-summary--brand-philosophy)
2. [Complete Chronological Engineering Timeline & Evolution](#2-complete-chronological-engineering-timeline--evolution)
3. [Exhaustive Breakdown: What We Tried vs. Final Solutions](#3-exhaustive-breakdown-what-we-tried-vs-final-solutions)
4. [Mobile Hard-Scroll & Apple-Style Resistance (Gemini Argon Specification)](#4-mobile-hard-scroll--apple-style-resistance-gemini-argon-specification)
5. [The React Bits Fluid Glass Fill Loader](#5-the-react-bits-fluid-glass-fill-loader)
6. [Frame Animation Pipeline & Canvas Architecture](#6-frame-animation-pipeline--canvas-architecture)
7. [The Pinned Editorial Specimen Dock & Watermark Occlusion Architecture](#7-the-pinned-editorial-specimen-dock--watermark-occlusion-architecture)
8. [Design System, Typography & Color Tokens](#8-design-system-typography--color-tokens)
9. [Deployment, Routing & Ghost File Sanitation](#9-deployment-routing--ghost-file-sanitation)
10. [Skills & Installed Component Catalog](#10-skills--installed-component-catalog)
11. [Runbook, Local Development & Future Roadmap](#11-runbook-local-development--future-roadmap)

---

## 1. EXECUTIVE SUMMARY & BRAND PHILOSOPHY

### 1.1 Brand Positioning
**"The New Me" (TNM)** is an ultra-premium, cellular botany wellness brand engineered around a flagship plant-based protein powder formulation. Unlike generic mass-market sports supplements packaged in aggressive neon tubs with artificial fillers, TNM is positioned in the luxury wellness tier alongside brands like Aesop, Apple, and Erewhon.

The product narrative centers on **cellular harmony, native bioavailability, and zero digestive bloat**.

### 1.2 Clinical Ingredient Matrix & Story Progression
The entire site is structured as a scroll-driven cinematic journey through 6 core chapters, each mapping to a distinct botanical active:

| Chapter | Ingredient / Theme | Clinical & Narrative Value Proposition |
| :--- | :--- | :--- |
| **01 (0%)** | `THE NEW ME EXPERIENCE` | Pure botanical cellular harmony; the introduction to bio-pure nutrition. |
| **02 (~20%)** | `GOLDEN PEA` | Canadian yellow pea isolate; naturally fermented for zero digestive bloat and high bio-absorption. |
| **03 (~35%)** | `BROWN RICE` | Whole sprouted brown rice peptide concentrate; delivers a complete essential amino acid (EAA) matrix. |
| **04 (~54%)** | `PUMPKIN SEEDS` | Cold-pressed raw pumpkin seed matrix; rich in native zinc, metabolic magnesium, and cellular antioxidants. |
| **05 (~73%)** | `ORCHID BENEFITS` | Pure cured Madagascar *Vanilla Planifolia* orchid aromatics; naturally comforting, free of artificial vanillin. |
| **06 (100%)** | `THE NEW ME PROTEIN` | Final formulated matrix; 24g pure bioactive protein, smooth solubility, and total digestive ease. |

---

## 2. COMPLETE CHRONOLOGICAL ENGINEERING TIMELINE & EVOLUTION

This section details every single milestone, problem encountered, user request, and code iteration throughout the project's development history.

```
+----------------------------------------------------------------------------------------------------+
|                                    PROJECT EVOLUTION LIFECYCLE                                     |
+----------------------------------------------------------------------------------------------------+
| Phase 1: Frame Sequence Surgery & Timeline Continuity (Frames 82-506)                              |
|   - Restored excised frame chunks (82-126, 308-346, 456-506)                                      |
|   - Ported redundant or jarring motion segments to temporary storage (246-278, 182-282)             |
|   - Inserted 12 interpolated transition frames after frame 180 to prevent abrupt cuts              |
+----------------------------------------------------------------------------------------------------+
                                                  |
                                                  v
+----------------------------------------------------------------------------------------------------+
| Phase 2: Typographic Synchrony & Spacing Hygiene                                                   |
|   - Advanced Sprouted Brown Rice text chapter forward to synchronize with grain emergence          |
|   - Collapsed disproportionate vertical gaps between bold display titles and descriptive copy      |
+----------------------------------------------------------------------------------------------------+
                                                  |
                                                  v
+----------------------------------------------------------------------------------------------------+
| Phase 3: Watermark Masking & Minimal Telemetry Card                                                |
|   - Identified residual AI/Runway watermark coordinates in the lower-right quadrant               |
|   - Iteration 1: Thin sticking bar (Rejected: "Very thin and bad looking")                         |
|   - Iteration 2: Oversized dark frosted card (Rejected: "Are you mad? this is so big")             |
|   - Iteration 3: 115px x 161px floating glassmorphic card (Rejected: subheadlines cluttered hero) |
+----------------------------------------------------------------------------------------------------+
                                                  |
                                                  v
+----------------------------------------------------------------------------------------------------+
| Phase 4: Deployment & File System Sanitation                                                       |
|   - Automated purge of macOS AppleDouble ghost files (._* and .DS_Store) via clean-ghosts.py       |
|   - Configured netlify.toml & vercel.json redirects resolving 404s on /protein and /protein-powder  |
+----------------------------------------------------------------------------------------------------+
                                                  |
                                                  v
+----------------------------------------------------------------------------------------------------+
| Phase 5: Mobile Hard-Scroll Resistance & Dead-Zone Glide (Gemini Argon Specification)               |
|   - Eliminated jittery CSS/GSAP mandatory snap                                                     |
|   - Expanded mobile pin travel to 7500px+ (~1150vh) with Lenis touchMultiplier: 0.55               |
|   - Implemented inertia dead-zone settle (400ms idle timer) gliding out of blurry transitions      |
|   - Time-dilated frame progress curve lingering on text plateaus                                   |
|   - Fixed iPhone Safari dynamic bottom address bar occlusion via env(safe-area-inset-bottom)       |
+----------------------------------------------------------------------------------------------------+
                                                  |
                                                  v
+----------------------------------------------------------------------------------------------------+
| Phase 6: Loading Screen Architecture (Anti-Slop Evolution)                                         |
|   - Iteration 1: SVG wave drift + sci-fi HUD telemetry (Rejected: "This was still slop")           |
|   - Built ReactBitsFluidLoader: Multi-harmonic Canvas fluid wave fill simulating a filling glass   |
|   - Unified 1:1 parity between Home (`index.html`) and Protein (`protein-powder.html`)             |
|   - Minimal brand green Heart emblem (`DATA/The New Me Heart Logo.webp`), zero AI slop text        |
+----------------------------------------------------------------------------------------------------+
                                                  |
                                                  v
+----------------------------------------------------------------------------------------------------+
| Phase 7: Pinned Editorial Specimen Dock (Complete Watermark Occlusion & Kinetic BlurText)          |
|   - Occluded Runway/Gemini watermark at coordinates bottom: 33px, right: 30px with 100% opaque plinth|
|   - Full-width architectural section spanning bottom: 0, height: clamp(170px, 23vh, 220px)         |
|   - Top video viewport stripped to bold uppercase display titles ONLY (.direct-hero-title)         |
|   - Lower dock houses Swiss 3-column grid: Specimen Identity, Creative Benefit Copy, Telemetry     |
|   - Synchronized GSAP scrub timeline: BlurText kinetic reveals (blur(8px) -> blur(0px), y: 16 -> 0)|
|   - Strict anti-slop copy: Real botanical facts, zero em dashes, zero generic buzzwords             |
+----------------------------------------------------------------------------------------------------+
                                                  |
                                                  v
+----------------------------------------------------------------------------------------------------+
| Phase 8: Typography Modernization & Serif Removal (Blog & Contact Pages)                           |
|   - Eliminated Playfair Display serif font from blog.html and contact.html                          |
|   - Migrated to Plus Jakarta Sans geometric sans-serif for modern luxury look                      |
|   - Calibrated tight display tracking (-0.035em) and responsive type clamps                         |
+----------------------------------------------------------------------------------------------------+
                                                  |
                                                  v
+----------------------------------------------------------------------------------------------------+
| Phase 9: Contact Us Clean White Architectural Background                                           |
|   - Replaced full-page contact_bg.webp and glassmorphism tint with clean white system              |
|   - Hero & Headquarters sections: var(--bg-off-white, #f8f7f2)                                     |
|   - Channels & Form section: var(--bg-white, #ffffff) with crisp 1px card borders                  |
|   - FAQ Accordion section: var(--bg-white, #ffffff) matching site-wide rhythm                      |
+----------------------------------------------------------------------------------------------------+
```

---

## 3. EXHAUSTIVE BREAKDOWN: WHAT WE TRIED VS. FINAL SOLUTIONS

A candid record of what failed, why it failed, user critique, and how it was ultimately perfected:

| Component / Task | Attempt 1 (Failed / Rejected) | Attempt 2 (Failed / Rejected) | Final Approved Production Solution |
| :--- | :--- | :--- | :--- |
| **Watermark Occlusion & Layout Hierarchy** | Minimalistic horizontal bar. User feedback: *"Very thin and bad looking, main purpose is to cover watermarks, which it is not doing."* | Large dark floating card covering ~30% of screen. User feedback: *"Are you mad? this is so big and covering the content."* Next tried floating 115x161 card, but user demanded: *"I NEED A NEW SECTION STARTING FROM THAT PLACE TILL THE BOTTOM... SEPERATE MINOR SECTION... BEHIND OF VIDEO MUST NOT BE VISIBLE... SUB HEADLINE TEXT WILL ALSO GO TO NEW SECTION, ONLY BOLD DISPLAY TEXT UP THERE."* | **Pinned Editorial Specimen Dock:** 100% opaque `#FFFFFF` architectural plinth (`height: clamp(170px, 23vh, 220px); bottom: 0; left: 0; right: 0; z-index: 35;`) physically eliminating video visibility over watermark coordinates (`bottom: 33px`, `right: 30px`). Transferred subheadlines & benefit lines into Swiss 3-column dock, leaving upper video stage reserved **exclusively for bold display typography** with GSAP `BlurText` motion engineering. |
| **Mobile Scroll Physics** | Standard Lenis smooth scroll (`touchMultiplier: 1.0`). Users flicked past entire chapters in one motion, skipping Golden Pea and Rice. | CSS `scroll-snap-type: y mandatory` and GSAP `snap: 1/5`. Caused violent finger fighting, stuttering, and backward frame jumps. | **Apple-Grade Resistance + Inertia Settle:** `7500px+` pin distance, `touchMultiplier: 0.55`, `wheelMultiplier: 0.45`, `scrub: 0.35`. Non-fighting dead-zone settle glides *only* after scroll is completely still for 400ms. |
| **Blurry Frame Transitions** | Linear mapping `frameIndex = Math.floor(progress * totalFrames)`. Result: Mobile scrolls regularly stalled in blurry motion-interpolation frames (44%, 91%). | Hard snapping frames to fixed indices. Created visible video stuttering and broke fluidity. | **Non-Linear Frame Remapping:** `getRemappedFrameProgress()` applies a cubic ease to each scene window. Scrubbing moves slowly through sharp ingredient scenes and rushes through blurry interstitial gaps. |
| **Typography Windowing** | Narrow triangle fade-in / fade-out (`opacity: 1` only at exact point, e.g. 54%). Result: Text vanished while the orchid flower or rice was still centered on screen. | Keeping text persistent across entire sections. Result: Overlapping typography collisions. | **Trapezoidal Window Plateaus:** Wide active zones (e.g. 100% opacity maintained from `15%–27%` for Golden Pea, `30%–45%` for Brown Rice, `66%–78%` for Orchid) matching exact physical object visibility. |
| **Initial Visit Loader** | Static SVG waves with CSS horizontal keyframe translation and sci-fi HUD text (*"Dispensing Bio-Matrix", "Submerging Sequence"*). User feedback: *"The load state looks Trash, fix it /antislop. This was still slop."* | Synthetic AI ingredients image & typography clutter. User feedback: *"remove this shitty generated ingredient image and use New Me Logo... remove all the fuckin text, only Heart should be there... make the heart logo a bit small, and same load screen on the Home page too... load screen on home and protien powder are different, make sure the HOME PAGE load screen is the exact same for protien powder too"*. | **Unified React Bits Fluid Glass Fill Engine:** Absolute white canvas (`#FFFFFF`). Pure minimal architecture with **only** the official The New Me 2.0 Brand Heart Emblem (`DATA/The New Me Heart Logo.webp`) in authentic brand green (`#2B4D1F`) centered in the viewport at refined scale (`clamp(90px, 11vw, 140px)`) with zero surrounding text or typography. 3-tier sinusoidal wave canvas filling like a water glass over 3.2s with rising micro-bubbles, maintaining the brand green Heart identity throughout, finishing with a smooth optical bloom dissolve. Deployed site-wide across both the Home Page (`index.html`) and the Protein Experience (`protein-powder.html`, `protein.html`) through the single source-of-truth engine `site-loader.js` and identical CSS rules in `style.css` and `protein-scroll.css`. |
| **Netlify Deployment** | Direct root hosting. Accessing `/protein` or `/protein-powder` resulted in Netlify 404 errors due to missing file extensions. | Manual HTML duplicate renaming without rewrite rules. | **Clean Architecture & Rewrites:** Unified `netlify.toml` and `vercel.json` rewrite maps redirecting `/protein` and `/protein-powder` to `protein-powder.html` with explicit 200 headers and aggressive WebP cache headers (`max-age=31536000, immutable`). |
| **Contact Us Background Architecture** | Full-page textured background image (`DATA/contact_bg.webp`) with translucent glassmorphic overlay (`body::before`). Result: Contact page looked grey/dark and disconnected from the rest of the site. | Simple white body override without card restyling, leaving translucent cards washed out. | **Clean White Architectural Surface:** Applied `--bg-white: #ffffff` and `--bg-off-white: #f8f7f2` matching site-wide rhythm (`index.html`, `blog.html`). Solid white cards (`#ffffff`) with subtle 1px border (`rgba(0,0,0,0.08)`) and soft shadow (`0 4px 20px rgba(0,0,0,0.04)`), crisp off-white Hero & Headquarters sections, and full mobile optimization. |
| **Contact Card Content & Nomenclature Audit** | FAQ 1 referenced incorrect product name "Neumi" ("How can I order the Neumi product?"). FAQ 4 referred to founder as "Gagan Dhawan Sir". Contact cards had mismatched email domains. | Minor text find-and-replace without checking topic chips or cards. | **Full Nomenclature & Card Content Refinement:** Replaced "Neumi" with "The New Me Protein Powder", removed "Sir" from all mentions of founder Gagan Dhawan, polished all 4 channel cards with unified `@thenewme.com` domains and professional descriptions, added "Protein Powder" directly to the message topic selector chips, and verified all FAQ answers for factual accuracy. |

---

## 4. MOBILE HARD-SCROLL & APPLE-STYLE RESISTANCE (GEMINI ARGON SPECIFICATION)

The mobile scroll implementation adheres strictly to the **GEMINI ARGON specification** for scroll-controlled video frames.

### 4.1 The Five Mechanical Pillars

#### 1. Heavy Resistance (Apple Website Touch Physics)
On standard mobile setups, a vigorous flick can generate 3000px–5000px of scroll delta, shooting the user from 0% to 100% in under a second. To counter this:
- **Extended Pin Travel:** Instead of standard viewport height, the mobile pin distance is dynamically computed:
  ```javascript
  getPinDistance() {
    const isMobile = window.innerWidth <= 768;
    return isMobile ? Math.max(window.innerHeight * 11.5, 7500) : window.innerHeight * 5.5;
  }
  ```
- **Damped Lenis Multipliers:**
  ```javascript
  touchMultiplier: 0.55,  // Heavy drag on iOS / Android touch
  wheelMultiplier: 0.45,  // Heavy drag on desktop trackpads / mice
  duration: 1.35,         // Eased inertia curve
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
  ```
- **Tightened GSAP Scrub:** `scrub: 0.35` ensures video frames stay tightly anchored to the finger without elastic lag or detachment.

#### 2. Non-Fighting Dead-Zone Settle (Argon Step 5)
Standard scroll-snapping fails because it pulls against the user's thumb while dragging. The Dead-Zone Settle algorithm operates strictly on **scroll completion**:
1. While scrolling, `isSettling` is `false`, and zero snap forces are exerted.
2. Every scroll event resets a 400ms debounce timer (`deadZoneTimer`).
3. When the user lifts their finger and momentum drops to zero, the timer fires.
4. If current progress has landed inside a known blurry transition dead-zone (e.g. `40%–48%` or `86%–95%`), it smoothly tweens to the nearest scene center over 0.85s using `power2.out`:
   ```javascript
   const SCENE_CENTERS = [0.0, 0.20, 0.35, 0.54, 0.73, 1.0];
   const DEAD_ZONES = [
     { start: 0.08, end: 0.14 },
     { start: 0.26, end: 0.30 },
     { start: 0.41, end: 0.48 },
     { start: 0.60, end: 0.67 },
     { start: 0.83, end: 0.94 }
   ];
   ```

#### 3. Cubic Time-Dilation Remapping (Argon Step 4)
Rather than advancing frames linearly with scroll distance, the `getRemappedFrameProgress(rawProgress)` function warps time between scene centers:
```javascript
function getRemappedFrameProgress(rawProgress) {
  for (let i = 0; i < SCENE_CENTERS.length - 1; i++) {
    const start = SCENE_CENTERS[i];
    const end = SCENE_CENTERS[i + 1];

    if (rawProgress >= start && rawProgress <= end) {
      const localProgress = (rawProgress - start) / (end - start);
      // Stays steady near centers (0 and 1), moves rapidly through blurry middle (0.5)
      const curvedProgress =
        localProgress < 0.5
          ? 0.5 * Math.pow(2 * localProgress, 2.2)
          : 1 - 0.5 * Math.pow(2 * (1 - localProgress), 2.2);

      return start + curvedProgress * (end - start);
    }
  }
  return rawProgress;
}
```

#### 4. Wide Active Text Plateaus (Argon Step 3)
Text scenes are mapped with broad trapezoidal opacity windows. For example, Sprouted Brown Rice (Scene 3) remains at **100% opacity from 30% to 45%**, and Madagascar Vanilla Orchid (Scene 5) remains at **100% opacity from 66% to 78%**, preventing premature fade-outs while ingredients are still prominently framed.

#### 5. Safari Dynamic Viewport Safe-Area Adaptation (Argon Step 6)
On iOS Safari, scrolling causes the bottom navigation address bar to expand and collapse dynamically. The watermark occlusion card is anchored using dynamic environment variables:
```css
@media (max-width: 768px) {
  .protein-vertical-card {
    position: fixed !important;
    right: calc(14px + env(safe-area-inset-right, 0px)) !important;
    bottom: calc(20px + env(safe-area-inset-bottom, 0px)) !important;
  }
}
```

---

## 5. THE REACT BITS FLUID GLASS FILL LOADER

The loading screen was re-architected from scratch to embody the user's specific creative concept, discarding all synthetic UI cliches in favor of pure organic physics.

```
+----------------------------------------------------------------------------------------------------+
|                                REACT BITS FLUID GLASS FILL ENGINE                                  |
+----------------------------------------------------------------------------------------------------+
|                                                                                                    |
|    Stage 1: Absolute White Frame (#FFFFFF)                                                         |
|             Official The New Me Brand Logo ([The New Me Logo.webp] in brand chlorophyll green)     |
|             Refined subline ("24g Bio-Pure Protein · Zero Digestive Bloat")                        |
|                                                                                                    |
|    Stage 2: Harmonic Multi-Layer Liquid Rising from Bottom                                          |
|             ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ < Specular Meniscus (2.4px glow) |
|             Wave 3: Forefront Primary Chlorophyll Body (#204a25)                                   |
|             Wave 2: Mid-Density Emerald Swell (rgba(36, 83, 41, 0.82))                             |
|             Wave 1: Ambient Translucent Undertow (rgba(26, 62, 31, 0.40))                          |
|             o  .  o   22 Effervescent Micro-Bubbles Rising Upward   .   o                          |
|                                                                                                    |
|    Stage 3: Submerged Brand Identity Contrast Reveal                                               |
|             Logo & text covered by liquid turn to Radiant Bone Ivory (#FAF8F5)                     |
|             Held for 3.2s minimum duration (Guaranteed video frame buffer)                         |
|                                                                                                    |
|    Stage 4: Optical Bloom Dissolve                                                                 |
|             brightness(1.22) blur(8px) -> scale(1.03) -> opacity: 0 -> Hands off to video canvas   |
+----------------------------------------------------------------------------------------------------+
```

### 5.1 Mathematical Wave Superposition
The engine (`ReactBitsFluidLoader` in [`protein-scroll.js`](file:///Volumes/DISK%201/web%20dev/TNM/TNM%20WEBSITE/protein-scroll.js)) evaluates three overlapping sinusoidal harmonics on every animation frame:
$$y(x) = y_{\text{base}} + A_1 \sin(f_1 x + \phi) + A_2 \cos(f_2 x + 0.8\phi) + A_3 \sin(f_3 x - 1.2\phi)$$

- **Wave 1 (Undertow):** Low frequency ($f = 0.006$), high amplitude ($1.25 \times A$), alpha $0.40$.
- **Wave 2 (Mid-body):** Medium frequency ($f = 0.011$), phase offset $1.4\text{ rad}$, alpha $0.82$.
- **Wave 3 (Foreground Crest):** High frequency ($f = 0.016$), phase offset $2.8\text{ rad}$, solid `#204a25`.
- **Specular Meniscus Line:** Along the top crest, a 2.4px stroked path with `rgba(255, 255, 255, 0.65)` and `rgba(167, 243, 208, 0.85)` shadow blur recreates the physical surface tension of water touching a glass vessel.
- **Hydrodynamic Effervescence:** 22 individual bubble objects with randomized horizontal wobble ($x + \sin(\omega t) \times A$), rising velocity, and auto-reset when reaching the liquid meniscus.
- **Amplitude Damping:** Wave agitation starts high ($A = 22\text{px}$) during pouring and settles gently ($A = 7.7\text{px}$) as the liquid reaches the rim.

### 5.2 Dynamic Text Reveal Mechanics
Rather than clunky opacity fades, the reveal uses dual geometric alignment:
- The base stage is `#FFFFFF` with typography styled in `#FFFFFF` (`opacity: 0` or tone-on-tone invisible).
- Directly overlaid is `.loader-revealed-layer` with `height: var(--fill-pct, 0%)` and `overflow: hidden`.
- Inside the revealed layer sits identical typography in **radiant bone ivory (`#FAF8F5`)** with deep text shadows.
- As the liquid line rises, the water physically submerges the text, unveiling the crisp typography through the rising chlorophyll liquid.

### 5.3 Optical Bloom Dissolve Hand-off
Once the fill reaches 100% (after the minimum 3.2-second gate and confirmation that Hero Frame 0 is rendered):
```javascript
gsap.to(this.loader, {
  opacity: 0,
  scale: 1.03,
  filter: 'brightness(1.22) blur(8px)',
  duration: 0.85,
  ease: 'power2.inOut',
  onComplete: () => {
    this.fluidLoader.destroy(); // Cancel RAF and free GPU memory
    this.loader.style.display = 'none';
  }
});
```

---

## 6. FRAME ANIMATION PIPELINE & CANVAS ARCHITECTURE

### 6.1 Sequential Frame Assets
- **Video Frames:** 432 active high-resolution frames located at [`TNM WEBSITE/frames/protein/frame_XXX.webp`](file:///Volumes/DISK%201/web%20dev/TNM/TNM%20WEBSITE/frames/protein/).
- **Format:** WebP format, 85% quality, resolution $1080 \times 1920$ (vertical 9:16 mobile-first master), downsampled cleanly for desktop viewport centering.
- **Luma Fade Transitions:** 24 grayscale matte frames at [`TNM WEBSITE/frames/protein/transitions/luma_XX.webp`](file:///Volumes/DISK%201/web%20dev/TNM/TNM%20WEBSITE/frames/protein/transitions/) enabling soft alpha dissolves between disparate takes.

### 6.2 High-Performance 2D Canvas Engine
- **Alpha Disabled:** `canvas.getContext('2d', { alpha: false })` eliminates compositing overhead between canvas and browser window.
- **DPI Clamping:** `dpr = Math.min(window.devicePixelRatio || 1, 2)` prevents 3x/4x mobile displays from crashing GPU texture limits.
- **Aspect-Ratio Fitting (`object-fit: cover` math):**
  ```javascript
  const hRatio = canvasWidth / img.naturalWidth;
  const vRatio = canvasHeight / img.naturalHeight;
  const ratio = Math.max(hRatio, vRatio);
  const centerShiftX = (canvasWidth - img.naturalWidth * ratio) / 2;
  const centerShiftY = (canvasHeight - img.naturalHeight * ratio) / 2;
  ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, centerShiftX, centerShiftY, img.naturalWidth * ratio, img.naturalHeight * ratio);
  ```

### 6.3 Frame Memory Management & Preloading Priority
1. **Tier 1 (Instant):** Hero Frame 0 is preloaded and painted immediately on DOMContentLoaded.
2. **Tier 2 (Parallel):** All 24 Luma transition frames are downloaded in parallel.
3. **Tier 3 (Chunked Worker Pipeline):** Video frames are fetched in sequential batches of 16 frames. If a user scrubs rapidly, the pipeline prioritizes the frame nearest to the current scrub head.

---

## 7. THE PINNED EDITORIAL SPECIMEN DOCK & WATERMARK OCCLUSION ARCHITECTURE

### 7.1 The Physical Watermark Challenge
In the original 720×1280 vertical video frame sequence, a residual Runway / Gemini watermark artifact was positioned in the lower-right quadrant:
- **Frame Space Coordinates:** `bottom: ~33px`, `right: ~30px`
- **Dynamic Viewport Behavior:** When rendered via `object-fit: cover` on wide desktop screens (16:9, 21:9), the video expands horizontally and crops vertically, shifting the watermark closer to the lower edge. On narrow mobile viewports (9:16, 9:19.5), the watermark floats near the bottom right thumb zone.

### 7.2 Architectural Evolution & Design Philosophy
1. **Initial Attempts & Failure Modes:**
   - *Attempt 1 (Thin floating bar):* Rejected by user as *"Very thin and bad looking, main purpose is to cover watermarks, which it is not doing."*
   - *Attempt 2 (Oversized dark card):* Rejected as *"Are you mad? this is so big and covering the content."*
   - *Attempt 3 (Floating 115px × 161px card):* While mathematically covering the corner, it left descriptive subheadlines crowding the upper video frame and felt disconnected from the layout.
2. **The Major Architectural Breakthrough:**
   The user mandated a fundamental re-architecture:
   > *"I NEED A NEW SECTION STARTING FROM THAT PLACE TILL THE BOTTOM, IT SHOULD BE A PROPER RECTANGULAR SECTION, SO IT SHOULD FEEL IT IS A SEPERATE MINOR SECTION OF SITE, BUT EXACTLY OVERLAY ON THE SCROLL. THE BEHIND OF VIDEO MUST NOT BE VISIBLE ON THAT REGION. IT WILL CONTAIN BEAUTIFUL AND MINIMAL TEXT BODIES, Ingredient name and benefits in creative lines, /antislop /gpt-taste /lenis /gsap /react-bits , Premium Text animations. so the right now sub headline text on scroll will also go to the new section, and ONLY BOLD DISPLAY TEXT WILL BE UP THERE."*

### 7.3 Decoupled Typographic Hierarchy
The interface was decoupled into two specialized spatial zones:
- **Zone 1: Upper Hero Video Stage (`.protein-editorial-overlay`):**
  - Positioned at `top: 36%` (mobile `top: 34%`).
  - Contains **exclusively** the bold display title (`.direct-hero-title`) in monumental uppercase editorial type (`clamp(2.4rem, 5.5vw, 4.8rem)`, `font-weight: 700`, text-shadow for crisp legibility over moving ingredients).
  - Subheadlines (`.direct-tagline`) and kickers (`.direct-kicker`) are completely removed from the upper video frame.
- **Zone 2: Pinned Editorial Specimen Dock (`.protein-specimen-dock`):**
  - A permanent, full-width rectangular plinth spanning `bottom: 0`, `left: 0`, `right: 0`, `width: 100%`.
  - **Calibrated Height to Natural Shaded Baseline:** `clamp(108px, 13vh, 126px)` on desktop and `clamp(120px, 16vh, 140px)` on mobile. Aligns right with the dark shaded shadow beneath the floating island roots.
  - **100% Opaque Solid `#FFFFFF` Base:** `background-color: #FFFFFF !important; border-top: 1px solid rgba(0, 0, 0, 0.07); box-shadow: 0 -8px 24px rgba(0, 0, 0, 0.03); z-index: 35;`.
  - **Strictly Symmetrical Margins:** Exactly equal `14px` top padding and `14px` bottom padding (`calc(14px + env(safe-area-inset-bottom, 0px))`).
  - **Zero Text Truncation:** Removed all `nowrap` and ellipsis cut-offs. Every benefit sentence flows across 2 complete, unabridged editorial lines.

### 7.4 Layout Matrix & Swiss Typography Grid
The dock is structured on an asymmetric Swiss grid (`max-width: 1360px`):
1. **Column 1: Specimen Identity (`.dock-identity-col`):**
   - Botanical kicker with green status dot: `font-size: 0.64rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: #2a4b2c;`.
   - Transferred editorial subheadline in Playfair Display serif (`clamp(1.1rem, 1.4vw, 1.35rem); color: #111b13; font-weight: 700; line-height: 1.18;`).
2. **Column 2: Creative Narrative & Botanical Spec Pills (`.dock-narrative-col`):**
   - Creative benefit narrative in Inter sans-serif (`clamp(0.76rem, 0.9vw, 0.84rem); color: #4a5e4d; line-height: 1.45; white-space: normal;`).
   - Pill badge matrix (`.dock-spec-pills`): Compact clinical certification pills (`#eef6f0` background, `#2a4b2c` text).
3. **Column 3: Integrated Swiss Telemetry Wing (`.dock-telemetry-wing`):**
   - Vertical divider border: `1px solid rgba(0, 0, 0, 0.07)`.
   - Live tabular percentage counter (`#telemetryVal`) in SF Mono monospace (`1.15rem`, `font-weight: 800`).
   - Minimal progress bar track (`.dock-progress-track`) with fill indicator (`#telemetryFill`).
   - 6 sequential chapter step chips (`01` through `06`), actively illuminating with dark green fill (`#2a4b2c`) as each chapter is reached.

### 7.5 Chapter Narrative Matrix (Anti-Slop Botanical Facts)
Strictly compliant with `/antislop` guidelines (no AI clichés, no em dashes, real botanical mechanisms, WCAG AA contrast):

| Chapter | Active Title (Upper Stage) | Provenance Kicker (Dock) | Subheadline (Dock) | Creative Benefit Narrative (Dock) | Spec Pills (Dock) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **01** | `THE NEW ME EXPERIENCE` | Phyto-Nutrition System | Pure botanical cellular harmony. | A complete tri-plant protein architecture engineered for cellular repair, smooth gastric transit, and continuous daily vitality. | `24g Bio-Protein`, `Complete Aminos`, `Zero Bloat` |
| **02** | `GOLDEN PEA` | Canadian Yellow Pea Isolate | Naturally fermented for zero digestive bloat. | Slow water-extracted to eliminate oligosaccharides and lectins. Delivers an 80% concentrated protein yield with zero gastrointestinal distress. | `Hypoallergenic`, `98% Digestibility`, `Alkaline Washed` |
| **03** | `BROWN RICE` | Enzymatically Sprouted Grain | Complete essential amino acid matrix. | Germinated prior to extraction to unlock native sulfur-rich amino acids, creating a complete biological protein score identical to whey. | `Bio-Sprouted`, `High Methionine`, `Silky Texture` |
| **04** | `PUMPKIN SEEDS` | Cold-Pressed Austrian Seeds | Native zinc & metabolic magnesium power. | Expeller-pressed without synthetic solvents. Delivers raw plant-derived minerals to support enzyme activation, hormonal balance, and tissue recovery. | `High Zinc & Magnesium`, `Cold-Expelled`, `Clean Lipid Matrix` |
| **05** | `ORCHID BENEFITS` | Madagascar Planifolia Orchid | Pure cured Madagascar Planifolia aromatics. | Harvested by hand and slowly cured under tropical sun to concentrate real vanillin, glucovanillin, and natural antioxidant phenolic compounds. | `100% Real Bean`, `Zero Synthetics`, `Natural Terpenes` |
| **06** | `THE NEW ME PROTEIN` | Clinical Botanical Standard | 24g bio-protein · zero bloat formulation. | Harmonized with chicory inulin prebiotic fiber and active methylcobalamin B12. Pure clinical fuel designed for lifelong longevity and cellular vibrancy. | `24g Net Yield`, `Prebiotic Inulin`, `Bioactive B12` |

### 7.6 React Bits `BlurText` Kinetic Motion Engineering
Transitioning between dock panels uses GSAP synchronized with Lenis scroll:
- **Kinetic Blur Reveal:** As each chapter enters, the dock panel animates from `y: 10px, filter: blur(6px), autoAlpha: 0` to `y: 0, filter: blur(0px), autoAlpha: 1` with `power3.out`.
- **Exit Dissolve:** When scrolling past a chapter, the panel glides upward to `y: -10px, filter: blur(6px), autoAlpha: 0` with `power2.in`.
- **Zero Transition Conflict:** CSS transitions on `.dock-panel` are explicitly omitted so GSAP maintains 60fps direct hardware-accelerated control without micro-stutter.
- **Mobile Plinth Integration:** On screens `<= 768px`, height is calibrated to `clamp(120px, 16vh, 140px)` with equal 14px top/bottom padding. Header line houses kicker and primary spec pill; subheadline sits prominently on line 2; narrative text flows untruncated over lines 3–4. Top micro-progress hairline (`--dock-mobile-progress`) displays real-time scroll completion across the upper border.

### 7.7 Production WebP Conversion Pipeline
To ensure instantaneous page loads and minimum network payload, all site assets are processed through an automated lossless/near-lossless WebP pipeline:
- **Total Converted Assets:** 42 production images in `DATA/` and `images/`.
- **Payload Compression:** Original size reduced from **28.37 MB down to 5.87 MB** (saving **22.50 MB**, a **79.3% network reduction**).
- **Codebase Integration:** 77 image references automatically updated across 23 HTML files (`index.html`, `protein-powder.html`, `protein.html`, `about.html`, `blog.html`, etc.).

---

## 8. DESIGN SYSTEM, TYPOGRAPHY & COLOR TOKENS

### 8.1 Curated Color Palette (Anti-Slop Standard)
Zero generic primaries. All colors are calibrated for high contrast, luxury editorial warmth, and biological association:

```css
:root {
  /* Surfaces */
  --bg-pure-white: #FFFFFF;           /* Pristine loader base and packaging white */
  --bg-bone-ivory: #FAF8F5;           /* Luxury editorial contrast text and cards */
  --bg-obsidian-forest: #08100B;      /* Deep cinematic background behind video */
  --bg-glass-card: rgba(8, 16, 11, 0.82);

  /* Botanicals */
  --brand-chlorophyll-deep: #1A4220;  /* Undertow fluid wave */
  --brand-chlorophyll-prime: #245329; /* Primary brand dark green */
  --brand-chlorophyll-glow: #4ADE80;  /* Active status indicators & pill kickers */
  --brand-botanical-mint: #A7F3D0;    /* Eyebrow and accent text */
  --brand-golden-pea: #FDE68A;        /* Golden pea isolate highlight */

  /* Borders & Glass */
  --border-glass-subtle: rgba(255, 255, 255, 0.14);
  --border-glass-highlight: rgba(255, 255, 255, 0.35);
  --shadow-luxury: 0 24px 60px -12px rgba(0, 0, 0, 0.45);
}
```

### 8.2 Typography System
- **Display Headlines:** `BBH Hegarty`, `BBH Bogle`, `Playfair Display` (Classic editorial serif with generous tracking and high contrast).
- **Body & Technical Specs:** `Inter`, `Plus Jakarta Sans`, `-apple-system` (High legibility, tabular numerals).
- **Telemetry & Numbers:** `SF Mono`, `Menlo`, `monospace` (Tabular numbers for jitter-free percentage readouts).

### 8.3 Unified Loading Screen Architecture (Home Page & Protein Powder 1:1 Parity)
Following explicit user directive (*"load screen on home and protien powder are different, make sure the HOME PAGE load screen is the exact same for protien powder too"*), the loading screen architecture was unified into a single source-of-truth implementation:
1. **DOM Tree Placement:** In both `index.html` and `protein-powder.html` / `protein.html`, the `#proteinLoader` element is placed directly as the very first child of `<body>`, guaranteeing instant full-viewport coverage before any other DOM elements, images, or header scripts are parsed.
2. **Identical Visual CSS:** The loader styling in `protein-scroll.css` is unified byte-for-byte with `style.css`. Both utilize:
   - Logo scale: `clamp(90px, 11vw, 140px)`
   - Breathing hover keyframe animation: `@keyframes brandLogoFloat`
   - Radial backlight lens: `.loader-brand-lens::before`
   - Multi-stage glow drop-shadow: `.logo-dark`
   - Elimination of the divergent 350px opaque ivory dish (`.loader-revealed-layer .loader-brand-lens::before`) that previously made Protein Powder look different from Home.
3. **Single Script Engine (`site-loader.js`):**
   - Both pages execute `site-loader.js?v=unified_v2`.
   - The loader engine animates progress from 0.0 to 1.0 over 3.2s using GSAP with `ease: 'power2.inOut'`, driving the multi-harmonic sinusoidal wave canvas, hydrodynamic effervescence, specular meniscus, and mask height.
   - Upon completion, an optical bloom dissolve (`filter: 'brightness(1.22) blur(8px)', scale: 1.03, opacity: 0`) gracefully exposes the underlying page.
   - Sets `window.__tnmFluidLoaderDismissed = true` and synchronizes with `proteinAnim.loaderDismissed` to ensure scroll triggers and idle settle routines resume cleanly.

---

## 9. DEPLOYMENT, ROUTING & GHOST FILE SANITATION

### 9.1 Ghost System Files Remediation
macOS creates hidden metadata files (`.DS_Store` and AppleDouble `._*` resource forks) on external drives (`/Volumes/DISK 1/`). These files corrupt web builds, cause git noise, and inflate deployment sizes.
- **Automated Cleaner:** Located at [`scripts/clean-ghosts.py`](file:///Volumes/DISK%201/web%20dev/TNM/scripts/clean-ghosts.py).
- **Execution:** Automatically scans the repository recursively and purges all AppleDouble artifacts. Must be run before pushing to GitHub.

### 9.2 Production Routing Rules
Both Netlify and Vercel are configured to ensure clean URLs, redirecting `/protein` and `/protein-powder` directly to the master document without 404s.

#### [`netlify.toml`](file:///Volumes/DISK%201/web%20dev/TNM/netlify.toml)
```toml
[[redirects]]
  from = "/protein"
  to = "/protein-powder.html"
  status = 200

[[redirects]]
  from = "/protein-powder"
  to = "/protein-powder.html"
  status = 200

[[headers]]
  for = "/*.webp"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

#### [`vercel.json`](file:///Volumes/DISK%201/web%20dev/TNM/vercel.json)
```json
{
  "cleanUrls": true,
  "rewrites": [
    { "source": "/protein", "destination": "/protein-powder.html" },
    { "source": "/protein-powder", "destination": "/protein-powder.html" }
  ],
  "headers": [
    {
      "source": "/frames/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    }
  ]
}
```

---

## 10. SKILLS & INSTALLED COMPONENT CATALOG

### 10.1 React Bits (`react-bits`) Installation
Installed in both global and workspace configurations per user request:
- **Global Skill:** [`/Users/theinvadernik/.gemini/config/skills/react-bits/SKILL.md`](file:///Users/theinvadernik/.gemini/config/skills/react-bits/SKILL.md)
- **Workspace Skill:** [`.agents/skills/react-bits/SKILL.md`](file:///Volumes/DISK%201/web%20dev/TNM/.agents/skills/react-bits/SKILL.md)
- **Component Repository:** Located in [`elements/react-bits/`](file:///Volumes/DISK%201/web%20dev/TNM/elements/react-bits/):
  - `content/`: JSX components, documentation, and CSS.
  - `tailwind/`: Tailwind CSS variants.
  - `ts-default/`: TypeScript definitions and unstyled components.

#### Available Elements in Workspace:
- **Backgrounds:** `Waves`, `LiquidChrome`, `Aurora`, `SoftAurora`, `Particles`, `Ballpit`, `Silk`, `Hyperspeed`, `Ferrofluid`, `GridDistortion`, `Iridescence`, `Topography`, `Threads`, `Plasma`.
- **Text Animations:** `BlurText`, `SplitText`, `DecryptedText`, `ShinyText`, `TrueFocus`, `VariableProximity`, `CurvedLoop`, `CircularText`, `CountUp`, `FallingText`, `GlitchText`.
- **Interactive Components:** `SplashCursor`, `PixelCard`, `SpotlightCard`, `TiltedCard`, `ElasticSlider`, `FluidGlass`, `GlassSurface`, `SpecularButton`, `StarBorder`, `ClickSpark`, `Magnet`.

---

## 11. RUNBOOK, LOCAL DEVELOPMENT & FUTURE ROADMAP

### 11.1 Running Locally
The site requires a local HTTP server with Range-request and CORS support for frame streaming:
```bash
# Using the built-in Node server
.toolchain/bin/node server.mjs
# Server runs at: http://localhost:8000
```
- Main Protein Experience: `http://localhost:8000/protein-powder.html` (or `http://localhost:8000/protein.html`)
- Brand Home: `http://localhost:8000/index.html`

### 11.2 Maintenance Commands
```bash
# 1. Clean macOS Ghost Files
python3 scripts/clean-ghosts.py

# 2. Syntax Validation
.toolchain/bin/node -c "TNM WEBSITE/protein-scroll.js"

# 3. Test Netlify configuration syntax
# Verified against netlify.toml and vercel.json
```

### 11.3 Dense Specimen Dock & Negative Space Rectification (Phase 9)
- **Root Cause of Excessive Negative Space:** Previous `@media (max-width: 768px)` implementation applied `align-content: space-between;` to `.dock-panel` inside a 100% height grid, which artificially distributed remaining vertical height as 18px–22px gaps between the kicker, subheadline, and narrative.
- **The Rectification:**
  1. **Collapsed Internal Gaps ("Bring Things Up"):** Switched to `align-content: center;` with a tight `row-gap: 3.5px;` and zeroed out heading/paragraph margins, creating a compact, cohesive typographic unit.
  2. **Expanded Narrative Copy (Filling the Bottom Naturally):** Expanded all 6 chapters from brief 2-line blurbs to 35–40 word clinical botanical narratives, allowing natural 3-line flow (`-webkit-line-clamp: 3;`) to cleanly occupy the lower portion.
  3. **Strict Top/Bottom Negative Space Symmetry:** Container padding is locked to `14px 18px calc(14px + env(safe-area-inset-bottom, 0px)) 18px;` with vertically centered content, ensuring the negative space above the kicker dot and below the final line of copy is mathematically identical across all mobile devices.

### 11.4 Dual-Engine Scroll Architecture (Completed Implementation)
The scroll engine is split cleanly via `gsap.matchMedia()` into two specialized hardware-profile engines:

1. **Engine 1: Mobile Tactile Engine (`(max-width: 768px)`):**
   - **Uniform Cross-Device Cadence:** Pin travel calibrated to `Math.max(5800, Math.min(7200, Math.round(window.innerHeight * 8.5)))`, ensuring all mobile devices (iPhone SE, iPhone 14/15/16 Pro, Samsung Galaxy, Pixel) require the exact same ~6 natural thumb swipes (1 per chapter).
   - **Direct Touch Scrub:** `scrub: 0.15` catchup for immediate 1:1 haptic responsiveness with zero disconnect or rubber-banding.
   - **Lenis Mobile Mode:** `duration: 0.45` and `syncTouch: true` with standard touch multipliers, eliminating artificial drag/damping fighting mobile hardware touch engines.
   - **Step-Magnetic Settle:** `320ms` idle delay with `0.55s` snappy glide into nearest chapter center when parked in a transition gap.
   - **Dock UI:** Centered single-column layout with equal 14px top/bottom padding and rich 3-line clinical copy.

2. **Engine 2: Desktop & 16:9 Tablet Smooth-Scroll Engine (`(min-width: 769px)`):**
   - **Zero "Hard-Scroll" Drag:** Relaxed pin travel of `Math.max(3400, Math.round(window.innerHeight * 3.8))` (down from 5.5vh/12,000px), requiring only ~4 comfortable wheel turns to journey through the entire experience.
   - **Luxury Lenis Inertia:** `duration: 1.15`, `wheelMultiplier: 1.0`, luxury exponential curve `(t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))`, driven seamlessly via `gsap.ticker` with `lagSmoothing(0)`.
   - **Cinematic Interpolation:** `scrub: 0.75` for velvety deceleration of video frames and typography.
   - **Desktop Settle:** `450ms` idle delay with `0.95s` gentle deceleration glide.
### 11.5 Modern Sans Typography Migration: Plus Jakarta Sans (Phase 10)
- **Problem:** [`blog.html`](file:///Volumes/DISK%201/web%20dev/TNM/TNM%20WEBSITE/blog.html) and [`contact.html`](file:///Volumes/DISK%201/web%20dev/TNM/TNM%20WEBSITE/contact.html) previously used the classical serif font `Playfair Display`, which gave an outdated literary tone conflicting with TNM's modern cellular botany aesthetic.
- **Decision & Solution:**
  1. Selected **`Plus Jakarta Sans`** (weights 400, 500, 600, 700, 800) over generic Inter and cold Swiss grotesque.
  2. Overrode `--font-heading` and `--font-body` in the page root of both templates.
  3. Re-calibrated heading tracking with tight negative letter spacing (`-0.035em` for major display titles, `-0.025em` to `-0.02em` for cards and FAQ accordions) and tighter leading (`1.10` to `1.22`) for crisp, muscular modern editorial punch.

### 11.6 Mobile-Only Post-Scroll Section Minimization (Phase 11)
- **Problem Statement:** After the user completes the video scroll animation on mobile, the page previously presented 9 consecutive full-length editorial sections (`#nourish-wellness`, `#benefits`, `#story-of-product`, `#ingredients`, `#comparison`, `#sensory`, `#nutrition`, `#reviews`, `#acquisition`), totaling over 10,000px of vertical scrolling. Many of these sections repeated narrative and biological facts already covered in the video scroll, creating heavy mobile scrolling fatigue before the user reached the purchase module.
- **The Solution (Mobile-Only `max-width: 768px` / Web Desktop 100% Intact):**
  1. **Strict Device Scope:** Rules are locked exclusively inside `@media (max-width: 768px)` in [`protein-scroll.css`](file:///Volumes/DISK%201/web%20dev/TNM/TNM%20WEBSITE/protein-scroll.css) and the inline `<style>` blocks of [`protein-powder.html`](file:///Volumes/DISK%201/web%20dev/TNM/TNM%20WEBSITE/protein-powder.html) and [`protein.html`](file:///Volumes/DISK%201/web%20dev/TNM/TNM%20WEBSITE/protein.html). The desktop/web layout (`> 768px`) retains all 9 editorial sections with zero changes.
  2. **Eliminated Redundant Sections on Mobile:**
     - `#nourish-wellness`: Hidden on mobile (`display: none !important;`). Duplicated the 4 macro metrics and introduced an unneeded filter console.
     - `#benefits`: Hidden on mobile (`display: none !important;`). Duplicated the pouch visual and mid-page CTA.
     - `#story-of-product`: Hidden on mobile (`display: none !important;`). The Australian sourcing chronicle is already narrated in video chapters 1 & 2.
     - `#comparison`: Hidden on mobile (`display: none !important;`). The dense 8-card matrix took ~1,500px of scrolling.
     - `#sensory`: Hidden on mobile (`display: none !important;`). The 3 circadian rituals took ~1,100px of vertical space.
  3. **Streamlined Active Core Sections (Minimal 4-Step Conversion Spine):**
     - **Step 1: Ingredients (`#ingredients`):** Re-flowed into a compact 2x2 grid (`grid-cols-2`) with 110px image thumbnails, tight 12px padding, and a compact B12 callout card.
     - **Step 2: Nutrition Panel (`#nutrition`):** Reduced to the 4 essential macro badges (18.8g Protein, 4.8g Inulin Fibre, 0.0g Added Sugar, 119 kcal) in a tight 2x2 grid. Heavy ICMR 100g table and toggle controls are hidden on mobile.
     - **Step 3: Social Proof (`#reviews`):** Displays the 4.9 rating trust pill alongside 1 featured verified customer review (Ananya Sharma), hiding reviews 2 and 3 to eliminate duplicate card bloat.
     - **Step 4: Direct Checkout (`#acquisition`):** Capped the travertine plinth pouch visual height to 180px, tightened card padding to 18px, streamlined bundle selectors, and kept the full-width 48px CTA button immediately accessible.
  4. **Vertical Density:** Section padding across all active sections was trimmed from desktop-scale `80px–128px` (`py-20 sm:py-28`) down to a mobile register of `36px 0`, compressing post-scroll height from ~10,300px to ~1,670px (~2.2 mobile viewport heights).

### 11.7 Balanced Mobile Cadence, Bug-Free Static Cards & React Bits Review Marquee (Phase 12)
- **Problem Statement & Feedback:** 
  1. Phase 11's initial minimization over-compressed the post-scroll experience (down to only 4 sections), making the page feel too sparse relative to the 8–9 section rhythm established on [`index.html`](file:///Volumes/DISK%201/web%20dev/TNM/TNM%20WEBSITE/index.html).
  2. Mobile accordions and open-down menus ("Clinical Detail" chevrons in `#ingredients`, macro table toggles in `#nutrition`, and interactive category pills in `#nourish-wellness`) caused jarring card expansion glitches and text jumps inside CSS grids on mobile touchscreens.
  3. The static testimonial layout required modernization into a smooth, continuous React Bits marquee ticker.
  4. Scroll reveal animations required elevation to match the cinematic GSAP standard of the hero scroll engine.

- **The Solution & Implementation:**
  1. **Cadence Restoration (8 Balanced Post-Scroll Sections on Mobile):**
     - Restored all 8 sections (`#nourish-wellness`, `#benefits`, `#story-of-product`, `#ingredients`, `#comparison`, `#sensory`, `#nutrition`, `#reviews`, `#acquisition`) across mobile viewports, matching the narrative depth and balance of the Home Page.
     - Kept sections sleek, compact, and minimal with calibrated mobile padding (`padding: 40px 0 !important;`), 2-column grids (`grid-template-columns: repeat(2, minmax(0, 1fr))`), and capped image heights (`max-height: 140px–180px`), eliminating scroll fatigue while providing complete product storytelling.
  2. **Elimination of Mobile Open-Down Menu Bugs:**
     - **#ingredients:** Chevrons and expanding clinical detail trays suppressed on mobile (`display: none !important; pointer-events: none !important;`). Cards remain static, clean, and tap-safe.
     - **#nutrition:** Toggle button bar and dense 100g ICMR table hidden on mobile; the 4 essential macro badges (18.8g Protein, 4.8g Inulin Fibre, 0g Added Sugar, 119 kcal) are permanently displayed in a clean 2x2 grid.
     - **#nourish-wellness:** Interactive formulation filter console hidden on mobile; displays the clean overview card directly.
     - **#comparison:** Conventional whey comparison column (`#col-regular`) hidden on mobile; affirmative "THE NEW ME Protocol" card (`#col-newme`) takes full width with zero visual clutter.
     - **Programmatic JS Guards:** Added `if (window.innerWidth <= 768) return;` to `toggleIngredientDetail()`, `toggleNutritionView()`, and `setActiveNourishFilter()`. Desktop (`> 768px`) preserves 100% full interactive depth, accordions, and ICMR lab tables.
  3. **React Bits Continuous Review Marquee (`#reviews`):**
     - Engineered hardware-accelerated infinite ticker with pure CSS `translate3d(-50%, 0, 0)` at `34s linear infinite`.
     - Integrated dual-edge progressive alpha gradient masks:
       ```css
       mask-image: linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%);
       -webkit-mask-image: linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%);
       ```
     - Structured with 4 diverse customer and clinician reviews (Ananya Sharma, Rohan Kapoor, Dr. Priya Mehta, Vikram Malhotra) plus a 1:1 duplicated set (`aria-hidden="true"`) for zero-glitch continuous loop transitions. Pause-on-hover/touch active.
  4. **Elevated GSAP ScrollTrigger Batch Animations:**
     - Replaced vanilla `IntersectionObserver` with `ScrollTrigger.batch('.editorial-card, .ingredient-card, #col-newme, .sensory-layer-card')`.
     - Elements glide upward with hardware-accelerated `power3.out` curve (`y: 24 -> 0`, `opacity: 0 -> 1`, `duration: 0.85s`, `stagger: 0.08s`, `force3D: true`).
     - Includes progressive fallback to CSS `reveal-on-scroll` for edge environments where JS CDN execution is restricted.

### 11.8 Mobile Length Optimization: Touch-Snap Provenance Strip & 2x2 Comparative Matrix (Phase 13)
- **Problem Statement:**
  1. Section 03 (**The Provenance Chronicle** `#story-of-product`) previously stacked a 3-paragraph manifesto card with a heavy blockquote on top of 3 large origin photo cards, consuming nearly ~1,700px of vertical space on mobile phones.
  2. Section 05 (**The Comparative Standard** `#comparison`) stacked 4 large vertical feature cards with an unnecessary mid-page checkout CTA, consuming ~850px of vertical space.
- **The Solution (Mobile-Only `max-width: 768px` / Desktop 100% Intact):**
  1. **Section 03 — The Provenance Chronicle (`#story-of-product`):**
     - **Header Tightening:** Scaled title to `1.5rem` and margin to `18px`.
     - **Manifesto Condensation:** Suppressed duplicate narrative and quote on mobile, presenting the story as a crisp, elegant 3-sentence editorial card.
     - **React Bits Touch-Snap Horizontal Carousel:** Converted the 3 stacked origin plates into a hardware-accelerated horizontal touch-snap track (`display: flex; overflow-x: auto; scroll-snap-type: x mandatory`). Cards glide horizontally with momentum touch physics (`235px` cards, `85px` thumbnails), reducing vertical section height by **78%** (from 1,700px to ~380px).
  2. **Section 05 — The Comparative Standard (`#comparison`):**
     - **Header Tightening:** Scaled title to `1.5rem` and margin to `18px`.
     - **2x2 Distinction Matrix:** Converted the 4 stacked vertical feature blocks into a compact 2x2 grid (`grid-template-columns: repeat(2, minmax(0, 1fr))`) with affirmative icons, crisp bold headers, and concise benefit copy.
     - **Duplicate Button Suppression:** Removed redundant mid-page checkout button on mobile; the 30-day guarantee trust line is retained, guiding user focus toward the main acquisition checkout module below.
     - Reduced vertical section height by **68%** (from 850px to ~270px).
  3. **Verification:**
     - Verified zero horizontal page scroll leaks.
     - Confirmed `HTTP 200 OK` on `protein-powder.html` and `protein.html`.

### 11.9 Protein Footer Gap Rectification & Blog Book Promo Mobile Reflow (Phase 14)
- **Problem Statement:**
  1. **Protein Page White Gap Bug:** On mobile screens, a 24px white horizontal bar appeared directly above the footer. This was caused by `margin-top: 24px;` in `style.css` on `.footer`, which created a 24px gap between `#acquisition` (`#f8f7f2`) and `.footer` (`#f8f7f2`), exposing the page `<body>`'s pure white background.
  2. **Blog Book Promo Card Bounding Box & Stacking:** In [`blog.html`](file:///Volumes/DISK%201/web%20dev/TNM/TNM%20WEBSITE/blog.html), the 90-Day Reset Journal book cover had a visible rectangular white card box with a shadow (`.promo-book-img-wrap`) behind the 3D book cover, instead of a floating transparent book. Additionally, on mobile devices, the widget was stacked vertically, pushing the title, description, and CTA button below the image.
- **The Solution:**
  1. **Protein Footer Gap Rectification (`antislop-layoutmobile`):**
     - Updated `style.css` line 1875 to `margin-top: 0;` inside the mobile media query.
     - Added `.footer { margin-top: 0 !important; background-color: #f8f7f2 !important; border-top: 1px solid #e0e0e0 !important; }` in `protein-scroll.css` and the inline styles of `protein-powder.html` and `protein.html`.
     - Completely eliminated the white gap bug, creating an unbroken cream transition into the footer.
  2. **Blog Book Section Bounding Box Elimination (`high-end-visual-design`):**
     - Removed `box-shadow`, `border-radius`, and background from `.promo-book-img-wrap`.
     - Applied `filter: drop-shadow(0 12px 20px rgba(0, 0, 0, 0.16))` directly to `.promo-book-img`, so the shadow follows the natural 3D contours of the book without any rectangular matte on both desktop and mobile.
  3. **Blog Book Section Mobile Reflow (`antislop-layoutmobile`):**
     - On mobile (`@media (max-width: 767px)`), converted `.promo-book-card` to a side-by-side flex layout (`flex-direction: row; align-items: center; gap: 16px;`).
     - **Left Side:** The 3D transparent book (`width: 100px; flex-shrink: 0;`).
     - **Right Side:** The text content and button in `.promo-book-content` (badge, 1.12rem title, 2-line clamped description, and compact pill button `Order Your Copy`).
     - Desktop sidebar remains a centered vertical widget.

### 11.10 Direct Acquisition Module Redesign & Pouch Artwork Uncropping (Phase 15)
- **Problem Statement:**
  1. **Severely Cropped Product Artwork:** The acquisition card in Section 09 (`#acquisition`) on mobile viewports suffered from extreme vertical cropping. The CSS previously enforced `#acquisition img { max-height: 180px !important; }` inside a wide card with `object-fit: cover`. Because the original artwork had a tall 9:16 aspect ratio with empty arched architecture at the top, the 180px height cap sliced off the top 40% (cutting off the pouch zipper and header) and bottom 40% (cutting off the travertine stone plinth and ingredients), making the product appear "messed up" and cramped.
  2. **Colliding Elements & Card Clutter:** A floating badge (`LIMITED HARVEST BATCH`) was slapped directly over the top of the pouch, obstructing the brand name and packaging details. The trust badges were sprawled across two lines, and the typography lacked the calm, editorial minimalism of the rest of the brand.
- **The Solution:**
  1. **Image Recalibration & Zero-Crop Framing (`antislop-ui`, `high-end-visual-design`):**
     - Recalibrated `Plant_protein_pouch_on_plinth_clean.webp` from 1536x2752 to a tailored 4:5 ratio (1536x1870), centering the pouch, plinth, botanical seeds, and rice while eliminating 800px of superfluous empty ceiling space.
     - Preserved the pristine original in `Plant_protein_pouch_on_plinth_clean.original.webp`.
     - Introduced `.product-showcase-box` with `aspect-ratio: 4 / 5`, `max-width: 320px`, `max-height: 340px`, and `border-radius: 16px`, combined with `object-fit: cover; object-position: center;`.
     - Product pouch, zipper, front nutritional callouts, travertine plinth, and botanical ingredients are now 100% visible with zero cut edges on both mobile and desktop.
  2. **Minimalist Card Redesign (`antislop-layoutmobile`, `design-taste-frontend`):**
     - Relocated the harvest batch notification from an awkward overlay badge into an elegant, pulse-dot eyebrow pill above the main headline (`Limited Reserve Harvest Batch`).
     - Refined the trust guarantees into a sleek, single-row pill (`Free Shipping • 30-Day Guarantee • Secure Checkout`) with crisp micro-icons.
     - Switched section title to modern sans typography (`font-bold text-2xl sm:text-3xl tracking-tight`), aligned with Apple/Aesop editorial standards.
     - Streamlined the bundle selection cards (`Single Reserve Pouch` & `Duo Vitality Pack`) with refined borders, subtle active states, and crisp typography.
     - Upgraded the CTA to a tactile, high-conversion pill button (`Claim Your Reserve Pouch`) with forward arrow icon and 30-day risk-free reassurance.
### 11.11 Anti-Snap Container Hardening across Direct Acquisition (Phase 16)
- **Problem Statement:**
  1. **Trust Bar "Secure Checkout" Container Snapping:** On mobile viewports ($\le 390\text{px}$), wrapping the three trust badges (`Free Shipping`, `30-Day Guarantee`, `Secure Checkout`) inside a single-line rounded pill container with fixed borders and `shrink-0` badges exceeded the available interior card width ($300\text{px}-320\text{px}$). This caused the third badge (`Secure Checkout`) to break outside the right curved border of the pill.
  2. **Bundle Selector Multi-Element Row Collision:** In the Duo Vitality Pack bundle choice, packing the title, a `Save 10%` badge, and a right-aligned `BEST VALUE` label onto a single flex row created horizontal collision risks on narrow mobile screens ($320\text{px}-360\text{px}$).
  3. **Micronutrient Allowance Badge No-Wrap Risk:** In Section 04, the Vitamin B12 callout had a 34-character string (`100% Recommended Dietary Allowance`) styled with `whitespace-nowrap`, creating overflow susceptibility on compact screens.
- **The Solution:**
  1. **Fluid Responsive Grid Architecture (`antislop-layoutmobile`):**
     - Replaced the rigid single-row pill in `#acquisition` with a responsive 3-column grid (`grid grid-cols-3 gap-2 w-full max-w-[340px] text-[11px] sm:text-xs text-[#555555] font-medium`).
     - Removed the restrictive enclosing pill background and borders.
     - On mobile screens, items use `flex flex-col items-center justify-center text-center gap-1`, centering each icon cleanly above its label and wrapping long text safely inside its own dedicated one-third column.
     - On desktop screens ($\ge 640\text{px}$), items transition seamlessly to `sm:flex-row sm:text-left`, placing icons side by side with labels matching the original design.
     - "Secure Checkout" is physically isolated within its own grid track, making container breakout mathematically impossible.
  2. **Hierarchical 2-Row Bundle Typography:**
     - Separated the Duo Pack title to Row 1 (`Duo Vitality Pack (2× 500g)` paired with `BEST VALUE`).
     - Relocated the `Save 10%` badge to Row 2 alongside the servings detail (`30 Servings • Free Handheld Shaker Included`).
     - Added `width: 100% !important; box-sizing: border-box !important; overflow: hidden !important;` to `.bundle-option` to guarantee zero boundary violations.
  3. **Site-Wide Anti-Overflow Hardening:**
     - Replaced `whitespace-nowrap` on the B12 allowance badge with `text-center`, allowing natural multi-line wrapping on ultra-compact mobile viewports.
     - Synchronized changes across `protein-powder.html`, `protein.html`, and `protein-scroll.css`.
### 11.12 Mobile Video Chapter Stepped Trajectory Sequence (Phase 17)
- **Problem Statement:** On mobile devices, the six video scroll chapter titles (`.editorial-chapter[data-chapter="1"]` through `[data-chapter="6"]`) previously sat at a flat vertical anchor (`top: 34%`). This flattened the narrative momentum of the scroll-driven video animation, where the camera perspective dives down through the botanical landscape (sky $\rightarrow$ field $\rightarrow$ harvest $\rightarrow$ seeds $\rightarrow$ orchid $\rightarrow$ plinth).
- **The Solution:**
  1. **Stepped Downward Trajectory Sequence (`protein-scroll.css`):**
     - Implemented the exact descending trajectory system across all 6 shots on mobile viewports (`@media (max-width: 768px)`):
       - **Shot 1 (Chapter 1: "THE NEW ME EXPERIENCE"):** `top: 20%;` (Commands open sky below header)
       - **Shot 2 (Chapter 2: "GOLDEN PEA"):** `top: 26%;` (One step down)
       - **Shot 3 (Chapter 3: "BROWN RICE"):** `top: 32%;` (One step down)
       - **Shot 4 (Chapter 4: "PUMPKIN SEEDS"):** `top: 38%;` (One step down)
       - **Shot 5 (Chapter 5: "ORCHID BENEFITS"):** `top: 44%;` (One step down)
       - **Shot 6 (Chapter 6: "THE NEW ME PROTEIN"):** `top: 50%;` (One step down, perfectly hovering above plinth and lower dock)
     - Desktop remains centered on the upper stage (`top: 36%`).
  2. **Multi-File Synchronization & Cache Invalidation:**
     - Synchronized changes across `protein-powder.html`, `protein.html`, and `protein-scroll.css`.
     - Bumped stylesheet query to `v=trajectory_steps_v11`.

### 11.13 Production Deployment Directory Architecture & Strict Zero-Bloat Isolation (`tnm-deploy`) (Phase 18)
- **Problem Statement:** The active development workspace contained experimental artifacts, video source captures (~500MB raw mp4 files), subagent skill definitions, Python utility scripts, temporary framing tests, legacy unreferenced imagery (`pouch_blue_glow_bg`, `pouch.jpg`, old concept mockups), and OS metadata files totaling over 650 MB and 1,200+ files. Directly deploying the root workspace risked uploading unnecessary private development data, triggering build timeout penalties, and deploying broken links (`web.html`).
- **The Solution:**
  1. **Clean Directory Assembly (`tnm-deploy`):**
     - Assembled an isolated, 100% self-contained production deployment folder at `/Volumes/DISK 1/web dev/TNM/tnm-deploy` without moving or altering original development files.
     - Pruned over 815 development-only files (`.agents/`, `temp_frames/`, `scratch/`, `skills/`, `rules/`, `temp_overlays/`, `VIDEOS/`, `web.html`, raw test pages, and 64 unreferenced/legacy images).
     - Excluded all unused image files: `pouch_blue_glow_bg.jpg/webp`, `pouch.jpg/webp`, `hero_product_splash.jpg/webp`, `Black_pouch_on_mirror_pool_2K.jpg`, duplicate unoptimized JPGs in `DATA/editorial/`, and deprecated award badges.
     - Retained strictly the 9 active WebP graphics in `images/` and 44 active WebP/SVG brand assets in `DATA/`.
     - Total deployment payload dramatically reduced from >650 MB to **23.62 MB across exactly 408 production files**.
  2. **Zero-Missing Asset Reference Audit:**
     - Audited all 22 active HTML pages and CSS files across 937 asset paths.
     - Discovered and rectified legacy references to non-existent demo file `web.html` in `blog.html`, `gut-brain-axis-guide.html`, and `the-new-me-2-reverse-ageing.html`, linking them to the active article `workout-tight-schedule.html`.
     - Verified all 315 WebP canvas frames (291 video frames + 24 luma transitions), custom fonts (`bbh-bogle.ttf`, `bbh-hegarty.ttf`), brand graphics, vendor GSAP libraries, and scripts are present and load with `HTTP 200 OK`.
  3. **Multi-Platform Deployment Ready:**
     - Included production routing and caching configs: `vercel.json`, `netlify.toml`, `_redirects`, `robots.txt`, `sitemap.xml`, `favicon.ico`, `favicon.png`, `server.mjs`, and `package.json`.
     - Completely sanitized from macOS AppleDouble (`._*`) ghost files.
     - Ready for one-command deployment to Vercel, Netlify, Cloudflare Pages, or static Node/Apache/Nginx servers.

### 11.14 Interactive Formulation Inspector Decommissioning (Phase 19)
- **Problem Statement:** Below the 4-column clinical foundation metric cards in Section 01 (`#nutrition`), an interactive pill filter box titled `Interactive Formulation Inspector` (`Complete Protocol`, `Gut Inulin`, `Cellular B12`, `Tri-Blend Aminos`, `Zero Glycemic Spike`) added visual noise, duplicated nutritional descriptions already featured in the primary bento cards, and disrupted the clean, uncluttered rhythm of the page.
- **The Solution:**
  1. **Clean Markup Deletion (`antislop-ui`):** Removed the `.max-w-3xl` card console and `#nourish-pill-detail` completely from Section 01 across both `protein-powder.html` and `protein.html`.
  2. **Dead Code Elimination:** Removed the `.nourish-pill` CSS rule block from `<style>` and the `setActiveNourishFilter()` JavaScript controller function.
  3. **Multi-Folder Synchronization:** Synchronized changes across both the deployment directory `tnm-deploy/` and working directory `TNM WEBSITE/`.

### 11.15 16:9 Full Product View Integration & Global Button/Badge Container Hardening (Phase 20)
- **Problem Statement:**
  1. **Chopped Product Artwork in Bento Card 1:** Bento Card 1 in Section 02 (`#benefits`) previously used the vertical 4:5 crop (`Plant_protein_pouch_on_plinth_clean.webp`). When rendered inside a wide landscape container with `object-cover`, the pouch was severely zoomed in and chopped off in half horizontally, slicing off the branding, right side of the pouch, and botanical surroundings.
  2. **Button & Badge Container Text Wrapping / Pill Border Collisions:** Badges such as `Cold Physical Extraction` in the Bento 1 header lacked `whitespace-nowrap` and `shrink-0`. In the flex row alongside the title `Velvety Vanilla Fudge 500g`, viewport narrowing squeezed the badge, causing the text to break into two lines inside a capsule pill (`rounded-full`), severely deforming the pill container arc. Similar wrapping vulnerabilities existed in `Fresh Harvest Batch`, `Clinical Detail`, `Verified Clean`, and editorial category tags.
- **The Solution:**
  1. **16:9 Full Product Artwork Deployment (`high-end-visual-design`, `antislop-ui`):**
     - Sourced the pristine 2752x1536 2K widescreen photograph `Plant_protein_pouch_on_plinth_2K_20261012111022.webp` and deployed it as `images/Plant_protein_pouch_on_plinth_16x9.webp` (296 KB WebP).
     - Upgraded the Bento Card 1 frame to `aspect-[16/9] w-full` with `object-cover object-center`.
     - The product pouch, zipper, nutritional callouts, travertine stone plinth, and botanical ingredients are now 100% visible with zero cut edges and zero choppy crops.
  2. **Comprehensive Button & Badge Container Hardening (`antislop-layoutmobile`):**
     - Hardened `Cold Physical Extraction` with `whitespace-nowrap shrink-0` and provided `min-w-0 flex-1` on the title wrapper.
     - Hardened all `Fresh Harvest Batch`, `Clinical Detail` (all 4 ingredient cards), `100% Recommended Dietary Allowance`, `Verified Clean`, and `Limited Reserve Harvest Batch` badges with `whitespace-nowrap shrink-0`.
     - Hardened `.overlay-pill-badge` in `protein-scroll.css` with `white-space: nowrap; flex-shrink: 0;`.
     - Updated category pills across all 16 editorial blog guides with `rounded-xl sm:rounded-full max-w-full text-center leading-snug`, eliminating border clipping on compact screens ($320\text{px}-390\text{px}$).
  3. **Multi-Folder Synchronization:**
     - Deployed and verified across `tnm-deploy/` and `TNM WEBSITE/`.

### 11.16 16:9 Frame Curation & 24-Step Optical Bloom Transition Engine (Phase 21)
- **Problem Statement:**
  1. **Excess Redundant Cloud Descent Frames (Shot 1):** In the 16:9 widescreen master sequence, Shot 1 (Cloudscape Descent) originally ran 95 frames (0–94). Frames 59 to 95 lingered unnecessarily inside the clouds before cutting into Shot 2 (Canadian Yellow Pea Isolate, Frame 96), creating temporal lag.
  2. **Hard Cut Between Shot 1 and Shot 2:** The hard jump from the sunlit clouds of Frame 58 directly into the Canadian Yellow Pea fields lacked the organic, celestial film-burn transition present in the vertical mobile engine.
  3. **Visual Clutter from 16:9 Preview HUD & Watermark Badge:** The temporary floating debug panel (`tnmShotInspector`, "16:9 PREVIEW MODE") and the simulated watermark cover badge (`watermarkCoverBadge`) used during evaluation remained visible on the page, cluttering the production interface.
- **The Solution:**
  1. **Surgical Removal of Frames 59–95:**
     - Safely moved 37 excess frames (`shot1_frame_0059.webp` to `shot1_frame_0095.webp`) to `16_9_frames/unused_frames/shot_1_removed_59_95/`.
     - Shot 1 now concludes at Frame 58 (`shot1_frame_0058.webp`, high-luminance golden cloudscape).
     - Recompiled continuous curated sequence (`16_9_frames/rebuild_sequence.py`) into 968 crisp 1080p WebP frames (`frame_0000.webp` to `frame_0967.webp`).
  2. **24-Step 16:9 Optical Bloom Transition Engine (`scripts/generate_16_9_bloom.py`):**
     - Generated 24 cinematic optical bloom transition frames (`luma_00.webp` to `luma_23.webp`) stored at `16_9_frames/curated_sequence/transitions/` and accessible via `frames/protein_16x9/transitions/`.
     - Uses identical physics to the vertical engine: highlight isolation ($L > 0.45$), 3-octave Gaussian blur diffusion ($55\text{px}, 22\text{px}, 8\text{px}$), celestial champagne warmth tint (`[1.06, 1.02, 0.95]`), and filmic shoulder highlight compression.
     - Perfect mathematical boundary matching: Frame 00 ($t=0.0$) matches Frame 58 exactly; Frame 23 ($t=1.0$) matches Shot 2 Frame 1 (Frame 96) exactly.
  3. **Decoupled Scroll Timeline Interpolation in `protein-scroll.js`:**
     - Total 16:9 timeline steps: $968 \text{ video frames} + 24 \text{ bloom steps} = 992 \text{ steps}$.
     - Preloads all 24 transition frames in parallel during initialization.
     - Timeline rendering cleanly routes:
       - $0 \le \text{step} \le 57$: Shot 1 video frames (0–57).
       - $58 \le \text{step} \le 81$: 24-step optical bloom transition (`drawLumaTransition16x9`).
       - $82 \le \text{step} \le 991$: Shots 2–5 video frames (58–967).
     - Bidirectional scrub support with zero lag, instant direction-aware rendering, and boundary frame fallbacks.
  4. **Decommissioning of Debug Preview HUD & Watermark Badge (`antislop-ui`):**
     - Removed `setupShotInspector()`, `updateShotInspector()`, and keydown toggle listeners from `protein-scroll.js`.
     - Purged `.tnm-shot-inspector` and `.watermark-cover-badge` styles from `protein-scroll.css`.
  5. **Complete Workspace & Deployment Synchronization:**
     - Verified identical parity across [`TNM WEBSITE/`](file:///Volumes/DISK%201/web%20dev/TNM/TNM%20WEBSITE/) and [`tnm-deploy/`](file:///Volumes/DISK%201/web%20dev/TNM/tnm-deploy/).

### 11.17 Dual Bloom Transition Architecture: Bloom 1 (57→59) & Hard Bloom 2 (728→729) (Phase 22)
- **Problem Statement & Requirements:**
  1. **Bloom 1 Relocation:** Transition 1 needed to be placed specifically between `frame_0057.webp` and `frame_0059.webp` in `16_9_frames/curated_sequence/` (bridging Shot 1 Cloudscape Descent into Shot 2 Canadian Yellow Pea Isolate, accounting for user removal of frame 58).
  2. **Hard Bloom 2 Requirement:** A punchy, solar high-energy flare transition ("hard bloom") was required between `frame_0728.webp` and `frame_0729.webp` (bridging Shot 4 Cold-Pressed Pumpkin Seeds into Shot 5 Madagascar Vanilla Orchid & Pouch).
  3. **Zero 404s & Perfect Timeline Synchronicity:** The player must not request missing frame 58 during buffering or keyframing, and the entire 1,015-step timeline must map smoothly across both transitions and all 5 shots with zero lag or frame jitter.
- **The Solution:**
  1. **Dual Bloom Generation (`scripts/generate_16_9_bloom.py`):**
     - **Bloom 1 (`luma_00.webp` to `luma_23.webp`):** 24 frames blending seamlessly from `frame_0057.webp` ($t=0.0$, mean 228.9) through a golden celestial flare to `frame_0059.webp` ($t=1.0$, mean 170.0).
     - **Hard Bloom 2 (`hard_bloom_00.webp` to `hard_bloom_23.webp`):** 24 frames launching from `frame_0728.webp` ($t=0.0$, mean 176.3), erupting into intense solar radiance ($t=0.52$, peak luminance mean 252.0) with expansive multi-scale Gaussian spread ($68\text{px}, 28\text{px}, 10\text{px}$) and warm core saturation boost, settling into `frame_0729.webp` ($t=1.0$, mean 181.9).
     - Assets stored in `16_9_frames/curated_sequence/transitions/` and symlinked to `frames/protein_16x9/transitions/`.
  2. **1,015-Step Master Timeline Orchestration (`protein-scroll.js`):**
     - $0 \le \text{step} \le 57$ (58 steps): Shot 1 video frames (`frame_0000` to `frame_0057`).
     - $58 \le \text{step} \le 81$ (24 steps): Bloom 1 transition (`luma_00` to `luma_23`).
     - $82 \le \text{step} \le 751$ (670 steps): Shots 2–4 video frames (`frame_0059` to `frame_0728`, offset $-23$).
     - $752 \le \text{step} \le 775$ (24 steps): Hard Bloom 2 transition (`hard_bloom_00` to `hard_bloom_23`).
     - $776 \le \text{step} \le 1014$ (239 steps): Shot 5 video frames (`frame_0729` to `frame_0967`, offset $-47$).
     - Total timeline steps = $58 + 24 + 670 + 24 + 239 = 1015$ steps.
  3. **High-Concurrency Parallel Preloading & Network Hardening:**
     - Both 24-frame transition sequences are preloaded concurrently during initialization.
     - `bufferWindow` and `preloadFrames` explicitly skip index 58 to prevent 404 network requests.
     - Reverse scrub resolution and fallback boundaries smoothly preserve display state without temporal flicker.
  4. **Strict Parity Across Projects:**
     - Synchronized across [`TNM WEBSITE/`](file:///Volumes/DISK%201/web%20dev/TNM/TNM%20WEBSITE/) and [`tnm-deploy/`](file:///Volumes/DISK%201/web%20dev/TNM/tnm-deploy/).

---
*Handover document compiled with complete contextual fidelity. All source files, specifications, and assets are synchronized in the repository.*








