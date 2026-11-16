/**
 * Sohoj Pathshala — Master Demo & Edge-Case Data Generator
 * Populates all 9 schools with realistic Bangladeshi academic and administrative data.
 */

import { createRng } from './rng.js';
import {
  NAME_CATALOG,
  PROFESSIONS,
  GEO_CATALOG,
  NOTICE_TEMPLATES
} from './catalogs.js';
import { SCHOOL_SPECS, getSchoolSpec } from './schools.js';
import { EDGE_CASES } from './edgeCases.js';
import { getTrapRecords } from './traps.js';

export class SeedGenerator {
  constructor(options = {}) {
    this.scale = options.scale || 'lite';
    this.seedValue = options.seed || 20261116;
    this.rng = createRng(this.seedValue);
    this.batchId = `seed_${Date.now()}`;
    this.credentials = [];
    this.stats = {
      schools: 0,
      students: 0,
      teachers: 0,
      results: 0,
      receipts: 0,
      notices: 0,
      admissions: 0,
      users: 0,
      total_bytes: 0
    };
  }

  // Generate random Bangladeshi phone number
  generatePhone() {
    const prefixes = ['017', '018', '019', '016', '015', '013'];
    const prefix = this.rng.pick(prefixes);
    const suffix = String(this.rng.int(10000000, 99999999));
    return `${prefix}${suffix}`;
  }

  // Generate random student / person name
  generatePerson(gender = 'any', religion = 'muslim') {
    const isFemale = gender === 'female' || (gender === 'any' && this.rng.random() < 0.48);

    let firstName, surname;
    if (religion === 'hindu') {
      firstName = this.rng.pick(isFemale ? NAME_CATALOG.hinduFemaleFirst : NAME_CATALOG.hinduMaleFirst);
      surname = this.rng.pick(NAME_CATALOG.hinduSurnames);
    } else if (religion === 'buddhist') {
      const bName = this.rng.pick(NAME_CATALOG.buddhistNames);
      firstName = { bn: bName.firstBn, en: bName.firstEn };
      surname = { bn: bName.surnameBn, en: bName.surnameEn };
    } else if (religion === 'christian') {
      const cName = this.rng.pick(NAME_CATALOG.christianNames);
      firstName = { bn: cName.firstBn, en: cName.firstEn };
      surname = { bn: cName.surnameBn, en: cName.surnameEn };
    } else {
      // Muslim
      firstName = this.rng.pick(isFemale ? NAME_CATALOG.muslimFemaleFirst : NAME_CATALOG.muslimMaleFirst);
      surname = this.rng.pick(NAME_CATALOG.muslimSurnames);
    }

    const fullNameBn = `${firstName.bn} ${surname.bn}`;
    const fullNameEn = `${firstName.en} ${surname.en}`;

    const fatherFirst = this.rng.pick(religion === 'hindu' ? NAME_CATALOG.hinduMaleFirst : NAME_CATALOG.muslimMaleFirst);
    const fatherSur = surname;
    const fatherBn = religion === 'hindu' ? `${fatherFirst.bn} ${fatherSur.bn}` : `মোঃ ${fatherFirst.bn} ${fatherSur.bn}`;
    const fatherEn = religion === 'hindu' ? `${fatherFirst.en} ${fatherSur.en}` : `Md. ${fatherFirst.en} ${fatherSur.en}`;

    const motherFirst = this.rng.pick(religion === 'hindu' ? NAME_CATALOG.hinduFemaleFirst : NAME_CATALOG.muslimFemaleFirst);
    const motherBn = religion === 'hindu' ? `${motherFirst.bn} ${fatherSur.bn}` : `${motherFirst.bn} বেগম`;
    const motherEn = religion === 'hindu' ? `${motherFirst.en} ${fatherSur.en}` : `${motherFirst.en} Begum`;

    return {
      name_bn: fullNameBn,
      name_en: fullNameEn,
      father_name_bn: fatherBn,
      father_name_en: fatherEn,
      mother_name_bn: motherBn,
      mother_name_en: motherEn,
      father_profession: this.rng.pick(PROFESSIONS),
      gender: isFemale ? 'female' : 'male',
      religion
    };
  }

