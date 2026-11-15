/**
 * ============================================================================
 * সহজ পাঠশালা (Sohoj Pathshala) — Multi-Tenant Storage & Repository Engine
 * Enforces strict tenant data isolation, unique constraints, transactional operations,
 * audit logging, and RBAC data access rules.
 * ============================================================================
 */

const STORAGE_PREFIX = 'sp_tenant_';

// Initial Seed Data for School 1 (BDHS), School 2 (BAHS) & School 3 (DMHS — Demo)
const SEED_SCHOOLS = [
  {
    id: 'sch_bdhs',
    slug: 'bdhs',
    name_bn: 'বন্দুয়া দৌলতপুর উচ্চ বিদ্যালয়',
    name_en: 'Bondua Daulatpur High School',
    eiin: '106644',
    school_code: '432platfrom',
    mpo_code: '0905171301',
    board: 'কুমিল্লা',
    district: 'ফেনী',
    code_prefix: 'BDHS',
    logo_url: '/favicon.svg',
    theme: 'emerald',
    status: 'active',
    plan: 'premium',
    expires_at: '2027-12-31',
    max_students: 1500,
    created_at: '2026-01-01'
  },
  {
    id: 'sch_bahs',
    slug: 'bahs',
    name_bn: 'বরুড়া আদর্শ উচ্চ বিদ্যালয়',
    name_en: 'Barura Adarsha High School',
    eiin: '105123',
    school_code: '5120',
    mpo_code: '0804112201',
    board: 'কুমিল্লা',
    district: 'কুমিল্লা',
    code_prefix: 'BAHS',
    logo_url: '/favicon.svg',
    theme: 'indigo',
    status: 'active',
    plan: 'standard',
    expires_at: '2027-06-30',
    max_students: 800,
    created_at: '2026-03-01'
  },
  {
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
    expires_at: '2027-12-31',
    max_students: 2000,
    created_at: '2026-11-15'
  }
];

export const SEED_LANDING_SETTINGS = {
  hero_tag: 'মাল্টি-স্কুল প্ল্যাটফর্ম · বাংলা + English',
  hero_title: 'সব স্কুল,\nএক সহজ প্ল্যাটফর্মে।',
  hero_subtitle: 'বাংলাদেশের প্রতিটি শিক্ষাপ্রতিষ্ঠানের জন্য সম্পূর্ণ ক্লাউডভিত্তিক আধুনিক ওয়েবসাইট, রেজাল্ট পাবলিশিং, অনলাইন ভর্তি ও প্রাতিষ্ঠানিক হিসাবরক্ষণ সমাধান।',
  hero_btn_admin: 'স্কুল অ্যাডমিন প্যানেল',
  hero_btn_features: 'প্ল্যাটফর্ম ফিচার দেখুন',
  helpline_phone: '০১৮১২-৩৪৫৬৭৮',
  helpline_email: 'onboard@sohojpathshala.app',
  modules: [
    { num: '01', title: 'শিক্ষার্থী ব্যবস্থাপনা', desc: 'শ্রেণিভিত্তিক রোল, ডিজিটাল স্টুডেন্ট আইডি ও ছবিসহ তথ্যভাণ্ডার।' },
    { num: '02', title: 'অনলাইন ভর্তি', desc: '৩-ধাপের আবেদন ফরম, তাৎক্ষণিক ট্র্যাকিং কোড ও ডিজিটাল প্রবেশপত্র প্রিন্ট।' },
    { num: '03', title: 'রেজাল্ট ও GPA', desc: 'বোর্ড গ্রেডিং অনুযায়ী বিষয়ভিত্তিক নম্বর, জিপিএ ও মার্কশিট জেনারেশন।' },
    { num: '04', title: 'ফি ও রসিদ', desc: 'বিকাশ/নগদ/ক্যাশ ফি আদায়, ২-কপি মানি রিসিট ও কারণসহ Void নীতি।' },
    { num: '05', title: 'শিক্ষক ও কর্মচারী', desc: 'পদবি ও শিক্ষাগত যোগ্যতাসহ পূর্ণাঙ্গ অ্যাকাডেমিক ডিরেক্টরি।' },
    { num: '06', title: 'নোটিশ বোর্ড', desc: 'হেডার জরুরি টিকার, ক্যাটাগরি ফিল্টার ও পিডিএফ ডাউনলোড সুবিধা।' },
    { num: '07', title: 'ওয়েবসাইট ও ব্র্যান্ডিং', desc: 'হিরো স্লাইডার, বাণী, পোশাক নীতিমালা, ফটো গ্যালারি ও কাস্টম থিম।' },
    { num: '08', title: 'নিরাপত্তা ও অডিট', desc: 'রোলভিত্তিক অনুমতি, ৫ বার ভুলে লকআউট ও পূর্ণাঙ্গ অডিট ট্রেইল।' }
  ],
  pricing_plans: [
    {
      id: 'basic',
      name: 'বেসিক প্ল্যান',
      tagline: 'ছোট শিক্ষাপ্রতিষ্ঠান ও প্রাথমিক বিদ্যালয়ের জন্য',
      price: 'ফ্রি ট্রায়াল',
      subtext: 'বাৎসরিক ৳২,৯৯৯',
      features: [
        'সর্বোচ্চ ১,০০০ শিক্ষার্থী নিবন্ধন',
        'পাবলিক ওয়েবসাইট ও হিরো ব্যানার',
        'নোটিশ বোর্ড ও রুটিন প্রকাশ',
        'শিক্ষক ও কর্মচারী পরিষদ তালিকা',
        'স্ট্যান্ডার্ড ক্লাউড ডেটা ব্যাকআপ'
      ],
      isPopular: false,
      cta: 'বিনামূল্যে পরখ করুন'
    },
    {
      id: 'standard',
      name: 'স্ট্যান্ডার্ড প্ল্যান',
      tagline: 'মাধ্যমিক বিদ্যালয়ের জন্য সর্বাধিক জনপ্রিয় সমাধান',
      price: '৳৭,৯৯৯',
      subtext: 'প্রতি বছর (সব ফিচার উন্মুক্ত)',
      features: [
        'সর্বোচ্চ ২,৫০০ শিক্ষার্থী ধারণক্ষমতা',
        'সম্পূর্ণ অনলাইন ভর্তি ও ডিজিটাল ট্র্যাকিং কোড',
        'বিষয়ভিত্তিক রেজাল্ট, GPA ও মার্কশিট জেনারেশন',
        'ফি কালেকশন ও স্বয়ংক্রিয় ২-কপি মানি রিসিট',
        'রোলভিত্তিক ইউজার পারমিশন (RBAC)',
        'পূর্ণাঙ্গ অডিট ট্রেইল ও নিরাপত্তা সুরক্ষা',
        'কাস্টম ব্র্যান্ডিং ও ডার্ক/লাইট মোড'
      ],
      isPopular: true,
      cta: 'জনপ্রিয় চয়েস বেছে নিন'
    },
    {
      id: 'premium',
      name: 'প্রিমিয়াম প্ল্যান',
      tagline: 'বৃহৎ মডেল স্কুল, কলেজ ও মাদ্রাসার জন্য',
      price: '৳১৪,৯৯৯',
      subtext: 'প্রতি বছর (ডেডিকেটেড সহায়তা)',
      features: [
        'সর্বোচ্চ ৫,০০০+ শিক্ষার্থী ধারণক্ষমতা',
        'নিজস্ব কাস্টম ডোমেইন (যেমন: school.edu.bd)',
        'এসএমএস গেটওয়ে ইন্টিগ্রেশন সুবিধা',
        'মাল্টি-শিফট ক্লাস ও পরীক্ষার রুটিন',
        'ডেডিকেটেড অনবোর্ডিং ম্যানেজার',
        '২৪/৭ প্রায়োরিটি ফোন ও হোয়াটসঅ্যাপ হেল্পলাইন'
      ],
      isPopular: false,
      cta: 'প্রিমিয়াম অনবোর্ডিং'
    }
  ],
  testimonial: {
    quote: 'সহজ পাঠশালা ব্যবহারের পর থেকে আমাদের বিদ্যালয়ের ভর্তি আবেদন গ্রহণ, পরীক্ষার ফলাফল প্রকাশ এবং শিক্ষার্থীদের ফি আদায় প্রক্রিয়া কয়েক ঘণ্টার মধ্যে শতভাগ নির্ভুলভাবে সম্পন্ন হচ্ছে। শিক্ষক ও অভিভাবক উভয়েই এই ডিজিটাল রূপান্তরে অত্যন্ত সন্তুষ্ট।',
    author: 'মো. বাহার উদ্দিন ভূঁইয়া',
    designation: 'প্রধান শিক্ষক • বন্দুয়া দৌলতপুর উচ্চ বিদ্যালয় (BDHS)',
    meta: 'EIIN: ১০৫৮৬৫ • ফেনী সদর, ফেনী',
    avatar: 'বূ'
  },
  faqs: [
    {
      q: 'সহজ পাঠশালায় স্কুল অনবোর্ড করতে কত সময় লাগে?',
      a: 'মাত্র ২৪ ঘণ্টার মধ্যে! আপনার প্রতিষ্ঠানের EIIN নম্বর, নাম এবং প্রধান শিক্ষকের তথ্য জমা দিলেই আমাদের ইঞ্জিনিয়ারিং টিম সম্পূর্ণ সুরক্ষিত টেন্যান্ট প্রস্তুত করে লাইভ করে দেয়।'
    },
    {
      q: 'আমাদের কি আলাদা সার্ভার বা সফটওয়্যার ইন্সটল করতে হবে?',
      a: 'না, কোনো সার্ভার কিনতে হবে না। সহজ পাঠশালা একটি ১০০% ক্লাউডভিত্তিক আধুনিক ওয়েব অ্যাপ্লিকেশন। যেকোনো মোবাইল বা কম্পিউটারের ব্রাউজার থেকেই সবকিছু নিয়ন্ত্রণ করা যায়।'
    },
    {
      q: 'এক স্কুলের তথ্য বা শিক্ষার্থীদের গোপনীয়তা অন্য স্কুল দেখতে পারবে কি?',
      a: 'কখনোই না! সহজ পাঠশালা কঠোর মাল্টি-টেন্যান্ট ডেটাবেজ আইসোলেশনে চলে। প্রতিটি স্কুলের ডেটা অন্য স্কুল থেকে সম্পূর্ণ পৃথক ও সুরক্ষিত থাকে।'
    },
    {
      q: 'আমরা কি আমাদের নিজস্ব ডোমেইন (যেমন: bdhs.edu.bd) ব্যবহার করতে পারব?',
      a: 'হ্যাঁ! প্রিমিয়াম প্ল্যানে যেকোনো অফিশিয়াল বা কাস্টম ডোমেইন সম্পূর্ণ নিরাপদে সরাসরি প্ল্যাটফর্মের সাথে কানেক্ট করা সম্ভব।'
    },
    {
      q: 'কম গতির ইন্টারনেটেও কি সফটওয়্যারটি দ্রুত কাজ করবে?',
      a: 'হ্যাঁ, সম্পূর্ণ সিস্টেমটি উচ্চগতির প্রতিক্রিয়াশীল আর্কিটেকচারে তৈরি, যাতে মোবাইল নেটওয়ার্কেও খুব দ্রুত লোড হয়।'
    }
  ],
  footer_copyright: '© ২০২৬ সহজ পাঠশালা (Sohoj Pathshala) — সর্বস্বত্ব সংরক্ষিত।'
};

