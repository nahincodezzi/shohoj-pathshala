import puppeteer from 'puppeteer-core';
import path from 'path';
import fs from 'fs';

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const OUTPUT_PDF_ROOT = path.resolve('FB_POST_GUIDE_BDHS.pdf');
const ARTIFACT_PDF = 'C:\\Users\\Skytech\\.gemini\\antigravity\\brain\\48914a8f-5154-44f2-ad74-8e555830a8f4\\FB_POST_GUIDE_BDHS.pdf';

const fbPostText = `আসসালামু আলাইকুম ও আন্তরিক শুভেচ্ছা সবাইকে! 🌸
শ্রদ্ধেয় বিদ্যালয় পরিচালনা পর্ষদ (কমিটি), সম্মানিত ভারপ্রাপ্ত প্রধান শিক্ষক ও শিক্ষকমণ্ডলী, প্রিয় অভিভাবকবৃন্দ, স্নেহের শিক্ষার্থী ও আমাদের প্রাণের বিদ্যাপীঠের প্রাক্তন সকল ভাই-বোন—

আমাদের ঐতিহ্যবাহী শিক্ষাপ্রতিষ্ঠান "বন্দুয়া দৌলতপুর উচ্চ বিদ্যালয়" (EIIN: ১০৬৬৪৪, প্রতিষ্ঠিত: ১৯৯০)-এর প্রতি গভীর ভালোবাসা এবং বিদ্যালয়কে আধুনিক ও ডিজিটাল যুগের সাথে আরও এক ধাপ এগিয়ে নেওয়ার ছোট্ট একটি স্বপ্ন থেকে আমি সম্পূর্ণ নিজ উদ্যোগে বিদ্যালয়ের জন্য একটি পূর্ণাঙ্গ আধুনিক ওয়েবসাইট ও স্কুল ম্যানেজমেন্ট সফটওয়্যার (ERP + CMS) তৈরি করেছি।

📌 একটি বিনীত কথা:
আমাদের সম্মানিত বিদ্যালয় পরিচালনা পর্ষদ বা কর্তৃপক্ষ এখনো আনুষ্ঠানিকভাবে এই উদ্যোগের কথা জানেন না। এটি আমার পক্ষ থেকে প্রিয় বিদ্যালয়ের জন্য একটি ক্ষুদ্র ভালোবাসার উপহার ও প্রস্তাবনা। আপনাদের সবার কাছে অনুরোধ—নিচের লিংকে গিয়ে ওয়েবসাইটটি ঘুরে দেখুন, সব ফিচার পরীক্ষা করে দেখুন এবং কমেন্টে আপনাদের মূল্যবান মতামত ও পরামর্শ জানান। পরিচালনা পর্ষদ ও প্রধান শিক্ষক মহোদয় যদি এটি উপযুক্ত মনে করেন, তাহলে কোনো বাড়তি ঝামেলা ছাড়াই এটি বিদ্যালয়ের অফিশিয়াল ডিজিটাল প্ল্যাটফর্ম হিসেবে ব্যবহার করা সম্ভব হবে।

🌐 লাইভ ওয়েবসাইট লিংক:
https://bondua-high-school-website.vercel.app/

━━━━━━━━━━━━━━━━━━━━━━
✨ শিক্ষার্থী, অভিভাবক ও সাধারণ সবার জন্য ওয়েবসাইটের চমৎকার সব ফিচার:
━━━━━━━━━━━━━━━━━━━━━━
✅ ডিজিটাল নোটিশ বোর্ড ও লাইভ আপডেট: স্কুল ছুটি, পরীক্ষা বা জরুরি যেকোনো বিজ্ঞপ্তি সবার উপরে স্ক্রলিং টিকারে ও নোটিশ বোর্ডে দেখা যাবে এবং প্রিন্ট/সংরক্ষণ করা যাবে।
✅ অনলাইন ফলাফল ও অফিশিয়াল মার্কশিট: শিক্ষার্থীর শ্রেণি ও রোল নম্বর দিলেই মুহূর্তের মধ্যে বিষয়ভিত্তিক নম্বর, গ্রেড ও GPA সহ প্রিন্টযোগ্য ডিজিটাল মার্কশিট দেখা যাবে। (পরীক্ষা করার জন্য ফলাফল পেজে গিয়ে দশম শ্রেণি ও রোল 101 দিয়ে টেস্ট রেজাল্ট দেখতে পারেন)।
✅ অনলাইন ভর্তি আবেদন: ঘরে বসেই অভিভাবকরা শিক্ষার্থীর ছবি ও প্রয়োজনীয় তথ্যসহ নতুন ভর্তির আবেদন করতে পারবেন।
✅ ক্লাস রুটিন, পরীক্ষার সময়সূচি ও সিলেবাস: ষষ্ঠ থেকে দশম শ্রেণির সাপ্তাহিক ক্লাস রুটিন, পরীক্ষার সূচি ও পাঠ্যসূচি দেখার ও ডাউনলোডের সুবিধা।
✅ নির্ধারিত স্কুল পোশাক (Dress Code) নীতিমালা: ছাত্র ও ছাত্রীদের জন্য নির্ধারিত স্কুল ইউনিফর্মের সুস্পষ্ট দিকনির্দেশনা।
✅ শিক্ষক-কর্মচারী ও পরিচালনা পর্ষদের তালিকা: সম্মানিত সভাপতি মহোদয়ের বাণী, পরিচালনা পর্ষদ, ভারপ্রাপ্ত প্রধান শিক্ষকের বাণী এবং সকল শিক্ষক-কর্মচারীর নাম, পদবি, যোগ্যতা ও যোগাযোগের নম্বর।
✅ স্কুল ফটো ও ভিডিও গ্যালারি + ফেসবুক সংযোগ: বিদ্যালয়ের ক্যাম্পাস, ল্যাব, ক্রীড়া ও সাংস্কৃতিক অনুষ্ঠানের ছবি-ভিডিও গ্যালারি এবং আমাদের এই ফেসবুক গ্রুপের সাথে সরাসরি লিংক।
✅ বাংলা ↔ English এবং ডুয়াল থিম মোড: এক ক্লিকেই পুরো ওয়েবসাইট বাংলা বা ইংরেজিতে দেখা যাবে এবং দুটি প্রিমিয়াম রঙের থিমে পরিবর্তন করা যাবে।
✅ মোবাইল ফ্রেন্ডলি ও সুপার ফাস্ট: কম্পিউটার ছাড়াও যেকোনো সাধারণ স্মার্টফোন থেকে খুব দ্রুত ও সুন্দরভাবে ব্যবহার করা যাবে।

━━━━━━━━━━━━━━━━━━━━━━
💻 বিশেষ আকর্ষণ — কোডিং ছাড়াই অ্যাডমিন ও CMS প্যানেল থেকে যা সবকিছু পরিবর্তন করা যায়:
━━━━━━━━━━━━━━━━━━━━━━
এই ওয়েবসাইট চালানোর জন্য কোনো প্রোগ্রামার বা কোডিং জানার প্রয়োজন নেই! স্কুলের দায়িত্বপ্রাপ্ত শিক্ষক বা অফিস সহকারী মোবাইল বা কম্পিউটার দিয়েই ক্লাউড সিএমএস (CMS) প্যানেল থেকে যেকোনো সময় সব কিছু বদলাতে পারবেন — আর সাথে সাথেই পৃথিবীর যেকোনো প্রান্তের যেকোনো ডিভাইসে তা লাইভ আপডেট হয়ে যাবে:
🔹 স্কুলের মূল লোগো, বাংলা-ইংরেজি নাম, EIIN/MPO কোড, ঠিকানা ও ফোন নম্বর পরিবর্তন।
🔹 হোমপেজের হিরো ব্যানারের ছবি (ফোন/পিসি থেকে আপলোড), লেখা, বাটন ও পরিসংখ্যান (শিক্ষার্থী সংখ্যা, পাসের হার ইত্যাদি) পরিবর্তন।
🔹 সভাপতি মহোদয় ও পরিচালনা পর্ষদের সদস্যদের নাম, ছবি, পদবি ও বাণী সংযোজন বা সম্পাদনা।
🔹 প্রধান শিক্ষক ও সকল শিক্ষক-কর্মচারীর তথ্য, ছবি ও পদবি যোগ বা আপডেট।
🔹 নতুন নোটিশ প্রকাশ, স্বাক্ষরিত নোটিশের ছবি আপলোড ও অফিশিয়াল প্যাডে প্রিন্ট।
🔹 বিজ্ঞান, ব্যবসায় শিক্ষা ও মানবিক বিভাগের বিষয়সমূহ এবং স্কুল ইউনিফর্মের নিয়ম পরিবর্তন।
🔹 মোবাইল বা কম্পিউটার থেকে সরাসরি গ্যালারির ছবি ও ভিডিও আপলোড।
🔹 এক্সেল (Excel) ফাইল থেকে এক ক্লিকে শত শত শিক্ষার্থীর ডেটা আপলোড ও সরাসরি ডিজিটাল স্টুডেন্ট আইডি কার্ড প্রিন্ট।
🔹 পরীক্ষার নম্বর এন্ট্রি করলে স্বয়ংক্রিয়ভাবে GPA ও গ্রেড হিসাব এবং সাথে সাথে অনলাইনে রেজাল্ট পাবলিশ।
🔹 বেতন ও ফি কালেকশন করলে তাৎক্ষণিক ২-কপি (অফিস ও শিক্ষার্থী কপি) ডিজিটাল মানি রসিদ প্রিন্ট।

━━━━━━━━━━━━━━━━━━━━━━
🔐 আপনারা নিজেরা ভেতরের অ্যাডমিন ড্যাশবোর্ড টেস্ট করে দেখুন (ডেমো লগইন তথ্য):
━━━━━━━━━━━━━━━━━━━━━━
(নিরাপত্তা ও মূল সিস্টেম নিয়ন্ত্রণের স্বার্থে সুপার অ্যাডমিন অ্যাক্সেস আলাদাভাবে সংরক্ষিত রেখে, সবার পরীক্ষামূলক ব্যবহারের জন্য নিচের ৪টি স্টাফ অ্যাকাউন্ট উন্মুক্ত রাখা হলো — ওয়েবসাইটের উপরে ডানদিকে "পোর্টাল লগইন" বাটনে ক্লিক করে লগইন করুন):

👤 ১. ভারপ্রাপ্ত প্রধান শিক্ষক (Headmaster — প্রায় সব মডিউল ও CMS কন্ট্রোল):
• ইউজারনেম: headmaster
• পাসওয়ার্ড: headmaster2026

👤 ২. সহকারী প্রধান শিক্ষক (Asst. Headmaster — CMS, ভর্তি, রুটিন, নোটিশ ও রেজাল্ট):
• ইউজারনেম: asst_headmaster
• পাসওয়ার্ড: assthead2026

👤 ৩. সহকারী শিক্ষক (Teacher — পরীক্ষার নম্বর এন্ট্রি ও নোটিশ):
• ইউজারনেম: teacher
• পাসওয়ার্ড: teacher2026

👤 ৪. অফিস সহকারী ও হিসাবরক্ষক (Office Assistant — শিক্ষার্থী ভর্তি, আইডি কার্ড, ফি ও মানি রসিদ):
• ইউজারনেম: office_assistant
• পাসওয়ার্ড: office2026

━━━━━━━━━━━━━━━━━━━━━━
🙏 সবার প্রতি বিনীত অনুরোধ:
একবার অবশ্যই ওয়েবসাইটটি ভিজিট করে দেখবেন এবং পোস্টের সাথে দেওয়া ছবিগুলো দেখবেন। বিদ্যালয়ের ঐতিহ্য ও সুনাম তুলে ধরতে কোনো তথ্য সংশোধন, নতুন কিছু যোগ করা বা পরিবর্তন প্রয়োজন হলে নির্দ্বিধায় কমেন্টে বা ইনবক্সে জানাবেন। আপনাদের উৎসাহ, দোয়া ও পরামর্শ পেলে আমাদের প্রিয় বন্দুয়া দৌলতপুর উচ্চ বিদ্যালয় ডিজিটাল শিক্ষায় আরও অনেক দূর এগিয়ে যাবে ইনশাআল্লাহ! ❤️

— আপনাদেরই প্রিয় বিদ্যালয়ের একজন শুভাকাঙ্ক্ষী ও প্রাক্তন/সংশ্লিষ্ট`;

