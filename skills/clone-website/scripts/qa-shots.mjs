// QA: screenshot the clone for side-by-side comparison with the original.
import { chromium } from '/home/zrh/.npm/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs';
import fs from 'node:fs';

const REF = 'docs/design-references/clone';
fs.mkdirSync(REF, { recursive: true });

const browser = await chromium.launch({ executablePath: '/usr/bin/chromium-browser', args: ['--no-sandbox'] });

for (const [label, width, height] of [['desktop-1440', 1440, 900], ['mobile-390', 390, 844]]) {
  const page = await browser.newPage({ viewport: { width, height } });
  await page.goto('http://localhost:3100/', { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(2000);
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let y = 0;
      const step = () => { y += 600; window.scrollTo(0, y);
        if (y < document.body.scrollHeight) setTimeout(step, 100); else resolve(); };
      step();
    });
  });
  await page.waitForTimeout(800);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${REF}/${label}-full.png`, fullPage: true });

  if (label === 'desktop-1440') {
    // Pricing annual toggle state
    await page.locator('#pricing').scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    const buttons = page.locator('#pricing [role="group"] button');
    await buttons.nth(1).click();
    await page.waitForTimeout(300);
    await page.locator('#pricing').screenshot({ path: `${REF}/pricing-annual.png` });
    await buttons.nth(0).click();
    // Counter liveness check
    const v1 = await page.locator('text=/METERING.*EVENTS/').first().textContent();
    await page.waitForTimeout(2500);
    const v2 = await page.locator('text=/METERING.*EVENTS/').first().textContent();
    console.log('counter t0:', v1, '| t+2.5s:', v2, '| ticking:', v1 !== v2);
  }
  await page.close();
}
await browser.close();
console.log('QA screenshots done');