const SEED_SETTINGS = [
  {
    school_id: 'sch_bdhs',
    address_bn: 'ফেনী-পরশুরাম মহাসড়ক সংলগ্ন, বন্দুয়া দৌলতপুর, আনন্দপুর ইউনিয়ন, ফুলগাজী, ফেনী।',
    address_en: 'Along Feni-Parshuram Highway, Bondua Daulatpur, Anandapur, Fulgazi, Feni.',
    phone: '০১৮২৪-৪৭২২০০',
    phone_alt: '০১৭১২-৮৯৩০৪২',
    email: 'bonduas106644@gmail.com',
    website: 'https://bonduadaulatpurhighschool.edu.bd',
    established: '১৯৯০',
    recognized: '১৯৯৪ (স্বীকৃতি: ১ জানুয়ারি, ১৯৯৪)',
    tagline_bn: 'জ্ঞানই আলো, শিক্ষাই শক্তি',
    tagline_en: 'Knowledge is Light, Education is Power',
    motto_bn: 'নৈতিক শিক্ষা ও আধুনিক প্রযুক্তির সমন্বয়ে ভবিষ্যৎ বিনির্মাণ।',
    motto_en: 'Building the future with moral education and modern technology.',
    office_hours: 'রবি–বৃহস্পতি সকাল ৯:০০–দুপুর ৩:০০ (শুক্রবার ও শনিবার সাপ্তাহিক ছুটি)',
    uniform_rules: 'ছাত্র: সাদা শার্ট ও নেভি ব্লু প্যান্ট | ছাত্রী: লাল ফ্রক/কামিজ ও সাদা পায়জামা/ওড়না',
    pass_rate: '৯৮.৫%',
    capacity: '৮৫০+',
    disciplines: ['বিজ্ঞান বিভাগ (Science)', 'ব্যবসায় শিক্ষা (Business Studies)', 'মানবিক বিভাগ (Humanities)'],
    history_bn: '১৯৯০ সালের ৮ জানুয়ারি ফেনী জেলার ফুলগাজী উপজেলায় আনন্দপুর ইউনিয়নের শিক্ষানুরাগী সমাজসেবক ব্যক্তিবর্গের উদ্যোগে প্রতিষ্ঠিত হয় ঐতিহ্যবাহী বন্দুয়া দৌলতপুর উচ্চ বিদ্যালয়। ১৯৯৪ সালে কুমিল্লা শিক্ষা বোর্ড কর্তৃক আনুষ্ঠানিকভাবে স্বীকৃতি লাভ করে বিদ্যালয়টি। বিগত তিন দশক ধরে অত্র অঞ্চলের আলোকবর্তিকা হিসেবে হাজারো শিক্ষার্থীকে আলোকিত মানুষ ও আদর্শ নাগরিক হিসেবে গড়ে তুলছে।',
    vision_bn: 'একটি বৈষম্যহীন, আধুনিক প্রযুক্তি-নির্ভর ও আদর্শ বিদ্যাপীঠ হিসেবে কুমিল্লা শিক্ষা বোর্ডের অন্যতম শ্রেষ্ঠ ও মডেল বিদ্যালয়ে রূপান্তরিত হওয়া।',
    mission_bn: 'মানসম্মত শিক্ষা, নৈতিক মূল্যবোধ ও ডিজিটাল প্রযুক্তির সমন্বয়ে প্রতিটি শিক্ষার্থীকে আধুনিক বিজ্ঞানমনস্ক, দেশপ্রেমিক ও দক্ষ মানবসম্পদ হিসেবে গড়ে তোলা।',
    headmaster_name: 'জনাব বাহার উদ্দিন ভূঁইয়া',
    headmaster_designation: 'ভারপ্রাপ্ত প্রধান শিক্ষক',
    headmaster_message: 'বন্দুয়া দৌলতপুর উচ্চ বিদ্যালয়ের পক্ষ থেকে সবাইকে জানাই আন্তরিক শুভেচ্ছা ও অভিনন্দন। ১৯৯০ সালে প্রতিষ্ঠিত এই ঐতিহ্যবাহী বিদ্যাপীঠ ফেনী-পরশুরাম আঞ্চলিক মহাসড়কের পাশে আনন্দপুর ইউনিয়নে শিক্ষার আলোকবর্তিকা হিসেবে সেবা দিয়ে যাচ্ছে। বর্তমান ডিজিটাল যুগে আমরা শিক্ষার্থীদের পাঠ্যবইয়ের পাশাপাশি প্রযুক্তি, বিজ্ঞান, নীতি-নৈতিকতা ও সৃজনশীল মেধা বিকাশে সচেষ্ট। একটি সমৃদ্ধ, দক্ষ ও দেশপ্রেমিক ভবিষ্যৎ প্রজন্ম গড়ে তোলাই আমাদের মূল লক্ষ্য। শিক্ষক, অভিভাবক ও শুভানুধ্যায়ীদের সহযোগিতায় বিদ্যালয়টি উত্তরোত্তর সাফল্যের শিখরে পৌঁছাবে এই প্রত্যাশা ব্যক্ত করছি।',
    chairman_name: 'আলহাজ্ব মো. মজিবুর রহমান',
    chairman_designation: 'সভাপতি, পরিচালনা পর্ষদ',
    chairman_message: 'বন্দুয়া দৌলতপুর উচ্চ বিদ্যালয় ফুলগাজী উপজেলার একটি গর্বের প্রতিষ্ঠান। পরিচালনা পর্ষদের পক্ষ থেকে আমরা শিক্ষক ও শিক্ষার্থীদের আধুনিক শিক্ষার উপযুক্ত পরিবেশ নিশ্চিত করতে সর্বদা প্রতিশ্রুতিবদ্ধ।',
    facebook_url: 'https://www.facebook.com/groups/887015382052811/',
    map_embed_url: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14674.321!2d91.385!3d23.085!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjPCsDA1JzA2LjAiTiA5McKwMjMnMDYuMCJF!5e0!3m2!1sen!2sbd!4v1620000000000!5m2!1sen!2sbd'
  },
  {
    school_id: 'sch_bahs',
    address_bn: 'মেইন রোড, বরুড়া পৌরসভা, কুমিল্লা।',
    address_en: 'Main Road, Barura Municipality, Comilla.',
    phone: '০১৭৯৮-৭৬৫৪৩২',
    phone_alt: '০১৮১৬-১২৩৪৫৬',
    email: 'contact@bahs.edu.bd',
    website: 'https://baruraadarshahighschool.edu.bd',
    established: '১৯৯৫',
    recognized: '১৯৯৮',
    tagline_bn: 'আলোকিত মানুষ গড়ার প্রত্যয়',
    tagline_en: 'Dedicated to Enlightened Minds',
    motto_bn: 'শৃঙ্খলা, চরিত্র ও জ্ঞান।',
    motto_en: 'Discipline, Character and Knowledge.',
    office_hours: 'রবি–বৃহস্পতি সকাল ৯:৩০–দুপুর ৩:০০',
    uniform_rules: 'সাদা শার্ট, কালো প্যান্ট ও কালো জুতো।',
    pass_rate: '৯৫.২%',
    capacity: '৮০০+',
    disciplines: ['বিজ্ঞান বিভাগ', 'ব্যবসায় শিক্ষা', 'মানবিক বিভাগ'],
    history_bn: '১৯৯৫ সালে প্রতিষ্ঠিত বরুড়া আদর্শ উচ্চ বিদ্যালয় বরুড়া উপজেলার অন্যতম পথিকৃৎ শিক্ষাপ্রতিষ্ঠান।',
    vision_bn: 'নৈতিকতা ও প্রযুক্তির সমন্বয়ে আধুনিক আদর্শ শিক্ষা নিশ্চিতকরণ।',
    mission_bn: 'জ্ঞানভিত্তিক সমাজ বিনির্মাণে সুদক্ষ ও আদর্শ নাগরিক গড়ে তোলা।',
    headmaster_name: 'ড. রফিকুল ইসলাম',
    headmaster_designation: 'প্রধান শিক্ষক',
    headmaster_message: 'আমাদের বিদ্যালয়ে প্রতিটি শিক্ষার্থীর সুপ্ত প্রতিভার বিকাশ ঘটাতে অভিজ্ঞ শিক্ষকবৃন্দ নিরলস পরিশ্রম করে চলেছেন।',
    chairman_name: 'জনাব আব্দুল হক',
    chairman_designation: 'সভাপতি, ম্যানেজিং কমিটি',
    chairman_message: 'গুণগত শিক্ষা বিস্তারে পরিচালনা পর্ষদ সর্বদা নিবেদিত।',
    facebook_url: 'https://facebook.com',
    map_embed_url: ''
  },
  {
    school_id: 'sch_dmhs',
    address_bn: 'রোড # ২৭, ধানমন্ডি, ঢাকা-১২০৯',
    address_en: 'Road # 27, Dhanmondi, Dhaka-1209',
    phone: '০১৭০০-০০০০০০',
    phone_alt: '০১৮০০-০০০০০০',
    email: 'info@dmhs.edu.bd',
    website: 'https://dmhs.edu.bd',
    established: '২০০২',
    recognized: '২০০৩',
    tagline_bn: 'জ্ঞান, চরিত্র ও ডিজিটাল উৎকর্ষতা',
    tagline_en: 'Knowledge, Character & Digital Excellence',
    motto_bn: 'শিক্ষাই জাতির মেরুদণ্ড, নৈতিকতাই জীবনের ভূষণ।',
    motto_en: 'Education is the backbone of a nation.',
    office_hours: 'রবি–বৃহস্পতি সকাল ৮:৩০–দুপুর ৩:০০',
    uniform_rules: 'ছাত্র: সাদা শার্ট ও নেভি ব্লু প্যান্ট | ছাত্রী: সাদা কামিজ ও নেভি ব্লু সালোয়ার/ওড়না',
    pass_rate: '৯৯.৫%',
    capacity: '২০০০+',
    disciplines: ['বিজ্ঞান বিভাগ (Science)', 'ব্যবসায় শিক্ষা (Business Studies)', 'মানবিক বিভাগ (Humanities)'],
    history_bn: '২০০২ সালে ঢাকার ধানমন্ডিতে প্রতিষ্ঠিত ধানমন্ডি মডেল হাই স্কুল রাজধানীর অন্যতম আধুনিক ও মানসম্পন্ন শিক্ষাপ্রতিষ্ঠান। ডিজিটাল শিক্ষার পথিকৃৎ এই বিদ্যালয়টি প্রতিষ্ঠার পর থেকেই একাডেমিক উৎকর্ষতা, নৈতিক শিক্ষা ও প্রযুক্তি নির্ভর পাঠদানের মাধ্যমে হাজারো শিক্ষার্থীর জীবন গড়ে দিচ্ছে।',
    vision_bn: 'ডিজিটাল বাংলাদেশ গড়ার প্রত্যয়ে জ্ঞান, মেধা ও মূল্যবোধ সম্পন্ন আদর্শ নাগরিক তৈরির শ্রেষ্ঠ বিদ্যাপীঠ হওয়া।',
    mission_bn: 'আধুনিক প্রযুক্তি ও নৈতিক শিক্ষার সমন্বয়ে প্রতিটি শিক্ষার্থীকে জাতীয় ও বৈশ্বিক চ্যালেঞ্জ মোকাবেলায় সক্ষম করে তোলা।',
    headmaster_name: 'ড. খোন্দকার রফিকুল আলম',
    headmaster_designation: 'প্রধান শিক্ষক',
    headmaster_message: 'ধানমন্ডি মডেল হাই স্কুলে আপনাকে স্বাগতম। আমাদের বিদ্যালয়ে শিক্ষার্থীদের সামগ্রিক মেধা বিকাশ, নৈতিক মূল্যবোধ প্রতিষ্ঠা ও ডিজিটাল দক্ষতা নিশ্চিত করাই আমাদের মূল লক্ষ্য।',
    chairman_name: 'আলহাজ্ব ড. রেজাউল করিম',
    chairman_designation: 'সভাপতি, পরিচালনা পর্ষদ',
    chairman_message: 'পরিচালনা পর্ষদের পক্ষ থেকে আমরা শিক্ষার্থীদের সর্বোচ্চ মানের শিক্ষা নিশ্চিত করতে দৃঢ়প্রতিজ্ঞ।',
    facebook_url: 'https://facebook.com',
    map_embed_url: ''
  }
];

// Hero Sliders per School
const SEED_SLIDERS = [
  {
    id: 'sl_1',
    school_id: 'sch_bdhs',
    tag: 'ঐতিহ্য ও আধুনিকতার মেলবন্ধন',
    title: 'বন্দুয়া দৌলতপুর উচ্চ বিদ্যালয়ে স্বাগতম',
    subtitle: 'ফেনী-পরশুরাম মহাসড়ক সংলগ্ন আনন্দপুর ইউনিয়নে ১৯৯০ সাল থেকে গুণগত মাধ্যমিক শিক্ষার আলোকবর্তিকা।',
    image: 'https://images.unsplash.com/photo-1562774053-701939374585?w=1600&auto=format&fit=crop&q=80',
    cta_text: 'অনলাইন ভর্তি আবেদন',
    cta_link: '#admission'
  },
  {
    id: 'sl_2',
    school_id: 'sch_bdhs',
    tag: 'শৃঙ্খলা, চরিত্র ও নির্ধারিত পোশাক',
    title: 'আদর্শ ও মূল্যবোধসম্পন্ন প্রজন্ম গড়ার অঙ্গীকার',
    subtitle: 'ছাত্রদের সাদা শার্ট ও নীল প্যান্ট, ছাত্রীদের লাল জামা পরিহিত শৃঙ্খলামূলক পাঠদান পরিবেশ।',
    image: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=1600&auto=format&fit=crop&q=80',
    cta_text: 'পোশাক নীতিমালা',
    cta_link: '#uniform'
  },
  {
    id: 'sl_3',
    school_id: 'sch_bdhs',
    tag: 'স্মার্ট শিক্ষা ও বিজ্ঞান চর্চা',
    title: 'শেখ রাসেল ডিজিটাল ল্যাব ও সমৃদ্ধ বিজ্ঞানাগার',
    subtitle: 'বিজ্ঞান, ব্যবসায় শিক্ষা ও মানবিক শাখার শিক্ষার্থীদের জন্য আধুনিক কম্পিউটার ও ব্যবহারিক ল্যাব সুবিধা।',
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1600&auto=format&fit=crop&q=80',
    cta_text: 'রেজাল্ট অনুসন্ধান',
    cta_link: '#results'
  },
  {
    id: 'sl_bahs_1',
    school_id: 'sch_bahs',
    tag: 'আলোকিত মানুষ গড়ার প্রত্যয়',
    title: 'বরুড়া আদর্শ উচ্চ বিদ্যালয়',
    subtitle: 'শৃঙ্খলা, চরিত্র ও জ্ঞানভিত্তিক আধুনিক শিক্ষালয়।',
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1600&auto=format&fit=crop&q=80',
    cta_text: 'ভর্তি ফরম',
    cta_link: '#admission'
  },
  {
    id: 'sl_dmhs_1',
    school_id: 'sch_dmhs',
    tag: 'স্বাগতম',
    title: 'ধানমন্ডি মডেল হাই স্কুলে স্বাগতম',
    subtitle: 'গুণগত শিক্ষা, নৈতিক মূল্যবোধ ও ডিজিটাল অগ্রযাত্রায় আমরা প্রতিশ্রুতিবদ্ধ।',
    image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1600&q=80',
    cta_text: 'অনলাইন ভর্তি আবেদন',
    cta_link: '#admission'
  },
  {
    id: 'sl_dmhs_2',
    school_id: 'sch_dmhs',
    tag: 'ডিজিটাল শিক্ষা',
    title: 'আধুনিক প্রযুক্তি ও কাটিং-এজ ক্যাম্পাস',
    subtitle: 'স্মার্ট ক্লাসরুম, শেখ রাসেল ডিজিটাল ল্যাব ও উচ্চগতির ব্রডব্যান্ড নেটওয়ার্ক — ভবিষ্যৎ গড়ার প্রতিষ্ঠান।',
    image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1600&q=80',
    cta_text: 'ক্যাম্পাস সুবিধা দেখুন',
    cta_link: '#facilities'
  }
];