  // Generate student scale count
  getStudentTargetCount(school) {
    if (this.scale === 'heavy') {
      return Math.min(school.max_students, 2500);
    }
    if (this.scale === 'normal') {
      return Math.min(school.max_students, 650);
    }
    // Lite Profile
    if (school.slug === 'bdhs') return 25; // 3 existing + 22 demo
    if (school.slug === 'bahs') return 138; // 92% of 150 = 138
    if (school.slug === 'shaplagirls') return 105; // 70% of 150
    if (school.slug === 'chormohona') return 45; // 30% of 150
    if (school.slug === 'taltola') return 52; // 35% of 150
    if (school.slug === 'nobarun') return 6; // almost empty setup wizard test
    if (school.slug === 'surjomukhi') return 135; // 90% of 150
    if (school.slug === 'kashbon') return 90; // 60% of 150
    if (school.slug === 'qa-limit') return 500; // exactly 500 for limit test
    return 50;
  }

  // Main generation routine
  generateAll(existingTables = {}) {
    const tables = {
      schools: [...(existingTables.schools || [])],
      settings: [...(existingTables.settings || [])],
      sliders: [...(existingTables.sliders || [])],
      uniforms: [...(existingTables.uniforms || [])],
      facilities: [...(existingTables.facilities || [])],
      committee: [...(existingTables.committee || [])],
      teachers: [...(existingTables.teachers || [])],
      students: [...(existingTables.students || [])],
      admissions: [...(existingTables.admissions || [])],
      results: [...(existingTables.results || [])],
      receipts: [...(existingTables.receipts || [])],
      notices: [...(existingTables.notices || [])],
      routines: [...(existingTables.routines || [])],
      gallery: [...(existingTables.gallery || [])],
      videos: [...(existingTables.videos || [])],
      contact_messages: [...(existingTables.contact_messages || [])],
      users: [...(existingTables.users || [])],
      audit_logs: [...(existingTables.audit_logs || [])]
    };

    // 1. Clean existing demo data (Idempotency)
    Object.keys(tables).forEach(tableName => {
      tables[tableName] = tables[tableName].filter(row => !row.is_demo);
    });

    // 2. Process each of the 9 schools
    SCHOOL_SPECS.forEach(schoolSpec => {
      this.generateSchoolData(schoolSpec, tables);
    });

    // 3. Inject Edge Cases (E01 - E40)
    this.injectEdgeCases(tables);

    // 4. Inject Cross-Tenant Traps
    this.injectTraps(tables);

    // Calculate statistics
    this.stats.schools = tables.schools.length;
    this.stats.students = tables.students.length;
    this.stats.teachers = tables.teachers.length;
    this.stats.results = tables.results.length;
    this.stats.receipts = tables.receipts.length;
    this.stats.notices = tables.notices.length;
    this.stats.admissions = tables.admissions.length;
    this.stats.users = tables.users.length;

    const jsonStr = JSON.stringify(tables);
    this.stats.total_bytes = jsonStr.length * 2; // UTF-16 byte representation
    this.stats.total_kb = Math.round(this.stats.total_bytes / 1024);
    this.stats.total_mb = (this.stats.total_kb / 1024).toFixed(2);

    return tables;
  }

