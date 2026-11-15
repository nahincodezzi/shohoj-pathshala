import { test, expect } from '@playwright/test';

const BASE = 'http://localhost:5173';

test.describe('Owner Platform — Dynamic School Directory & Live Visit Links', () => {

  test('Owner Panel displays all schools (BDHS, BAHS, DMHS) with direct site visit links', async ({ page }) => {
    // 1. Visit Owner Login
    await page.goto(`${BASE}/owner`);
    await page.waitForLoadState('networkidle');

    // Fill credentials
    await page.fill('input[type="text"]', 'owner');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');

    // Wait for Directory to load
    await page.waitForSelector('text=স্কুলসমূহ', { timeout: 10000 });
    await page.waitForLoadState('networkidle');

    const bodyText = await page.innerText('body');

    // Verify all 3 schools exist in the directory
    expect(bodyText).toContain('বন্দুয়া দৌলতপুর উচ্চ বিদ্যালয়');
    expect(bodyText).toContain('বরুড়া আদর্শ উচ্চ বিদ্যালয়');
    expect(bodyText).toContain('ধানমন্ডি মডেল হাই স্কুল');
    expect(bodyText).toContain('998877');

    // Verify direct site visit link for DMHS exists
    const dmhsSiteLink = page.locator('a[href="/dmhs"]').first();
    await expect(dmhsSiteLink).toBeVisible();

    // Verify direct site visit link for BDHS exists
    const bdhsSiteLink = page.locator('a[href="/bdhs"]').first();
    await expect(bdhsSiteLink).toBeVisible();

    // 2. Add a new school dynamically from Owner Panel
    await page.click('button:has-text("নতুন স্কুল যোগ করুন")');
    await page.locator('[role="dialog"] input').nth(0).fill('মিরপুর বাংলা স্কুল');
    await page.locator('[role="dialog"] input').nth(1).fill('Mirpur Bangla School');
    await page.locator('[role="dialog"] input').nth(2).fill('mbs');
    await page.locator('[role="dialog"] input').nth(3).fill('778899');
    await page.locator('[role="dialog"] input').nth(4).fill('MBS');
    await page.locator('[role="dialog"] input').nth(5).fill('ঢাকা');
    await page.locator('[role="dialog"] button:has-text("স্কুল তৈরি সম্পন্ন করুন")').click();

    // Verify success modal
    await expect(page.locator('button:has-text("সম্পন্ন")')).toBeVisible();
    await page.click('button:has-text("সম্পন্ন")');

    // Verify new school dynamically appears in table without page reload
    const updatedBody = await page.innerText('body');
    expect(updatedBody).toContain('মিরপুর বাংলা স্কুল');
    expect(updatedBody).toContain('mbs');
    expect(updatedBody).toContain('778899');

    // Verify site link for new school is immediately live
    const mbsSiteLink = page.locator('a[href="/mbs"]').first();
    await expect(mbsSiteLink).toBeVisible();
  });

});