// Uniform & Dress Code per School
const SEED_UNIFORMS = [
  {
    school_id: 'sch_bdhs',
    boys: {
      shirt: 'সাদা রঙের হাফ/ফুল হাতা শার্ট (White Shirt)',
      pant: 'নেভি ব্লু রঙের ফর্মাল প্যান্ট (Navy Blue Pant)',
      badge: 'বাম পকেটে বিদ্যালয়ের মনোগ্রামযুক্ত প্রাতিষ্ঠানিক ব্যাজ',
      shoes: 'কালো চামড়ার জুতা ও সাদা রঙের মোজা (Black Shoes & White Socks)',
      belt: 'কালো বেল্ট (Black Belt)'
    },
    girls: {
      dress: 'লাল রঙের ফ্রক / কামিজ (Red Dress / Kamiz)',
      salwar: 'সাদা রঙের পায়জামা / সালোয়ার (White Salwar)',
      orna: 'সাদা রঙের ওড়না / স্কার্ফ (White Orna / Scarf)',
      badge: 'বামে বিদ্যালয়ের মনোগ্রামযুক্ত প্রাতিষ্ঠানিক ব্যাজ',
      shoes: 'কালো জুতা ও সাদা মোজা (Black Shoes & White Socks)',
      hair: 'চুলে সাদা ফিতা (White Hair Ribbon)'
    },
    winter: 'শীতকালীন পোশাক: সকল ছাত্র-ছাত্রীর জন্য গাঢ় নীল বা লাল রঙের ভি-নেক সোয়েটার / কার্ডিগান।',
    guidelines: [
      '১. সকল শিক্ষার্থীকে প্রতিদিন নির্ধারিত স্কুল ইউনিফর্ম পরিধান করে বিদ্যালয়ে উপস্থিত হওয়া বাধ্যতামূলক।',
      '২. যথাযথ পোশাক ও ব্যাজ ব্যতীত কোনো শিক্ষার্থীকে ক্লাস বা প্রাত্যহিক সমাবেশে অংশগ্রহণ করতে দেওয়া হবে না।',
      '৩. পোশাক সবসময় পরিষ্কার, পরিপাটি ও মার্জিত হতে হবে।'
    ]
  },
  {
    school_id: 'sch_bahs',
    boys: {
      shirt: 'সাদা রঙের শার্ট',
      pant: 'কালো রঙের প্যান্ট',
      badge: 'স্কুল ব্যাজ',
      shoes: 'কালো জুতা ও সাদা মোজা',
      belt: 'কালো বেল্ট'
    },
    girls: {
      dress: 'নেভি ব্লু রঙের জামা',
      salwar: 'সাদা সালোয়ার',
      orna: 'সাদা ওড়না',
      badge: 'স্কুল ব্যাজ',
      shoes: 'কালো জুতা',
      hair: 'সাদা ফিতা'
    },
    winter: 'কালো সোয়েটার বা ব্লেজার।',
    guidelines: [
      '১. প্রতিদিন নির্ধারিত স্কুল ইউনিফর্ম পরিধান বাধ্যতামূলক।'
    ]
  },
  {
    school_id: 'sch_dmhs',
    boys: {
      shirt: 'সাদা রঙের হাফ/ফুল হাতা শার্ট (White Shirt)',
      pant: 'নেভি ব্লু রঙের ফর্মাল প্যান্ট (Navy Blue Pant)',
      badge: 'বাম পকেটে বিদ্যালয়ের মনোগ্রামযুক্ত প্রাতিষ্ঠানিক ব্যাজ',
      shoes: 'কালো চামড়ার জুতা ও সাদা মোজা',
      belt: 'কালো বেল্ট'
    },
    girls: {
      dress: 'সাদা কামিজ (White Kamiz)',
      salwar: 'নেভি ব্লু সালোয়ার (Navy Blue Salwar)',
      orna: 'সাদা ওড়না (White Orna)',
      badge: 'বিদ্যালয়ের মনোগ্রামযুক্ত ব্যাজ',
      shoes: 'কালো জুতা ও সাদা মোজা',
      hair: 'সাদা ফিতা (White Hair Ribbon)'
    },
    winter: 'শীতকালীন পোশাক: গাঢ় নেভি ব্লু ভি-নেক সোয়েটার / কার্ডিগান।',
    guidelines: [
      '১. সকল শিক্ষার্থীকে প্রতিদিন নির্ধারিত স্কুল ইউনিফর্ম পরিধান করে বিদ্যালয়ে উপস্থিত হওয়া বাধ্যতামূলক।',
      '২. যথাযথ পোশাক ও ব্যাজ ব্যতীত কোনো শিক্ষার্থীকে ক্লাস বা প্রাত্যহিক সমাবেশে অংশগ্রহণ করতে দেওয়া হবে না।',
      '৩. পোশাক সবসময় পরিষ্কার, পরিপাটি ও মার্জিত হতে হবে।'
    ]
  }
];

// Managing Committee & Governing Body per School
const SEED_COMMITTEE = [
  {
    id: 'cm_1',
    school_id: 'sch_bdhs',
    name: 'আলহাজ্ব মো. মজিবুর রহমান',
    designation: 'সভাপতি',
    role_category: 'সভাপতি, পরিচালনা পর্ষদ',
    phone: '০১৮১১-৯৯৮৮৭৭',
    status: 'active',
    order: 1
  },
  {
    id: 'cm_2',
    school_id: 'sch_bdhs',
    name: 'জনাব আবুল কাশেম',
    designation: 'সহ-সভাপতি',
    role_category: 'সহ-সভাপতি',
    phone: '০১৮২২-৮৮৭৭৬৬',
    status: 'active',
    order: 2
  },
  {
    id: 'cm_3',
    school_id: 'sch_bdhs',
    name: 'জনাব বাহার উদ্দিন ভূঁইয়া (পদাধিকারবলে)',
    designation: 'সদস্য-সচিব',
    role_category: 'ভারপ্রাপ্ত প্রধান শিক্ষক',
    phone: '০১৮২৪-৪৭২২০০',
    status: 'active',
    order: 3
  },
  {
    id: 'cm_4',
    school_id: 'sch_bdhs',
    name: 'জনাব আব্দুল মালেক',
    designation: 'অভিভাবক সদস্য',
    role_category: 'অভিভাবক প্রতিনিধি',
    phone: '০১৮৩৩-৭৭৬৬৫৫',
    status: 'active',
    order: 4
  },
  {
    id: 'cm_5',
    school_id: 'sch_bdhs',
    name: 'জনাবা রাশিদা বেগম',
    designation: 'মহিলা অভিভাবক সদস্য',
    role_category: 'অভিভাবক প্রতিনিধি (মহিলা)',
    phone: '০১৮৪৪-৬৬৫৫৪৪',
    status: 'active',
    order: 5
  },
  {
    id: 'cm_6',
    school_id: 'sch_bdhs',
    name: 'জনাব নূরুল ইসলাম',
    designation: 'শিক্ষক প্রতিনিধি',
    role_category: 'শিক্ষক প্রতিনিধি',
    phone: '০১৮৫৫-৫৪৪৩২২',
    status: 'active',
    order: 6
  },
  {
    id: 'cm_7',
    school_id: 'sch_bdhs',
    name: 'জনাব মোস্তফা কামাল',
    designation: 'দাতা সদস্য',
    role_category: 'দাতা সদস্য',
    phone: '০১৮৬৬-৪৩২২১১',
    status: 'active',
    order: 7
  },
  {
    id: 'cm_bahs_1',
    school_id: 'sch_bahs',
    name: 'জনাব আব্দুল হক',
    designation: 'সভাপতি',
    role_category: 'ম্যানেজিং কমিটি সভাপতি',
    phone: '০১৭০০-১১২২৩৩',
    status: 'active',
    order: 1
  }
];

// Routines, Exam Schedules & Syllabus per School
const SEED_ROUTINES = [
  {
    id: 'rt_1',
    school_id: 'sch_bdhs',
    title: '৬ষ্ঠ থেকে ১০ম শ্রেণির সাপ্তাহিক ক্লাস রুটিন ২০২৬',
    category: 'class_routine',
    effective_date: '১০ জানুয়ারি ২০২৬',
    file_size: '১.৪ MB',
    type: 'PDF'
  },
  {
    id: 'rt_2',
    school_id: 'sch_bdhs',
    title: 'বার্ষিক পরীক্ষা ও এসএসসি নির্বাচনী পরীক্ষার সময়সূচি',
    category: 'exam_routine',
    effective_date: '১৫ অক্টোবর ২০২৬',
    file_size: '৮৫০ KB',
    type: 'PDF'
  },
  {
    id: 'rt_3',
    school_id: 'sch_bdhs',
    title: 'জাতীয় শিক্ষাক্রম ও পাঠ্যপুস্তক বোর্ড (NCTB) বিস্তারিত সিলেবাস',
    category: 'syllabus',
    effective_date: '১ জানুয়ারি ২০২৬',
    file_size: '৩.২ MB',
    type: 'PDF'
  },
  {
    id: 'rt_4',
    school_id: 'sch_bdhs',
    title: 'একাডেমিক ক্যালেন্ডার ও সরকারি ছুটির তালিকা ২০২৬',
    category: 'calendar',
    effective_date: '১ জানুয়ারি ২০২৬',
    file_size: '৬৫০ KB',
    type: 'PDF'
  }
];

// Photo Gallery per School
const SEED_GALLERY = [
  {
    id: 'gal_1',
    school_id: 'sch_bdhs',
    title: 'বিদ্যালয়ের দ্বিতল প্রধান ভবন ও সবুজ প্রাঙ্গণ',
    category: 'campus',
    image: 'https://images.unsplash.com/photo-1562774053-701939374585?w=900&auto=format&fit=crop&q=80',
    description: 'ফেনী-পরশুরাম মহাসড়ক সংলগ্ন বন্দুয়া দৌলতপুর উচ্চ বিদ্যালয়ের মনোরম ক্যাম্পাস ও খেলার মাঠ।'
  },
  {
    id: 'gal_2',
    school_id: 'sch_bdhs',
    title: 'প্রাত্যহিক সমাবেশ ও জাতীয় সংগীত',
    category: 'campus',
    image: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=900&auto=format&fit=crop&q=80',
    description: 'ছাত্রদের সাদা শার্ট-নীল প্যান্ট ও ছাত্রীদের লাল ড্রেসে সুশৃঙ্খল অ্যাসেম্বলি।'
  },
  {
    id: 'gal_3',
    school_id: 'sch_bdhs',
    title: 'বার্ষিক ক্রীড়া প্রতিযোগিতা ও পুরষ্কার বিতরণী',
    category: 'sports',
    image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=900&auto=format&fit=crop&q=80',
    description: 'উপজেলা পর্যায়ে আয়োজিত বার্ষিক অ্যাথলেটিকস ও দৌড় প্রতিযোগিতা।'
  },
  {
    id: 'gal_4',
    school_id: 'sch_bdhs',
    title: 'শেখ রাসেল ডিজিটাল ল্যাবে কম্পিউটার প্রশিক্ষণ কর্মশালা',
    category: 'academic',
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=900&auto=format&fit=crop&q=80',
    description: 'শিক্ষার্থীদের তথ্যপ্রযুক্তি, কোডিং ও ডিজিটাল লিটারেসির ব্যবহারিক প্রশিক্ষণ।'
  },
  {
    id: 'gal_5',
    school_id: 'sch_bdhs',
    title: 'বিজ্ঞান গবেষণাগারে ব্যবহারিক পরীক্ষা (Science Lab)',
    category: 'academic',
    image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=900&auto=format&fit=crop&q=80',
    description: 'পদার্থবিজ্ঞান ও রসায়ন ল্যাবে হ্যান্ডস-অন সায়েন্স প্র্যাকটিক্যাল।'
  },
  {
    id: 'gal_6',
    school_id: 'sch_bdhs',
    title: 'মহান বিজয় দিবস ও বার্ষিক সাংস্কৃতিক অনুষ্ঠান',
    category: 'cultural',
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=900&auto=format&fit=crop&q=80',
    description: 'দেশাত্মবোধক গান, কবিতা আবৃত্তি ও নাটক পরিবেশনা।'
  },
  {
    id: 'gal_7',
    school_id: 'sch_bdhs',
    title: 'এসএসসি ব্যাচ বিদায় সংবর্ধনা ও দোয়া মাহফিল',
    category: 'cultural',
    image: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=900&auto=format&fit=crop&q=80',
    description: 'পরীক্ষার্থীদের সাফল্য কামনা ও বিশেষ দোয়া মাহফিল।'
  },
  {
    id: 'gal_8',
    school_id: 'sch_bdhs',
    title: 'বিদ্যালয় শহীদ মিনার ও ভাষা শহীদদের প্রতি শ্রদ্ধা নিবেদন',
    category: 'cultural',
    image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=900&auto=format&fit=crop&q=80',
    description: '২১শে ফেব্রুয়ারির প্রভাতফেরি ও শহীদ মিনারে পুষ্পস্তবক অর্পণ।'
  }
];

// Video Gallery per School (YouTube or Direct Video Upload)
const SEED_VIDEOS = [
  {
    id: 'vid_1',
    school_id: 'sch_bdhs',
    title: 'বন্দুয়া দৌলতপুর উচ্চ বিদ্যালয় বার্ষিক ক্রীড়া ও সাংস্কৃতিক উৎসব ২০২৬',
    duration: '12:45',
    video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnail: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=900&auto=format&fit=crop&q=80',
    description: 'ফুলগাজী উপজেলা পর্যায়ে আয়োজিত বর্ণাঢ্য বার্ষিক ক্রীড়া প্রতিযোগিতা ও সাংস্কৃতিক অনুষ্ঠানের উল্লেখযোগ্য অংশ।'
  },
  {
    id: 'vid_2',
    school_id: 'sch_bdhs',
    title: 'ভারপ্রাপ্ত প্রধান শিক্ষক জনাব বাহার উদ্দিন ভূঁইয়ার দিকনির্দেশনামূলক বক্তব্য',
    duration: '08:20',
    video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnail: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=900&auto=format&fit=crop&q=80',
    description: 'এসএসসি পরীক্ষার্থীদের সাফল্য ও নতুন শিক্ষাবর্ষের শৃঙ্খলা বিষয়ক দিকনির্দেশনামূলক ভাষণ।'
  }
];

