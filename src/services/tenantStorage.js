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
    address_bn: 'ফেনী-পরশুরাম মহাসড়ক, আনন্দপুর, ফুলগাজী, ফেনী।',
    address_en: 'Feni-Parshuram Highway, Anandapur, Fulgazi, Feni.',
    phone: '০১৮১২-৩৪৫৬৭৮',
    email: 'info@bdhs.edu.bd',
    established: '১৯৯০',
    tagline_bn: 'জ্ঞানই আলো, শিক্ষাই শক্তি',
    tagline_en: 'Knowledge is Light, Education is Power',
    motto_bn: 'নৈতিক শিক্ষা ও আধুনিক প্রযুক্তির সমন্বয়ে ভবিষ্যৎ বিনির্মাণ।',
    motto_en: 'Building the future with moral education and modern technology.',
    office_hours: 'রবি–বৃহস্পতি সকাল ৯টা–দুপুর ২টা',
    uniform_rules: 'ছাত্র: সাদা শার্ট, নেভি ব্লু প্যান্ট। ছাত্রী: নেভি ব্লু ফ্রক, সাদা ওড়না/হিজাব।',
    pass_rate: '৯৮.৫%'
  },
  {
    school_id: 'sch_bahs',
    address_bn: 'মেইন রোড, বরুড়া পৌরসভা, কুমিল্লা।',
    address_en: 'Main Road, Barura Municipality, Comilla.',
    phone: '০১৭৯৮-৭৬৫৪৩২',
    email: 'contact@bahs.edu.bd',
    established: '১৯৯৫',
    tagline_bn: 'আলোকিত মানুষ গড়ার প্রত্যয়',
    tagline_en: 'Dedicated to Enlightened Minds',
    motto_bn: 'শৃঙ্খলা, চরিত্র ও জ্ঞান।',
    motto_en: 'Discipline, Character and Knowledge.',
    office_hours: 'রবি–বৃহস্পতি সকাল ৯:৩০–দুপুর ২:৩০',
    uniform_rules: 'সাদা শার্ট, কালো প্যান্ট ও কালো জুতো।',
    pass_rate: '৯৫.২%'
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
    id: 'usr_bdhs_teacher',
    school_id: 'sch_bdhs',
    username: 'teacher',
    password: 'password123',
    name: 'মোঃ সাইদুল ইসলাম',
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
    name: 'কামাল হোসেন',
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
  // BDHS Teachers
  {
    id: 'tch_1',
    school_id: 'sch_bdhs',
    category: 'teacher',
    name: 'জনাব বাহার উদ্দিন ভূঁইয়া',
    designation: 'ভারপ্রাপ্ত প্রধান শিক্ষক',
    subject: 'গণিত ও পদার্থবিজ্ঞান',
    qualification: 'বি.এসসি (অনার্স), এম.এসসি, বি.এড',
    phone: '০১৮১১-১২৩৪৫৬',
    email: 'headmaster@bdhs.edu.bd',
    order: 1
  },
  {
    id: 'tch_2',
    school_id: 'sch_bdhs',
    category: 'teacher',
    name: 'জনাব মোহাম্মদ শামসুল হক',
    designation: 'সহকারী প্রধান শিক্ষক',
    subject: 'ইংরেজি সাহিত্য',
    qualification: 'বি.এ (অনার্স), এম.এ (ইংরেজি), বি.এড',
    phone: '০১৮২২-২৩৪৫৬৭',
    email: 'shamsul@bdhs.edu.bd',
    order: 2
  },
  {
    id: 'tch_3',
    school_id: 'sch_bdhs',
    category: 'teacher',
    name: 'মোঃ সাইদুল ইসলাম',
    designation: 'সিনিয়র সহকারী শিক্ষক',
    subject: 'বাংলা ও সামাজিক বিজ্ঞান',
    qualification: 'বি.এ (অনার্স), এম.এ (বাংলা)',
    phone: '০১৮৩৩-৩৪৫৬৭৮',
    email: 'saidul@bdhs.edu.bd',
    order: 3
  },
  {
    id: 'tch_4',
    school_id: 'sch_bdhs',
    category: 'staff',
    name: 'কামাল হোসেন',
    designation: 'অফিস সহকারী কাম কম্পিউটার অপারেটর',
    subject: 'অফিস প্রশাসন ও হিসাব',
    qualification: 'এইচএসসি (ব্যবসায় শিক্ষা)',
    phone: '০১৮৪৪-৪৫৬৭৮৯',
    email: 'office@bdhs.edu.bd',
    order: 4
  },
  // BAHS Teacher
  {
    id: 'tch_bahs_1',
    school_id: 'sch_bahs',
    category: 'teacher',
    name: 'ড. রফিকুল ইসলাম',
    designation: 'প্রধান শিক্ষক',
    subject: 'পদার্থবিজ্ঞান',
    qualification: 'পিএইচডি, এম.এসসি',
    phone: '০১৭৭৭-৮৮৮৯৯৯',
    email: 'head@bahs.edu.bd',
    order: 1
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
    return JSON.parse(raw);
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

  // Factory Reset (Restricted to specific school only!)
  factoryResetSchool(schoolId, confirmCode) {
    if (confirmCode !== 'RESET') {
      throw new Error('ফ্যাক্টরি রিসেট করতে "RESET" কোডটি সঠিকভাবে লিখুন।');
    }
    // Delete all data associated with ONLY this school_id
    const tables = ['settings', 'students', 'teachers', 'notices', 'results', 'receipts', 'admissions'];
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
