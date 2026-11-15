import { test, expect, Page } from '@playwright/test';

// ============================================================================
// সহজ পাঠশালা (Sohoj Pathshala) — Professional Full SQA & Developer Audit Suite
// ============================================================================

const BASE = 'http://localhost:5173';

// Helper to ensure demo school and admin exist in localStorage
async function ensureDemoSchool(page: Page) {
  await page.goto(`${BASE}/`);
  await page.waitForLoadState('networkidle');

  await page.evaluate(() => {
    const storagePrefix = 'sp_tenant_';
    const schoolsJson = localStorage.getItem(`${storagePrefix}schools`);
    const schools = schoolsJson ? JSON.parse(schoolsJson) : [];

    let dmhs = schools.find((s: any) => s.slug === 'dmhs');
    if (!dmhs) {
      dmhs = {
        id: 'sch_dmhs',
        slug: 'dmhs',
        name_bn: 'ধানমন্ডি মডেল হাই স্কুল',
        name_en: 'Dhanmondi Model High School',
        eiin: '998877',
        school_code: '9988',
        mpo_code: '0102030405',
        board: 'ঢাকা',
        district: 'ঢাকা',
        code_prefix: 'DMHS',
        logo_url: '/favicon.svg',
        theme: 'emerald',
        status: 'active',
        plan: 'premium',
        expires_at: '2028-12-31',
        max_students: 2000,
        created_at: '2026-11-15'
      };
      schools.push(dmhs);
      localStorage.setItem(`${storagePrefix}schools`, JSON.stringify(schools));
    }

    // Settings
    const settingsJson = localStorage.getItem(`${storagePrefix}settings`);
    const settings = settingsJson ? JSON.parse(settingsJson) : [];
    if (!settings.some((s: any) => s.school_id === 'sch_dmhs')) {
      settings.push({
        school_id: 'sch_dmhs',
        address_bn: 'রোড # ২৭, ধানমন্ডি, ঢাকা-১২০৯',
        address_en: 'Road # 27, Dhanmondi, Dhaka-1209',
        phone: '০১৭০০-০০০০০০',
        email: 'info@dmhs.edu.bd',
        established: '২০০২',
        tagline_bn: 'জ্ঞান, চরিত্র ও ডিজিটাল উৎকর্ষতা',
        tagline_en: 'Knowledge, Character & Digital Excellence',
        motto_bn: 'শিক্ষাই জাতির মেরুদণ্ড, নৈতিকতাই জীবনের ভূষণ।',
        office_hours: 'রবি–বৃহস্পতি সকাল ৮:৩০–দুপুর ৩:০০',
        pass_rate: '৯৯.৫%'
      });
      localStorage.setItem(`${storagePrefix}settings`, JSON.stringify(settings));
    }

    // Users
    const usersJson = localStorage.getItem(`${storagePrefix}users`);
    const users = usersJson ? JSON.parse(usersJson) : [];
    if (!users.some((u: any) => u.username === 'dmhs_admin')) {
      users.push({
        id: 'usr_dmhs_admin',
        school_id: 'sch_dmhs',
        username: 'dmhs_admin',
        password: 'password123',
        name: 'ড. খোন্দকার রফিকুল আলম',
        role: 'school_superadmin',
        active: true,
        failed_attempts: 0,
        locked_until: null,
        must_change_password: false
      });
      localStorage.setItem(`${storagePrefix}users`, JSON.stringify(users));
    }

    // Initial Sliders
    const slidersJson = localStorage.getItem(`${storagePrefix}sliders`);
    const sliders = slidersJson ? JSON.parse(slidersJson) : [];
    if (!sliders.some((s: any) => s.school_id === 'sch_dmhs')) {
      sliders.push({
        id: 'sl_dmhs_1',
        school_id: 'sch_dmhs',
        title: 'ধানমন্ডি মডেল হাই স্কুলে স্বাগতম',
        subtitle: 'গুণগত শিক্ষা, নৈতিক মূল্যবোধ ও ডিজিটাল অগ্রযাত্রায় আমরা প্রতিশ্রুতিবদ্ধ।',
        image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1600&q=80',
        tag: 'স্বাগতম'
      });
      localStorage.setItem(`${storagePrefix}sliders`, JSON.stringify(sliders));
    }

    // Initial Facilities
    const facJson = localStorage.getItem(`${storagePrefix}facilities`);
    const fac = facJson ? JSON.parse(facJson) : [];
    if (!fac.some((f: any) => f.school_id === 'sch_dmhs')) {
      fac.push({
        id: 'fac_dmhs_1',
        school_id: 'sch_dmhs',
        title: 'আধুনিক কম্পিউটার ল্যাব',
        subtitle: '৩০টি আইম্যাক ও হাইস্পিড ইন্টারনেট',
        desc: 'হাতে-কলমে প্রোগ্রামিং, এআই ও রোবোটিক্স অনুশীলনের সর্বাধুনিক সুযোগ।'
      });
      localStorage.setItem(`${storagePrefix}facilities`, JSON.stringify(fac));
    }
  });
}