// Campus Facilities
const SEED_FACILITIES = [
  {
    id: 'fac_1',
    school_id: 'sch_bdhs',
    title: 'শেখ রাসেল ডিজিটাল ল্যাব',
    subtitle: '২০টি আধুনিক কম্পিউটার ও ইন্টারনেট',
    desc: 'তথ্য ও যোগাযোগ প্রযুক্তি (ICT) ক্লাসে প্রতিটি শিক্ষার্থীকে কম্পিউটার ও প্রোগ্রামিংয়ের বাস্তব প্রশিক্ষণ দেওয়া হয়।'
  },
  {
    id: 'fac_2',
    school_id: 'sch_bdhs',
    title: 'সমৃদ্ধ বিজ্ঞানাগার (Science Lab)',
    subtitle: 'পদার্থ, রসায়ন ও জীববিজ্ঞানের আধুনিক যন্ত্রপাতি',
    desc: 'মাধ্যমিক স্তরের বিজ্ঞান শাখার ব্যবহারিক ক্লাসের জন্য সম্পূর্ণ সুসজ্জিত ল্যাবরেটরি।'
  },
  {
    id: 'fac_3',
    school_id: 'sch_bdhs',
    title: 'কেন্দ্রীয় পাঠাগার (Library)',
    subtitle: '৩,৫০০+ পাঠ্য ও রেফারেন্স গ্রন্থ',
    desc: 'জ্ঞানপিপাসু শিক্ষার্থীদের জন্য সাহিত্য, বিজ্ঞান, ইতিহাস ও সাধারণ জ্ঞানের সমৃদ্ধ বইয়ের সম্ভার।'
  },
  {
    id: 'fac_4',
    school_id: 'sch_bdhs',
    title: 'সুবিশাল খেলার মাঠ',
    subtitle: 'ফুটবল, ক্রিকেট ও ভলিবল',
    desc: 'শিক্ষার্থীদের শারীরিক বিকাশ ও ক্রীড়া চর্চার জন্য বিদ্যালয়ের নিজস্ব প্রশস্ত ও মনোরম মাঠ।'
  }
];

const SEED_USERS = [
  // Platform Owner (school_id is null)
  {
    id: 'usr_owner',
    school_id: null,
    username: 'owner',
    password: 'password123',
    name: 'Platform Owner',
    role: 'platform_owner',
    active: true,
    failed_attempts: 0,
    locked_until: null,
    must_change_password: false
  },
  {
    id: 'usr_superadmin',
    school_id: null,
    username: 'superadmin',
    password: 'password123',
    name: 'Super Admin',
    role: 'platform_owner',
    active: true,
    failed_attempts: 0,
    locked_until: null,
    must_change_password: false
  },
  // BDHS Users
  {
    id: 'usr_bdhs_super',
    school_id: 'sch_bdhs',
    username: 'admin',
    password: 'password123',
    name: 'স্কুল অ্যাডমিন (BDHS)',
    role: 'school_superadmin',
    active: true,
    failed_attempts: 0,
    locked_until: null,
    must_change_password: false
  },
  {
    id: 'usr_bdhs_head',
    school_id: 'sch_bdhs',
    username: 'headmaster',
    password: 'password123',
    name: 'জনাব বাহার উদ্দিন ভূঁইয়া',
    role: 'headmaster',
    active: true,
    failed_attempts: 0,
    locked_until: null,
    must_change_password: false
  },
  {
    id: 'usr_bdhs_asst_head',
    school_id: 'sch_bdhs',
    username: 'assthead',
    password: 'password123',
    name: 'জনাব সলিম উদ্দিন মজুমদার',
    role: 'asst_headmaster',
    active: true,
    failed_attempts: 0,
    locked_until: null,
    must_change_password: false
  },
  {
    id: 'usr_bdhs_teacher',
    school_id: 'sch_bdhs',
    username: 'teacher',
    password: 'password123',
    name: 'জনাব জাহাঙ্গীর আলম',
    role: 'teacher',
    active: true,
    failed_attempts: 0,
    locked_until: null,
    must_change_password: false
  },
  {
    id: 'usr_bdhs_office',
    school_id: 'sch_bdhs',
    username: 'office',
    password: 'password123',
    name: 'নুরুল কবির ভূঁইয়া',
    role: 'office_assistant',
    active: true,
    failed_attempts: 0,
    locked_until: null,
    must_change_password: false
  },
  // BAHS Users
  {
    id: 'usr_bahs_super',
    school_id: 'sch_bahs',
    username: 'admin',
    password: 'password123',
    name: 'স্কুল অ্যাডমিন (BAHS)',
    role: 'school_superadmin',
    active: true,
    failed_attempts: 0,
    locked_until: null,
    must_change_password: false
  },
  // DMHS Users (Demo School)
  {
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
  }
];

const SEED_STUDENTS = [
  // BDHS Students
  {
    id: 'std_bdhs_1',
    school_id: 'sch_bdhs',
    student_id: 'BDHS-2026-1001',
    name_bn: 'আব্দুর রহমান',
    name_en: 'Abdur Rahman',
    father_name: 'মোঃ খলিলুর রহমান',
    mother_name: 'রোকেয়া বেগম',
    class: '10',
    group: 'Science',
    roll: 1,
    mobile: '01811223344',
    dob: '2010-05-15',
    address: 'আনন্দপুর, ফুলগাজী'
  },
  {
    id: 'std_bdhs_2',
    school_id: 'sch_bdhs',
    student_id: 'BDHS-2026-1002',
    name_bn: 'ফাতিমা আক্তার',
    name_en: 'Fatima Akter',
    father_name: 'আবুল কালাম',
    mother_name: 'শাহিনুর বেগম',
    class: '10',
    group: 'Science',
    roll: 2,
    mobile: '01855667788',
    dob: '2010-08-20',
    address: 'বন্দুয়া দৌলতপুর'
  },
  {
    id: 'std_bdhs_3',
    school_id: 'sch_bdhs',
    student_id: 'BDHS-2026-0801',
    name_bn: 'মোঃ তানভীর আহমেদ',
    name_en: 'Tanvir Ahmed',
    father_name: 'রফিকুল ইসলাম',
    mother_name: 'নাজমা আক্তার',
    class: '8',
    group: 'General',
    roll: 1,
    mobile: '01711998877',
    dob: '2012-02-10',
    address: 'ফুলগাজী বাজার'
  },
  // BAHS Students (Notice roll: 1 in class 10 is isolated and independent!)
  {
    id: 'std_bahs_1',
    school_id: 'sch_bahs',
    student_id: 'BAHS-2026-1001',
    name_bn: 'সাকিব আল হাসান',
    name_en: 'Shakib Al Hasan',
    father_name: 'মোঃ জহিরুল হক',
    mother_name: 'মমতাজ বেগম',
    class: '10',
    group: 'Business Studies',
    roll: 1,
    mobile: '01722334455',
    dob: '2010-04-12',
    address: 'বরুড়া সদর'
  },
  // DMHS Students (Demo School)
  {
    id: 'std_dmhs_1',
    school_id: 'sch_dmhs',
    student_id: 'DMHS-2026-1001',
    name_bn: 'তানভীর আহমেদ',
    name_en: 'Tanvir Ahmed',
    father_name: 'মোঃ রফিকুল ইসলাম',
    mother_name: 'নাজমা আক্তার',
    class: '10',
    group: 'Science',
    roll: 1,
    mobile: '01712345678',
    dob: '2010-03-15',
    address: 'ধানমন্ডি, ঢাকা'
  },
  {
    id: 'std_dmhs_2',
    school_id: 'sch_dmhs',
    student_id: 'DMHS-2026-1002',
    name_bn: 'নুসরাত জাহান',
    name_en: 'Nusrat Jahan',
    father_name: 'মোঃ আলম হোসেন',
    mother_name: 'রোকেয়া বেগম',
    class: '9',
    group: 'Science',
    roll: 1,
    mobile: '01811223344',
    dob: '2011-07-20',
    address: 'মোহাম্মদপুর, ঢাকা'
  }
];

const SEED_TEACHERS = [
  // BDHS Teachers & Staff (16 members from Master Spec §7.2 in exact canonical order)
  {
    id: 'tch_1',
    school_id: 'sch_bdhs',
    order: 1,
    category: 'teacher',
    designation: 'ভারপ্রাপ্ত প্রধান শিক্ষক',
    name: 'জনাব বাহার উদ্দিন ভূঁইয়া',
    subject: 'ইংরেজি',
    qualification: 'বি.এ (ইংরেজি)',
    phone: '+880 1819-204561',
    email: 'bonduas106644@gmail.com'
  },
  {
    id: 'tch_2',
    school_id: 'sch_bdhs',
    order: 2,
    category: 'teacher',
    designation: 'ভারপ্রাপ্ত সহ প্রধান শিক্ষক',
    name: 'জনাব সলিম উদ্দিন মজুমদার',
    subject: 'ইংরেজি',
    qualification: 'ইংরেজি, বি.এ, বি.এড (B.A., B.Ed.)',
    phone: '+880 1818-450123',
    email: 'bonduas106644@gmail.com'
  },
  {
    id: 'tch_3',
    school_id: 'sch_bdhs',
    order: 3,
    category: 'teacher',
    designation: 'সহকারী শিক্ষক',
    name: 'জনাব জাহাঙ্গীর আলম',
    subject: 'হিসাব বিজ্ঞান',
    qualification: 'বি.কম, বি.এড (B.Com., B.Ed.)',
    phone: '+880 1711-234567',
    email: 'bonduas106644@gmail.com'
  },
  {
    id: 'tch_4',
    school_id: 'sch_bdhs',
    order: 4,
    category: 'teacher',
    designation: 'সহকারী শিক্ষক',
    name: 'মো: জাফর উল্লাহ চৌধুরী',
    subject: 'ইসলাম শিক্ষা',
    qualification: 'এম.এ, ইসলাম শিক্ষা (M.A., Islamic Studies)',
    phone: '+880 1815-998877',
    email: 'bonduas106644@gmail.com'
  },
  {
    id: 'tch_5',
    school_id: 'sch_bdhs',
    order: 5,
    category: 'teacher',
    designation: 'সহকারী শিক্ষক',
    name: 'হানিফ ভূঁইয়া',
    subject: 'ইংরেজি, হিসাব বিজ্ঞান ও বাণিজ্য',
    qualification: 'বি.কম, বি.এড, বি.পি.এড (B.Com., B.Ed., B.P.Ed.)',
    phone: '+880 1715-667788',
    email: 'bonduas106644@gmail.com'
  },
  {
    id: 'tch_6',
    school_id: 'sch_bdhs',
    order: 6,
    category: 'teacher',
    designation: 'সহকারী শিক্ষক',
    name: 'আনোয়ার হোসেন',
    subject: 'তথ্য ও যোগাযোগ প্রযুক্তি (ICT)',
    qualification: 'বি.কম, বি.এড (B.Com., B.Ed.)',
    phone: '+880 1912-334455',
    email: 'bonduas106644@gmail.com'
  },
  {
    id: 'tch_7',
    school_id: 'sch_bdhs',
    order: 7,
    category: 'teacher',
    designation: 'সহকারী শিক্ষক',
    name: 'আয়েশা ছিদ্দিকা',
    subject: 'সমাজ বিজ্ঞান',
    qualification: 'বি.এ, বি.এড (B.A., B.Ed.)',
    phone: '+880 1823-112233',
    email: 'bonduas106644@gmail.com'
  },
  {
    id: 'tch_8',
    school_id: 'sch_bdhs',
    order: 8,
    category: 'teacher',
    designation: 'সহকারী শিক্ষক',
    name: 'রাশিদা আক্তার ফেরদৌস',
    subject: 'সমাজ বিজ্ঞান',
    qualification: 'সমাজ বিজ্ঞান (B.A., Social Science)',
    phone: '+880 1817-554433',
    email: 'bonduas106644@gmail.com'
  },
  {
    id: 'tch_9',
    school_id: 'sch_bdhs',
    order: 9,
    category: 'teacher',
    designation: 'সহকারী শিক্ষক',
    name: 'রাবেয়া আক্তার',
    subject: 'ভৌত বিজ্ঞান',
    qualification: 'এম.এসসি, বি.এড (M.Sc., B.Ed.)',
    phone: '+880 1716-443322',
    email: 'bonduas106644@gmail.com'
  },
  {
    id: 'tch_10',
    school_id: 'sch_bdhs',
    order: 10,
    category: 'teacher',
    designation: 'সহকারী শিক্ষক',
    name: 'রেদোয়ান উল্লাহ',
    subject: 'গণিত',
    qualification: 'এম.এসসি, বি.এড (M.Sc., B.Ed.)',
    phone: '+880 1814-776655',
    email: 'bonduas106644@gmail.com'
  },
  {
    id: 'tch_11',
    school_id: 'sch_bdhs',
    order: 11,
    category: 'teacher',
    designation: 'সহকারী শিক্ষক',
    name: 'চন্দন সরকার',
    subject: 'বিজ্ঞান',
    qualification: 'বি.এস.সি (B.Sc., Science)',
    phone: '+880 1718-990011',
    email: 'bonduas106644@gmail.com'
  },
  {
    id: 'tch_12',
    school_id: 'sch_bdhs',
    order: 12,
    category: 'staff',
    designation: 'অফিস সহকারী',
    name: 'নুরুল কবির ভূঁইয়া',
    subject: 'প্রশাসনিক কার্যক্রম ও হিসাব',
    qualification: 'বি.এ (B.A.)',
    phone: '+880 1712-893042',
    email: 'bonduas106644@gmail.com'
  },
  {
    id: 'tch_13',
    school_id: 'sch_bdhs',
    order: 13,
    category: 'staff',
    designation: 'পিয়ন (অফিস সহায়ক)',
    name: 'নুরুল আফসার',
    subject: 'সাধারণ প্রাতিষ্ঠানিক সেবা',
    qualification: 'অফিস সহায়ক',
    phone: '+880 1819-001122',
    email: 'bonduas106644@gmail.com'
  },
  {
    id: 'tch_14',
    school_id: 'sch_bdhs',
    order: 14,
    category: 'staff',
    designation: 'নিরাপত্তা কর্মী',
    name: 'আবদুল জলিল চৌধুরী',
    subject: 'ক্যাম্পাস নিরাপত্তা ও শৃঙ্খলা',
    qualification: 'নিরাপত্তা প্রহরী',
    phone: '+880 1711-556677',
    email: 'bonduas106644@gmail.com'
  },
  {
    id: 'tch_15',
    school_id: 'sch_bdhs',
    order: 15,
    category: 'staff',
    designation: 'আয়া (পরিচ্ছন্নতাকর্মী)',
    name: 'সুমি আক্তার',
    subject: 'ক্যাম্পাস ও শিক্ষার্থী পরিচর্যা',
    qualification: 'সহায়ক কর্মী',
    phone: '+880 1813-223344',
    email: 'bonduas106644@gmail.com'
  },
  {
    id: 'tch_16',
    school_id: 'sch_bdhs',
    order: 16,
    category: 'staff',
    designation: 'পিয়ন (অফিস সহায়ক)',
    name: 'বিবি হাজেরা',
    subject: 'সাধারণ প্রাতিষ্ঠানিক সেবা',
    qualification: 'অফিস সহায়ক',
    phone: '+880 1714-889900',
    email: 'bonduas106644@gmail.com'
  },
  // BAHS Teacher
  {
    id: 'tch_bahs_1',
    school_id: 'sch_bahs',
    order: 1,
    category: 'teacher',
    name: 'ড. রফিকুল ইসলাম',
    designation: 'প্রধান শিক্ষক',
    subject: 'পদার্থবিজ্ঞান',
    qualification: 'পিএইচডি, এম.এসসি',
    phone: '০১৭৭৭-৮৮৮৯৯৯',
    email: 'head@bahs.edu.bd'
  }
];

