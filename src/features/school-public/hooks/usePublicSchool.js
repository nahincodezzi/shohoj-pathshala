import { useMemo } from 'react';
import { TenantRepository } from '../../../services/tenantStorage';

const RESERVED_SLUGS = [
  'owner', 'admin', 'login', 'logout', 'register', 'api', 'app', 
  'assets', 'static', 'uploads', 'design', 'help', 'support', 
  'pricing', 'about', 'contact', 'www', 'mail'
];

/**
 * Hook to retrieve public school data with strict server-equivalent availability
 * and feature gating resolution based on plan, owner override, and school status.
 */
export function usePublicSchool(slug) {
  return useMemo(() => {
    const emptyResult = {
      availability: 'not_found',
      school: null,
      plan: 'standard',
      features: {
        admissionForm: false,
        admissionTrack: false,
        resultSearch: false,
        routines: false,
        videos: false
      },
      sections: {},
      sliders: [],
      notices: [],
      facilities: [],
      gallery: [],
      videos: [],
      teachers: [],
      students: [],
      settings: {},
      uniform: null,
      stats: {},
      urgentNotice: null
    };

    if (!slug) {
      return emptyResult;
    }

    const cleanSlug = String(slug).toLowerCase().trim();

    // Check reserved slug
    if (RESERVED_SLUGS.includes(cleanSlug)) {
      return emptyResult;
    }

    const school = TenantRepository.getSchoolBySlug(cleanSlug);
    if (!school) {
      return emptyResult;
    }

    // 1. Availability Computation (Section 1.3)
    let availability = 'live';
    const status = school.status || 'active';

    if (status === 'disabled') {
      availability = 'closed';
    } else if (status === 'suspended') {
      availability = 'limited';
    } else {
      availability = 'live'; // Active, Trial, Grace
    }

    // 2. Feature Gating (Section 1.4)
    // Server computes features = plan modules + owner overrides + school settings + availability
    const plan = school.plan || 'standard';
    const settings = TenantRepository.getSettings(school.id) || {};
    const admissionSettings = settings.admission || {};

    const isBasic = plan === 'basic';
    const hasOwnerOverride = school.features_override || {};

    // Standard & Premium have all core modules by default; Basic excludes admissions, results, routines
    const defaultAdmission = !isBasic;
    const defaultResult = !isBasic;
    const defaultRoutines = !isBasic;
    const defaultVideos = plan === 'premium';

    const admissionEnabled = hasOwnerOverride.admission !== undefined 
      ? hasOwnerOverride.admission 
      : (settings.admission_enabled !== undefined ? settings.admission_enabled : defaultAdmission);

    const resultEnabled = hasOwnerOverride.results !== undefined 
      ? hasOwnerOverride.results 
      : (settings.results_enabled !== undefined ? settings.results_enabled : defaultResult);

    const routinesEnabled = hasOwnerOverride.routines !== undefined 
      ? hasOwnerOverride.routines 
      : defaultRoutines;

    const videosEnabled = hasOwnerOverride.videos !== undefined 
      ? hasOwnerOverride.videos 
      : defaultVideos;

    const features = {
      admissionForm: availability !== 'limited' && Boolean(admissionEnabled),
      admissionTrack: Boolean(admissionEnabled), // tracking allowed even in limited/grace
      resultSearch: Boolean(resultEnabled),
      routines: Boolean(routinesEnabled),
      videos: Boolean(videosEnabled)
    };

    // 3. Section Config from CMS (Section 1.5)
    const rawSections = settings.sections || {};
    const sections = {
      notices: rawSections.notices !== undefined ? rawSections.notices : true,
      stats: rawSections.stats !== undefined ? rawSections.stats : true,
      message: rawSections.message !== undefined ? rawSections.message : true,
      departments: rawSections.departments !== undefined ? rawSections.departments : true,
      facilities: rawSections.facilities !== undefined ? rawSections.facilities : true,
      gallery: rawSections.gallery !== undefined ? rawSections.gallery : true,
      uniform: rawSections.uniform !== undefined ? rawSections.uniform : true,
      contact: rawSections.contact !== undefined ? rawSections.contact : true
    };

    // 4. Data Slices
    const sliders = TenantRepository.getSliders(school.id) || [];
    const notices = TenantRepository.getNotices(school.id) || [];
    const facilities = TenantRepository.getFacilities(school.id) || [];
    const gallery = TenantRepository.getGallery(school.id) || [];
    const videos = TenantRepository.getVideos ? (TenantRepository.getVideos(school.id) || []) : [];
    const teachers = TenantRepository.getTeachers(school.id) || [];
    const students = TenantRepository.getStudents ? (TenantRepository.getStudents(school.id) || []) : [];
    const committee = TenantRepository.getCommittee(school.id) || [];
    const routines = TenantRepository.getRoutines(school.id) || [];
    const uniform = TenantRepository.getUniform(school.id) || null;
    const stats = settings.stats || [];

    // Find Headmaster from faculty
    const headmaster = teachers.find(t => 
      t.designation_bn && (t.designation_bn.includes('প্রধান শিক্ষক') || t.designation_bn.includes('ভারপ্রাপ্ত'))
    ) || teachers[0] || null;

    // Academic groups / departments
    const academicGroups = settings.academic_groups || [
      { id: 'science', num: '০১', title_bn: 'বিজ্ঞান বিভাগ', title_en: 'Science Group', icon: 'FlaskConical', desc_bn: 'আধুনিক পদার্থ, রসায়ন ও জীববিজ্ঞান ল্যাবসহ অভিজ্ঞ শিক্ষকদের সার্বক্ষণিক তত্ত্বাবধানে পাঠদান।' },
      { id: 'business', num: '০২', title_bn: 'ব্যবসায় শিক্ষা', title_en: 'Business Studies', icon: 'BarChart3', desc_bn: 'হিসাববিজ্ঞান ও ফিন্যান্সের প্রায়োগিক জ্ঞান ও ব্যবসায়িক নেতৃত্বের সমন্বিত শিক্ষাক্রম।' },
      { id: 'humanities', num: '০৩', title_bn: 'মানবিক বিভাগ', title_en: 'Humanities Group', icon: 'BookOpen', desc_bn: 'ইতিহাস, সাহিত্য, অর্থনীতি ও পৌরনীতি বিষয়ে সৃজনশীল চিন্তাশক্তি বিকাশের শিক্ষা।' }
    ];

    // Urgent notice
    const urgentNotice = notices.find(n => n.is_urgent && n.published);

    // Normalized school representation for all public sections
    const normalizedSchool = {
      ...school,
      name: school.name_bn || school.name_en || school.name,
      logo: school.logo || school.logo_url,
      slogan: school.slogan || settings.motto_bn || settings.motto_en,
      address: school.address || settings.address_bn || settings.address_en,
      phone: school.phone || settings.phone,
      email: school.email || settings.email
    };

    return {
      availability,
      school: normalizedSchool,
      settings,
      plan,
      features,
      sections,
      sliders,
      notices,
      facilities,
      gallery,
      videos,
      teachers,
      students,
      committee,
      routines,
      uniform,
      stats,
      headmaster,
      academicGroups,
      urgentNotice,
      admissionSettings
    };
  }, [slug]);
}
