import { test, expect } from '@playwright/test';

test('Capture buttons in Dark and Light mode to verify high contrast', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');

  // Scroll to schools section
  const schoolsSection = page.locator('#schools');
  await schoolsSection.scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);

  // Take screenshot of schools cards in Dark Mode
  await page.locator('#schools .grid').first().screenshot({ path: 'test-results/cards-dark.png' });
  await page.locator('header').first().screenshot({ path: 'test-results/header-dark.png' });

  // Toggle to Light Mode
  const themeBtn = page.locator('header button[aria-label*="mode"]').first();
  await themeBtn.click();
  await page.waitForTimeout(500);

  // Take screenshot of schools cards in Light Mode
  await page.locator('#schools .grid').first().screenshot({ path: 'test-results/cards-light.png' });
  await page.locator('header').first().screenshot({ path: 'test-results/header-light.png' });

  // Verify button texts
  await expect(page.locator('text=ওয়েবসাইট ভিজিট').first()).toBeVisible();
  await expect(page.locator('text=অ্যাডমিন লগইন').first()).toBeVisible();
});