const htmlContent = `<!DOCTYPE html>
<html lang="bn">
<head>
  <meta charset="UTF-8">
  <title>ফেসবুক গ্রুপ পোস্ট, ফিচার গ্যালারি ও স্টাফ ডেমো গাইড — বন্দুয়া দৌলতপুর উচ্চ বিদ্যালয়</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&family=Noto+Sans+Bengali:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet">
  <style>
    @page { size: A4; margin: 13mm 14mm 15mm 14mm; }
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Hind Siliguri', 'Noto Sans Bengali', sans-serif;
      font-size: 9.5pt;
      line-height: 1.5;
      color: #1e293b;
      background: #ffffff;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .header-banner {
      background: linear-gradient(135deg, #064e3b 0%, #047857 100%);
      color: #ffffff;
      padding: 14px 18px;
      border-radius: 10px;
      margin-bottom: 14px;
    }
    .header-banner h1 { font-size: 14.5pt; font-weight: 800; margin-bottom: 3px; color: #ffffff; }
    .header-banner p { font-size: 9pt; color: #ecfdf5; }
    .pill-row { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 7px; }
    .pill {
      background: rgba(255,255,255,0.16);
      border: 1px solid rgba(255,255,255,0.3);
      padding: 2px 9px;
      border-radius: 99px;
      font-size: 8.2pt;
      font-weight: 600;
      color: #fef08a;
    }
    .section { margin-bottom: 14px; }
    .section-title {
      font-size: 11pt;
      font-weight: 700;
      color: #064e3b;
      border-bottom: 2px solid #a7f3d0;
      padding-bottom: 4px;
      margin-bottom: 8px;
    }
    .post-box {
      background: #f8fafc;
      border: 1.5px solid #cbd5e1;
      border-radius: 8px;
      padding: 12px 14px;
      white-space: pre-wrap;
      font-size: 8.9pt;
      line-height: 1.52;
      color: #0f172a;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 4px;
      font-size: 8.5pt;
    }
    th {
      background: #064e3b;
      color: #ffffff;
      text-align: left;
      padding: 5.5px 8px;
      font-weight: 700;
    }
    td {
      border-bottom: 1px solid #e2e8f0;
      padding: 4.5px 8px;
      vertical-align: top;
    }
    tr:nth-child(even) td { background: #f8fafc; }
    code {
      font-family: 'JetBrains Mono', monospace;
      background: #ecfdf5;
      color: #065f46;
      padding: 1px 5px;
      border-radius: 4px;
      font-size: 8.2pt;
      font-weight: 700;
      white-space: nowrap;
    }
    .note-box {
      background: #fffbeb;
      border: 1px solid #fde68a;
      border-left: 4px solid #d97706;
      border-radius: 6px;
      padding: 8px 11px;
      font-size: 8.8pt;
      color: #78350f;
      margin-top: 8px;
    }
    .page-break { page-break-before: always; }
  </style>
</head>
<body>
  <div class="header-banner">
    <h1>বন্দুয়া দৌলতপুর উচ্চ বিদ্যালয় — ফেসবুক গ্রুপ পোস্ট ও প্রদর্শনী প্যাকেজ</h1>
    <p>স্কুল কমিটি, শিক্ষক, অভিভাবক ও প্রাক্তন শিক্ষার্থীদের জন্য নিজ উদ্যোগে তৈরি ডিজিটাল ওয়েবসাইট ও ইআরপি (CMS + ERP) পরিচিতি</p>
    <div class="pill-row">
      <span class="pill">EIIN: 106644 | MPO: 0905171301</span>
      <span class="pill">লাইভ পোর্টাল: bondua-high-school-website.vercel.app</span>
      <span class="pill">স্ক্রিনশট ফোল্ডার: FB_Post_Screenshots (১৭টি ছবি)</span>
    </div>
  </div>

  <div class="section">
    <div class="section-title">১. ফেসবুক গ্রুপে কপি-পেস্ট করার জন্য প্রস্তুত পোস্ট (সহজ ও বিনীত বাংলায়)</div>
    <div class="post-box">${fbPostText.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
  </div>

  <div class="page-break"></div>

  <div class="section">
    <div class="section-title">২. পরীক্ষামূলক ব্যবহারের জন্য স্টাফ লগইন ক্রেডেনশিয়াল (সুপার অ্যাডমিন ব্যতীত)</div>
    <p style="font-size:9pt; color:#475569; margin-bottom:6px;">
      নিরাপত্তা নীতিমালা অনুযায়ী সুপার অ্যাডমিন অ্যাকাউন্ট সম্পূর্ণ গোপন রাখা হয়েছে। শিক্ষক, কমিটি ও অফিস স্টাফরা নিচের ৪টি রোল দিয়ে পোর্টালের ভেতরের কাজ সরাসরি পরীক্ষা করতে পারবেন:
    </p>
    <table>
      <thead>
        <tr>
          <th style="width:22%;">পদবী / রোল</th>
          <th style="width:20%;">ইউজারনেম</th>
          <th style="width:18%;">পাসওয়ার্ড</th>
          <th style="width:40%;">প্রবেশাধিকার ও সিএমএস সুবিধা</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>ভারপ্রাপ্ত প্রধান শিক্ষক</strong><br/>(Headmaster)</td>
          <td><code>headmaster</code></td>
          <td><code>headmaster2026</code></td>
          <td>CMS ব্যানার/লোগো/সেটিংস, পরিচালনা পর্ষদ, শিক্ষক তালিকা, শিক্ষার্থী, ভর্তি, রেজাল্ট, নোটিশ এবং ফি হিসাব সবকিছু নিয়ন্ত্রণ ও অনুমোদন।</td>
        </tr>
        <tr>
          <td><strong>সহকারী প্রধান শিক্ষক</strong><br/>(Asst. Headmaster)</td>
          <td><code>asst_headmaster</code></td>
          <td><code>assthead2026</code></td>
          <td>CMS কন্টেন্ট, পরিচালনা পর্ষদ, শিক্ষার্থী ব্যবস্থাপনা, ভর্তি যাচাই, ফলাফল ও নোটিশ বোর্ড পরিচালনা।</td>
        </tr>
        <tr>
          <td><strong>সহকারী শিক্ষক</strong><br/>(Assistant Teacher)</td>
          <td><code>teacher</code></td>
          <td><code>teacher2026</code></td>
          <td>বিষয়ভিত্তিক পরীক্ষার নম্বর এন্ট্রি (GPA অটো হিসাব) এবং অফিসিয়াল নোটিশ বোর্ড পর্যবেক্ষণ।</td>
        </tr>
        <tr>
          <td><strong>অফিস সহকারী ও হিসাবরক্ষক</strong><br/>(Office Assistant)</td>
          <td><code>office_assistant</code></td>
          <td><code>office2026</code></td>
          <td>নতুন শিক্ষার্থী ভর্তি এন্ট্রি, এক্সেল আপলোড, স্টুডেন্ট আইডি কার্ড প্রিন্ট, নোটিশ ও বেতন-ফি কালেকশন + ২-কপি মানি রসিদ।</td>
        </tr>
      </tbody>
    </table>
    <div class="note-box">
      💡 <strong>ফেসবুক পোস্টে ছবি যুক্ত করার পরামর্শ:</strong> গ্রুপে পোস্ট করার সময় একসাথে সবগুলো ছবি দিলে অনেকেই সব দেখেন না। প্রথমে সেরা <strong>৬–৮টি ছবি</strong> (যেমন: <code>01</code> হোমপেজ, <code>04</code> নোটিশ, <code>06</code> মার্কশিট, <code>11</code> ড্যাশবোর্ড, <code>12</code> সিএমএস, <code>14</code> মানি রসিদ, <code>16</code> আইডি কার্ড, <code>17</code> মোবাইল ভিউ) পোস্টের সাথে দিন এবং বাকিগুলো প্রয়োজন হলে কমেন্টে যোগ করতে পারেন।
    </div>
  </div>

  <div class="section">
    <div class="section-title">৩. সংরক্ষিত ১৭টি স্ক্রিনশটের তালিকা (D:\\Bondua school website\\FB_Post_Screenshots)</div>
    <table>
      <thead>
        <tr>
          <th style="width:7%;">ক্রম</th>
          <th style="width:43%;">ফাইলের নাম (.png)</th>
          <th style="width:50%;">কোন ফিচারটি দেখানো হয়েছে</th>
        </tr>
      </thead>
      <tbody>
        <tr><td>০১</td><td><code>01_হোমপেজ_ও_হিরো_ব্যানার.png</code></td><td>মূল ওয়েবসাইট, স্কুল বিল্ডিং ব্যানার, লাইভ পরিসংখ্যান ও ড্রেসকোড পিল</td></tr>
        <tr><td>০২</td><td><code>02_প্রধান_শিক্ষকের_বাণী.png</code></td><td>ভারপ্রাপ্ত প্রধান শিক্ষক মহোদয়ের পরিচিতি ও বাণী সেকশন</td></tr>
        <tr><td>০৩</td><td><code>03_পরিচালনা_পর্ষদ_ও_সভাপতি.png</code></td><td>সভাপতি মহোদয়ের বাণী, লক্ষ্য-রূপকল্প এবং ফুটার ও জরুরি লিংকসমূহ</td></tr>
        <tr><td>০৪</td><td><code>04_ডিজিটাল_নোটিশ_বোর্ড.png</code></td><td>ক্যাটাগরি ফিল্টার ও সার্চ সুবিধাসহ ডিজিটাল নোটিশ বোর্ড</td></tr>
        <tr><td>০৫</td><td><code>05_শিক্ষকমণ্ডলীর_তালিকা.png</code></td><td>সকল শিক্ষক ও কর্মচারীদের ছবিসহ পূর্ণাঙ্গ প্রোফাইল ও ফোন নম্বর</td></tr>
        <tr><td>০৬</td><td><code>06_অনলাইন_ফলাফল_ও_ডিজিটাল_মার্কশিট.png</code></td><td>রোল ও শ্রেণি দিয়ে লাইভ ফলাফল সার্চ এবং GPA ৫.০০ প্রিন্টযোগ্য মার্কশিট</td></tr>
        <tr><td>০৭</td><td><code>07_অনলাইন_ভর্তি_আবেদন.png</code></td><td>ছবি ও অভিভাবকের তথ্যসহ অনলাইন নতুন শিক্ষার্থী ভর্তি আবেদন ফরম</td></tr>
        <tr><td>০৮</td><td><code>08_স্কুল_গ্যালারি_ও_ক্যাম্পাস.png</code></td><td>ক্যাটাগরিভিত্তিক ফটো-ভিডিও গ্যালারি এবং ফেসবুক গ্রুপ সিঙ্ক বার্তা</td></tr>
        <tr><td>০৯</td><td><code>09_ডিজিটাল_ক্লাস_ও_পরীক্ষার_রুটিন.png</code></td><td>সাপ্তাহিক ক্লাস রুটিন টেবিল, পরীক্ষার সময়সূচি ও পাঠ্যসূচি ডাউনলোড</td></tr>
        <tr><td>১০</td><td><code>10_নির্ধারিত_স্কুল_পোশাক_নীতিমালা.png</code></td><td>ছাত্র (সাদা-নীল) ও ছাত্রীদের (লাল-সাদা) নির্ধারিত পোশাক নির্দেশিকা</td></tr>
        <tr><td>১১</td><td><code>11_অ্যাডমিন_ও_শিক্ষক_ড্যাশবোর্ড.png</code></td><td>লগইন পরবর্তী প্রধান শিক্ষক/অ্যাডমিন পোর্টাল ও লাইভ ডাটা ওভারভিউ</td></tr>
        <tr><td>১২</td><td><code>12_সিএমএস_ব্যানার_ও_কনটেন্ট_নিয়ন্ত্রণ.png</code></td><td>কোডিং ছাড়াই ব্যানার ছবি, লেখা, গ্যালারি, পাঠ্যক্রম ও পোশাক নিয়ন্ত্রণ CMS</td></tr>
        <tr><td>১৩</td><td><code>13_প্রতিষ্ঠান_সেটিংস_ও_লোগো_কাস্টমাইজেশন.png</code></td><td>একক লোগো আপলোড, EIIN/MPO ও প্রতিষ্ঠান তথ্য পরিবর্তনের CMS</td></tr>
        <tr><td>১৪</td><td><code>14_ফি_কালেকশন_ও_ডিজিটাল_মানি_রসিদ.png</code></td><td>শিক্ষার্থী ফি গ্রহণ ও ২-কপি কিউআর-সহ ডিজিটাল মানি রসিদ প্রিন্ট</td></tr>
        <tr><td>১৫</td><td><code>15_শিক্ষার্থী_ব্যবস্থাপনা_ও_এক্সেল_আপলোড.png</code></td><td>শ্রেণিভিত্তিক শিক্ষার্থী তালিকা, সার্চ ও এক্সেল বাল্ক আপলোড ফিচার</td></tr>
        <tr><td>১৬</td><td><code>16_ডিজিটাল_শিক্ষার্থী_আইডি_কার্ড.png</code></td><td>ছবি, প্রতিষ্ঠানের লোগো ও প্রধান শিক্ষকের স্বাক্ষরযুক্ত স্টুডেন্ট আইডি কার্ড</td></tr>
        <tr><td>১৭</td><td><code>17_মোবাইল_রেসপনসিভ_ভিউ.png</code></td><td>স্মার্টফোন থেকে দেখা লাইভ মোবাইল ভিউ, নোটিশ টিকার ও মেন্যু</td></tr>
      </tbody>
    </table>
  </div>
</body>
</html>`;

async function generatePdf() {
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setContent(htmlContent, { waitUntil: 'networkidle0', timeout: 60000 });
  await page.evaluateHandle('document.fonts.ready');

  const pdfBuffer = await page.pdf({
    format: 'A4',
    printBackground: true,
    displayHeaderFooter: true,
    headerTemplate: '<div></div>',
    footerTemplate: '<div style="font-size:8pt; width:100%; text-align:center; color:#64748b; font-family:Hind Siliguri,sans-serif;">বন্দুয়া দৌলতপুর উচ্চ বিদ্যালয় — ফেসবুক গ্রুপ পোস্ট ও প্রদর্শনী গাইড | পৃষ্ঠা <span class="pageNumber"></span> / <span class="totalPages"></span></div>',
    margin: { top: '13mm', right: '14mm', bottom: '15mm', left: '14mm' }
  });

  fs.writeFileSync(OUTPUT_PDF_ROOT, pdfBuffer);
  fs.writeFileSync(ARTIFACT_PDF, pdfBuffer);

  await browser.close();
  console.log('Generated FB_POST_GUIDE_BDHS.pdf successfully.');
}

generatePdf().catch(err => {
  console.error('PDF generation failed:', err);
  process.exit(1);
});