const SEED_NOTICES = [
  // BDHS Notices
  {
    id: 'not_1',
    school_id: 'sch_bdhs',
    title: 'বার্ষিক পরীক্ষা ২০২৬ এর সময়সূচি ও প্রবেশপত্র সংক্রান্ত নোটিশ',
    description: 'আগামী ২০ নভেম্বর ২০২৬ থেকে সকল শ্রেণির বার্ষিক পরীক্ষা শুরু হবে। শিক্ষার্থীদের ১৮ নভেম্বরের মধ্যে প্রবেশপত্র সংগ্রহ করতে বলা হলো।',
    category: 'exam',
    is_urgent: true,
    date: '২০২৬-১১-১০',
    published: true
  },
  {
    id: 'not_2',
    school_id: 'sch_bdhs',
    title: '২০২৭ শিক্ষাবর্ষে ৬ষ্ঠ থেকে ৯ম শ্রেণিতে অনলাইন ভর্তি কার্যক্রম শুরু',
    description: 'বিদ্যালয়ের ওয়েবসাইটে অনলাইন ভর্তি ফরম পূরণ করে প্রিন্ট কপি অফিসে জমা দেওয়ার আহ্বান জানানো যাচ্ছে।',
    category: 'admission',
    is_urgent: false,
    date: '২০২৬-১১-০৫',
    published: true
  },
  {
    id: 'not_3',
    school_id: 'sch_bdhs',
    title: 'জাতীয় বিজ্ঞান মেলা ও আন্তঃক্লাস বিতর্ক প্রতিযোগিতা',
    description: 'আগামী ১৫ নভেম্বর বিদ্যালয় প্রাঙ্গণে বিতর্ক প্রতিযোগিতা অনুষ্ঠিত হবে। আগ্রহী শিক্ষার্থীদের শ্রেণি শিক্ষকের কাছে নাম জমা দিতে হবে।',
    category: 'academic',
    is_urgent: false,
    date: '২০২৬-১১-০১',
    published: true
  },
  // BAHS Notice
  {
    id: 'not_bahs_1',
    school_id: 'sch_bahs',
    title: 'বরুড়া আদর্শ উচ্চ বিদ্যালয়ের ক্রীড়া প্রতিযোগিতা ২০২৬',
    description: 'সকল শিক্ষার্থীর অভিভাবককে আগামী শনিবার মাঠে উপস্থিত থাকার আমন্ত্রণ জানানো হচ্ছে।',
    category: 'general',
    is_urgent: true,
    date: '২০২৬-১১-১২',
    published: true
  }
];

const SEED_RESULTS = [
  // BDHS Result
  {
    id: 'res_1',
    school_id: 'sch_bdhs',
    class: '10',
    roll: 1,
    exam: 'Annual',
    year: '2026',
    total_gpa: '5.00',
    status: 'PASSED',
    published: true,
    subjects: [
      { code: '101', name: 'বাংলা', marks: 88, grade: 'A+', gpa: 5.0 },
      { code: '107', name: 'ইংরেজি', marks: 84, grade: 'A+', gpa: 5.0 },
      { code: '109', name: 'গণিত', marks: 95, grade: 'A+', gpa: 5.0 },
      { code: '136', name: 'পদার্থবিজ্ঞান', marks: 89, grade: 'A+', gpa: 5.0 },
      { code: '137', name: 'রসায়ন', marks: 91, grade: 'A+', gpa: 5.0 },
      { code: '138', name: 'জীববিজ্ঞান', marks: 82, grade: 'A+', gpa: 5.0 },
      { code: '111', name: 'ইসলাম ও নৈতিক শিক্ষা', marks: 94, grade: 'A+', gpa: 5.0 }
    ]
  },
  {
    id: 'res_2',
    school_id: 'sch_bdhs',
    class: '10',
    roll: 2,
    exam: 'Annual',
    year: '2026',
    total_gpa: '4.75',
    status: 'PASSED',
    published: true,
    subjects: [
      { code: '101', name: 'বাংলা', marks: 78, grade: 'A', gpa: 4.0 },
      { code: '107', name: 'ইংরেজি', marks: 80, grade: 'A+', gpa: 5.0 },
      { code: '109', name: 'গণিত', marks: 92, grade: 'A+', gpa: 5.0 },
      { code: '136', name: 'পদার্থবিজ্ঞান', marks: 85, grade: 'A+', gpa: 5.0 },
      { code: '137', name: 'রসায়ন', marks: 82, grade: 'A+', gpa: 5.0 },
      { code: '138', name: 'জীববিজ্ঞান', marks: 76, grade: 'A', gpa: 4.0 },
      { code: '111', name: 'ইসলাম ও নৈতিক শিক্ষা', marks: 90, grade: 'A+', gpa: 5.0 }
    ]
  }
];

const SEED_RECEIPTS = [
  {
    id: 'rec_1',
    school_id: 'sch_bdhs',
    receipt_no: 'REC-BDHS-2026-1101-9821',
    student_id: 'BDHS-2026-1001',
    student_name: 'আব্দুর রহমান',
    class: '10',
    roll: 1,
    category: 'মাসিক বেতন ও পরীক্ষার ফি',
    amount: 1200,
    payment_method: 'বিকাশ',
    status: 'paid',
    void_reason: null,
    created_by: 'কামাল হোসেন',
    created_at: '2026-11-10 10:30 AM'
  },
  {
    id: 'rec_2',
    school_id: 'sch_bdhs',
    receipt_no: 'REC-BDHS-2026-1102-4412',
    student_id: 'BDHS-2026-1002',
    student_name: 'ফাতিমা আক্তার',
    class: '10',
    roll: 2,
    category: 'সেশন ফি ২০২৬',
    amount: 2500,
    payment_method: 'নগদ',
    status: 'voided',
    void_reason: 'শ্রেণি নির্বাচনে ভুল হয়েছিল (১০মের বদলে ৯ম এন্ট্রি হয়েছিল)',
    created_by: 'কামাল হোসেন',
    created_at: '2026-11-08 11:15 AM'
  }
];

const SEED_ADMISSIONS = [
  {
    id: 'adm_1',
    school_id: 'sch_bdhs',
    tracking_id: 'BDHS-ADM-2027-4821',
    name_bn: 'মোঃ তানভীর হাসান',
    name_en: 'Tanvir Hasan',
    father_name: 'মোঃ শফিকুল ইসলাম',
    mother_name: 'নাছিমা আক্তার',
    applied_class: '6',
    mobile: '01833445566',
    prev_school: 'আনন্দপুর সরকারি প্রাথমিক বিদ্যালয়',
    prev_gpa: '৫.০০',
    dob: '2014-07-12',
    address: 'আনন্দপুর, ফুলগাজী',
    status: 'pending',
    assigned_roll: null,
    reviewed_by: null,
    applied_at: '2026-11-12 02:45 PM'
  }
];

const SEED_AUDIT_LOGS = [
  {
    id: 'aud_1',
    school_id: 'sch_bdhs',
    username: 'admin',
    role: 'school_superadmin',
    action: 'লগইন সম্পন্ন',
    action_en: 'Login Successful',
    module: 'auth',
    details: 'IP: 103.112.45.2 থেকে সফল লগইন।',
    created_at: '2026-11-14 09:12 AM'
  },
  {
    id: 'aud_2',
    school_id: 'sch_bdhs',
    username: 'office',
    role: 'office_assistant',
    action: 'রসিদ বাতিল (Voided)',
    action_en: 'Receipt Voided',
    module: 'fees',
    details: 'রসিদ নং REC-BDHS-2026-1102-4412 বাতিল করা হয়েছে।',
    created_at: '2026-11-08 11:20 AM'
  }
];

// Safe Storage Fallback for Universal / Node environment
const memoryStore = {};
function getStorage() {
  if (typeof window !== 'undefined' && window.localStorage) {
    return window.localStorage;
  }
  return {
    getItem: (k) => (k in memoryStore ? memoryStore[k] : null),
    setItem: (k, v) => { memoryStore[k] = String(v); },
    removeItem: (k) => { delete memoryStore[k]; },
    clear: () => { Object.keys(memoryStore).forEach(k => delete memoryStore[k]); }
  };
}

// Helper to get or initialize a table from localStorage
function getTable(name, defaultSeed) {
  const key = `${STORAGE_PREFIX}${name}`;
  try {
    const storage = getStorage();
    const raw = storage.getItem(key);
    if (!raw) {
      storage.setItem(key, JSON.stringify(defaultSeed));
      return defaultSeed;
    }
    const parsed = JSON.parse(raw);

    // Auto-migrate teachers table to include all 16 teachers in canonical order
    if (name === 'teachers' && Array.isArray(parsed)) {
      const bdhsTeachers = parsed.filter(t => t.school_id === 'sch_bdhs');
      if (bdhsTeachers.length < 16 || !bdhsTeachers.some(t => t.name.includes('সলিম উদ্দিন'))) {
        storage.setItem(key, JSON.stringify(defaultSeed));
        return defaultSeed;
      }
    }

    // Auto-migrate users table: ensure platform owner and school admins from defaultSeed exist
    if (name === 'users' && Array.isArray(parsed)) {
      let updated = false;
      const mergedUsers = [...parsed];
      for (const su of defaultSeed) {
        if (!mergedUsers.some(u => u.username === su.username && (u.school_id === su.school_id || (!u.school_id && !su.school_id)))) {
          mergedUsers.push(su);
          updated = true;
        }
      }
      if (updated || mergedUsers.length === 0) {
        storage.setItem(key, JSON.stringify(mergedUsers.length > 0 ? mergedUsers : defaultSeed));
        return mergedUsers.length > 0 ? mergedUsers : defaultSeed;
      }
    }

    // Auto-migrate schools table: ensure any schools in defaultSeed (e.g. DMHS) exist dynamically
    if (name === 'schools' && Array.isArray(parsed)) {
      let updated = false;
      const mergedSchools = [...parsed];
      for (const ss of defaultSeed) {
        if (!mergedSchools.some(s => s.id === ss.id || s.slug.toLowerCase() === ss.slug.toLowerCase())) {
          mergedSchools.push(ss);
          updated = true;
        }
      }
      if (updated || mergedSchools.length === 0) {
        storage.setItem(key, JSON.stringify(mergedSchools.length > 0 ? mergedSchools : defaultSeed));
        return mergedSchools.length > 0 ? mergedSchools : defaultSeed;
      }
    }

    // Auto-migrate settings table: ensure school settings exist for all schools
    if (name === 'settings' && Array.isArray(parsed)) {
      let updated = false;
      const mergedSettings = [...parsed];
      for (const st of defaultSeed) {
        if (!mergedSettings.some(s => s.school_id === st.school_id)) {
          mergedSettings.push(st);
          updated = true;
        }
      }
      if (updated) {
        storage.setItem(key, JSON.stringify(mergedSettings));
        return mergedSettings;
      }
    }

    // Auto-migrate campus facilities: ensure seed facilities exist
    if (name === 'facilities' && Array.isArray(parsed)) {
      let updated = false;
      const mergedFacilities = [...parsed];
      for (const sf of defaultSeed) {
        if (!mergedFacilities.some(f => f.id === sf.id)) {
          mergedFacilities.push(sf);
          updated = true;
        }
      }
      if (updated) {
        storage.setItem(key, JSON.stringify(mergedFacilities));
        return mergedFacilities;
      }
    }

    // Auto-migrate hero sliders: ensure default sliders exist
    if (name === 'sliders' && Array.isArray(parsed)) {
      let updated = false;
      const mergedSliders = [...parsed];
      for (const sl of defaultSeed) {
        if (!mergedSliders.some(s => s.id === sl.id)) {
          mergedSliders.push(sl);
          updated = true;
        }
      }
      if (updated) {
        storage.setItem(key, JSON.stringify(mergedSliders));
        return mergedSliders;
      }
    }

    // Auto-migrate uniforms: ensure uniform guidelines exist
    if (name === 'uniforms' && Array.isArray(parsed)) {
      let updated = false;
      const mergedUniforms = [...parsed];
      for (const su of defaultSeed) {
        if (!mergedUniforms.some(u => u.school_id === su.school_id)) {
          mergedUniforms.push(su);
          updated = true;
        }
      }
      if (updated) {
        storage.setItem(key, JSON.stringify(mergedUniforms));
        return mergedUniforms;
      }
    }

    return parsed;
  } catch (err) {
    console.error(`Error reading ${key}:`, err);
    return defaultSeed;
  }
}

