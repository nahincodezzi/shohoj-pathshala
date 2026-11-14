import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const OUTPUT_DIR = path.resolve('FB_Post_Screenshots');
const BASE_URL = 'https://bondua-high-school-website.vercel.app';

async function waitForImages(page) {
  await page.evaluate(async () => {
    const imgs = Array.from(document.querySelectorAll('img'));
    await Promise.all(
      imgs.map(img => {
        if (img.complete) return Promise.resolve();
        return new Promise(res => {
          img.addEventListener('load', res, { once: true });
          img.addEventListener('error', res, { once: true });
          setTimeout(res, 4000);
        });
      })
    );
  });
}

async function run() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  } else {
    // Remove stale PNG files before fresh capture
    for (const f of fs.readdirSync(OUTPUT_DIR)) {
      if (f.endsWith('.png')) {
        fs.unlinkSync(path.join(OUTPUT_DIR, f));
      }
    }
  }

  console.log('Launching Edge browser...');
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,900']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1.5 });

  // 1. Homepage Hero Banner
  console.log('1. Opening live homepage...');
  await page.goto(`${BASE_URL}/#home`, { waitUntil: 'networkidle2', timeout: 60000 });
  await new Promise(r => setTimeout(r, 3500));
  await waitForImages(page);
  await page.screenshot({ path: path.join(OUTPUT_DIR, '01_হোমপেজ_ও_হিরো_ব্যানার.png') });

  // 2. Headmaster Message on Homepage
  console.log('2. Capturing Headmaster Message...');
  await page.evaluate(() => {
    const sections = Array.from(document.querySelectorAll('section'));
    const hm = sections.find(s => s.innerText.includes('প্রধান শিক্ষক') || s.innerText.includes('বাণী'));
    if (hm) hm.scrollIntoView({ behavior: 'instant', block: 'center' });
    else window.scrollTo(0, 820);
  });
  await new Promise(r => setTimeout(r, 1200));
  await waitForImages(page);
  await page.screenshot({ path: path.join(OUTPUT_DIR, '02_প্রধান_শিক্ষকের_বাণী.png') });

  // 3. About Page — President Card & Managing Committee
  console.log('3. Capturing President & Managing Committee...');
  await page.evaluate(() => { window.location.hash = '#about'; });
  await new Promise(r => setTimeout(r, 1500));
  await page.evaluate(() => {
    // Only match .glass-card (never outer section), so President card scrolls accurately
    const cards = Array.from(document.querySelectorAll('.glass-card'));
    const pres = cards.find(c => c.innerText.includes('সভাপতির বাণী'));
    if (pres) {
      pres.scrollIntoView({ behavior: 'instant', block: 'start' });
      window.scrollBy(0, -110);
    }
  });
  await new Promise(r => setTimeout(r, 900));
  await waitForImages(page);
  await page.screenshot({ path: path.join(OUTPUT_DIR, '03_পরিচালনা_পর্ষদ_ও_সভাপতি.png') });

  // 4. Digital Notice Board
  console.log('4. Capturing Notice Board...');
  await page.evaluate(() => { window.location.hash = '#notices'; window.scrollTo(0, 0); });
  await new Promise(r => setTimeout(r, 1500));
  await waitForImages(page);
  await page.screenshot({ path: path.join(OUTPUT_DIR, '04_ডিজিটাল_নোটিশ_বোর্ড.png') });

  // 5. Faculty & Staff Directory
  console.log('5. Capturing Faculty Directory...');
  await page.evaluate(() => { window.location.hash = '#faculty'; window.scrollTo(0, 0); });
  await new Promise(r => setTimeout(r, 1500));
  await waitForImages(page);
  await page.screenshot({ path: path.join(OUTPUT_DIR, '05_শিক্ষকমণ্ডলীর_তালিকা.png') });

  // 6. Online Result Search & Printable Digital Marksheet
  console.log('6. Capturing Online Result & Digital Marksheet...');
  await page.evaluate(() => { window.location.hash = '#results'; window.scrollTo(0, 0); });
  await new Promise(r => setTimeout(r, 1500));
  await page.type('#roll-input', '101');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button[type="submit"]'));
    const searchBtn = btns.find(b => b.innerText.includes('ফলাফল') || b.innerText.includes('খুঁজুন') || b.innerText.includes('Search'));
    searchBtn?.click();
  });
  await new Promise(r => setTimeout(r, 1200));
  await page.evaluate(() => {
    const sheet = document.querySelector('#printable-marksheet') || document.querySelector('.marksheet-container');
    if (sheet) sheet.scrollIntoView({ behavior: 'instant', block: 'start' });
    else window.scrollTo(0, 320);
  });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(OUTPUT_DIR, '06_অনলাইন_ফলাফল_ও_ডিজিটাল_মার্কশিট.png') });

  // 7. Online Admission Form
  console.log('7. Capturing Online Admission...');
  await page.evaluate(() => { window.location.hash = '#admission'; window.scrollTo(0, 0); });
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: path.join(OUTPUT_DIR, '07_অনলাইন_ভর্তি_আবেদন.png') });

  // 8. Photo & Video Gallery + Facebook Sync
  console.log('8. Capturing Photo Gallery...');
  await page.evaluate(() => { window.location.hash = '#gallery'; window.scrollTo(0, 0); });
  await new Promise(r => setTimeout(r, 1500));
  await waitForImages(page);
  await page.screenshot({ path: path.join(OUTPUT_DIR, '08_স্কুল_গ্যালারি_ও_ক্যাম্পাস.png') });

  // 9. Class & Exam Routines
  console.log('9. Capturing Routines...');
  await page.evaluate(() => { window.location.hash = '#routines'; window.scrollTo(0, 0); });
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: path.join(OUTPUT_DIR, '09_ডিজিটাল_ক্লাস_ও_পরীক্ষার_রুটিন.png') });

  // 10. Official School Uniform Policy
  console.log('10. Capturing Uniform & Dress Code...');
  await page.evaluate(() => { window.location.hash = '#uniform'; window.scrollTo(0, 0); });
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: path.join(OUTPUT_DIR, '10_নির্ধারিত_স্কুল_পোশাক_নীতিমালা.png') });

  // 11. Login as Headmaster & Capture Admin Overview
  console.log('11. Logging into Admin Portal as headmaster...');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const loginBtn = buttons.find(b => b.innerText.includes('পোর্টাল লগইন') || b.innerText.includes('Portal Login'));
    loginBtn?.click();
  });
  await new Promise(r => setTimeout(r, 800));
  await page.type('#auth-username', 'headmaster', { delay: 30 });
  await page.type('#auth-password', 'headmaster2026', { delay: 30 });
  await page.click('form button[type="submit"]');
  await new Promise(r => setTimeout(r, 2500));
  await waitForImages(page);
  await page.screenshot({ path: path.join(OUTPUT_DIR, '11_অ্যাডমিন_ও_শিক্ষক_ড্যাশবোর্ড.png') });

  // 12. CMS Hero Slides & Content Editor
  console.log('12. Capturing CMS Hero Slides & Content Control...');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('aside button, nav button'));
    const cmsBtn = buttons.find(b => b.innerText.includes('কনটেন্ট ও গ্যালারি') || b.innerText.includes('CMS'));
    cmsBtn?.click();
  });
  await new Promise(r => setTimeout(r, 1200));
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const slidesTab = buttons.find(b => b.innerText.includes('ব্যানার স্লাইডার') || b.innerText.includes('হোমপেজ'));
    slidesTab?.click();
  });
  await new Promise(r => setTimeout(r, 1200));
  await waitForImages(page);
  await page.screenshot({ path: path.join(OUTPUT_DIR, '12_সিএমএস_ব্যানার_ও_কনটেন্ট_নিয়ন্ত্রণ.png') });

  // 13. Institutional Settings & Logo / President / Headmaster Customization
  console.log('13. Capturing School Settings & Identity CMS...');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('aside button, nav button'));
    const settingsBtn = buttons.find(b => b.innerText.includes('প্রতিষ্ঠান সেটিংস'));
    settingsBtn?.click();
  });
  await new Promise(r => setTimeout(r, 1200));
  await waitForImages(page);
  await page.screenshot({ path: path.join(OUTPUT_DIR, '13_প্রতিষ্ঠান_সেটিংস_ও_লোগো_কাস্টমাইজেশন.png') });

  // 14. Fee Collection & Digital Money Receipt
  console.log('14. Capturing Fee Collection & Money Receipt...');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('aside button, nav button'));
    const feeBtn = buttons.find(b => b.innerText.includes('ফি ও হিসাব'));
    feeBtn?.click();
  });
  await new Promise(r => setTimeout(r, 1200));
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const receiptBtn = btns.find(b => b.innerText.trim() === 'রশিদ');
    receiptBtn?.click();
  });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(OUTPUT_DIR, '14_ফি_কালেকশন_ও_ডিজিটাল_মানি_রসিদ.png') });

  // Close receipt modal
  await page.evaluate(() => {
    const closeBtn = document.querySelector('[aria-label="Close"]');
    closeBtn?.click();
  });
  await new Promise(r => setTimeout(r, 500));

  // 15. Student Directory & Excel Bulk Upload
  console.log('15. Capturing Student Directory...');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('aside button, nav button'));
    const stuBtn = buttons.find(b => b.innerText.includes('শিক্ষার্থী ব্যবস্থাপনা'));
    stuBtn?.click();
  });
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(OUTPUT_DIR, '15_শিক্ষার্থী_ব্যবস্থাপনা_ও_এক্সেল_আপলোড.png') });

  // 16. Digital Student ID Card Modal (use female student so fallback photo matches naturally)
  console.log('16. Capturing Digital Student ID Card...');
  await page.evaluate(() => {
    const rows = Array.from(document.querySelectorAll('tbody tr'));
    const targetRow = rows.find(r => r.innerText.includes('ফাতেমা')) || rows[0];
    const idBtn = targetRow ? Array.from(targetRow.querySelectorAll('button')).find(b => b.innerText.includes('আইডি কার্ড')) : null;
    idBtn?.click();
  });
  await new Promise(r => setTimeout(r, 1000));
  await waitForImages(page);
  await page.screenshot({ path: path.join(OUTPUT_DIR, '16_ডিজিটাল_শিক্ষার্থী_আইডি_কার্ড.png') });

  // 17. Mobile Responsive View
  console.log('17. Capturing Mobile Responsive View...');
  await page.evaluate(() => {
    localStorage.removeItem('bdhs_auth');
  });
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true });
  await page.goto(`${BASE_URL}/#home`, { waitUntil: 'networkidle2', timeout: 60000 });
  await new Promise(r => setTimeout(r, 2500));
  await waitForImages(page);
  await page.screenshot({ path: path.join(OUTPUT_DIR, '17_মোবাইল_রেসপনসিভ_ভিউ.png') });

  await browser.close();
  console.log('All 17 high-resolution screenshots captured in:', OUTPUT_DIR);
}

run().catch(err => {
  console.error('Screenshot capture failed:', err);
  process.exit(1);
});
