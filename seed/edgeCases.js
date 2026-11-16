/**
 * Sohoj Pathshala — Edge Cases Catalog (E01 – E40)
 * Generates realistic edge cases and stress test scenarios for automated & manual QA.
 */

export const EDGE_CASES = [
  {
    id: 'E01',
    title: '৬০+ অক্ষরের দীর্ঘ বাংলা নাম ও যুক্তাক্ষর',
    module: 'students',
    school_slug: 'bdhs',
    description: 'শিক্ষার্থীর নাম ৬০টির বেশি অক্ষর ও জটিল যুক্তাক্ষর সম্বলিত। টেবিল, আইডি কার্ড, প্রিন্ট ও রসিদে লেআউট ভাঙছে কিনা পরীক্ষা।',
    expected: 'নাম কাটবে না বা কার্ডের বাইরে ওভারফ্লো করবে না। আইডি কার্ড ও রসিদে সুন্দরভাবে র‍্যাপ হবে।',
    payload: {
      name_bn: 'মোছাম্মৎ উম্মে কুলসুম খাতুন চৌধুরী বিনতে শাহজাহান শিকদার',
      name_en: 'Mst. Umme Kulsum Khatun Chowdhury Binte Shahjahan Shikdar',
      class: '10',
      roll: 91,
      father_name: 'জনাব মোহাম্মদ শাহজাহান শিকদার চৌধুরী',
      mother_name: 'বেগম রাজিয়া সুলতানা চৌধুরী'
    }
  },
  {
    id: 'E02',
    title: 'একই শ্রেণিতে যমজ শিক্ষার্থী (একই নাম, আলাদা রোল)',
    module: 'students',
    school_slug: 'bdhs',
    description: '১০ম শ্রেণিতে একই নামে দুইজন শিক্ষার্থী: তাহমিদ হাসান। রোল যথাক্রমে ১৪ ও ১৫। সার্চ ও রসিদ তৈরির সময় দ্ব্যর্থতা পরীক্ষা।',
    expected: 'রোল ও আইডি নাম্বার দেখে সঠিকভাবে শনাক্ত করা যাবে। ড্রপডাউনে রোল সহ নাম প্রদর্শিত হবে।',
    payload: [
      { name_bn: 'তাহমিদ হাসান', name_en: 'Tahmid Hasan', class: '10', roll: 14, student_id: 'BDHS-2026-1014' },
      { name_bn: 'তাহমিদ হাসান', name_en: 'Tahmid Hasan', class: '10', roll: 15, student_id: 'BDHS-2026-1015' }
    ]
  },
  {
    id: 'E03',
    title: 'রোল ১ এবং সর্বোচ্চ রোল ৯৯৯৯; শূন্য ও বড় তালিকা',
    module: 'students',
    school_slug: 'bdhs',
    description: 'স্বাভাবিক রোল ১ ছাড়াও অস্বাভাবিক রোল ৯৯৯৯ ইনপুট টেস্ট।',
    expected: '৪ ডিজিটের রোল টেবিল কলাম বা ব্যাজে ঠিকমতো বসবে।',
    payload: { roll_min: 1, roll_max: 9999 }
  },
  {
    id: 'E04',
    title: 'নামের ভিন্নতা (মোঃ / মো. / মোহাম্মদ) ও বাংলা-ইংরেজি অঙ্ক সার্চ',
    module: 'search',
    school_slug: 'bdhs',
    description: 'মোঃ তানভীর, মো. তানভীর, মোহাম্মদ তানভীর ও রোল ১০ বা 10 দিয়ে সার্চ।',
    expected: 'যেকোনো ফরমেটে সার্চ করলেই প্রত্যাশিত শিক্ষার্থী পাওয়া যাবে।',
    payload: { search_queries: ['মোঃ', 'মো.', 'মোহাম্মদ', '১০', '10'] }
  },
  {
    id: 'E05',
    title: 'নামে ZWNJ/ZWJ এবং শুরুতে-শেষে ফাঁকা স্পেস',
    module: 'students',
    school_slug: 'bdhs',
    description: 'নামে অদৃশ্য ক্যারেক্টার ZWNJ (\u200C) ও স্পেস ("  তান‌ভীর আহমেদ  ") যুক্ত ইনপুট।',
    expected: 'সিস্টেম স্বয়ংক্রিয়ভাবে ট্রিম ও স্বাভাবিকীকরণ করবে।',
    payload: { raw_name: '  তান\u200Cভীর আহমেদ  ', normalized: 'তানভীর আহমেদ' }
  },
  {
    id: 'E06',
    title: 'বড় ফাইল (১৪ MB) ও বিভিন্ন রেশিওর ছবি আপলোড টেস্ট',
    module: 'gallery',
    school_slug: 'bdhs',
    description: 'খাড়া (Portrait) ও আড়াআড়ি (Landscape) বড় ছবি আপলোডের হ্যান্ডলিং।',
    expected: '১৫ মেগাবাইটের বেশি ফাইল সতর্কবার্তা দিয়ে আটকাবে, অনুমোদিত ছবি স্বয়ংক্রিয় ক্রপ ও কম্প্রেস হবে।',
    payload: { file_size_mb: 14.2, orientation: 'portrait' }
  },
  {
    id: 'E07',
    title: 'বাংলা অঙ্কে মোবাইল নম্বর (০১৭১১...) এবং অবৈধ প্রিফিক্স 012',
    module: 'admissions',
    school_slug: 'bdhs',
    description: 'ভর্তি আবেদনে বাংলা ডিজিটে মোবাইল নম্বর দেওয়া অথবা ভুল প্রিফিক্স ব্যবহার।',
    expected: 'বাংলা ডিজিট ইংরেজিতে কনভার্ট হয়ে গৃহীত হবে; তবে invalid 012 প্রিফিক্সে স্পষ্ট বাংলা এরর দেখাবে।',
    payload: { bn_mobile: '০১৭১১২৩৪৫৬৭', invalid_mobile: '01298765432' }
  },
  {
    id: 'E08',
    title: 'বয়সসীমার বাইরে জন্মতারিখ ও ভবিষ্যতের তারিখ',
    module: 'admissions',
    school_slug: 'bdhs',
    description: '২০২৪ সালের জন্মতারিখ দিয়ে ৬ষ্ঠ শ্রেণিতে ভর্তির চেষ্টা বা ভবিষ্যতের তারিখ।',
    expected: 'ভ্যালিডেশন এরর আসবে: "শ্রেণি অনুযায়ী শিক্ষার্থীর বয়স গ্রহণযোগ্য সীমার মধ্যে নয়।"',
    payload: { invalid_dob_future: '2027-01-01', invalid_dob_underage: '2024-05-10' }
  },
  {
    id: 'E09',
    title: 'একই নাম + মোবাইল + শ্রেণিতে ডুপ্লিকেট আবেদন',
    module: 'admissions',
    school_slug: 'bdhs',
    description: 'একই শিক্ষার্থী কর্তৃক পুনরায় ভর্তি ফর্ম সাবমিট করা।',
    expected: 'সতর্কবার্তা: "এই মোবাইল নম্বর ও নাম দিয়ে ইতিমধ্যে আবেদন জমা হয়েছে।"',
    payload: { name_bn: 'রাকিব হাসান', mobile: '01855667788', applied_class: '6' }
  },
  {
    id: 'E10',
    title: 'একই আবেদন দুই ট্যাবে একসাথে অনুমোদন চেষ্টা (Concurrency)',
    module: 'admissions',
    school_slug: 'bdhs',
    description: 'একই আবেদনকারীকে দুইবার অনুমোদন দিয়ে ডুপ্লিকেট রোল বা স্টুডেন্ট আইডি তৈরি রোধ।',
    expected: 'একটাই অনুমোদন হবে এবং রোল বরাদ্দ পাবে, দ্বিতীয়টিতে ইতিমধ্যে অনুমোদিত দেখাবে।',
    payload: { tracking_id: 'BDHS-ADM-2027-E10' }
  },
  {
    id: 'E11',
    title: 'একসাথে ৩০টি আবেদন বাল্ক অনুমোদন (Bulk Admission)',
    module: 'admissions',
    school_slug: 'bdhs',
    description: 'লটারির পর ৩০ জন শিক্ষার্থীর আবেদন এক ক্লিকে অনুমোদন ও ধারাবাহিক রোল বরাদ্দ।',
    expected: 'কোনো রোল মিসিং বা ডুপ্লিকেট হবে না, সবাই ক্রমানুসারে তালিকাভুক্ত হবে।',
    payload: { batch_count: 30, target_class: '6' }
  },
  {
    id: 'E12',
    title: 'ফলাফল/রসিদ থাকা শিক্ষার্থীর ভর্তি আবেদন রিভার্ট চেষ্টা',
    module: 'admissions',
    school_slug: 'bdhs',
    description: 'যে শিক্ষার্থীর ফি রসিদ বা পরীক্ষার রেজাল্ট ইতিমধ্যে সিস্টেমে রয়েছে, তার ভর্তি বাতিল করা।',
    expected: 'সিস্টেম আটকাবে: "শিক্ষার্থীর আর্থিক বা একাডেমিক রেকর্ড থাকায় আবেদন বাতিল করা যাবে না।"',
    payload: { student_id: 'BDHS-2026-1001' }
  },
  {
    id: 'E13',
    title: 'সব বিষয়ে পাস কিন্তু একটি বাধ্যতামূলক বিষয়ে F (GPA 0.00)',
    module: 'results',
    school_slug: 'bdhs',
    description: 'গণিতে ২৯ পেয়ে ফেল (F), বাকি সব বিষয়ে A+ পেলেও সামগ্রিক ফলাফল FAILED ও GPA 0.00।',
    expected: 'টোটাল GPA 0.00 এবং স্ট্যাটাস স্পষ্ট লাল অক্ষরে "FAILED" দেখাবে।',
    payload: {
      class: '10',
      roll: 21,
      student_name: 'সাকিব আল হাসান',
      subjects: [
        { code: '101', name: 'বাংলা', marks: 85, grade: 'A+', gpa: 5.0 },
        { code: '107', name: 'ইংরেজি', marks: 80, grade: 'A+', gpa: 5.0 },
        { code: '109', name: 'গণিত', marks: 28, grade: 'F', gpa: 0.0 },
        { code: '111', name: 'বিজ্ঞান', marks: 82, grade: 'A+', gpa: 5.0 }
      ],
      total_gpa: '0.00',
      status: 'FAILED'
    }
  },
  {
    id: 'E14',
    title: 'সব বিষয়ে ১০০% মার্কস (GPA 5.00) ও ১০০-এর বেশি নম্বর রোধ',
    module: 'results',
    school_slug: 'bdhs',
    description: 'সব বিষয়ে ফুল মার্কস পেয়ে গোল্ডেন GPA 5.00; ১০৫ নম্বর ইনপুটের চেষ্টা ভ্যালিডেশন।',
    expected: 'GPA 5.00 অতিক্রম করবে না; ১০০-র বেশি ইনপুট দিলে এরর আসবে।',
    payload: { total_gpa: '5.00', status: 'PASSED', invalid_mark: 105 }
  },
  {
    id: 'E15',
    title: 'CQ-তে পাস কিন্তু MCQ-তে ফেল (অংশভিত্তিক ফেল)',
    module: 'results',
    school_slug: 'bdhs',
    description: 'CQ-তে ৫০/৭০ (পাস) কিন্তু MCQ-তে ৮/৩০ (ফেল — ন্যূনতম ১০ প্রয়োজন)।',
    expected: 'সামগ্রিক বিষয়ে F গ্রেড আসবে।',
    payload: { subject: 'বিজ্ঞান', cq: 50, mcq: 8, grade: 'F' }
  },
  {
    id: 'E16',
    title: 'পরীক্ষায় অনুপস্থিত শিক্ষার্থী (Absent)',
    module: 'results',
    school_slug: 'bdhs',
    description: 'শিক্ষার্থী ইংরেজি পরীক্ষায় অসুস্থতার কারণে উপস্থিত হতে পারেনি।',
    expected: 'মার্কশিটে নম্বরের স্থলে "অনুপস্থিত (ABS)" লেখা থাকবে এবং মোট ফলাফলে FAILED আসবে।',
    payload: {
      class: '10',
      roll: 22,
      student_name: 'মেহেদী হাসান',
      subjects: [
        { code: '101', name: 'বাংলা', marks: 74, grade: 'A', gpa: 4.0 },
        { code: '107', name: 'ইংরেজি', marks: null, grade: 'ABS', gpa: 0.0, is_absent: true }
      ],
      total_gpa: '0.00',
      status: 'FAILED'
    }
  },
  {
    id: 'E17',
    title: 'অপ্রকাশিত খসড়া ফলাফল (Draft Results)',
    module: 'results',
    school_slug: 'bdhs',
    description: 'রেজাল্ট এন্ট্রি সম্পন্ন কিন্তু পাবলিশ করা হয়নি (published: false)।',
    expected: 'পাবলিক রেজাল্ট সার্চ পেজে কোনো ফলাফল পাওয়া যাবে না; শুধু অ্যাডমিন প্যানেলে দেখাবে।',
    payload: { published: false, exam: 'Half-Yearly' }
  },
  {
    id: 'E18',
    title: 'আর্কাইভকৃত প্রাক্তন শিক্ষার্থীর অতীত ফলাফল অনুসন্ধান',
    module: 'results',
    school_slug: 'bdhs',
    description: '২০২৪ শিক্ষাবর্ষের উত্তীর্ণ শিক্ষার্থীর পুরোনো ফলাফল রোল ও বছর দিয়ে অনুসন্ধান।',
    expected: 'আর্কাইভ থেকে সঠিক সনদের মার্কশিট প্রদর্শিত হবে।',
    payload: { year: '2024', roll: 5, status: 'archived' }
  },
  {
    id: 'E19',
    title: 'আংশিক পরিশোধ, অতিরিক্ত পরিশোধ ও ০ টাকার রসিদ রোধ',
    module: 'receipts',
    school_slug: 'bdhs',
    description: '১২০০ টাকা বকেয়ার বিপরীতে ৫০০ টাকা আংশিক পরিশোধ এবং ০ টাকার রসিদ কাটার চেষ্টা।',
    expected: 'আংশিক পরিশোধে ৭০০ টাকা বকেয়া দেখাবে; ০ টাকার রসিদ ভ্যালিডেশনে আটকে যাবে।',
    payload: { total_fee: 1200, paid_amount: 500, remaining_due: 700 }
  },
  {
    id: 'E20',
    title: '১,০০,০০০ ও ১২,৩৪,৫৬৭ টাকার বড় রসিদ ও কথায় রূপান্তর',
    module: 'receipts',
    school_slug: 'bdhs',
    description: 'উন্নয়ন ফি বা অনুদানের জন্য ১ লক্ষ ও ১২ লক্ষ টাকার বড় অঙ্কের মানি রিসিট।',
    expected: 'কমা ফরম্যাটিং (১২,৩৪,৫৬৭) ও বাংলা কথায় "বারো লক্ষ চৌত্রিশ হাজার পাঁচশত সাতষট্টি টাকা মাত্র" সঠিক থাকবে।',
    payload: {
      amount: 1234567,
      amount_formatted: '১২,৩৪,৫৬৭',
      in_words_bn: 'বারো লক্ষ চৌত্রিশ হাজার পাঁচশত সাতষট্টি টাকা মাত্র'
    }
  },
  {
    id: 'E21',
    title: 'বছরের সীমানার রসিদ (৩১ ডিসেম্বর ২৩:৫০ ও ১ জানুয়ারি ০০:১০)',
    module: 'receipts',
    school_slug: 'bdhs',
    description: 'বছরের শেষ মুহূর্ত ও নতুন বছরের শুরুর রসিদে বছর ও ক্রমিক নম্বর পরীক্ষা।',
    expected: 'নতুন বছরে রসিদের সিরিয়াল নম্বর ১ থেকে শুরু হবে এবং সঠিক শিক্ষাবর্ষ ট্যাগ হবে।',
    payload: { rec_end_year: 'REC-BDHS-2026-1231-9999', rec_new_year: 'REC-BDHS-2027-0101-0001' }
  },
  {
    id: 'E22',
    title: 'মেধাবী ও দরিদ্র কোটায় বিনা বেতনের শিক্ষার্থী (Full Free)',
    module: 'receipts',
    school_slug: 'bdhs',
    description: 'শিক্ষার্থীকে ১০০% বৃত্তি দেওয়ায় মাসিক বেতন শূন্য টাকা।',
    expected: 'মাসিক বকেয়া তালিকায় এই শিক্ষার্থীর কোনো বকেয়া প্রদর্শিত হবে না।',
    payload: { student_id: 'BDHS-2026-1008', scholarship: '100% Free Studentship', due_amount: 0 }
  },
  {
    id: 'E23',
    title: 'ভুল এন্ট্রির কারণে বাতিলকৃত রসিদ (Void Receipt)',
    module: 'receipts',
    school_slug: 'bdhs',
    description: 'অফিস সহকারী ভুল অঙ্কে রসিদ কাটায় কারণ উল্লেখ করে রসিদ বাতিল করা হয়েছে।',
    expected: 'দৈনিক ও মাসিক মোট ক্যাশ আদায়ের রিপোর্টে এই রসিদের টাকা বাদ পড়বে, রসিদে "VOID/বাতিল" ওয়াটারমার্ক থাকবে।',
    payload: {
      receipt_no: 'REC-BDHS-2026-1108-VOID',
      status: 'void',
      void_reason: 'ভুল শ্রেণি ও অতিরিক্ত ফি টাইপ করায় বাতিল করা হলো।'
    }
  },
  {
    id: 'E24',
    title: 'একাধিক প্রধান শিক্ষক নির্ধারণের চেষ্টা রোধ',
    module: 'teachers',
    school_slug: 'bdhs',
    description: 'শিক্ষক তালিকায় ইতিমধ্যে একজন প্রধান শিক্ষক থাকতে আরেকজনকে প্রধান শিক্ষক পদবি দেওয়া।',
    expected: 'সতর্কবার্তা আসবে: "প্রতিষ্ঠানে ইতিমধ্যে একজন প্রধান শিক্ষক কর্মরত আছেন।"',
    payload: { role: 'head_teacher', conflict_check: true }
  },
  {
    id: 'E25',
    title: 'ভবিষ্যতের নির্ধারিত নোটিশ ও মেয়াদোত্তীর্ণ জরুরি নোটিশ',
    module: 'notices',
    school_slug: 'bdhs',
    description: 'আগামী সপ্তাহে প্রকাশের জন্য শিডিউল করা নোটিশ এবং তারিখ পার হয়ে যাওয়া নোটিশ।',
    expected: 'শিডিউল নোটিশ নির্ধারিত তারিখের আগে পাবলিকে আসবে না; মেয়াদোত্তীর্ণ নোটিশ টপবার টিকার থেকে সরবে।',
    payload: {
      future_notice_date: '2026-12-01',
      expired_notice_date: '2026-10-01'
    }
  },
  {
    id: 'E26',
    title: '২০০ অক্ষরের দীর্ঘ শিরোনাম, শুধু ইংরেজি শিরোনাম ও ৫ MB PDF',
    module: 'notices',
    school_slug: 'bdhs',
    description: 'দীর্ঘ নোটিশ শিরোনাম এবং বাংলা না থাকা নোটিশে ইংরেজি ফলব্যাক।',
    expected: 'টাইটেল রেসপনসিভভাবে র‍্যাপ হবে, কোনো ওভারফ্লো বা কাটবে না, PDF ভিউয়ার কাজ করবে।',
    payload: {
      long_title: 'গণপ্রজাতন্ত্রী বাংলাদেশ সরকারের শিক্ষা মন্ত্রণালয় ও মাধ্যমিক ও উচ্চশিক্ষা অধিদপ্তর কর্তৃক জারিকৃত ২০২৬ শিক্ষাবর্ষের বার্ষিক ক্রীড়া প্রতিযোগিতা, সাংস্কৃতিক সপ্তাহ এবং বিজ্ঞান মেলার সমন্বিত জাতীয় দিকনির্দেশনা ও বাস্তবায়ন বিধিমালা সংক্রান্ত অতি জরুরি নোটিশ।',
      en_only_title: 'Notice regarding annual inspection of educational infrastructure and multimedia classroom facilities.'
    }
  },
  {
    id: 'E27',
    title: 'XSS স্ক্রিপ্ট ইনজেকশন স্ট্রিং নিরাপত্তা পরীক্ষা',
    module: 'security',
    school_slug: 'bdhs',
    description: 'নোটিশের শিরোনাম ও যোগাযোগ ফর্মে `<script>alert(1)</script>` এবং `<b>বোল্ড</b>` ইনপুট।',
    expected: 'স্ক্রিপ্ট এক্সিকিউট হবে না, সম্পূর্ণ স্যানিটাইজ হয়ে সাধারণ টেক্সট হিসেবে নিরাপদভাবে রেন্ডার হবে।',
    payload: {
      xss_payload: '<script>alert("XSS-TEST-PASSED")</script>',
      html_payload: '<b>জরুরি নোটিশ</b> & <img src=x onerror=alert(1)>'
    }
  },
  {
    id: 'E28',
    title: 'যোগাযোগ ফর্মে ইমোজি ও ৫,০০০ অক্ষরের বার্তা',
    module: 'contact',
    school_slug: 'bdhs',
    description: 'ইনবক্সে ইমোজি (🏫🇧🇩✨) এবং ৫ হাজার অক্ষরের দীর্ঘ অভিযোগ/বার্তা।',
    expected: 'ইনবক্স ভাঙবে না, UTF-8 ইমোজি সঠিকভাবে সংরক্ষিত ও প্রদর্শিত হবে।',
    payload: { message_length: 5000, has_emojis: true }
  },
  {
    id: 'E29',
    title: 'একই শিক্ষকের একই সময়ে দুই ক্লাসে রুটিন নির্ধারণ দ্বন্দ্ব',
    module: 'routines',
    school_slug: 'bdhs',
    description: 'রবিবার সকাল ১০:৪৫-এ গণিত শিক্ষক জনাব কামাল হোসেনকে একই সাথে ৮ম ও ৯ম শ্রেণিতে বরাদ্দ।',
    expected: 'রুটিন ম্যানেজারে কনফ্লিক্ট সতর্কতা (Warning) প্রদর্শিত হবে।',
    payload: { teacher_name: 'কামাল হোসেন', period: '2nd Period (10:45 AM)', conflict: true }
  },
  {
    id: 'E30',
    title: 'লক ইউজার, নিষ্ক্রিয় ইউজার ও বাধ্যতামূলক পাসওয়ার্ড পরিবর্তন',
    module: 'users',
    school_slug: 'bdhs',
    description: '৫ বার ভুল পাসওয়ার্ড দিয়ে লক হওয়া অ্যাকাউন্ট, অ্যাডমিন কর্তৃক নিষ্ক্রিয় অ্যাকাউন্ট ও ফার্স্ট লগইন ইউজার।',
    expected: 'যথাক্রমে অ্যাকাউন্ট লক বার্তা, নিষ্ক্রিয় বার্তা এবং বাধ্যতামূলক পাসওয়ার্ড পরিবর্তন স্ক্রিনে রিডাইরেক্ট।',
    payload: [
      { username: 'locked_user', failed_attempts: 5, locked_until: '2026-11-17 10:00 AM' },
      { username: 'inactive_staff', active: false },
      { username: 'new_teacher', must_change_password: true }
    ]
  },
  {
    id: 'E31',
    title: 'প্রতিষ্ঠানের একমাত্র সক্রিয় সুপার অ্যাডমিন নিষ্ক্রিয়করণ রোধ',
    module: 'users',
    school_slug: 'bdhs',
    description: 'প্রতিষ্ঠানের সর্বশেষ সক্রিয় সুপার অ্যাডমিনকে ডিলিট বা নিষ্ক্রিয় করার চেষ্টা।',
    expected: 'সিস্টেম আটকাবে: "প্রতিষ্ঠানের একমাত্র সক্রিয় সুপার অ্যাডমিন নিষ্ক্রিয় করা সম্ভব নয়।"',
    payload: { prevent_orphan_admin: true }
  },
  {
    id: 'E32',
    title: 'কিউএ সীমা বিদ্যালয়ে শিক্ষার্থী (৫০১তম) ও ইউজার (৬ষ্ঠ) সীমা রোধ',
    module: 'limits',
    school_slug: 'qa-limit',
    description: 'Basic প্ল্যানে ৫০০ শিক্ষার্থীর কোটা পূর্ণ থাকায় ৫০১তম শিক্ষার্থী এন্ট্রি চেষ্টা।',
    expected: 'সিস্টেম আটকাবে: "আপনার প্ল্যানের সর্বোচ্চ শিক্ষার্থী সীমা (৫০০) পূর্ণ হয়েছে। প্ল্যান আপগ্রেড করুন।"',
    payload: { school_slug: 'qa-limit', max_students: 500, attempt_count: 501 }
  },
  {
    id: 'E33',
    title: 'বরুড়া আদর্শ বিদ্যালয়ে ৯২% কোটা সতর্কতা (Capacity Warning)',
    module: 'dashboard',
    school_slug: 'bahs',
    description: '৮০০ শিক্ষার্থী সীমার মধ্যে ৭৩৬ জন ভর্তি থাকায় ৯২% সক্ষমতা পূর্ণ।',
    expected: 'অ্যাডমিন ড্যাশবোর্ডে হলুদ সতর্কতা ব্যাজ: "বিদ্যালয়ের মোট ধারণক্ষমতার ৯২% ব্যবহৃত হয়েছে।"',
    payload: { max: 800, current: 736, percentage: 92 }
  },
  {
    id: 'E34',
    title: 'বিভিন্ন প্ল্যান লাইফসাইকেল স্ট্যাটাস আচরণ পরীক্ষা',
    module: 'platform',
    school_slug: 'shaplagirls',
    description: 'Grace (১২ দিন বাকি), Trial (আজ শেষ), Suspended (২০ দিন পূর্বে সমাপ্ত), Disabled (বন্ধ)।',
    expected: 'Grace-এ টপবার সতর্কবার্তা, Suspended-এ অ্যাডমিন ব্লক, Disabled-এ পাবলিক নোটিশ "সাময়িক বন্ধ"।',
    payload: {
      shaplagirls: { status: 'grace', days_left: 12 },
      nobarun: { status: 'trial', expires: 'today' },
      surjomukhi: { status: 'suspended' },
      kashbon: { status: 'disabled' }
    }
  },
  {
    id: 'E35',
    title: 'পুরোনো স্লাগ chor-mohona থেকে chormohona রিডাইরেক্ট',
    module: 'routing',
    school_slug: 'chormohona',
    description: 'ব্যবহারকারী পুরোনো URL /chor-mohona ভিজিট করলে স্বয়ংক্রিয় রিডাইরেক্ট।',
    expected: 'ব্রাউজার মসৃণভাবে /chormohona এ নিয়ে যাবে।',
    payload: { legacy_slug: 'chor-mohona', current_slug: 'chormohona' }
  },
  {
    id: 'E36',
    title: 'নবারুণ বিদ্যালয়ে অসম্পূর্ণ সেটআপ উইজার্ড ও ডিফল্ট স্টেট',
    module: 'onboarding',
    school_slug: 'nobarun',
    description: 'নতুন রেজিস্ট্রেশন করা স্কুল যার উইজার্ড শেষ হয়নি ও কোনো তথ্য এন্ট্রি হয়নি।',
    expected: 'অ্যাডমিনে লগইন করলে সেটআপ উইজার্ড প্রম্পট দেখাবে; পাবলিকে খালি স্টেট সুন্দরভাবে হ্যান্ডেল হবে।',
    payload: { wizard_incomplete: true }
  },
  {
    id: 'E37',
    title: 'বকেয়া থাকা শিক্ষার্থীর প্রবেশপত্র (Admit Card) প্রিন্ট রেস্ট্রিকশন',
    module: 'admit_card',
    school_slug: 'bdhs',
    description: 'পরীক্ষার পূর্বে যে শিক্ষার্থীর ফি বকেয়া রয়েছে তার প্রবেশপত্র ডাউনলোড চেষ্টা।',
    expected: 'সতর্কবার্তা বা প্রবেশপত্রে "বকেয়া ফি পরিশোধ সাপেক্ষে প্রযোজ্য" শর্তাবলী প্রিন্ট হবে।',
    payload: { student_id: 'BDHS-2026-1012', due: 1500 }
  },
  {
    id: 'E38',
    title: 'দ্বিমুখী শিফট (প্রভাতি ও দিবা) রুটিন ও ক্লাসরুম বরাদ্দ',
    module: 'routines',
    school_slug: 'shaplagirls',
    description: 'প্রভাতি শিফট (সকাল ৭:৩০-১২:০০) এবং দিবা শিফট (১২:৩০-৫:০০) এর ক্লাস শিডিউল।',
    expected: 'শিফট অনুযায়ী সময় আলাদা থাকবে এবং একই কক্ষে দুই শিফটের সংঘর্ষ হবে না।',
    payload: { morning: '07:30 AM - 12:00 PM', day: '12:30 PM - 05:00 PM' }
  },
  {
    id: 'E39',
    title: 'অফলাইন নগদ ক্যাশ আদায় ও হিসাব সহকারী ভিত্তিক রিপোর্ট',
    module: 'receipts',
    school_slug: 'bdhs',
    description: 'আলাদা আলাদা অফিস সহকারীর মাধ্যমে ক্যাশ কাউন্টারে আদায়কৃত টাকার মিলকরণ।',
    expected: 'ইউজার ভিত্তিক ক্যাশ সামারি রিপোর্টে হিসাব শতভাগ মিলবে।',
    payload: { collector_1: 'কামাল হোসেন (ক্যাশ: ৫,৪০০)', collector_2: 'নুরুল ইসলাম (বিকাশ: ৩,২০০)' }
  },
  {
    id: 'E40',
    title: 'অধিবর্ষ (Leap Year) ২৯শে ফেব্রুয়ারি জন্মতারিখ',
    module: 'students',
    school_slug: 'bdhs',
    description: 'অধিবর্ষের ২৯শে ফেব্রুয়ারি (যেমন ২০১২-০২-২৯) জন্মতারিখযুক্ত শিক্ষার্থী প্রোফাইল।',
    expected: 'সঠিকভাবে সেভ হবে এবং বয়স গণনায় কোনো এরর বা NaN তৈরি হবে না।',
    payload: { dob: '2012-02-29', is_leap_year: true }
  }
];

export function getEdgeCase(id) {
  return EDGE_CASES.find(e => e.id.toUpperCase() === id.toUpperCase()) || null;
}
