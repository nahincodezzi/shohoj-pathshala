import { chromium } from 'playwright';

async function testDevSeed() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log('Navigating to http://localhost:5173/__dev/seed ...');
  await page.goto('http://localhost:5173/__dev/seed', { waitUntil: 'networkidle' });

  // 1. Verify title and controls
  const title = await page.textContent('h1');
  console.log('Page Title:', title);

  // 2. Click Seed button
  console.log('Clicking "ডেমো ডেটা তৈরি করুন (Seed)" button...');
  await page.click('button:has-text("ডেমো ডেটা তৈরি করুন")');
  await page.waitForTimeout(1000);

  // 3. Verify logs appear
  const logContent = await page.textContent('.overflow-y-auto');
  console.log('Console Log snippet:', logContent.slice(0, 150));

  // 4. Verify LocalStorage stats
  const storageText = await page.textContent('.font-mono.font-bold');
  console.log('Storage gauge:', storageText);

  // 5. Switch to Verification tab
  console.log('Switching to verification tab...');
  await page.click('button:has-text("ভেরিফিকেশন রিপোর্ট")');
  await page.waitForTimeout(500);

  // 6. Capture screenshot
  await page.screenshot({ path: 'C:/Users/Skytech/.gemini/antigravity/brain/d1eb605f-c7ee-47fc-87aa-a81940a56a58/verified-dev-seed.png', fullPage: true });
  console.log('Saved screenshot: verified-dev-seed.png');

  // 7. Verify BDHS public page
  console.log('Navigating to BDHS public page http://localhost:5173/bdhs ...');
  await page.goto('http://localhost:5173/bdhs', { waitUntil: 'networkidle' });
  const bdhsHeading = await page.textContent('h1');
  console.log('BDHS Heading:', bdhsHeading);
  await page.screenshot({ path: 'C:/Users/Skytech/.gemini/antigravity/brain/d1eb605f-c7ee-47fc-87aa-a81940a56a58/verified-bdhs-seeded.png' });

  // 8. Verify BAHS public page
  console.log('Navigating to BAHS public page http://localhost:5173/bahs ...');
  await page.goto('http://localhost:5173/bahs', { waitUntil: 'networkidle' });
  const bahsHeading = await page.textContent('h1');
  console.log('BAHS Heading:', bahsHeading);
  await page.screenshot({ path: 'C:/Users/Skytech/.gemini/antigravity/brain/d1eb605f-c7ee-47fc-87aa-a81940a56a58/verified-bahs-seeded.png' });

  // 9. Verify Shapla Girls public page
  console.log('Navigating to Shapla Girls public page http://localhost:5173/shaplagirls ...');
  await page.goto('http://localhost:5173/shaplagirls', { waitUntil: 'networkidle' });
  const shaplaHeading = await page.textContent('h1');
  console.log('Shapla Girls Heading:', shaplaHeading);
  await page.screenshot({ path: 'C:/Users/Skytech/.gemini/antigravity/brain/d1eb605f-c7ee-47fc-87aa-a81940a56a58/verified-shaplagirls-seeded.png' });

  await browser.close();
  console.log('All browser seed checks passed!');
}

testDevSeed().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
