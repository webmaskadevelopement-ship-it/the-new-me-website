// Recon pass 1: full-page screenshots (desktop + mobile) and page structure dump.
import { openTarget } from './pw.mjs';
import fs from 'node:fs';

const REF = 'docs/design-references';
fs.mkdirSync(REF, { recursive: true });

// ---- Desktop full-page ----
{
  const { browser, page } = await openTarget(1440, 900);
  // Scroll through page first to trigger lazy-loaded content
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let y = 0;
      const step = () => {
        y += 600;
        window.scrollTo(0, y);
        if (y < document.body.scrollHeight) setTimeout(step, 120);
        else resolve();
      };
      step();
    });
  });
  await page.waitForTimeout(1500);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(800);
  await page.screenshot({ path: `${REF}/desktop-1440-full.png`, fullPage: true });

  const structure = await page.evaluate(() => {
    const body = document.body;
    function summarize(el, depth) {
      if (depth > 3) return null;
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      return {
        tag: el.tagName.toLowerCase(),
        id: el.id || undefined,
        classes: (el.className?.toString() || '').split(' ').slice(0, 6).join(' ') || undefined,
        pos: cs.position !== 'static' ? cs.position : undefined,
        rect: { top: Math.round(r.top + window.scrollY), height: Math.round(r.height) },
        text: el.childNodes.length === 1 && el.childNodes[0].nodeType === 3 ? el.textContent.trim().slice(0, 80) : undefined,
        children: [...el.children].map((c) => summarize(c, depth + 1)).filter(Boolean),
      };
    }
    return {
      title: document.title,
      scrollHeight: document.body.scrollHeight,
      bodyClasses: body.className,
      htmlClasses: document.documentElement.className,
      tree: [...body.children].map((c) => summarize(c, 0)).filter(Boolean),
    };
  });
  fs.writeFileSync('docs/research/raw-structure.json', JSON.stringify(structure, null, 2));
  console.log('Desktop done. scrollHeight =', structure.scrollHeight);
  await browser.close();
}

// ---- Mobile full-page ----
{
  const { browser, page } = await openTarget(390, 844);
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let y = 0;
      const step = () => {
        y += 500;
        window.scrollTo(0, y);
        if (y < document.body.scrollHeight) setTimeout(step, 120);
        else resolve();
      };
      step();
    });
  });
  await page.waitForTimeout(1500);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(800);
  await page.screenshot({ path: `${REF}/mobile-390-full.png`, fullPage: true });
  console.log('Mobile done. scrollHeight =', await page.evaluate(() => document.body.scrollHeight));
  await browser.close();
}
