// Shared Playwright launcher for all extraction scripts.
// System chromium is used because the npx-cached Playwright expects a
// different browser build than the one present in ~/.cache/ms-playwright.
import { chromium } from '/home/zrh/.npm/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs';

export const TARGET = 'https://www.usehallmark.com/examples/tally/#';

export async function launch(width = 1440, height = 900) {
  const browser = await chromium.launch({
    executablePath: '/usr/bin/chromium-browser',
    args: ['--no-sandbox'],
  });
  const page = await browser.newPage({ viewport: { width, height } });
  return { browser, page };
}

export async function openTarget(width = 1440, height = 900) {
  const { browser, page } = await launch(width, height);
  await page.goto(TARGET, { waitUntil: 'networkidle', timeout: 60000 });
  // Let fonts/animations settle
  await page.waitForTimeout(2000);
  return { browser, page };
}
