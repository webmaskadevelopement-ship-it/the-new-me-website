// Recon pass 3: per-section screenshots (desktop + mobile + stateful variants).
import { openTarget } from './pw.mjs';
import fs from 'node:fs';

const REF = 'docs/design-references';
fs.mkdirSync(REF, { recursive: true });

const SECTIONS = [
  ['nav', 'nav.nav'],
  ['hero', 'section.hero'],
  ['logos', 'section.logos'],
  ['workbench', 'section.workbench'],
  ['stats', 'section.stats'],
  ['features', 'section.features'],
  ['pricing', 'section.pricing'],
  ['testimonial', 'section.testimonial'],
  ['cta', 'section.cta'],
  ['footer', 'footer.footer'],
];

// Desktop
{
  const { browser, page } = await openTarget(1440, 900);
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let y = 0;
      const step = () => { y += 600; window.scrollTo(0, y);
        if (y < document.body.scrollHeight) setTimeout(step, 100); else resolve(); };
      step();
    });
  });
  await page.waitForTimeout(800);
  for (const [name, sel] of SECTIONS) {
    const el = page.locator(sel);
    await el.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await el.screenshot({ path: `${REF}/section-${name}-desktop.png` });
  }
  // Pricing annual state
  await page.locator('.pricing__toggle button[data-period="annual"]').click();
  await page.waitForTimeout(300);
  await page.locator('section.pricing').screenshot({ path: `${REF}/section-pricing-annual-desktop.png` });
  // Feature hover state
  await page.locator('.feature').first().hover();
  await page.waitForTimeout(400);
  await page.locator('section.features').screenshot({ path: `${REF}/section-features-hover-desktop.png` });
  console.log('desktop sections done');
  await browser.close();
}

// Mobile
{
  const { browser, page } = await openTarget(390, 844);
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let y = 0;
      const step = () => { y += 500; window.scrollTo(0, y);
        if (y < document.body.scrollHeight) setTimeout(step, 100); else resolve(); };
      step();
    });
  });
  await page.waitForTimeout(800);
  for (const [name, sel] of ['hero', 'workbench', 'pricing', 'cta', 'footer'].map((n) => [n, SECTIONS.find(([s]) => s === n)[1]])) {
    const el = page.locator(sel);
    await el.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await el.screenshot({ path: `${REF}/section-${name}-mobile.png` });
  }
  console.log('mobile sections done');
  await browser.close();
}