  generateSchoolData(school, tables) {
    const schoolId = school.id;
    const slug = school.slug;

    // A. School record
    let maxStudents = school.max_students;
    if (this.scale === 'lite' && slug === 'bahs') {
      maxStudents = 150; // 138 students / 150 = exactly 92% for dashboard capacity warning
    }

    let existingSchool = tables.schools.find(s => s.id === schoolId || s.slug === slug);
    if (!existingSchool) {
      existingSchool = {
        id: schoolId,
        slug: slug,
        name_bn: school.name_bn,
        name_en: school.name_en,
        eiin: school.eiin,
        school_code: school.school_code,
        mpo_code: school.mpo_code,
        board: school.board,
        district: school.district,
        code_prefix: school.code_prefix,
        logo_url: school.logo_url,
        seal_url: school.seal_url,
        signature_url: school.signature_url,
        theme: school.theme,
        status: school.status,
        plan: school.plan,
        expires_at: school.expires_at,
        max_students: maxStudents,
        created_at: school.created_at,
        is_demo: !school.is_real,
        seed_batch: this.batchId
      };
      tables.schools.push(existingSchool);
    } else if (!school.is_real) {
      // Update mutable status/plan fields for demo schools
      Object.assign(existingSchool, {
        status: school.status,
        plan: school.plan,
        expires_at: school.expires_at,
        theme: school.theme,
        logo_url: school.logo_url,
        seal_url: school.seal_url,
        signature_url: school.signature_url,
        max_students: maxStudents,
        is_demo: true,
        seed_batch: this.batchId
      });
    }

    // B. School Settings
    let existingSettings = tables.settings.find(s => s.school_id === schoolId);
    if (!existingSettings) {
      existingSettings = {
        school_id: schoolId,
        address_bn: `${school.union || 'সদর'}, ${school.upazila || ''}, ${school.district}।`,
        address_en: `${school.upazila || ''}, ${school.district}, Bangladesh.`,
        phone: this.generatePhone(),
        phone_alt: this.generatePhone(),
        email: `info@${slug}.edu.bd`,
        website: `https://${slug}.sohojpathshala.app`,
        established: school.established,
        tagline_bn: 'নৈতিক শিক্ষা ও আধুনিক প্রযুক্তির সমন্বয়ে আদর্শ প্রতিষ্ঠান',
        tagline_en: 'Excellence in Education and Moral Values',
        motto_bn: 'শিক্ষা, শৃঙ্খলা ও চরিত্র গঠন।',
        motto_en: 'Education, Discipline and Character.',
        office_hours: 'রবি–বৃহস্পতি সকাল ৯:০০–বিকাল ৪:০০',
        uniform_rules: school.gender_restriction === 'female'
          ? 'গাঢ় সবুজ রঙের কামিজ, সাদা সালোয়ার ও সাদা ওড়না/স্কার্ফ।'
          : 'সাদা রঙের শার্ট, নেভি ব্লু ফুল প্যান্ট, কালো চামড়ার জুতা ও সাদা মোজা।',
        pass_rate: '৯৬.৮৫%',
        is_demo: !school.is_real,
        seed_batch: this.batchId
      };
      tables.settings.push(existingSettings);
    }

    // C. Hero Sliders (if not present)
    if (!tables.sliders.some(sl => sl.school_id === schoolId)) {
      for (let i = 1; i <= 3; i++) {
        tables.sliders.push({
          id: `sl_${slug}_${i}`,
          school_id: schoolId,
          title: i === 1 ? `${school.name_bn}-এ স্বাগতম` : i === 2 ? 'ডিজিটাল মাল্টিমিডিয়া ক্লাসরুম' : 'সমৃদ্ধ বিজ্ঞান ও কম্পিউটার ল্যাব',
          subtitle: i === 1 ? `${school.district} জেলার অন্যতম শ্রেষ্ঠ বিদ্যাপীঠ, যেখানে প্রতিটি শিক্ষার্থীর মেধার পূর্ণ বিকাশ ঘটে।` : 'অভিজ্ঞ ও নিবেদিতপ্রাণ শিক্ষক মণ্ডলীর তত্ত্বাবধানে পাঠদান।',
          image: `/seed-media/${slug}/hero-${i}.svg`,
          tag: i === 1 ? 'ঐতিহ্য ও উৎকর্ষ' : i === 2 ? 'আধুনিক প্রযুক্তি' : 'ব্যবহারিক শিক্ষা',
          cta_text: 'অনলাইন ভর্তি আবেদন',
          is_demo: true,
          seed_batch: this.batchId
        });
      }
    }

    // D. Campus Facilities
    if (!tables.facilities.some(f => f.school_id === schoolId)) {
      tables.facilities.push(
        {
          id: `fac_${slug}_1`,
          school_id: schoolId,
          title: 'শেখ রাসেল ডিজিটাল ল্যাব ও কম্পিউটার ক্লাসরুম',
          subtitle: 'আধুনিক কম্পিউটার ও ব্রডব্যান্ড ইন্টারনেট সংযোগের মাধ্যমে শিক্ষার্থীদের আইসিটি প্রশিক্ষণ প্রদান করা হয়।',
          icon: 'Laptop',
          order: 1,
          is_demo: true,
          seed_batch: this.batchId
        },
        {
          id: `fac_${slug}_2`,
          school_id: schoolId,
          title: 'আধুনিক বিজ্ঞানাগার (Science Lab)',
          subtitle: 'পদার্থ, রসায়ন ও জীববিজ্ঞানের সকল আধুনিক উপকরণ সম্বলিত ব্যবহারিক গবেষণাগার।',
          icon: 'FlaskConical',
          order: 2,
          is_demo: true,
          seed_batch: this.batchId
        },
        {
          id: `fac_${slug}_3`,
          school_id: schoolId,
          title: 'বঙ্গবন্ধু ও মুক্তিযুদ্ধ কর্নার এবং উন্মুক্ত লাইব্রেরি',
          subtitle: 'পাঁচ সহস্রাধিক গ্রন্থ সম্বলিত পাঠাগার যেখানে নিয়মিত সাহিত্য ও সাধারণ জ্ঞানের চর্চা হয়।',
          icon: 'BookOpen',
          order: 3,
          is_demo: true,
          seed_batch: this.batchId
        },
        {
          id: `fac_${slug}_4`,
          school_id: schoolId,
          title: 'বিশাল খেলার মাঠ ও ক্রীড়া সরঞ্জাম',
          subtitle: 'ফুটবল, ক্রিকেট, ভলিবল সহ বার্ষিক ক্রীড়া প্রতিযোগিতা আয়োজনের উন্মুক্ত সবুজ মাঠ।',
          icon: 'Trophy',
          order: 4,
          is_demo: true,
          seed_batch: this.batchId
        }
      );
    }

    // E. Uniforms
    if (!tables.uniforms.some(u => u.school_id === schoolId)) {
      tables.uniforms.push({
        school_id: schoolId,
        boys: {
          shirt: 'সাদা রঙের হাফ/ফুল হাতা শার্ট',
          pant: school.theme === 'emerald' ? 'গাঢ় সবুজ রঙের ফুল প্যান্ট' : 'নেভি ব্লু রঙের ফুল প্যান্ট',
          badge: 'বুকের বাম পকেটে বিদ্যালয়ের মনোগ্রামযুক্ত প্রাতিষ্ঠানিক ব্যাজ',
          shoes: 'কালো চামড়ার জুতা ও সাদা রঙের মোজা',
          belt: 'কালো বেল্ট'
        },
        girls: {
          dress: school.theme === 'emerald' ? 'গাঢ় সবুজ রঙের কামিজ' : 'নীল রঙের ফ্রক বা কামিজ',
          salwar: 'সাদা রঙের সালোয়ার',
          orna: 'সাদা রঙের ওড়না বা হিজাব',
          badge: 'বামে বিদ্যালয়ের মনোগ্রামযুক্ত ব্যাজ',
          shoes: 'কালো জুতা ও সাদা মোজা'
        },
        is_demo: true,
        seed_batch: this.batchId
      });
    }

    // F. Managing Committee
    if (!tables.committee.some(c => c.school_id === schoolId)) {
      const pres = this.generatePerson('male', 'muslim');
      const vice = this.generatePerson('male', 'muslim');
      const donor = this.generatePerson('male', 'muslim');
      tables.committee.push(
        {
          id: `cm_${slug}_1`,
          school_id: schoolId,
          name: `আলহাজ্ব ${pres.name_bn}`,
          designation: 'সভাপতি',
          role_category: 'সভাপতি, পরিচালনা পর্ষদ',
          phone: this.generatePhone(),
          status: 'active',
          order: 1,
          is_demo: true,
          seed_batch: this.batchId
        },
        {
          id: `cm_${slug}_2`,
          school_id: schoolId,
          name: `জনাব ${vice.name_bn}`,
          designation: 'সহ-সভাপতি',
          role_category: 'সহ-সভাপতি',
          phone: this.generatePhone(),
          status: 'active',
          order: 2,
          is_demo: true,
          seed_batch: this.batchId
        },
        {
          id: `cm_${slug}_3`,
          school_id: schoolId,
          name: `বীর মুক্তিযোদ্ধা ${donor.name_bn}`,
          designation: 'দাতা সদস্য',
          role_category: 'দাতা সদস্য',
          phone: this.generatePhone(),
          status: 'active',
          order: 3,
          is_demo: true,
          seed_batch: this.batchId
        }
      );
    }

    // G. Teachers & Staff
    if (school.slug === 'bdhs') {
      // BDHS has 16 canonical teachers; do NOT overwrite!
      if (!tables.teachers.some(t => t.school_id === 'sch_bdhs' && t.is_demo)) {
        tables.teachers.push({
          id: `tch_bdhs_demo_1`,
          school_id: 'sch_bdhs',
          order: 17,
          category: 'teacher',
          designation: 'খণ্ডকালীন শিক্ষক (তথ্যপ্রযুক্তি)',
          name: 'জনাব আদনান সামি',
          subject: 'তথ্য ও যোগাযোগ প্রযুক্তি',
          qualification: 'বি.এসসি (কম্পিউটার সায়েন্স)',
          phone: this.generatePhone(),
          email: 'ict_guest@bdhs.edu.bd',
          is_demo: true,
          seed_batch: this.batchId
        });
      }
    } else if (!tables.teachers.some(t => t.school_id === schoolId)) {
      const head = this.generatePerson('male', 'muslim');
      const asstHead = this.generatePerson('male', 'muslim');
      const mathT = this.generatePerson('male', 'hindu');
      const engT = this.generatePerson('female', 'muslim');
      const sciT = this.generatePerson('female', 'muslim');
      const clerk = this.generatePerson('male', 'muslim');

      tables.teachers.push(
        {
          id: `tch_${slug}_1`,
          school_id: schoolId,
          order: 1,
          category: 'teacher',
          designation: 'প্রধান শিক্ষক',
          name: `জনাব ${head.name_bn}`,
          subject: 'গণিত ও সাধারণ বিজ্ঞান',
          qualification: 'এম.এসসি (১ম শ্রেণি), বি.এড',
          phone: this.generatePhone(),
          email: `headmaster@${slug}.edu.bd`,
          is_demo: true,
          seed_batch: this.batchId
        },
        {
          id: `tch_${slug}_2`,
          school_id: schoolId,
          order: 2,
          category: 'teacher',
          designation: 'সহকারী প্রধান শিক্ষক',
          name: `জনাব ${asstHead.name_bn}`,
          subject: 'ইংরেজি',
          qualification: 'এম.এ (ইংরেজি), বি.এড',
          phone: this.generatePhone(),
          email: `asst_head@${slug}.edu.bd`,
          is_demo: true,
          seed_batch: this.batchId
        },
        {
          id: `tch_${slug}_3`,
          school_id: schoolId,
          order: 3,
          category: 'teacher',
          designation: 'সহকারী শিক্ষক (গণিত)',
          name: `শ্রী ${mathT.name_bn}`,
          subject: 'উচ্চতর গণিত',
          qualification: 'বি.এসসি (গণিত), বি.এড',
          phone: this.generatePhone(),
          email: `math@${slug}.edu.bd`,
          is_demo: true,
          seed_batch: this.batchId
        },
        {
          id: `tch_${slug}_4`,
          school_id: schoolId,
          order: 4,
          category: 'teacher',
          designation: 'সহকারী শিক্ষক (ইংরেজি)',
          name: `বেগম ${engT.name_bn}`,
          subject: 'ইংরেজি ১ম ও ২য় পত্র',
          qualification: 'বি.এ (সম্মান), এম.এ',
          phone: this.generatePhone(),
          email: `english@${slug}.edu.bd`,
          is_demo: true,
          seed_batch: this.batchId
        },
        {
          id: `tch_${slug}_5`,
          school_id: schoolId,
          order: 5,
          category: 'staff',
          designation: 'অফিস সহকারী কাম কম্পিউটার অপারেটর',
          name: `জনাব ${clerk.name_bn}`,
          subject: 'অফিস প্রশাসন ও হিসাবরক্ষণ',
          qualification: 'স্নাতক (পাস)',
          phone: this.generatePhone(),
          email: `office@${slug}.edu.bd`,
          is_demo: true,
          seed_batch: this.batchId
        }
      );
    }

    // H. Users & Roles for this school
    this.generateSchoolUsers(school, tables);

    // I. Notices
    this.generateSchoolNotices(school, tables);

    // J. Students & Academic Records (scaled by target count)
    const targetStudentCount = this.getStudentTargetCount(school);
    this.generateSchoolStudentsAndAcademics(school, targetStudentCount, tables);
  }