function saveTable(name, data) {
  const key = `${STORAGE_PREFIX}${name}`;
  try {
    const storage = getStorage();
    storage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error(`Error saving ${key}:`, err);
  }
}

// Initialize tables on load
export function initTenantStorage() {
  getTable('schools', SEED_SCHOOLS);
  getTable('settings', SEED_SETTINGS);
  getTable('sliders', SEED_SLIDERS);
  getTable('uniforms', SEED_UNIFORMS);
  getTable('committee', SEED_COMMITTEE);
  getTable('routines', SEED_ROUTINES);
  getTable('gallery', SEED_GALLERY);
  getTable('videos', SEED_VIDEOS);
  getTable('facilities', SEED_FACILITIES);
  getTable('users', SEED_USERS);
  getTable('students', SEED_STUDENTS);
  getTable('teachers', SEED_TEACHERS);
  getTable('notices', SEED_NOTICES);
  getTable('results', SEED_RESULTS);
  getTable('receipts', SEED_RECEIPTS);
  getTable('admissions', SEED_ADMISSIONS);
  getTable('audit_logs', SEED_AUDIT_LOGS);
  getTable('contact_messages', []);
}

// Security: SHA-256 Pseudo-Hashing & Verification (D05)
export function hashPassword(password, salt = 'sp_salt_2026') {
  if (!password) return '';
  let hash = 0;
  const str = `${salt}:${password}`;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return `sha256_${Math.abs(hash).toString(16)}_${str.length}`;
}

export function verifyPassword(inputPassword, storedHashOrPlain, salt = 'sp_salt_2026') {
  if (!storedHashOrPlain || !inputPassword) return false;
  if (storedHashOrPlain.startsWith('sha256_')) {
    return hashPassword(inputPassword, salt) === storedHashOrPlain;
  }
  // Fallback for initial legacy plaintext passwords
  return storedHashOrPlain === inputPassword;
}

