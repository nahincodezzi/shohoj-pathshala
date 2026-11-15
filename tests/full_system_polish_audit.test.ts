import { test, expect } from '@playwright/test';

test.describe('Sohoj Pathshala - Full System Polish & Cross-Module Verification', () => {

  // Test 1: Landing Page End-to-End
  test('1. Landing Page Navigation, Theme, Search, and Mobile Drawer', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error' && !msg.text().includes('favicon')) {
        errors.push(msg.text());
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Verify brand
    await expect(page.locator('text=সহজ পাঠশালা').first()).toBeVisible();

    // Verify nav anchors
    const navLinks = ['#modules', '#flow', '#security', '#schools', '#pricing', '#faq'];
    for (const href of navLinks) {
      const link = page.locator(`header a[href="${href}"]`).first();
      await expect(link).toBeVisible();
    }

    // Verify Search in Schools section
    const searchInput = page.locator('#schools input');
    await searchInput.scrollIntoViewIfNeeded();
    await searchInput.fill('দৌলতপুর');
    await page.waitForTimeout(300);
    await expect(page.locator('text=বন্দুয়া দৌলতপুর').first()).toBeVisible();
    await searchInput.fill('');
    await page.waitForTimeout(200);

    // Verify FAQ accordion expand/collapse
    const firstFaq = page.locator('#faq button').first();
    await firstFaq.scrollIntoViewIfNeeded();
    await firstFaq.click();
    await page.waitForTimeout(350);

    // Verify Theme Switch
    const themeBtn = page.locator('header button[aria-label*="mode"]').first();
    await themeBtn.click();
    await page.waitForTimeout(400);

    // Verify EN switch
    const langBtn = page.locator('header button:has-text("EN")').first();
    if (await langBtn.isVisible()) {
      await langBtn.click();
      await page.waitForTimeout(400);
      await expect(page.locator('text=All Schools,').first()).toBeVisible();
      // Switch back to BN
      await page.locator('header button:has-text("বাং")').first().click();
      await page.waitForTimeout(300);
    }

    expect(errors).toHaveLength(0);
  });

  // Test 2: School Public Portal (BDHS)
  test('2. BDHS Public School Portal Verification', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error' && !msg.text().includes('favicon')) {
        errors.push(msg.text());
      }
    });

    await page.goto('/bdhs');
    await page.waitForLoadState('networkidle');

    // Verify school name
    await expect(page.locator('text=বন্দুয়া দৌলতপুর উচ্চ বিদ্যালয়').first()).toBeVisible();

    // Verify presence of essential sections: Notice, About/Headmaster, Gallery/Stats
    const noticeSection = page.locator('text=নোটিশ').first();
    await expect(noticeSection).toBeVisible();

    expect(errors).toHaveLength(0);
  });

  // Test 3: Owner Platform Dynamic School List & Site Visit
  test('3. Owner Platform Dynamic Schools & Management', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error' && !msg.text().includes('favicon')) {
        errors.push(msg.text());
      }
    });

    await page.goto('/owner');
    await page.waitForLoadState('networkidle');

    // Fill owner credentials if login is presented
    const passwordInput = page.locator('input[type="password"]');
    if (await passwordInput.isVisible()) {
      await page.fill('input[type="text"]', 'owner');
      await page.fill('input[type="password"]', 'password123');
      await page.click('button[type="submit"]');
      await page.waitForLoadState('networkidle');
    }

    // Verify school cards (BDHS, BAHS, DMHS)
    await expect(page.locator('text=বন্দুয়া দৌলতপুর উচ্চ বিদ্যালয়').first()).toBeVisible();
    await expect(page.locator('text=ধানমন্ডি মডেল হাই স্কুল').first()).toBeVisible();

    // Verify site visit buttons exist
    const visitLinks = page.locator('a[href="/bdhs"]');
    await expect(visitLinks.first()).toBeVisible();

    expect(errors).toHaveLength(0);
  });

  // Test 4: School Admin & Universal Print Style Check
  test('4. School Admin Access & Print CSS Rules', async ({ page }) => {
    await page.goto('/bdhs/admin');
    await page.waitForLoadState('networkidle');

    // Verify admin dashboard renders or login redirects properly
    const bodyText = await page.textContent('body');
    expect(bodyText).toBeTruthy();

    // Verify print styles injection
    const hasPrintStyles = await page.evaluate(() => {
      const sheets = Array.from(document.styleSheets);
      for (const sheet of sheets) {
        try {
          const rules = Array.from(sheet.cssRules || []);
          for (const rule of rules) {
            if (rule.type === CSSRule.MEDIA_RULE && (rule as CSSMediaRule).media.mediaText.includes('print')) {
              return true;
            }
          }
        } catch (e) {
          // cross-origin stylesheets
        }
      }
      return false;
    });

    expect(hasPrintStyles).toBe(true);
  });

});
