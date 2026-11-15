import { test, expect } from '@playwright/test';

test.describe('Sohoj Pathshala Landing Page Audit & Verification', () => {
  test('Complete visual, functional, i18n, and theme verification', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    // 1. Navigate to Landing Page
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Verify Title & Brand
    await expect(page.locator('text=সহজ পাঠশালা').first()).toBeVisible();

    // Take screenshot of Dark Mode
    await page.screenshot({ path: 'test-results/landing-dark.png', fullPage: true });

    // 2. Check Hero Section
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('text=স্কুল অ্যাডমিন প্যানেল')).toBeVisible();

    // 3. Check Modules Bento Grid
    await expect(page.locator('text=মডিউল').first()).toBeVisible();

    // 4. Check Onboarding Steps
    await expect(page.locator('#flow')).toBeVisible();

    // 5. Check Security Section
    await expect(page.locator('#security')).toBeVisible();
    await expect(page.locator('text=এক স্কুলের ডেটা আরেক স্কুল').first()).toBeVisible();

    // 6. Check Schools Directory & Live Search
    await expect(page.locator('#schools')).toBeVisible();
    const searchInput = page.locator('input[placeholder*="স্কুলের নাম"]');
    await expect(searchInput).toBeVisible();
    await searchInput.fill('ধানমন্ডি');
    await page.waitForTimeout(300);
    await expect(page.locator('text=ধানমন্ডি').first()).toBeVisible();
    await searchInput.fill('');
    await page.waitForTimeout(200);

    // 7. Check Pricing Section
    await expect(page.locator('#pricing')).toBeVisible();
    await expect(page.locator('text=সবচেয়ে জনপ্রিয়').first()).toBeVisible();

    // 8. Check FAQ Accordion Toggle
    await expect(page.locator('#faq')).toBeVisible();
    const firstFaqButton = page.locator('#faq button').first();
    await firstFaqButton.scrollIntoViewIfNeeded();
    await firstFaqButton.click();
    await page.waitForTimeout(400);

    // 9. Check Onboarding Modal
    const ctaBtn = page.locator('button:has-text("অনবোর্ডিং শুরু করুন")').first();
    if (await ctaBtn.isVisible()) {
      await ctaBtn.scrollIntoViewIfNeeded();
      await ctaBtn.click();
      await page.waitForTimeout(400);
      await expect(page.locator('text=নতুন স্কুল অনবোর্ডিং যোগাযোগ').first()).toBeVisible();
      await expect(page.locator('text=০১৮১২-৩৪৫৬৭৮').first()).toBeVisible();
      // Close modal
      await page.locator('button:has-text("বন্ধ করুন")').click();
      await page.waitForTimeout(300);
    }

    // 10. Check Language Switch (BN -> EN)
    const langBtn = page.locator('header button:has-text("EN")').first();
    if (await langBtn.isVisible()) {
      await langBtn.click();
      await page.waitForTimeout(400);
      await expect(page.locator('text=All Schools,').first()).toBeVisible();
      // Switch back to BN
      const bnBtn = page.locator('header button:has-text("বাং")').first();
      await bnBtn.click();
      await page.waitForTimeout(400);
      await expect(page.locator('text=সব স্কুল,').first()).toBeVisible();
    }

    // 11. Check Theme Toggle (Dark -> Light)
    const themeBtn = page.locator('header button[aria-label*="light mode"], header button[aria-label*="dark mode"]').first();
    await themeBtn.click();
    await page.waitForTimeout(500);

    // Take screenshot of Light Mode
    await page.screenshot({ path: 'test-results/landing-light.png', fullPage: true });

    // Verify zero fatal console errors
    console.log('Console Errors found:', consoleErrors);
    expect(consoleErrors.filter(e => !e.includes('favicon'))).toHaveLength(0);
  });
});