  generateSchoolUsers(school, tables) {
    const slug = school.slug;
    const schoolId = school.id;

    const userRoles = [
      { role: 'school_superadmin', username: `${slug}_admin`, name: `${school.name_bn} সুপার অ্যাডমিন` },
      { role: 'head_teacher', username: `${slug}_head`, name: `প্রধান শিক্ষক (${school.code_prefix})` },
      { role: 'teacher', username: `${slug}_teacher`, name: `সহকারী শিক্ষক (${school.code_prefix})` },
      { role: 'accountant', username: `${slug}_cashier`, name: `হিসাব সহকারী (${school.code_prefix})` },
      { role: 'office_assistant', username: `${slug}_office`, name: `অফিস সহকারী (${school.code_prefix})` }
    ];

    userRoles.forEach(ur => {
      if (!tables.users.some(u => u.username === ur.username)) {
        const plainPassword = `Pass@${slug.slice(0, 4)}${this.rng.int(1000, 9999)}`;
        tables.users.push({
          id: `usr_${slug}_${ur.role}`,
          school_id: schoolId,
          username: ur.username,
          password: plainPassword,
          name: ur.name,
          role: ur.role,
          active: true,
          failed_attempts: 0,
          locked_until: null,
          must_change_password: false,
          is_demo: true,
          seed_batch: this.batchId
        });
        this.credentials.push({
          school: school.name_bn,
          slug: slug,
          role: ur.role,
          username: ur.username,
          password: plainPassword
        });
      }
    });

    // Special User states: Locked, Inactive, MustChangePassword
    if (slug === 'bahs' || slug === 'bdhs') {
      const lockedUser = `usr_${slug}_locked`;
      if (!tables.users.some(u => u.id === lockedUser)) {
        tables.users.push({
          id: lockedUser,
          school_id: schoolId,
          username: `${slug}_locked_user`,
          password: `LockPass#${this.rng.int(1000, 9999)}`,
          name: 'লক হওয়া ব্যবহারকারী (E30)',
          role: 'teacher',
          active: true,
          failed_attempts: 5,
          locked_until: '2026-11-17 12:00 PM',
          must_change_password: false,
          is_demo: true,
          seed_batch: this.batchId
        });
      }
    }
  }