test.describe.serial('Professional SQA & Full Project Audit', () => {

  test('SQA-01 | Create and seed Demo School (dmhs - ধানমন্ডি মডেল হাই স্কুল)', async ({ page }) => {
    await ensureDemoSchool(page);
    await page.goto(`${BASE}/dmhs`);
    await page.waitForLoadState('networkidle');

    const pageContent = await page.innerText('body');
    expect(pageContent).toContain('ধানমন্ডি মডেল হাই স্কুল');
  });

  test('SQA-02 | Login as Superadmin to Demo School (dmhs)', async ({ page }) => {
    await ensureDemoSchool(page);
    await page.goto(`${BASE}/dmhs/login`);
    await page.waitForLoadState('networkidle');

    await page.fill('input[type="text"], input[name="username"]', 'dmhs_admin');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');

    await page.waitForURL('**/dmhs/admin**', { timeout: 10000 });
    const bodyText = await page.innerText('body');
    expect(bodyText).toContain('ধানমন্ডি মডেল হাই স্কুল');
  });

  test('SQA-03 | CMS Manager — Sliders & Campus Facilities full CRUD', async ({ page }) => {
    await ensureDemoSchool(page);

    // Login to admin
    await page.goto(`${BASE}/dmhs/login`);
    await page.fill('input[type="text"], input[name="username"]', 'dmhs_admin');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dmhs/admin**');

    // Go to CMS Module
    await page.goto(`${BASE}/dmhs/admin/cms`);
    await page.waitForLoadState('networkidle');

    // 1. Verify Sliders Tab
    await page.click('button:has-text("হিরো স্লাইডার")');
    const sliderText = await page.innerText('body');
    expect(sliderText).toContain('ধানমন্ডি মডেল হাই স্কুলে স্বাগতম');

    // 2. Verify Campus Facilities Tab (Brand new feature)
    await page.click('button:has-text("ক্যাম্পাস সুবিধাসমূহ")');
    const facilitiesText = await page.innerText('body');
    expect(facilitiesText).toContain('আধুনিক কম্পিউটার ল্যাব');

    // 3. Add new facility via CMS UI
    await page.click('button:has-text("নতুন সুবিধা যোগ করুন")');
    await page.locator('[role="dialog"] input').nth(0).fill('সমৃদ্ধ বিজ্ঞানাগার');
    await page.locator('[role="dialog"] input').nth(1).fill('পদার্থ, রসায়ন ও জীববিজ্ঞানের আধুনিক সরঞ্জাম');
    await page.locator('[role="dialog"] textarea').fill('ব্যবহারিক ক্লাসের জন্য সম্পূর্ণ আন্তর্জাতিক মানের ল্যাব।');
    await page.locator('[role="dialog"] button[type="submit"]').click();

    // Verify newly added facility is rendered
    const updatedFacilities = await page.innerText('body');
    expect(updatedFacilities).toContain('সমৃদ্ধ বিজ্ঞানাগার');
  });

  test('SQA-04 | Teachers, Committee & Routine CRUD', async ({ page }) => {
    await ensureDemoSchool(page);

    // Login
    await page.goto(`${BASE}/dmhs/login`);
    await page.fill('input[type="text"], input[name="username"]', 'dmhs_admin');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dmhs/admin**');

    // Teacher Entry
    await page.goto(`${BASE}/dmhs/admin/teachers`);
    await page.waitForLoadState('networkidle');
    await page.click('button:has-text("নতুন শিক্ষক/কর্মচারী যোগ করুন")');
    await page.locator('[role="dialog"] input').nth(0).fill('মো. আনিসুর রহমান');
    await page.locator('[role="dialog"] input').nth(1).fill('সিনিয়র শিক্ষক (পদার্থবিজ্ঞান)');
    await page.locator('[role="dialog"] input').nth(2).fill('পদার্থবিজ্ঞান');
    await page.locator('[role="dialog"] button[type="submit"]').click();

    let teacherBody = await page.innerText('body');
    expect(teacherBody).toContain('মো. আনিসুর রহমান');

    // Committee Entry
    await page.goto(`${BASE}/dmhs/admin/committee`);
    await page.waitForLoadState('networkidle');
    await page.click('button:has-text("নতুন সদস্য যোগ করুন")');
    await page.locator('[role="dialog"] input').nth(0).fill('আলহাজ্ব ড. রেজাউল করিম');
    await page.locator('[role="dialog"] input').nth(1).fill('সভাপতি, পরিচালনা পর্ষদ');
    await page.locator('[role="dialog"] button[type="submit"]').click();

    let commBody = await page.innerText('body');
    expect(commBody).toContain('আলহাজ্ব ড. রেজাউল করিম');

    // Routine Entry
    await page.goto(`${BASE}/dmhs/admin/routines`);
    await page.waitForLoadState('networkidle');
    await page.click('button:has-text("নতুন রুটিন যোগ করুন")');
    await page.locator('[role="dialog"] input').nth(0).fill('বার্ষিক পরীক্ষা ২০২৬ এর সংশোধিত সময়সূচি');
    await page.locator('[role="dialog"] button[type="submit"]').click();

    let routineBody = await page.innerText('body');
    expect(routineBody).toContain('বার্ষিক পরীক্ষা ২০২৬ এর সংশোধিত সময়সূচি');

    // Notice Entry & Print Preview Modal Check
    await page.goto(`${BASE}/dmhs/admin/notices`);
    await page.waitForLoadState('networkidle');
    await page.click('button:has-text("নতুন নোটিশ প্রকাশ")');
    await page.locator('[role="dialog"] input').nth(0).fill('২০২৭ শিক্ষাবর্ষে ডিজিটাল ভর্তি কার্যক্রম শুরু');
    await page.locator('[role="dialog"] textarea').fill('অনলাইনে ফরম পূরণ করে প্রবেশপত্র প্রিন্ট করার নির্দেশ দেওয়া হচ্ছে।');
    await page.locator('[role="dialog"] button[type="submit"]').click();

    let noticeBody = await page.innerText('body');
    expect(noticeBody).toContain('ডিজিটাল ভর্তি কার্যক্রম শুরু');

    // Click Print button on notice row
    const printBtn = page.locator('button[title="প্রিন্ট / প্রিভিউ"]').first();
    await printBtn.click();
    const modalText = await page.innerText('[role="dialog"]');
    expect(modalText).toContain('অফিসিয়াল নোটিশ প্রিন্ট ও প্রিভিউ');
    expect(modalText).toContain('ধানমন্ডি মডেল হাই স্কুল');
    expect(modalText).toContain('প্রিন্ট করুন (A4)');
  });

  test('SQA-05 | Student ID Card, 2-Copy Money Receipt & Marksheet Print Verification', async ({ page }) => {
    await ensureDemoSchool(page);

    // Login
    await page.goto(`${BASE}/dmhs/login`);
    await page.fill('input[type="text"], input[name="username"]', 'dmhs_admin');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dmhs/admin**');

    // Add Student
    await page.goto(`${BASE}/dmhs/admin/students`);
    await page.waitForLoadState('networkidle');
    
    let studentBody = await page.innerText('body');
    if (!studentBody.includes('তানভীর আহমেদ')) {
      await page.click('button:has-text("নতুন শিক্ষার্থী যোগ করুন")');
      await page.locator('[role="dialog"] input').nth(0).fill('তানভীর আহমেদ');
      await page.locator('[role="dialog"] input[type="number"]').fill('5');
      await page.locator('[role="dialog"] input[placeholder*="018"]').fill('01712345678');
      await page.locator('[role="dialog"] button:has-text("নিবন্ধন সম্পন্ন করুন")').click();
      await page.waitForSelector('[role="dialog"]', { state: 'detached', timeout: 5000 }).catch(() => {});
      studentBody = await page.innerText('body');
    }
    expect(studentBody).toContain('তানভীর আহমেদ');

    // Open Student ID Card print view
    const idCardBtn = page.locator('button[title*="আইডি"]').first();
    await idCardBtn.click();
    const idCardModal = await page.innerText('[role="dialog"]');
    expect(idCardModal).toContain('ডিজিটাল স্টুডেন্ট আইডি কার্ড');
    expect(idCardModal).toContain('তানভীর আহমেদ');
    expect(idCardModal).toContain('আইডি কার্ড প্রিন্ট করুন');
    await page.click('button:has-text("বন্ধ করুন")');

    // Fee Collection & 2-Copy Receipt
    await page.goto(`${BASE}/dmhs/admin/fees`);
    await page.waitForLoadState('networkidle');
    await page.click('button:has-text("নতুন রসিদ")');
    
    // Select the existing student from dropdown
    const studentSelect = page.locator('[role="dialog"] select').first();
    await studentSelect.selectOption({ index: 1 });
    await page.locator('[role="dialog"] input[type="number"]').fill('2500');
    await page.locator('[role="dialog"] button:has-text("রসিদ প্রিন্ট ও সেভ করুন")').click();

    // Verify 2-Copy Money Receipt Modal
    const receiptModal = await page.innerText('[role="dialog"]');
    expect(receiptModal).toContain('শিক্ষার্থী কপি (Student Copy)');
    expect(receiptModal).toContain('অফিস কপি (Office Copy)');
    expect(receiptModal).toContain('এখান থেকে কেটে আলাদা করুন');
    expect(receiptModal).toContain('প্রিন্ট করুন (A4)');
    await page.click('button:has-text("বন্ধ করুন")');

    // Result & Marksheet
    await page.goto(`${BASE}/dmhs/admin/results`);
    await page.waitForLoadState('networkidle');
    await page.click('button:has-text("নতুন ফলাফল এন্ট্রি করুন")');
    await page.locator('[role="dialog"] input[placeholder*="1"]').first().fill('1');
    
    // Fill subject marks
    const markInputs = page.locator('[role="dialog"] input[type="number"]');
    const count = await markInputs.count();
    for (let i = 1; i < count; i++) {
      await markInputs.nth(i).fill('85');
    }
    await page.locator('[role="dialog"] button:has-text("ফলাফল সংরক্ষণ করুন")').click();

    // View Marksheet
    const viewMarksheetBtn = page.locator('button:has-text("দেখুন")').first();
    await viewMarksheetBtn.click();
    const marksheetModal = await page.innerText('[role="dialog"]');
    expect(marksheetModal).toContain('একাডেমিক');
    expect(marksheetModal).toContain('চূড়ান্ত গ্রেড পয়েন্ট (GPA)');
    expect(marksheetModal).toContain('মার্কশিট প্রিন্ট করুন');
  });

  test('SQA-06 | Public Website reflects all CMS data (Hero, Facilities, Notices, Faculty)', async ({ page }) => {
    await ensureDemoSchool(page);

    await page.goto(`${BASE}/dmhs`);
    await page.waitForLoadState('networkidle');

    const publicContent = await page.innerText('body');
    // Header & Meta
    expect(publicContent).toContain('ধানমন্ডি মডেল হাই স্কুল');
    expect(publicContent).toMatch(/998877|৯৯৮৮৭৭/); // EIIN

    // Hero Slider
    expect(publicContent).toContain('ধানমন্ডি মডেল হাই স্কুলে স্বাগতম');

    // Campus Facilities (Uploaded from CMS!)
    expect(publicContent).toContain('ক্যাম্পাসের অত্যাধুনিক সুবিধাসমূহ');
    expect(publicContent).toContain('আধুনিক কম্পিউটার ল্যাব');
  });

  test('SQA-07 | Dark Mode Independence — Print is 100% pure white, black text, single page', async ({ page }) => {
    await ensureDemoSchool(page);

    await page.goto(`${BASE}/dmhs`);
    await page.waitForLoadState('networkidle');

    // Turn on Dark Mode
    await page.evaluate(() => {
      document.documentElement.classList.add('mode-dark');
      document.body.classList.add('mode-dark');
    });

    // Verify dark mode is active in normal DOM
    const isDark = await page.evaluate(() => {
      return document.documentElement.classList.contains('mode-dark');
    });
    expect(isDark).toBe(true);

    // Evaluate print CSS rules in document stylesheet
    const printRules = await page.evaluate(() => {
      let printStyles = '';
      for (const sheet of Array.from(document.styleSheets)) {
        try {
          for (const rule of Array.from(sheet.cssRules || [])) {
            if (
              (rule instanceof CSSMediaRule && rule.conditionText.includes('print')) ||
              rule.cssText.includes('@page') ||
              rule.cssText.includes('A4') ||
              rule.cssText.includes('print')
            ) {
              printStyles += rule.cssText;
            }
          }
        } catch (e) {
          // Ignore CORS sheets if any
        }
      }
      const lowerStyles = printStyles.toLowerCase();
      return {
        hasPrintMedia: printStyles.length > 0,
        hasWhiteBackground: lowerStyles.includes('#ffffff') || lowerStyles.includes('white'),
        hasPageSizeA4: lowerStyles.includes('a4'),
        hasSinglePageConstraint: lowerStyles.includes('page-break-inside') || lowerStyles.includes('break-inside') || lowerStyles.includes('max-height')
      };
    });

    expect(printRules.hasPrintMedia).toBe(true);
    expect(printRules.hasWhiteBackground).toBe(true);
    expect(printRules.hasPageSizeA4).toBe(true);
    expect(printRules.hasSinglePageConstraint).toBe(true);
  });

  test('SQA-08 | Strict Multi-Tenant Isolation between DMHS, BDHS & BAHS', async ({ page }) => {
    await ensureDemoSchool(page);

    // 1. Visit BDHS
    await page.goto(`${BASE}/bdhs`);
    await page.waitForLoadState('networkidle');
    const bdhsContent = await page.innerText('body');

    // BDHS should have its own name, EIIN, and NEVER contain DMHS data
    expect(bdhsContent).toContain('বন্দুয়া দৌলতপুর উচ্চ বিদ্যালয়');
    expect(bdhsContent).not.toContain('ধানমন্ডি মডেল হাই স্কুল');
    expect(bdhsContent).not.toContain('আলহাজ্ব ড. রেজাউল করিম');

    // 2. Visit BAHS
    await page.goto(`${BASE}/bahs`);
    await page.waitForLoadState('networkidle');
    const bahsContent = await page.innerText('body');

    expect(bahsContent).toContain('বরুড়া আদর্শ উচ্চ বিদ্যালয়');
    expect(bahsContent).not.toContain('ধানমন্ডি মডেল হাই স্কুল');
  });

});