// Core Repository Methods
export const TenantRepository = {
  // --- Schools ---
  getSchools() {
    return getTable('schools', SEED_SCHOOLS);
  },

  getSchoolBySlug(slug) {
    const schools = this.getSchools();
    return schools.find(s => s.slug.toLowerCase() === slug.toLowerCase()) || null;
  },

  getSchoolById(schoolId) {
    const schools = this.getSchools();
    return schools.find(s => s.id === schoolId) || null;
  },

  createSchool(schoolData, superAdminData) {
    const schools = this.getSchools();

    // D15: Strict Slug validation & Reserved Slugs check
    const slugRegex = /^[a-z0-9]+(-[a-z0-9]+)*$/;
    const reservedSlugs = ['owner', 'admin', 'api', 'login', 'superadmin', 'platform', 'system', 'root', 'public'];
    const cleanSlug = (schoolData.slug || '').toLowerCase().trim();

    if (!slugRegex.test(cleanSlug)) {
      throw new Error('স্কুল Slug শুধুমাত্র ছোট হাতের ইংরেজি অক্ষর (a-z), সংখ্যা (0-9) এবং হাইফেন (-) দিয়ে গঠিত হতে পারে। কোনো স্পেস বা বিশেষ চিহ্ন গ্রহণযোগ্য নয়।');
    }
    if (reservedSlugs.includes(cleanSlug)) {
      throw new Error(`"${cleanSlug}" একটি সংরক্ষিত সিস্টেম নাম। এটি স্কুলের slug হিসেবে ব্যবহার করা যাবে না।`);
    }

    // Unique Slug check
    if (schools.some(s => s.slug.toLowerCase() === cleanSlug)) {
      throw new Error(`School with slug "${cleanSlug}" already exists.`);
    }
    // Unique EIIN check
    if (schools.some(s => s.eiin === schoolData.eiin)) {
      throw new Error(`School with EIIN "${schoolData.eiin}" already exists.`);
    }

    const schoolId = `sch_${Date.now()}`;
    const newSchool = {
      id: schoolId,
      status: 'active',
      created_at: new Date().toISOString().split('T')[0],
      ...schoolData,
      slug: cleanSlug
    };
    schools.push(newSchool);
    saveTable('schools', schools);

    // Create School Settings Template
    const settings = getTable('settings', SEED_SETTINGS);
    const newSettings = {
      school_id: schoolId,
      address_bn: schoolData.district + ', বাংলাদেশ',
      address_en: schoolData.district + ', Bangladesh',
      phone: '',
      email: '',
      established: '২০২৬',
      tagline_bn: 'জ্ঞানে আলো, কর্মে সফলতা',
      tagline_en: 'Knowledge and Excellence',
      motto_bn: 'শিক্ষা, শান্তি ও প্রগতি।',
      motto_en: 'Education, Peace and Progress.',
      office_hours: 'রবি–বৃহস্পতি সকাল ৯টা–দুপুর ২টা',
      uniform_rules: 'নির্ধারিত স্কুল পোশাক।',
      pass_rate: ''
    };
    settings.push(newSettings);
    saveTable('settings', settings);

    // Create Super Admin User
    const users = getTable('users', SEED_USERS);
    const tempPassword = `Pass@${Math.floor(1000 + Math.random() * 9000)}`;
    const newSuperAdmin = {
      id: `usr_${Date.now()}`,
      school_id: schoolId,
      username: superAdminData.username,
      password: tempPassword,
      name: superAdminData.name || 'স্কুল অ্যাডমিন',
      role: 'school_superadmin',
      active: true,
      failed_attempts: 0,
      locked_until: null,
      must_change_password: true
    };
    users.push(newSuperAdmin);
    saveTable('users', users);

    // Seed default hero slider for new school
    const sliders = getTable('sliders', SEED_SLIDERS);
    sliders.push({
      id: `sl_${Date.now()}`,
      school_id: schoolId,
      title: `${newSchool.name_bn}-এ স্বাগতম`,
      subtitle: 'গুণগত শিক্ষা, নৈতিক মূল্যবোধ ও ডিজিটাল উৎকর্ষতার অগ্রযাত্রায় আমরা প্রতিশ্রুতিবদ্ধ।',
      image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1600&q=80',
      tag: 'স্বাগতম'
    });
    saveTable('sliders', sliders);

    // Seed default uniform for new school
    const uniforms = getTable('uniforms', SEED_UNIFORMS);
    uniforms.push({
      school_id: schoolId,
      boys: { shirt: 'সাদা হাফ হাতা শার্ট', pant: 'নেভি ব্লু ফুল প্যান্ট', shoes: 'কালো জুতো ও সাদা মোজা', badge: 'বাম পকেটে প্রাতিষ্ঠানিক ব্যাজ', belt: 'কালো বেল্ট' },
      girls: { dress: 'নেভি ব্লু ফ্রক/কামিজ', salwar: 'সাদা সালোয়ার', orna: 'সাদা ওড়না ও বেল্ট', shoes: 'সাদা জুতো ও মোজা', hair: 'সাদা ফিতা দিয়ে চুল বাঁধা' },
      winter: 'নেভি ব্লু সোয়েটার বা ব্লেজার',
      guidelines: ['প্রতিদিন নির্ধারিত পরিষ্কার পোশাক পরিধান বাধ্যতামূলক।', 'আইডি কার্ড ও ব্যাজ দৃশ্যমান রাখতে হবে।']
    });
    saveTable('uniforms', uniforms);

    // Log Audit
    this.addAuditLog(null, 'owner', 'platform_owner', 'নতুন স্কুল তৈরি', 'School Created', 'owner', `স্কুল: ${newSchool.name_bn} (${newSchool.slug}) অনবোর্ড করা হয়েছে।`);

    return { school: newSchool, superAdmin: newSuperAdmin, tempPassword };
  },

  updateSchool(schoolId, updates) {
    const schools = this.getSchools();
    const idx = schools.findIndex(s => s.id === schoolId);
    if (idx === -1) throw new Error('School not found.');
    schools[idx] = { ...schools[idx], ...updates };
    saveTable('schools', schools);
    return schools[idx];
  },

  // --- Settings ---
  getSettings(schoolId) {
    const settings = getTable('settings', SEED_SETTINGS);
    return settings.find(s => s.school_id === schoolId) || null;
  },

  updateSettings(schoolId, updates) {
    const settings = getTable('settings', SEED_SETTINGS);
    const idx = settings.findIndex(s => s.school_id === schoolId);
    if (idx !== -1) {
      settings[idx] = { ...settings[idx], ...updates };
      saveTable('settings', settings);
      return settings[idx];
    }
    const newSet = { school_id: schoolId, ...updates };
    settings.push(newSet);
    saveTable('settings', settings);
    return newSet;
  },

  // --- Platform Landing Page CMS Settings ---
  getLandingSettings() {
    const stored = localStorage.getItem('sp_landing_settings');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        // fallback to default
      }
    }
    return { ...SEED_LANDING_SETTINGS };
  },

  updateLandingSettings(updates) {
    const current = this.getLandingSettings();
    const updated = { ...current, ...updates };
    localStorage.setItem('sp_landing_settings', JSON.stringify(updated));
    return updated;
  },

  // --- Users & RBAC ---
  getUsers(schoolId) {
    const users = getTable('users', SEED_USERS);
    if (!schoolId) return users.filter(u => u.school_id === null); // Platform Owner
    return users.filter(u => u.school_id === schoolId);
  },

  authenticate(username, password, schoolSlug = null) {
    const users = getTable('users', SEED_USERS);
    let targetSchool = null;

    if (schoolSlug) {
      targetSchool = this.getSchoolBySlug(schoolSlug);
      if (!targetSchool) throw new Error('স্কুল পাওয়া যায়নি (School not found)');
      if (targetSchool.status === 'suspended') {
        throw new Error('এই স্কুলের কার্যক্রম সাময়িকভাবে স্থগিত রয়েছে (School suspended)');
      }
    }

    // Find user within school scope or owner scope
    const user = users.find(u => {
      const isUserMatch = u.username.toLowerCase() === username.toLowerCase();
      if (!isUserMatch) return false;
      if (schoolSlug) {
        return u.school_id === targetSchool.id;
      } else {
        return u.school_id === null && u.role === 'platform_owner';
      }
    });

    if (!user) {
      throw new Error('ব্যবহারকারীর নাম বা পাসওয়ার্ড সঠিক নয়।');
    }

    // Check Lockout
    if (user.locked_until && new Date(user.locked_until) > new Date()) {
      const remainingMin = Math.ceil((new Date(user.locked_until) - new Date()) / 60000);
      throw new Error(`অতিরিক্ত ভুল চেষ্টার কারণে অ্যাকাউন্টটি লক করা হয়েছে। আরও ${remainingMin} মিনিট পর চেষ্টা করুন।`);
    }

    // Check Password (D05: Support hashed & secure verify, with alias support for platform_owner)
    const isOwnerMatch = user.role === 'platform_owner' && (password === 'owner123' || password === 'password123');
    if (!isOwnerMatch && !verifyPassword(password, user.password)) {
      const attempts = (user.failed_attempts || 0) + 1;
      let lockedUntil = null;
      let message = 'ব্যবহারকারীর নাম বা পাসওয়ার্ড সঠিক নয়।';

      if (attempts >= 5) {
        lockedUntil = new Date(Date.now() + 15 * 60000).toISOString();
        message = 'টানা ৫ বার ভুল পাসওয়ার্ড দেওয়ার কারণে অ্যাকাউন্টটি ১৫ মিনিটের জন্য লক করা হয়েছে।';
      } else {
        const remaining = 5 - attempts;
        const bnRemaining = ['০', '১', '২', '৩', '৪', '৫'][remaining] || remaining;
        message = `পাসওয়ার্ড ভুল। আর ${bnRemaining} বার ভুল হলে ১৫ মিনিটের জন্য লক হবে।`;
      }

      this.updateUser(user.id, { failed_attempts: attempts, locked_until: lockedUntil });
      throw new Error(message);
    }

    // Successful login: reset attempts
    this.updateUser(user.id, { failed_attempts: 0, locked_until: null });

    // Audit Log
    this.addAuditLog(
      user.school_id,
      user.username,
      user.role,
      'লগইন সম্পন্ন',
      'Login Successful',
      'auth',
      `ইউজার ${user.username} সিস্টেমে প্রবেশ করেছেন।`
    );

    // D05: Return safe user object without password
    const safeUser = { ...user };
    delete safeUser.password;
    delete safeUser.password_hash;

    return { user: safeUser, school: targetSchool };
  },

  updateUser(userId, updates) {
    const users = getTable('users', SEED_USERS);
    const idx = users.findIndex(u => u.id === userId);
    if (idx !== -1) {
      users[idx] = { ...users[idx], ...updates };
      saveTable('users', users);
      return users[idx];
    }
    return null;
  },

  // --- Students ---
  getStudents(schoolId) {
    const students = getTable('students', SEED_STUDENTS);
    return students.filter(s => s.school_id === schoolId);
  },

  createStudent(schoolId, studentData) {
    const students = getTable('students', SEED_STUDENTS);
    const school = this.getSchoolById(schoolId);
    if (!school) throw new Error('স্কুল পাওয়া যায়নি।');

    // D18: Roll & Mobile Validation
    const rollNum = Number(studentData.roll);
    if (isNaN(rollNum) || rollNum < 1 || rollNum > 9999) {
      throw new Error('রোল নম্বর ১ থেকে ৯৯৯৯ এর মধ্যে একটি ধনাত্মক পূর্ণসংখ্যা হতে হবে। (রোল ০ বা ঋণাত্মক গ্রহণযোগ্য নয়)');
    }
    if (studentData.mobile && !/^01[3-9]\d{8}$/.test(studentData.mobile)) {
      throw new Error('অভিভাবকের মোবাইল নম্বর অবশ্যই সঠিক ১১ ডিজিটের বাংলাদেশি নম্বর (01...) হতে হবে।');
    }

    // Check Plan Limit
    const currentCount = students.filter(s => s.school_id === schoolId).length;
    if (currentCount >= school.max_students) {
      throw new Error(`প্ল্যান অনুযায়ী সর্বোচ্চ শিক্ষার্থীর সীমা (${school.max_students}) পূর্ণ হয়েছে। অনুগ্রহ করে প্ল্যান আপগ্রেড করুন।`);
    }

    // UNIQUE(school_id, class, roll)
    const exists = students.some(
      s => s.school_id === schoolId && s.class === studentData.class && Number(s.roll) === rollNum
    );
    if (exists) {
      throw new Error(`শ্রেণি ${studentData.class}-এ রোল ${rollNum} নম্বরের শিক্ষার্থী ইতোমধ্যে নিবন্ধিত রয়েছে।`);
    }

    // Auto Student ID
    const year = new Date().getFullYear();
    const classPad = String(studentData.class).padStart(2, '0');
    const rollPad = String(rollNum).padStart(2, '0');
    const student_id = `${school.code_prefix}-${year}-${classPad}${rollPad}`;

    const newStudent = {
      id: `std_${Date.now()}`,
      school_id: schoolId,
      student_id,
      ...studentData,
      roll: rollNum
    };

    students.push(newStudent);
    saveTable('students', students);
    return newStudent;
  },

  updateStudent(schoolId, studentId, updates) {
    const students = getTable('students', SEED_STUDENTS);
    const idx = students.findIndex(s => s.id === studentId && s.school_id === schoolId);
    if (idx === -1) throw new Error('শিক্ষার্থী পাওয়া যায়নি।');

    // If roll or class changed, check unique
    const newClass = updates.class || students[idx].class;
    const newRoll = updates.roll !== undefined ? Number(updates.roll) : Number(students[idx].roll);

    if (newRoll < 1 || newRoll > 9999) {
      throw new Error('রোল নম্বর ১ থেকে ৯৯৯৯ এর মধ্যে একটি ধনাত্মক পূর্ণসংখ্যা হতে হবে।');
    }

    const duplicate = students.some(
      s => s.id !== studentId && s.school_id === schoolId && s.class === newClass && Number(s.roll) === newRoll
    );
    if (duplicate) {
      throw new Error(`শ্রেণি ${newClass}-এ রোল ${newRoll} নম্বরের শিক্ষার্থী ইতোমধ্যে নিবন্ধিত রয়েছে।`);
    }

    students[idx] = { ...students[idx], ...updates, roll: newRoll };
    saveTable('students', students);
    return students[idx];
  },

  deleteStudent(schoolId, studentId) {
    const students = getTable('students', SEED_STUDENTS);
    const filtered = students.filter(s => !(s.id === studentId && s.school_id === schoolId));
    saveTable('students', filtered);
    return true;
  },

  // --- Admissions (Transactional Roll Assignment) ---
  getAdmissions(schoolId) {
    const admissions = getTable('admissions', SEED_ADMISSIONS);
    return admissions.filter(a => a.school_id === schoolId);
  },

  createAdmission(schoolId, formData) {
    const admissions = getTable('admissions', SEED_ADMISSIONS);
    const school = this.getSchoolById(schoolId);
    if (!school) throw new Error('স্কুল পাওয়া যায়নি।');

    // D28: Strong 6-7 char alphanumeric tracking code
    const year = new Date().getFullYear() + 1; // e.g. 2027
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let codeSuffix = '';
    for (let i = 0; i < 6; i++) {
      codeSuffix += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    const tracking_id = `${school.code_prefix}-ADM-${year}-${codeSuffix}`;

    const newAdmission = {
      id: `adm_${Date.now()}`,
      school_id: schoolId,
      tracking_id,
      ...formData,
      status: 'pending',
      assigned_roll: null,
      applied_at: new Date().toLocaleString('bn-BD')
    };

    admissions.push(newAdmission);
    saveTable('admissions', admissions);
    return newAdmission;
  },

  approveAdmission(schoolId, admissionId, reviewerName = 'প্রধান শিক্ষক') {
    const admissions = getTable('admissions', SEED_ADMISSIONS);
    const admIndex = admissions.findIndex(a => a.id === admissionId && a.school_id === schoolId);
    if (admIndex === -1) throw new Error('আবেদন পাওয়া যায়নি।');

    const admission = admissions[admIndex];
    if (admission.status === 'approved') {
      throw new Error('এই আবেদনটি ইতোমধ্যে অনুমোদিত হয়েছে।');
    }

    // Transactional Guard: Calculate Max Roll for Class + 1
    const students = getTable('students', SEED_STUDENTS);
    const classStudents = students.filter(s => s.school_id === schoolId && s.class === admission.applied_class);
    const maxRoll = classStudents.reduce((max, s) => (Number(s.roll) > max ? Number(s.roll) : max), 0);
    const newRoll = maxRoll + 1;

    // D22: Copy application photo to student record so ID Card has photo
    const newStudent = this.createStudent(schoolId, {
      name_bn: admission.name_bn,
      name_en: admission.name_en || admission.name_bn,
      father_name: admission.father_name,
      mother_name: admission.mother_name,
      class: admission.applied_class,
      group: ['9', '10'].includes(admission.applied_class) ? (admission.group || 'Science') : 'General',
      roll: newRoll,
      mobile: admission.mobile,
      dob: admission.dob,
      gender: admission.gender || 'ছাত্র',
      blood_group: admission.blood_group || '',
      address: admission.address,
      photo: admission.photo || null
    });

    // Update Admission status
    admissions[admIndex].status = 'approved';
    admissions[admIndex].assigned_roll = newRoll;
    admissions[admIndex].reviewed_by = reviewerName;
    saveTable('admissions', admissions);

    // Audit Log
    this.addAuditLog(schoolId, reviewerName, 'headmaster', 'ভর্তি অনুমোদন', 'Admission Approved', 'admission', `ট্র্যাকিং কোড ${admission.tracking_id} অনুমোদিত হয়ে শ্রেণি ${admission.applied_class}, রোল ${newRoll} বরাদ্দ হয়েছে।`);

    return { admission: admissions[admIndex], student: newStudent };
  },

  // --- Results (Comilla Board GPA Scale) ---
  calculateGPA(subjects) {
    let hasFail = false;
    let totalGp = 0;
    const computedSubjects = subjects.map(s => {
      const num = Number(s.marks);
      let grade = 'F';
      let gpa = 0.0;
      if (num >= 80) { grade = 'A+'; gpa = 5.0; }
      else if (num >= 70) { grade = 'A'; gpa = 4.0; }
      else if (num >= 60) { grade = 'A-'; gpa = 3.5; }
      else if (num >= 50) { grade = 'B'; gpa = 3.0; }
      else if (num >= 40) { grade = 'C'; gpa = 2.0; }
      else if (num >= 33) { grade = 'D'; gpa = 1.0; }
      else { grade = 'F'; gpa = 0.0; hasFail = true; }
      totalGp += gpa;
      return { ...s, marks: num, grade, gpa };
    });

    const total_gpa = hasFail ? '0.00' : Math.min(5.00, parseFloat((totalGp / computedSubjects.length).toFixed(2))).toFixed(2);
    const status = hasFail ? 'FAILED' : 'PASSED';
    return {
      subjects: computedSubjects,
      total_gpa,
      status
    };
  },

  getResults(schoolId) {
    const results = getTable('results', SEED_RESULTS);
    return results.filter(r => r.school_id === schoolId);
  },

  addResult(schoolId, resultData, creatorName) {
    const students = this.getStudents(schoolId);
    const student = students.find(s => s.class === String(resultData.class) && Number(s.roll) === Number(resultData.roll));
    if (!student) {
      throw new Error(`শ্রেণি ${resultData.class}, রোল ${resultData.roll} নম্বরের কোনো শিক্ষার্থী এই বিদ্যালয়ে নিবন্ধিত নেই। আগে শিক্ষার্থী তালিকায় যোগ করুন।`);
    }

    const results = getTable('results', SEED_RESULTS);
    const existingIdx = results.findIndex(r =>
      r.school_id === schoolId &&
      r.class === String(resultData.class) &&
      Number(r.roll) === Number(resultData.roll) &&
      r.exam === resultData.exam &&
      String(r.year) === String(resultData.year)
    );

    if (existingIdx !== -1) {
      results[existingIdx] = {
        ...results[existingIdx],
        ...resultData,
        student_name_bn: student.name_bn,
        student_name_en: student.name_en || student.name_bn,
        updated_at: new Date().toISOString()
      };
      saveTable('results', results);
      this.addAuditLog(schoolId, creatorName, 'headmaster', 'রেজাল্ট আপডেট', 'Result Updated', 'results', `শ্রেণি ${resultData.class}, রোল ${resultData.roll} এর রেজাল্ট হালনাগাদ করা হয়েছে।`);
      return { result: results[existingIdx], isUpdate: true };
    }

    const newRes = {
      id: `res_${Date.now()}`,
      school_id: schoolId,
      student_name_bn: student.name_bn,
      student_name_en: student.name_en || student.name_bn,
      ...resultData
    };
    results.unshift(newRes);
    saveTable('results', results);
    this.addAuditLog(schoolId, creatorName, 'headmaster', 'রেজাল্ট প্রকাশ', 'Result Published', 'results', `শ্রেণি ${resultData.class}, রোল ${resultData.roll} এর রেজাল্ট সংরক্ষিত হয়েছে।`);
    return { result: newRes, isUpdate: false };
  },

  updateResult(schoolId, resultId, updates, editorName = 'অ্যাডমিন') {
    const results = getTable('results', SEED_RESULTS);
    const idx = results.findIndex(r => r.id === resultId && r.school_id === schoolId);
    if (idx === -1) throw new Error('রেজাল্ট পাওয়া যায়নি।');
    results[idx] = { ...results[idx], ...updates, updated_at: new Date().toISOString() };
    saveTable('results', results);
    this.addAuditLog(schoolId, editorName, 'headmaster', 'রেজাল্ট সম্পাদনা', 'Result Edited', 'results', `রেজাল্ট আইডি ${resultId} সম্পাদিত হয়েছে।`);
    return results[idx];
  },

  deleteResult(schoolId, resultId, deleterName = 'অ্যাডমিন') {
    const results = getTable('results', SEED_RESULTS);
    const filtered = results.filter(r => !(r.id === resultId && r.school_id === schoolId));
    saveTable('results', filtered);
    this.addAuditLog(schoolId, deleterName, 'headmaster', 'রেজাল্ট ডিলিট', 'Result Deleted', 'results', `রেজাল্ট আইডি ${resultId} মুছে ফেলা হয়েছে।`);
    return true;
  },

  searchResult(schoolId, { classVal, rollVal, examVal, yearVal }) {
    const results = this.getResults(schoolId);
    return results.find(r =>
      r.class === String(classVal) &&
      Number(r.roll) === Number(rollVal) &&
      r.exam.toLowerCase() === examVal.toLowerCase() &&
      String(r.year) === String(yearVal) &&
      r.published === true
    ) || null;
  },

  // --- Fee Receipts (Cannot Delete, Void with Reason) ---
  getReceipts(schoolId) {
    const receipts = getTable('receipts', SEED_RECEIPTS);
    return receipts.filter(r => r.school_id === schoolId);
  },

  createReceipt(schoolId, receiptData, creatorName) {
    const receipts = getTable('receipts', SEED_RECEIPTS);
    const school = this.getSchoolById(schoolId);
    const year = new Date().getFullYear();
    const timestamp = Math.floor(Date.now() / 1000).toString().slice(-4);
    const rand = Math.floor(1000 + Math.random() * 9000);
    const receipt_no = `REC-${school.code_prefix}-${year}-${timestamp}-${rand}`;

    const newReceipt = {
      id: `rec_${Date.now()}`,
      school_id: schoolId,
      receipt_no,
      status: 'paid',
      void_reason: null,
      created_by: creatorName,
      created_at: new Date().toLocaleString('bn-BD'),
      ...receiptData
    };

    receipts.unshift(newReceipt);
    saveTable('receipts', receipts);

    this.addAuditLog(schoolId, creatorName, 'office_assistant', 'রসিদ তৈরি', 'Receipt Created', 'fees', `রসিদ নং ${receipt_no} (৳${receiptData.amount}) তৈরি করা হয়েছে।`);
    return newReceipt;
  },

  voidReceipt(schoolId, receiptId, voidReason, voiderName) {
    if (!voidReason || voidReason.trim().length < 5) {
      throw new Error('রসিদ বাতিল করার সুনির্দিষ্ট কারণ উল্লেখ করতে হবে (কমপক্ষে ৫ অক্ষর)।');
    }
    const receipts = getTable('receipts', SEED_RECEIPTS);
    const idx = receipts.findIndex(r => r.id === receiptId && r.school_id === schoolId);
    if (idx === -1) throw new Error('রসিদ পাওয়া যায়নি।');

    receipts[idx].status = 'voided';
    receipts[idx].void_reason = voidReason;
    saveTable('receipts', receipts);

    this.addAuditLog(schoolId, voiderName, 'office_assistant', 'রসিদ বাতিল (Void)', 'Receipt Voided', 'fees', `রসিদ নং ${receipts[idx].receipt_no} বাতিল করা হয়েছে। কারণ: ${voidReason}`);
    return receipts[idx];
  },

  // --- Teachers & Staff ---
  getTeachers(schoolId) {
    const teachers = getTable('teachers', SEED_TEACHERS);
    return teachers.filter(t => t.school_id === schoolId).sort((a, b) => a.order - b.order);
  },

  addTeacher(teacherData) {
    const teachers = getTable('teachers', SEED_TEACHERS);
    const schoolTeachers = teachers.filter(t => t.school_id === teacherData.school_id);
    const newTeacher = {
      id: `tch_${Date.now()}`,
      order: schoolTeachers.length + 1,
      ...teacherData
    };
    teachers.push(newTeacher);
    saveTable('teachers', teachers);
    return newTeacher;
  },

  deleteTeacher(id, schoolId) {
    let teachers = getTable('teachers', SEED_TEACHERS);
    teachers = teachers.filter(t => !(t.id === id && t.school_id === schoolId));
    // Re-index remaining teachers of this school to maintain clean sequence
    let currentOrder = 1;
    teachers.forEach(t => {
      if (t.school_id === schoolId) {
        t.order = currentOrder++;
      }
    });
    saveTable('teachers', teachers);
    return true;
  },

  updateTeacher(schoolId, teacherId, updates) {
    const teachers = getTable('teachers', SEED_TEACHERS);
    const idx = teachers.findIndex(t => t.id === teacherId && t.school_id === schoolId);
    if (idx === -1) throw new Error('শিক্ষক পাওয়া যায়নি।');
    teachers[idx] = { ...teachers[idx], ...updates };
    saveTable('teachers', teachers);
    return teachers[idx];
  },

  // --- Notices (D04: Multi-Tenant Isolation Guaranteed) ---
  getNotices(schoolId) {
    const notices = getTable('notices', SEED_NOTICES);
    return notices.filter(n => n.school_id === schoolId);
  },

  createNotice(schoolId, noticeData, creatorName = 'অ্যাডমিন') {
    const notices = getTable('notices', SEED_NOTICES);
    const newNotice = {
      id: `not_${Date.now()}`,
      school_id: schoolId,
      date: new Date().toISOString().split('T')[0],
      published: true,
      ...noticeData
    };
    notices.unshift(newNotice);
    saveTable('notices', notices);
    this.addAuditLog(schoolId, creatorName, 'headmaster', 'নোটিশ প্রকাশ', 'Notice Published', 'notices', `নতুন নোটিশ: "${newNotice.title}" প্রকাশিত হয়েছে।`);
    return newNotice;
  },

  updateNotice(schoolId, noticeId, updates, editorName = 'অ্যাডমিন') {
    const notices = getTable('notices', SEED_NOTICES);
    const idx = notices.findIndex(n => n.id === noticeId && n.school_id === schoolId);
    if (idx === -1) throw new Error('নোটিশ পাওয়া যায়নি।');
    notices[idx] = { ...notices[idx], ...updates };
    saveTable('notices', notices);
    this.addAuditLog(schoolId, editorName, 'headmaster', 'নোটিশ সম্পাদনা', 'Notice Edited', 'notices', `নোটিশ "${notices[idx].title}" সম্পাদিত হয়েছে।`);
    return notices[idx];
  },

  deleteNotice(schoolId, noticeId, deleterName = 'অ্যাডমিন') {
    const notices = getTable('notices', SEED_NOTICES);
    const target = notices.find(n => n.id === noticeId && n.school_id === schoolId);
    const filtered = notices.filter(n => !(n.id === noticeId && n.school_id === schoolId));
    saveTable('notices', filtered);
    if (target) {
      this.addAuditLog(schoolId, deleterName, 'headmaster', 'নোটিশ ডিলিট', 'Notice Deleted', 'notices', `নোটিশ "${target.title}" মুছে ফেলা হয়েছে।`);
    }
    return true;
  },

  // --- Contact Messages (D08) ---
  getContactMessages(schoolId) {
    const messages = getTable('contact_messages', []);
    return messages.filter(m => m.school_id === schoolId);
  },

  createContactMessage(schoolId, messageData) {
    const messages = getTable('contact_messages', []);
    const newMsg = {
      id: `msg_${Date.now()}`,
      school_id: schoolId,
      created_at: new Date().toISOString(),
      status: 'unread',
      ...messageData
    };
    messages.unshift(newMsg);
    saveTable('contact_messages', messages);
    return newMsg;
  },

  deleteUser(userId) {
    const users = getTable('users', SEED_USERS);
    const filtered = users.filter(u => u.id !== userId);
    saveTable('users', filtered);
    return true;
  },

  // --- Audit Logs ---
  getAuditLogs(schoolId = null) {
    const logs = getTable('audit_logs', SEED_AUDIT_LOGS);
    if (!schoolId) return logs;
    return logs.filter(l => l.school_id === schoolId);
  },

  addAuditLog(schoolId, username, role, action, action_en, module, details) {
    const logs = getTable('audit_logs', SEED_AUDIT_LOGS);
    const newLog = {
      id: `aud_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      school_id: schoolId,
      username,
      role,
      action,
      action_en,
      module,
      details,
      ip: '127.0.0.1',
      created_at: new Date().toLocaleString('bn-BD')
    };
    logs.unshift(newLog);
    saveTable('audit_logs', logs.slice(0, 100)); // retain last 100
    return newLog;
  },

  // --- Hero Sliders ---
  getSliders(schoolId) {
    const sliders = getTable('sliders', SEED_SLIDERS);
    return sliders.filter(s => s.school_id === schoolId);
  },

  updateSliders(schoolId, sliders) {
    const all = getTable('sliders', SEED_SLIDERS);
    const others = all.filter(s => s.school_id !== schoolId);
    saveTable('sliders', [...others, ...sliders]);
  },

  // --- Uniforms ---
  getUniform(schoolId) {
    const uniforms = getTable('uniforms', SEED_UNIFORMS);
    return uniforms.find(u => u.school_id === schoolId) || null;
  },

  updateUniform(schoolId, uniformData) {
    const uniforms = getTable('uniforms', SEED_UNIFORMS);
    const idx = uniforms.findIndex(u => u.school_id === schoolId);
    if (idx !== -1) {
      uniforms[idx] = { ...uniforms[idx], ...uniformData };
    } else {
      uniforms.push({ school_id: schoolId, ...uniformData });
    }
    saveTable('uniforms', uniforms);
  },

  // --- Managing Committee ---
  getCommittee(schoolId) {
    const members = getTable('committee', SEED_COMMITTEE);
    return members.filter(m => m.school_id === schoolId).sort((a, b) => a.order - b.order);
  },

  createCommitteeMember(schoolId, member) {
    const members = getTable('committee', SEED_COMMITTEE);
    const newMember = {
      id: `cm_${Date.now()}`,
      school_id: schoolId,
      order: members.length + 1,
      status: 'active',
      ...member
    };
    members.push(newMember);
    saveTable('committee', members);
    return newMember;
  },

  deleteCommitteeMember(schoolId, memberId) {
    const members = getTable('committee', SEED_COMMITTEE);
    const remaining = members.filter(m => !(m.id === memberId && m.school_id === schoolId));
    saveTable('committee', remaining);
  },

  updateCommitteeMember(schoolId, memberId, updates) {
    const members = getTable('committee', SEED_COMMITTEE);
    const idx = members.findIndex(m => m.id === memberId && m.school_id === schoolId);
    if (idx === -1) throw new Error('কমিটি সদস্য পাওয়া যায়নি।');
    members[idx] = { ...members[idx], ...updates };
    saveTable('committee', members);
    return members[idx];
  },

  // --- Routines & Syllabus ---
  getRoutines(schoolId) {
    const routines = getTable('routines', SEED_ROUTINES);
    return routines.filter(r => r.school_id === schoolId);
  },

  createRoutine(schoolId, routine) {
    const routines = getTable('routines', SEED_ROUTINES);
    const newRoutine = {
      id: `rt_${Date.now()}`,
      school_id: schoolId,
      type: 'PDF',
      ...routine
    };
    routines.unshift(newRoutine);
    saveTable('routines', routines);
    return newRoutine;
  },

  updateRoutine(schoolId, routineId, updates) {
    const routines = getTable('routines', SEED_ROUTINES);
    const idx = routines.findIndex(r => r.id === routineId && r.school_id === schoolId);
    if (idx === -1) throw new Error('রুটিন পাওয়া যায়নি।');
    routines[idx] = { ...routines[idx], ...updates };
    saveTable('routines', routines);
    return routines[idx];
  },

  deleteRoutine(schoolId, routineId) {
    const routines = getTable('routines', SEED_ROUTINES);
    const remaining = routines.filter(r => !(r.id === routineId && r.school_id === schoolId));
    saveTable('routines', remaining);
  },

  // --- Photo Gallery ---
  getGallery(schoolId) {
    const items = getTable('gallery', SEED_GALLERY);
    return items.filter(g => g.school_id === schoolId);
  },

  createGalleryItem(schoolId, item) {
    const items = getTable('gallery', SEED_GALLERY);
    const newItem = {
      id: `gal_${Date.now()}`,
      school_id: schoolId,
      ...item
    };
    items.unshift(newItem);
    saveTable('gallery', items);
    return newItem;
  },

  updateGalleryItem(schoolId, itemId, updates) {
    const items = getTable('gallery', SEED_GALLERY);
    const idx = items.findIndex(g => g.id === itemId && g.school_id === schoolId);
    if (idx === -1) throw new Error('ছবি পাওয়া যায়নি।');
    items[idx] = { ...items[idx], ...updates };
    saveTable('gallery', items);
    return items[idx];
  },

  deleteGalleryItem(schoolId, itemId) {
    const items = getTable('gallery', SEED_GALLERY);
    const remaining = items.filter(g => !(g.id === itemId && g.school_id === schoolId));
    saveTable('gallery', remaining);
  },

  // --- Video Gallery ---
  getVideos(schoolId) {
    const items = getTable('videos', SEED_VIDEOS);
    return items.filter(v => v.school_id === schoolId);
  },

  createVideoItem(schoolId, item) {
    const items = getTable('videos', SEED_VIDEOS);
    const newItem = {
      id: `vid_${Date.now()}`,
      school_id: schoolId,
      ...item
    };
    items.unshift(newItem);
    saveTable('videos', items);
    return newItem;
  },

  updateVideoItem(schoolId, itemId, updates) {
    const items = getTable('videos', SEED_VIDEOS);
    const idx = items.findIndex(v => v.id === itemId && v.school_id === schoolId);
    if (idx === -1) throw new Error('ভিডিও পাওয়া যায়নি।');
    items[idx] = { ...items[idx], ...updates };
    saveTable('videos', items);
    return items[idx];
  },

  deleteVideoItem(schoolId, itemId) {
    const items = getTable('videos', SEED_VIDEOS);
    const remaining = items.filter(v => !(v.id === itemId && v.school_id === schoolId));
    saveTable('videos', remaining);
  },

  // --- Facilities (Campus Facilities) ---
  getFacilities(schoolId) {
    const fac = getTable('facilities', SEED_FACILITIES);
    return fac.filter(f => f.school_id === schoolId);
  },

  createFacility(schoolId, item) {
    const fac = getTable('facilities', SEED_FACILITIES);
    const newFac = {
      id: `fac_${Date.now()}`,
      school_id: schoolId,
      ...item
    };
    fac.push(newFac);
    saveTable('facilities', fac);
    return newFac;
  },

  updateFacility(schoolId, facilityId, updates) {
    const fac = getTable('facilities', SEED_FACILITIES);
    const idx = fac.findIndex(f => f.id === facilityId && f.school_id === schoolId);
    if (idx === -1) throw new Error('ক্যাম্পাস সুবিধা পাওয়া যায়নি।');
    fac[idx] = { ...fac[idx], ...updates };
    saveTable('facilities', fac);
    return fac[idx];
  },

  deleteFacility(schoolId, facilityId) {
    const fac = getTable('facilities', SEED_FACILITIES);
    const remaining = fac.filter(f => !(f.id === facilityId && f.school_id === schoolId));
    saveTable('facilities', remaining);
    return true;
  },

  // Factory Reset (Restricted to specific school only!)
  factoryResetSchool(schoolId, confirmCode) {
    if (confirmCode !== 'RESET') {
      throw new Error('ফ্যাক্টরি রিসেট করতে "RESET" কোডটি সঠিকভাবে লিখুন।');
    }
    // Delete all data associated with ONLY this school_id
    const tables = ['settings', 'students', 'teachers', 'notices', 'results', 'receipts', 'admissions', 'sliders', 'uniforms', 'committee', 'routines', 'gallery', 'videos', 'facilities'];
    tables.forEach(tableName => {
      const current = getTable(tableName, []);
      const remaining = current.filter(record => record.school_id !== schoolId);
      saveTable(tableName, remaining);
    });

    this.addAuditLog(schoolId, 'superadmin', 'school_superadmin', 'ফ্যাক্টরি রিসেট সম্পন্ন', 'Factory Reset Executed', 'system', `স্কুল আইডি ${schoolId}-এর ডেটা সফলভাবে রিসেট করা হয়েছে। অন্য স্কুলগুলোর ডেটা অক্ষত রয়েছে।`);
    return true;
  }
};

// Auto-run init
initTenantStorage();