  generateSchoolNotices(school, tables) {
    const slug = school.slug;
    const schoolId = school.id;
    if (tables.notices.filter(n => n.school_id === schoolId).length >= 5) return;

    NOTICE_TEMPLATES.forEach((tmpl, idx) => {
      tables.notices.push({
        id: `not_${slug}_${idx + 1}`,
        school_id: schoolId,
        title: tmpl.title,
        description: tmpl.description,
        category: tmpl.category,
        is_urgent: tmpl.is_urgent,
        date: tmpl.date,
        published: true,
        is_demo: true,
        seed_batch: this.batchId
      });
    });
  }

  generateSchoolStudentsAndAcademics(school, targetCount, tables) {
    const slug = school.slug;
    const schoolId = school.id;
    const isGirlsOnly = school.gender_restriction === 'female';
    const classes = ['6', '7', '8', '9', '10'];

    const existingCount = tables.students.filter(s => s.school_id === schoolId).length;
    const needed = Math.max(0, targetCount - existingCount);

    let rollTracker = { '6': 1, '7': 1, '8': 1, '9': 1, '10': 1 };

    for (let i = 0; i < needed; i++) {
      const cls = classes[i % classes.length];
      const roll = rollTracker[cls]++;
      const gender = isGirlsOnly ? 'female' : (this.rng.random() < 0.5 ? 'male' : 'female');
      const religion = this.rng.weightedPick(['muslim', 'hindu', 'buddhist', 'christian'], [0.88, 0.10, 0.015, 0.005]);
      const person = this.generatePerson(gender, religion);

      const group = (cls === '9' || cls === '10')
        ? this.rng.weightedPick(['Science', 'Humanities', 'Business Studies'], [0.45, 0.35, 0.20])
        : 'General';

      const birthYear = 2026 - (10 + parseInt(cls, 10));
      const birthMonth = String(this.rng.int(1, 12)).padStart(2, '0');
      const birthDay = String(this.rng.int(1, 28)).padStart(2, '0');
      const dob = `${birthYear}-${birthMonth}-${birthDay}`;

      const studentId = `${school.code_prefix}-2026-${cls.padStart(2, '0')}${String(roll).padStart(2, '0')}`;
      const stdRecord = {
        id: `std_${slug}_${cls}_${roll}_${this.batchId}`,
        school_id: schoolId,
        student_id: studentId,
        name_bn: person.name_bn,
        name_en: person.name_en,
        father_name: person.father_name_bn,
        mother_name: person.mother_name_bn,
        class: cls,
        group: group,
        roll: roll,
        mobile: this.generatePhone(),
        dob: dob,
        address: `${school.union || 'সদর'}, ${school.upazila || ''}, ${school.district}`,
        shift: school.shifts && school.shifts.length > 1 ? (roll % 2 === 0 ? 'day' : 'morning') : 'day',
        section: roll % 2 === 0 ? 'B' : 'A',
        is_demo: true,
        seed_batch: this.batchId
      };
      tables.students.push(stdRecord);

      // Generate corresponding Result (if school supports results and student is in Class 9 or 10)
      if (school.has_results && (cls === '9' || cls === '10') && roll <= 5) {
        const gpaVal = (3.5 + this.rng.random() * 1.5).toFixed(2);
        tables.results.push({
          id: `res_${slug}_${cls}_${roll}`,
          school_id: schoolId,
          class: cls,
          roll: roll,
          exam: 'Annual',
          year: '2026',
          total_gpa: gpaVal,
          status: 'PASSED',
          published: true,
          subjects: [
            { code: '101', name: 'বাংলা', marks: this.rng.int(70, 95), grade: 'A+', gpa: 5.0 },
            { code: '107', name: 'ইংরেজি', marks: this.rng.int(65, 90), grade: 'A', gpa: 4.0 },
            { code: '109', name: 'গণিত', marks: this.rng.int(75, 98), grade: 'A+', gpa: 5.0 },
            { code: '111', name: 'বিজ্ঞান', marks: this.rng.int(70, 92), grade: 'A', gpa: 4.0 }
          ],
          is_demo: true,
          seed_batch: this.batchId
        });
      }

      // Generate corresponding Receipt
      if (school.has_finance && roll <= 6) {
        const amount = this.rng.int(300, 1500);
        tables.receipts.push({
          id: `rec_${slug}_${cls}_${roll}`,
          school_id: schoolId,
          receipt_no: `REC-${school.code_prefix}-2026-11${String(roll).padStart(2, '0')}-${this.rng.int(1000, 9999)}`,
          student_id: studentId,
          student_name: person.name_bn,
          class: cls,
          roll: roll,
          category: 'মাসিক বেতন ও পরীক্ষার ফি',
          amount: amount,
          payment_method: this.rng.pick(['নগদ', 'বিকাশ', 'নগদ']),
          status: 'paid',
          void_reason: null,
          created_by: 'অফিস সহকারী',
          created_at: `2026-11-${String(this.rng.int(1, 15)).padStart(2, '0')} 10:30 AM`,
          is_demo: true,
          seed_batch: this.batchId
        });
      }

      // Generate admission application (if school supports admissions)
      if (school.has_admissions && i < 4) {
        tables.admissions.push({
          id: `adm_${slug}_${i + 1}`,
          school_id: schoolId,
          tracking_id: `${school.code_prefix}-ADM-2027-${this.rng.int(1000, 9999)}`,
          name_bn: person.name_bn,
          name_en: person.name_en,
          father_name: person.father_name_bn,
          mother_name: person.mother_name_bn,
          applied_class: '6',
          mobile: this.generatePhone(),
          prev_school: `${school.upazila || school.district} সরকারি প্রাথমিক বিদ্যালয়`,
          prev_gpa: '৫.০০',
          dob: '2014-06-15',
          address: `${school.union || 'সদর'}, ${school.district}`,
          status: this.rng.pick(['approved', 'pending']),
          is_demo: true,
          seed_batch: this.batchId
        });
      }
    }
  }

