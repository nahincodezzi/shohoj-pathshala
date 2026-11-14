/**
 * ============================================================================
 * সহজ পাঠশালা (Sohoj Pathshala) — Multi-Tenant Storage & Repository Engine
 * Enforces strict tenant data isolation, unique constraints, transactional operations,
 * audit logging, and RBAC data access rules.
 * ============================================================================
 */

const STORAGE_PREFIX = 'sp_tenant_';

// Initial Seed Data for School 1 (BDHS) & School 2 (BAHS)
const SEED_SCHOOLS = [
  {
    id: 'sch_bdhs',
    slug: 'bdhs',
    name_bn: 'বন্দুয়া দৌলতপুর উচ্চ বিদ্যালয়',
    name_en: 'Bondua Daulatpur High School',
    eiin: '106644',
    school_code: '4320',
    mpo_code: '0905171301',
    board: 'কুমিল্লা',
    district: 'কুমিল্লা',
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
  }
];

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
  // BDHS Users
  {
    id: 'usr_bdhs_super',
    school_id: 'sch_bdhs',
    username: 'admin',
    password: 'password123',
    name: 'সুপার অ্যাডমিন (BDHS)',
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
    name: 'সুপার অ্যাডমিন (BAHS)',
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
  getTable('facilities', SEED_FACILITIES);
  getTable('users', SEED_USERS);
  getTable('students', SEED_STUDENTS);
  getTable('teachers', SEED_TEACHERS);
  getTable('notices', SEED_NOTICES);
  getTable('results', SEED_RESULTS);
  getTable('receipts', SEED_RECEIPTS);
  getTable('admissions', SEED_ADMISSIONS);
  getTable('audit_logs', SEED_AUDIT_LOGS);
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
    // Unique Slug check
    if (schools.some(s => s.slug.toLowerCase() === schoolData.slug.toLowerCase())) {
      throw new Error(`School with slug "${schoolData.slug}" already exists.`);
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
      ...schoolData
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
      name: superAdminData.name || 'সুপার অ্যাডমিন',
      role: 'school_superadmin',
      active: true,
      failed_attempts: 0,
      locked_until: null,
      must_change_password: true
    };
    users.push(newSuperAdmin);
    saveTable('users', users);

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

    // Check Password
    if (user.password !== password) {
      const attempts = (user.failed_attempts || 0) + 1;
      let lockedUntil = null;
      let message = 'ব্যবহারকারীর নাম বা পাসওয়ার্ড সঠিক নয়।';

      if (attempts >= 5) {
        lockedUntil = new Date(Date.now() + 15 * 60000).toISOString();
        message = 'টানা ৫ বার ভুল পাসওয়ার্ড দেওয়ার কারণে অ্যাকাউন্টটি ১৫ মিনিটের জন্য লক করা হয়েছে।';
      } else {
        message = `পাসওয়ার্ড ভুল। আর ${5 - attempts} বার ভুল হলে ১৫ মিনিটের জন্য লক হবে।`;
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

    return { user, school: targetSchool };
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

    // Check Plan Limit
    const currentCount = students.filter(s => s.school_id === schoolId).length;
    if (currentCount >= school.max_students) {
      throw new Error(`প্ল্যান অনুযায়ী সর্বোচ্চ শিক্ষার্থীর সীমা (${school.max_students}) পূর্ণ হয়েছে। অনুগ্রহ করে প্ল্যান আপগ্রেড করুন।`);
    }

    // UNIQUE(school_id, class, roll)
    const exists = students.some(
      s => s.school_id === schoolId && s.class === studentData.class && Number(s.roll) === Number(studentData.roll)
    );
    if (exists) {
      throw new Error(`শ্রেণি ${studentData.class}-এ রোল ${studentData.roll} নম্বরের শিক্ষার্থী ইতোমধ্যে নিবন্ধিত রয়েছে।`);
    }

    // Auto Student ID
    const year = new Date().getFullYear();
    const classPad = String(studentData.class).padStart(2, '0');
    const rollPad = String(studentData.roll).padStart(2, '0');
    const student_id = `${school.code_prefix}-${year}-${classPad}${rollPad}`;

    const newStudent = {
      id: `std_${Date.now()}`,
      school_id: schoolId,
      student_id,
      ...studentData,
      roll: Number(studentData.roll)
    };

    students.push(newStudent);
    saveTable('students', students);
    return newStudent;
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

    const year = new Date().getFullYear() + 1; // e.g. 2027
    const random4 = Math.floor(1000 + Math.random() * 9000);
    const tracking_id = `${school.code_prefix}-ADM-${year}-${random4}`;

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

    // Create Student
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
      address: admission.address
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
    const results = getTable('results', SEED_RESULTS);
    const newRes = {
      id: `res_${Date.now()}`,
      school_id: schoolId,
      ...resultData
    };
    results.unshift(newRes);
    saveTable('results', results);
    this.addAuditLog(schoolId, creatorName, 'headmaster', 'রেজাল্ট প্রকাশ', 'Result Published', 'results', `শ্রেণি ${resultData.class}, রোল ${resultData.roll} এর রেজাল্ট সংরক্ষিত হয়েছে।`);
    return newRes;
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
    saveTable('teachers', teachers);
    return true;
  },

  // --- Notices ---
  getNotices(schoolId) {
    const notices = getTable('notices', SEED_NOTICES);
    return notices.filter(n => n.school_id === schoolId);
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

  deleteGalleryItem(schoolId, itemId) {
    const items = getTable('gallery', SEED_GALLERY);
    const remaining = items.filter(g => !(g.id === itemId && g.school_id === schoolId));
    saveTable('gallery', remaining);
  },

  // --- Facilities ---
  getFacilities(schoolId) {
    const fac = getTable('facilities', SEED_FACILITIES);
    return fac.filter(f => f.school_id === schoolId);
  },

  // Factory Reset (Restricted to specific school only!)
  factoryResetSchool(schoolId, confirmCode) {
    if (confirmCode !== 'RESET') {
      throw new Error('ফ্যাক্টরি রিসেট করতে "RESET" কোডটি সঠিকভাবে লিখুন।');
    }
    // Delete all data associated with ONLY this school_id
    const tables = ['settings', 'students', 'teachers', 'notices', 'results', 'receipts', 'admissions', 'sliders', 'uniforms', 'committee', 'routines', 'gallery'];
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
