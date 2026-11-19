// Recon pass 2: global extraction — fonts, colors, favicons, assets, smooth scroll, keyframes.
import { openTarget } from './pw.mjs';
import fs from 'node:fs';

const { browser, page } = await openTarget(1440, 900);

// Trigger lazy content
await page.evaluate(async () => {
  await new Promise((resolve) => {
    let y = 0;
    const step = () => {
      y += 600;
      window.scrollTo(0, y);
      if (y < document.body.scrollHeight) setTimeout(step, 100);
      else resolve();
    };
    step();
  });
});
await page.waitForTimeout(1200);
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(500);

const data = await page.evaluate(() => {
  const out = {};

  // --- Fonts ---
  out.fontLinks = [...document.querySelectorAll('link[rel="stylesheet"], link[rel="preload"], link[rel="preconnect"]')]
    .map((l) => ({ rel: l.rel, href: l.href, as: l.as || undefined }))
    .filter((l) => /font|gstatic|googleapis/.test(l.href));
  out.fontFaces = [...document.styleSheets].flatMap((ss) => {
    try {
      return [...ss.cssRules].filter((r) => r instanceof CSSFontFaceRule).map((r) => ({
        family: r.style.getPropertyValue('font-family'),
        weight: r.style.getPropertyValue('font-weight'),
        style: r.style.getPropertyValue('font-style'),
        src: r.style.getPropertyValue('src').slice(0, 300),
      }));
    } catch { return []; }
  });
  const fontUse = new Map();
  document.querySelectorAll('*').forEach((el) => {
    const cs = getComputedStyle(el);
    const key = `${cs.fontFamily} | ${cs.fontWeight} | ${cs.fontStyle}`;
    fontUse.set(key, (fontUse.get(key) || 0) + 1);
  });
  out.fontUsage = [...fontUse.entries()].sort((a, b) => b[1] - a[1]).slice(0, 25);

  // --- Colors ---
  const colors = new Map();
  const bgColors = new Map();
  const borderColors = new Map();
  document.querySelectorAll('*').forEach((el) => {
    const cs = getComputedStyle(el);
    if (cs.color && cs.color !== 'rgba(0, 0, 0, 0)') colors.set(cs.color, (colors.get(cs.color) || 0) + 1);
    if (cs.backgroundColor && cs.backgroundColor !== 'rgba(0, 0, 0, 0)') bgColors.set(cs.backgroundColor, (bgColors.get(cs.backgroundColor) || 0) + 1);
    if (cs.borderColor && cs.borderColor !== 'rgba(0, 0, 0, 0)' && cs.borderWidth !== '0px') borderColors.set(cs.borderColor, (borderColors.get(cs.borderColor) || 0) + 1);
  });
  const top = (m, n = 30) => [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, n);
  out.textColors = top(colors);
  out.backgroundColors = top(bgColors);
  out.borderColors = top(borderColors, 15);

  // CSS variables
  const rootStyles = getComputedStyle(document.documentElement);
  out.cssVariables = [];
  for (const prop of rootStyles) {
    if (prop.startsWith('--')) out.cssVariables.push(`${prop}: ${rootStyles.getPropertyValue(prop).trim()}`);
  }

  // --- Favicons & meta ---
  out.favicons = [...document.querySelectorAll('link[rel*="icon"], link[rel="manifest"], link[rel="apple-touch-icon"]')]
    .map((l) => ({ rel: l.rel, href: l.href, sizes: l.sizes?.toString(), type: l.type }));
  out.meta = [...document.querySelectorAll('meta[property], meta[name]')]
    .map((m) => ({ key: m.getAttribute('property') || m.getAttribute('name'), content: (m.content || '').slice(0, 200) }))
    .filter((m) => /og:|twitter:|description|theme-color/.test(m.key));

  // --- Assets ---
  out.images = [...document.querySelectorAll('img')].map((img) => ({
    src: img.src || img.currentSrc,
    alt: img.alt,
    naturalWidth: img.naturalWidth,
    naturalHeight: img.naturalHeight,
    parentClasses: img.parentElement?.className?.toString().slice(0, 100),
    siblings: img.parentElement ? img.parentElement.querySelectorAll('img').length : 0,
    position: getComputedStyle(img).position,
    zIndex: getComputedStyle(img).zIndex,
  }));
  out.videos = [...document.querySelectorAll('video')].map((v) => ({
    src: v.src || v.querySelector('source')?.src,
    poster: v.poster,
    autoplay: v.autoplay,
    loop: v.loop,
    muted: v.muted,
  }));
  const bgMap = new Map();
  document.querySelectorAll('*').forEach((el) => {
    const bg = getComputedStyle(el).backgroundImage;
    if (bg && bg !== 'none' && bg.includes('url(')) {
      bgMap.set(bg.slice(0, 300), el.tagName + '.' + (el.className?.toString().split(' ')[0] || ''));
    }
  });
  out.backgroundImages = [...bgMap.entries()].map(([url, el]) => ({ url, el }));
  out.svgCount = document.querySelectorAll('svg').length;
  out.canvasCount = document.querySelectorAll('canvas').length;

  // --- Smooth scroll / global behaviors ---
  out.smoothScroll = {
    htmlScrollBehavior: getComputedStyle(document.documentElement).scrollBehavior,
    hasLenis: !!document.querySelector('.lenis, [data-lenis-prevent]') || document.documentElement.classList.contains('lenis'),
    htmlClasses: document.documentElement.className,
    bodyClasses: document.body.className,
  };

  // --- Keyframes ---
  out.keyframes = [...document.styleSheets].flatMap((ss) => {
    try {
      return [...ss.cssRules].filter((r) => r instanceof CSSKeyframesRule).map((r) => r.name);
    } catch { return []; }
  });

  // --- Tech stack hints ---
  out.tech = {
    hasNextData: !!document.getElementById('__NEXT_DATA__'),
    hasNuxt: !!document.getElementById('__NUXT__'),
    generator: document.querySelector('meta[name="generator"]')?.content,
    scripts: [...document.querySelectorAll('script[src]')].map((s) => s.src).slice(0, 20),
  };

  return out;
});

fs.writeFileSync('docs/research/raw-global.json', JSON.stringify(data, null, 2));
console.log('fonts:', data.fontUsage.slice(0, 8));
console.log('svgCount:', data.svgCount, '| images:', data.images.length, '| videos:', data.videos.length, '| canvas:', data.canvasCount);
console.log('smoothScroll:', data.smoothScroll);
console.log('keyframes:', data.keyframes);
console.log('favicons:', data.favicons);
console.log('tech.generator:', data.tech.generator, '| nextData:', data.tech.hasNextData);
await browser.close();