  injectEdgeCases(tables) {
    // E01: 60+ char Bengali name
    const e01 = EDGE_CASES.find(e => e.id === 'E01');
    if (e01) {
      tables.students.push({
        id: `std_e01_${this.batchId}`,
        school_id: 'sch_bdhs',
        student_id: 'BDHS-2026-E01',
        name_bn: e01.payload.name_bn,
        name_en: e01.payload.name_en,
        father_name: e01.payload.father_name,
        mother_name: e01.payload.mother_name,
        class: e01.payload.class,
        group: 'Science',
        roll: e01.payload.roll,
        mobile: this.generatePhone(),
        dob: '2010-04-12',
        address: 'ফুলগাজী, ফেনী',
        is_demo: true,
        edge_case_id: 'E01',
        seed_batch: this.batchId
      });
    }

    // E02: Twins with identical names in same class
    const e02 = EDGE_CASES.find(e => e.id === 'E02');
    if (e02 && Array.isArray(e02.payload)) {
      e02.payload.forEach((twin, idx) => {
        tables.students.push({
          id: `std_e02_${idx}_${this.batchId}`,
          school_id: 'sch_bdhs',
          student_id: twin.student_id,
          name_bn: twin.name_bn,
          name_en: twin.name_en,
          father_name: 'মোঃ রফিকুল ইসলাম',
          mother_name: 'নাজনীন আক্তার',
          class: twin.class,
          group: 'Science',
          roll: twin.roll,
          mobile: this.generatePhone(),
          dob: '2010-09-18',
          address: 'আনন্দপুর, ফুলগাজী',
          is_demo: true,
          edge_case_id: 'E02',
          seed_batch: this.batchId
        });
      });
    }

    // E13: FAILED result with 0.00 GPA despite other A+
    const e13 = EDGE_CASES.find(e => e.id === 'E13');
    if (e13) {
      tables.results.push({
        id: `res_e13_${this.batchId}`,
        school_id: 'sch_bdhs',
        class: e13.payload.class,
        roll: e13.payload.roll,
        exam: 'Annual',
        year: '2026',
        total_gpa: e13.payload.total_gpa,
        status: e13.payload.status,
        published: true,
        subjects: e13.payload.subjects,
        is_demo: true,
        edge_case_id: 'E13',
        seed_batch: this.batchId
      });
    }

    // E16: Absent Subject in Result
    const e16 = EDGE_CASES.find(e => e.id === 'E16');
    if (e16) {
      tables.results.push({
        id: `res_e16_${this.batchId}`,
        school_id: 'sch_bdhs',
        class: e16.payload.class,
        roll: e16.payload.roll,
        exam: 'Annual',
        year: '2026',
        total_gpa: e16.payload.total_gpa,
        status: e16.payload.status,
        published: true,
        subjects: e16.payload.subjects,
        is_demo: true,
        edge_case_id: 'E16',
        seed_batch: this.batchId
      });
    }

    // E20: Large Receipt (12,34,567 Tk)
    const e20 = EDGE_CASES.find(e => e.id === 'E20');
    if (e20) {
      tables.receipts.push({
        id: `rec_e20_${this.batchId}`,
        school_id: 'sch_bdhs',
        receipt_no: 'REC-BDHS-2026-E20-1234',
        student_id: 'BDHS-2026-1001',
        student_name: 'আব্দুর রহমান',
        class: '10',
        roll: 1,
        category: 'প্রাতিষ্ঠানিক উন্নয়ন ও বিজ্ঞানাগার অনুদান',
        amount: e20.payload.amount,
        amount_bn: e20.payload.amount_formatted,
        in_words_bn: e20.payload.in_words_bn,
        payment_method: 'ব্যাংক ড্রাফট',
        status: 'paid',
        void_reason: null,
        created_by: 'প্রধান হিসাবরক্ষক',
        created_at: '2026-11-15 02:00 PM',
        is_demo: true,
        edge_case_id: 'E20',
        seed_batch: this.batchId
      });
    }

    // E23: Voided Receipt
    const e23 = EDGE_CASES.find(e => e.id === 'E23');
    if (e23) {
      tables.receipts.push({
        id: `rec_e23_${this.batchId}`,
        school_id: 'sch_bdhs',
        receipt_no: e23.payload.receipt_no,
        student_id: 'BDHS-2026-1002',
        student_name: 'ফাতিমা আক্তার',
        class: '10',
        roll: 2,
        category: 'ভুল সেশন ফি রসিদ',
        amount: 2500,
        payment_method: 'নগদ',
        status: 'void',
        void_reason: e23.payload.void_reason,
        created_by: 'অফিস সহকারী',
        created_at: '2026-11-12 11:45 AM',
        is_demo: true,
        edge_case_id: 'E23',
        seed_batch: this.batchId
      });
    }

    // E27: XSS Payload Notice (rendered safely as text)
    const e27 = EDGE_CASES.find(e => e.id === 'E27');
    if (e27) {
      tables.notices.push({
        id: `not_e27_${this.batchId}`,
        school_id: 'sch_bdhs',
        title: `নিরাপত্তা অডিট নোটিশ: ${e27.payload.xss_payload}`,
        description: `টেস্টিং স্যানিটাইজেশন ফিল্টার: ${e27.payload.html_payload}। এটি সাধারণ টেক্সট হিসেবে প্রদর্শিত হওয়া বাধ্যতামূলক।`,
        category: 'administrative',
        is_urgent: false,
        date: '২০২৬-১১-১৬',
        published: true,
        is_demo: true,
        edge_case_id: 'E27',
        seed_batch: this.batchId
      });
    }
  }

  injectTraps(tables) {
    const trapData = getTrapRecords(this.batchId);
    if (trapData.students) tables.students.push(...trapData.students);
    if (trapData.notices) tables.notices.push(...trapData.notices);
    if (trapData.receipts) tables.receipts.push(...trapData.receipts);
  }
}
