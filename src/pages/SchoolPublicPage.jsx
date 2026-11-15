import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useParams, Link } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import { TenantRepository } from '../services/tenantStorage';
import ThemeToggle from '../components/common/ThemeToggle';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Badge from '../components/ui/Badge';
import Card from '../components/ui/Card';
import FilterChip from '../components/ui/FilterChip';
import Stepper from '../components/ui/Stepper';
import EmptyState from '../components/ui/EmptyState';
import GridTable from '../components/ui/GridTable';
import Modal from '../components/ui/Modal';
import Alert from '../components/ui/Alert';
import FileUpload from '../components/ui/FileUpload';
import { useToast } from '../components/ui/ToastContext';
import { toBengaliNumber, toEnglishNumber, toBengaliOrdinal } from '../utils/dateFormatter';
import { 
  GraduationCap, 
  Users, 
  BookOpen, 
  Calendar, 
  Search, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  ShieldAlert, 
  CheckCircle2, 
  Printer, 
  ArrowLeft, 
  AlertTriangle, 
  Bell, 
  Menu, 
  X, 
  Home, 
  Award, 
  Download, 
  Copy, 
  Share2,
  QrCode,
  MessageSquare,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  UserCheck,
  Image as ImageIcon,
  FileText,
  Check,
  ExternalLink,
  Sparkles,
  Shield,
  Compass,
  Star,
  Briefcase,
  ShieldCheck,
  Film,
  Play,
  Paperclip
} from 'lucide-react';

export default function SchoolPublicPage() {
  const { slug } = useParams();
  const school = TenantRepository.getSchoolBySlug(slug || '');
  const { mode, theme, toggleMode } = useTheme({ slug, defaultTheme: school?.theme });
  const { showToast } = useToast();
  const settings = school ? TenantRepository.getSettings(school.id) : null;
  const teachers = school ? TenantRepository.getTeachers(school.id) : [];
  const students = school ? TenantRepository.getStudents(school.id) : [];
  const notices = school ? TenantRepository.getNotices(school.id) : [];
  const sliders = school ? TenantRepository.getSliders(school.id) : [];
  const uniform = school ? TenantRepository.getUniform(school.id) : null;
  const committee = school ? TenantRepository.getCommittee(school.id) : [];
  const routines = school ? TenantRepository.getRoutines(school.id) : [];
  const gallery = school ? TenantRepository.getGallery(school.id) : [];
  const videos = school ? TenantRepository.getVideos(school.id) : [];
  const facilities = school ? TenantRepository.getFacilities(school.id) : [];

  // Active hash or mobile tab
  const [activeTab, setActiveTab] = useState('home'); 
  const [activeNoticeFilter, setActiveNoticeFilter] = useState('all');
  const [activeGalleryFilter, setActiveGalleryFilter] = useState('all');
  const [activeMediaTab, setActiveMediaTab] = useState('photos'); // 'photos', 'videos'
  const [selectedVideo, setSelectedVideo] = useState(null);

  // Slider State
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto slide interval
  useEffect(() => {
    if (sliders.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % sliders.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [sliders.length]);

  // Gallery Modal Lightbox
  const [lightboxImage, setLightboxImage] = useState(null);

  // Faculty & Teachers filter & search
  const [teacherFilter, setTeacherFilter] = useState('all'); // 'all', 'teacher', 'staff'
  const [teacherSearch, setTeacherSearch] = useState('');

  // Result Search State
  const [resultQuery, setResultQuery] = useState({ classVal: '10', rollVal: '1', examVal: 'Annual', yearVal: '2026' });
  const [searchOutput, setSearchOutput] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Admission Multi-step State
  const [admissionStep, setAdmissionStep] = useState(1);
  const [admissionForm, setAdmissionForm] = useState({
    name_bn: '',
    name_en: '',
    photo: '',
    father_name: '',
    mother_name: '',
    applied_class: '6',
    group: 'General',
    mobile: '',
    prev_school: '',
    prev_gpa: '',
    dob: '',
    address: ''
  });
  const [step1Errors, setStep1Errors] = useState({});
  const [step2Errors, setStep2Errors] = useState({});
  const [mobileError, setMobileError] = useState('');
  const [submittedAdmission, setSubmittedAdmission] = useState(null);
  const [trackingModalOpen, setTrackingModalOpen] = useState(false);
  const [searchTrackCode, setSearchTrackCode] = useState('');
  const [searchTrackPhone, setSearchTrackPhone] = useState('');
  const [trackError, setTrackError] = useState('');
  const [trackResult, setTrackResult] = useState(null);
  const [admitCardData, setAdmitCardData] = useState(null);

  // Contact Form State (D08)
  const [contactForm, setContactForm] = useState({
    name: '',
    mobile: '',
    email: '',
    message: ''
  });
  const [contactErrors, setContactErrors] = useState({});
  const [contactSuccess, setContactSuccess] = useState(false);

  // Notice Read Modal
  const [readingNotice, setReadingNotice] = useState(null);

  // Teacher Initials Helper (UI/UX Phase 2)
  const getTeacherInitials = (name) => {
    if (!name) return 'শি';
    const clean = name.replace(/^(মো\.|মোঃ|জনাব|শ্রী|মুহাম্মদ|ড\.|ডঃ)\s*/i, '').trim();
    const parts = clean.split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] || '') + (parts[1][0] || '');
    }
    return clean.slice(0, 2);
  };

  // Mobile menu
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const navRef = useRef(null);

  // Click outside and ESC key listener for dropdowns
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setOpenDropdown(null);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setOpenDropdown(null);
        setMobileNavOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const navigateToTab = (tabKey) => {
    setActiveTab(tabKey);
    window.location.hash = tabKey;
    setOpenDropdown(null);
    setMobileNavOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Sync hash with activeTab
  useEffect(() => {
    const handleHash = () => {
      let hash = window.location.hash.replace('#', '');
      if (hash === 'faculty') hash = 'teachers';
      if (hash === 'routines') hash = 'academics';
      if (hash === 'facebookHub') hash = 'contact';
      const validTabs = ['home', 'about', 'committee', 'teachers', 'academics', 'uniform', 'notices', 'admission', 'results', 'gallery', 'contact'];
      if (validTabs.includes(hash)) {
        setActiveTab(hash);
      } else {
        setActiveTab('home');
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // Dynamic Document Title
  useEffect(() => {
    if (school) {
      document.title = `${school.name_bn} — অফিশিয়াল পোর্টাল`;
    }
  }, [school]);

  if (!school) {
    return (
      <div className="min-h-screen bg-bg text-text flex flex-col items-center justify-center p-6 text-center">
        <ShieldAlert className="w-14 h-14 text-danger mb-4" />
        <h2 className="text-2xl font-heading font-bold mb-2">স্কুল পাওয়া যায়নি (404)</h2>
        <p className="text-sm text-muted mb-6">"{slug}" স্লাগে কোনো পাবলিক ওয়েবসাইট রেজিস্টার করা নেই।</p>
        <Link to="/"><Button variant="secondary" icon={ArrowLeft}>প্ল্যাটফর্ম হোমপেজে যান</Button></Link>
      </div>
    );
  }

  // Urgent Notice for Header Ticker
  const urgentNotice = notices.find(n => n.is_urgent && n.published);

  // Notice filtering
  const filteredNotices = notices.filter(n => {
    if (!n.published) return false;
    if (activeNoticeFilter === 'all') return true;
    return n.category === activeNoticeFilter;
  });

  // Gallery filtering
  const filteredGallery = gallery.filter(g => {
    if (activeGalleryFilter === 'all') return true;
    return g.category === activeGalleryFilter;
  });

  // Video filtering
  const filteredVideos = videos.filter(v => {
    if (activeGalleryFilter === 'all') return true;
    return v.category === activeGalleryFilter;
  });

  // Handle Result Search (D12, D33, D37)
  const handleResultSearch = (e) => {
    e.preventDefault();
    setHasSearched(true);
    const cleanRoll = toEnglishNumber((resultQuery.rollVal || '').trim());
    const res = TenantRepository.searchResult(school.id, {
      ...resultQuery,
      rollVal: cleanRoll
    });
    setSearchOutput(res);
  };

  // Admission Validation Helpers (D09)
  const validateStep1 = () => {
    const errs = {};
    if (!admissionForm.name_bn.trim()) {
      errs.name_bn = 'বাংলায় শিক্ষার্থীর নাম আবশ্যক';
    } else if (!/[\u0980-\u09FF]/.test(admissionForm.name_bn)) {
      errs.name_bn = 'নাম অবশ্যই বাংলা অক্ষরে লিখতে হবে';
    }

    if (!admissionForm.name_en.trim()) {
      errs.name_en = 'ইংরেজি বড় হাতের অক্ষরে নাম আবশ্যক';
    }

    if (!admissionForm.photo) {
      errs.photo = 'শিক্ষার্থীর পাসপোর্ট সাইজ ছবি আপলোড করুন';
    }

    if (['9', '10'].includes(admissionForm.applied_class) && admissionForm.group === 'General') {
      errs.group = '৯ম ও ১০ম শ্রেণির জন্য বিভাগ নির্বাচন করুন (বিজ্ঞান/ব্যবসায় শিক্ষা/মানবিক)';
    }

    if (admissionForm.prev_gpa.trim()) {
      const gpaNum = parseFloat(toEnglishNumber(admissionForm.prev_gpa));
      if (isNaN(gpaNum) || gpaNum < 1.00 || gpaNum > 5.00) {
        errs.prev_gpa = 'জিপিএ ১.০০ থেকে ৫.০০ এর মধ্যে হতে হবে';
      }
    }

    setStep1Errors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep2 = () => {
    const errs = {};
    if (!admissionForm.father_name.trim()) errs.father_name = 'পিতার নাম আবশ্যক';
    if (!admissionForm.mother_name.trim()) errs.mother_name = 'মাতার নাম আবশ্যক';
    
    const cleanPhone = toEnglishNumber(admissionForm.mobile.trim());
    if (!/^01[3-9]\d{8}$/.test(cleanPhone)) {
      errs.mobile = 'সঠিক ১১ ডিজিট বাংলাদেশি মোবাইল নম্বর দিন (যেমন: 018XXXXXXXX)';
    }

    if (!admissionForm.address.trim()) {
      errs.address = 'বর্তমান ঠিকানা আবশ্যক';
    }

    setStep2Errors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleStep1Next = () => {
    if (validateStep1()) {
      setAdmissionStep(2);
      window.scrollTo({ top: 250, behavior: 'smooth' });
    }
  };

  const handleStep2Next = () => {
    if (validateStep2()) {
      setAdmissionStep(3);
      window.scrollTo({ top: 250, behavior: 'smooth' });
    }
  };

  // Handle Admission Submit (D09)
  const handleAdmissionSubmit = (e) => {
    e.preventDefault();
    if (!validateStep1() || !validateStep2()) {
      showToast('আবেদন ফরমে কিছু ভুল রয়েছে, সংশোধন করুন।', 'error');
      return;
    }

    try {
      const newAdm = TenantRepository.createAdmission(school.id, {
        ...admissionForm,
        mobile: toEnglishNumber(admissionForm.mobile.trim()),
        prev_gpa: admissionForm.prev_gpa ? toEnglishNumber(admissionForm.prev_gpa.trim()) : ''
      });
      setSubmittedAdmission(newAdm);
      showToast('ভর্তি আবেদন সফলভাবে জমা হয়েছে!', 'success');
    } catch (err) {
      showToast(err.message || 'ভর্তি আবেদন প্রক্রিয়াকরণে ত্রুটি হয়েছে', 'error');
    }
  };

  // Handle Tracking Lookup (D28: Requires Code AND Phone)
  const handleTrackingLookup = (e) => {
    e.preventDefault();
    setTrackError('');
    const code = searchTrackCode.trim().toUpperCase();
    const phone = toEnglishNumber(searchTrackPhone.trim());

    if (!code) {
      setTrackError('ট্র্যাকিং কোড দিন');
      return;
    }
    if (!phone || phone.length < 11) {
      setTrackError('আবেদনে প্রদত্ত ১১ ডিজিটের মোবাইল নম্বর দিন');
      return;
    }

    const admissions = TenantRepository.getAdmissions(school.id);
    const adm = admissions.find(
      a => a.tracking_id.toUpperCase() === code && a.mobile === phone
    );
    setTrackResult(adm || 'NOT_FOUND');
  };

  // Handle Routine Download (D10)
  const handleRoutineDownload = (routine) => {
    if (routine.file_url && routine.file_url.startsWith('http')) {
      window.open(routine.file_url, '_blank');
      return;
    }

    const htmlContent = `<!DOCTYPE html>
<html lang="bn">
<head>
  <meta charset="UTF-8">
  <title>${routine.title} — ${school.name_bn}</title>
  <style>
    body { font-family: 'Noto Sans Bengali', system-ui, sans-serif; padding: 40px; color: #0f172a; line-height: 1.5; }
    .header { text-align: center; border-bottom: 2px solid #0f766e; padding-bottom: 20px; margin-bottom: 24px; }
    .header h1 { margin: 0 0 6px 0; font-size: 24px; color: #0f766e; }
    .header p { margin: 2px 0; font-size: 13px; color: #475569; }
    .title-box { background: #f8fafc; border: 1px solid #cbd5e1; padding: 12px 20px; border-radius: 8px; margin-bottom: 24px; }
    table { width: 100%; border-collapse: collapse; margin-top: 16px; font-size: 13px; }
    th, td { border: 1px solid #94a3b8; padding: 10px 12px; text-align: left; }
    th { background: #e2e8f0; font-weight: bold; }
    .footer { margin-top: 40px; display: flex; justify-content: space-between; font-size: 12px; color: #475569; padding-top: 30px; border-top: 1px dashed #cbd5e1; }
  </style>
</head>
<body>
  <div class="header">
    <h1>${school.name_bn}</h1>
    <p>EIIN: ${school.eiin} • শিক্ষাবোর্ড: ${school.board} • জেলা: ${school.district}</p>
    <p>অফিশিয়াল একাডেমিক বিজ্ঞপ্তি ও রুটিন</p>
  </div>
  <div class="title-box">
    <h2 style="margin: 0 0 6px 0; font-size: 18px;">${routine.title}</h2>
    <p style="margin: 0; font-size: 12px; color: #64748b;">কার্যকরের তারিখ: ${routine.effective_date} • ক্যাটাগরি: ${routine.category === 'class_routine' ? 'ক্লাস রুটিন' : 'পরীক্ষার সময়সূচি'}</p>
  </div>
  <table>
    <thead>
      <tr>
        <th>বার / সময়</th>
        <th>১০:০০ - ১০:৪৫</th>
        <th>১০:৫০ - ১১:৩৫</th>
        <th>১১:৪০ - ১২:২৫</th>
        <th>১:১৫ - ২:০০</th>
        <th>২:০৫ - ২:৫০</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>রবিবার</strong></td>
        <td>বাংলা ১ম পত্র</td>
        <td>ইংরেজি ১ম পত্র</td>
        <td>সাধারণ গণিত</td>
        <td>পদার্থবিজ্ঞান / হিসাববিজ্ঞান</td>
        <td>আইসিটি</td>
      </tr>
      <tr>
        <td><strong>সোমবার</strong></td>
        <td>ইংরেজি ২য় পত্র</td>
        <td>বাংলা ২য় পত্র</td>
        <td>উচ্চতর গণিত / সাধারণ বিজ্ঞান</td>
        <td>রসায়ন / ব্যবসায় উদ্যোগ</td>
        <td>ধর্ম ও নৈতিক শিক্ষা</td>
      </tr>
      <tr>
        <td><strong>মঙ্গলবার</strong></td>
        <td>সাধারণ গণিত</td>
        <td>বাংলাদেশ ও বিশ্বপরিচয়</td>
        <td>ইংরেজি ১ম পত্র</td>
        <td>জীববিজ্ঞান / ফিন্যান্স</td>
        <td>শারীরিক শিক্ষা</td>
      </tr>
      <tr>
        <td><strong>বুধবার</strong></td>
        <td>পদার্থবিজ্ঞান / হিসাববিজ্ঞান</td>
        <td>রসায়ন / ব্যবসায় উদ্যোগ</td>
        <td>বাংলা ১ম পত্র</td>
        <td>উচ্চতর গণিত / কৃষি শিক্ষা</td>
        <td>চারু ও কারুকলা</td>
      </tr>
      <tr>
        <td><strong>বৃহস্পতিবার</strong></td>
        <td>আইসিটি</td>
        <td>সাধারণ গণিত</td>
        <td>ইংরেজি ২য় পত্র</td>
        <td>ধর্ম ও নৈতিক শিক্ষা</td>
        <td>সাপ্তাহিক মূল্যায়ন</td>
      </tr>
    </tbody>
  </table>
  <div class="footer">
    <div>প্রস্তুতকারক: একাডেমিক কো-অর্ডিনেটর</div>
    <div>অনুমোদনকারী: প্রধান শিক্ষক (${school.name_bn})</div>
  </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${routine.title.replace(/\s+/g, '_')}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast(`রুটিন ডাউনলোড সম্পন্ন হয়েছে: ${routine.title}`, 'success');
  };

  // Handle Contact Message Submit (D08)
  const handleContactSubmit = (e) => {
    e.preventDefault();
    const errs = {};
    if (!contactForm.name.trim()) errs.name = 'আপনার নাম লিখুন';
    const cleanPhone = toEnglishNumber(contactForm.mobile.trim());
    if (!/^01[3-9]\d{8}$/.test(cleanPhone)) {
      errs.mobile = 'সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন (যেমন: 018XXXXXXXX)';
    }
    if (contactForm.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactForm.email.trim())) {
      errs.email = 'সঠিক ইমেইল ঠিকানা দিন (অথবা ফাঁকা রাখুন)';
    }
    if (!contactForm.message.trim() || contactForm.message.trim().length < 5) {
      errs.message = 'আপনার বার্তা কমপক্ষে ৫ অক্ষরের হতে হবে';
    }

    if (Object.keys(errs).length > 0) {
      setContactErrors(errs);
      return;
    }
    setContactErrors({});

    try {
      TenantRepository.createContactMessage(school.id, {
        name: contactForm.name.trim(),
        mobile: cleanPhone,
        email: contactForm.email.trim(),
        message: contactForm.message.trim()
      });
      setContactSuccess(true);
      setContactForm({ name: '', mobile: '', email: '', message: '' });
      showToast('আপনার বার্তাটি সফলভাবে পাঠানো হয়েছে! কর্তৃপক্ষ শীঘ্রই যোগাযোগ করবে।', 'success');
    } catch (err) {
      showToast(err.message || 'বার্তা পাঠাতে ত্রুটি হয়েছে', 'error');
    }
  };

  // Category Badge Helper (D31, D32)
  const renderCategoryBadge = (cat) => {
    switch (cat) {
      case 'exam':
        return <Badge variant="info">পরীক্ষা</Badge>;
      case 'admission':
        return <Badge variant="primary">ভর্তি</Badge>;
      case 'academic':
        return <Badge variant="success">একাডেমিক</Badge>;
      default:
        return <Badge variant="muted">সাধারণ</Badge>;
    }
  };

  // Structured Navigation Groups
  const navGroups = {
    about: {
      id: 'about',
      label: 'আমাদের সম্পর্কে',
      keys: ['about', 'committee', 'teachers'],
      items: [
        { key: 'about', label: 'বিদ্যালয় পরিচিতি ও ইতিহাস', desc: 'ইতিহাস, লক্ষ্য, ভিশন ও প্রধান শিক্ষকের বাণী', icon: BookOpen },
        { key: 'committee', label: 'পরিচালনা পর্ষদ', desc: 'ম্যানেজিং কমিটি ও পরিষদ সদস্যবৃন্দ', icon: Shield },
        { key: 'teachers', label: 'শিক্ষক ও কর্মচারী পরিষদ', desc: 'অভিজ্ঞ শিক্ষকমণ্ডলী ও প্রাতিষ্ঠানিক স্টাফ', icon: Users },
      ]
    },
    academics: {
      id: 'academics',
      label: 'একাডেমিক',
      keys: ['academics', 'uniform', 'notices'],
      items: [
        { key: 'academics', label: 'শাখা ও ক্লাস রুটিন', desc: 'শাখা বিবরণ ও পরীক্ষার রুটিন ডাউনলোড', icon: Calendar },
        { key: 'uniform', label: 'পোশাক নীতিমালা (Uniform)', desc: 'ছাত্র ও ছাত্রীদের নির্ধারিত ড্রেসকোড', icon: Sparkles },
        { key: 'notices', label: 'প্রাতিষ্ঠানিক নোটিশ বোর্ড', desc: 'জরুরি ও অ্যাকাডেমিক সকল নোটিশ', icon: Bell },
      ]
    }
  };

  return (
    <div className="min-h-screen bg-bg text-text flex flex-col font-sans transition-colors duration-200">
      {/* Accessible Skip Link */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-on-primary focus:font-bold focus:rounded-lg focus:shadow-xl"
      >
        মূল কনটেন্টে যান (Skip to content)
      </a>
      
      {/* ================= 1. INSTITUTIONAL TOP BAR ================= */}
      <div className="bg-surface-2 border-b border-border py-1.5 text-xs text-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3 font-mono text-[11px]">
            <span>EIIN: <strong className="text-text font-bold">{school.eiin}</strong></span>
            <span>•</span>
            <span>বোর্ড: <strong className="text-text">{school.board}</strong></span>
            <span>•</span>
            <span>জেলা: <strong className="text-text">{school.district}</strong></span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            {/* Font Scaler */}
            <div className="hidden sm:flex items-center gap-1 bg-surface px-2 py-0.5 rounded-md border border-border" aria-label="ফন্ট সাইজ পরিবর্তন">
              <span className="text-[10px] text-muted mr-1 font-mono">ফন্ট:</span>
              <button
                type="button"
                onClick={() => { document.documentElement.style.fontSize = '14px'; }}
                className="px-1.5 py-0.5 rounded text-[10px] font-bold hover:bg-surface-2 hover:text-text cursor-pointer"
                title="ছোট ফন্ট"
              >
                A-
              </button>
              <button
                type="button"
                onClick={() => { document.documentElement.style.fontSize = '16px'; }}
                className="px-1.5 py-0.5 rounded text-[10px] font-bold hover:bg-surface-2 hover:text-text cursor-pointer"
                title="স্বাভাবিক ফন্ট"
              >
                স্বাভাবিক
              </button>
              <button
                type="button"
                onClick={() => { document.documentElement.style.fontSize = '18px'; }}
                className="px-1.5 py-0.5 rounded text-[10px] font-bold hover:bg-surface-2 hover:text-text cursor-pointer"
                title="বড় ফন্ট"
              >
                A+
              </button>
            </div>

            <Link to={`/${school.slug}/login`} className="hover:text-primary transition-colors flex items-center gap-1 font-semibold text-[11px]">
              <Users className="w-3.5 h-3.5 text-primary" />
              <span>অ্যাডমিন পোর্টাল লগইন</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ================= 2. MAIN HEADER & LOGO ================= */}
      <header className="sticky top-0 z-40 bg-header-bg backdrop-blur-md border-b border-border shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          
          {/* Logo & School Name */}
          <Link to={`/${school.slug}`} onClick={() => navigateToTab('home')} className="flex items-center gap-3 group">
            {(settings?.logo || school.logo) ? (
              <img
                src={settings?.logo || school.logo}
                alt={school.name_bn}
                className="w-12 h-12 rounded-2xl object-cover border border-border shadow-md shrink-0 bg-surface-2"
              />
            ) : (
              <div className="w-12 h-12 rounded-2xl bg-primary text-on-primary font-heading font-extrabold text-xl flex items-center justify-center shadow-md shrink-0">
                {school.name_bn[0]}
              </div>
            )}
            <div>
              <h1 className="text-base sm:text-lg font-heading font-bold text-text leading-tight group-hover:text-primary transition-colors">
                {school.name_bn}
              </h1>
              <p className="text-[11px] text-muted">
                স্থাপিত: {settings?.established || '১৯৯০'} • {settings?.recognized || 'কুমিল্লা শিক্ষাবোর্ড'}
              </p>
            </div>
          </Link>

          {/* Desktop Grouped Dropdown Navigation */}
          <nav ref={navRef} className="hidden lg:flex items-center gap-1.5" aria-label="প্রধান নেভিগেশন">
            {/* 1. Home */}
            <button
              type="button"
              onClick={() => navigateToTab('home')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'home'
                  ? 'bg-primary text-on-primary shadow-xs'
                  : 'text-muted hover:text-text hover:bg-surface-2'
              }`}
            >
              হোম
            </button>

            {/* 2. Dropdown: আমাদের সম্পর্কে */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setOpenDropdown(openDropdown === 'about' ? null : 'about')}
                onMouseEnter={() => setOpenDropdown('about')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold inline-flex items-center gap-1 transition-all cursor-pointer ${
                  navGroups.about.keys.includes(activeTab)
                    ? 'bg-primary text-on-primary shadow-xs'
                    : 'text-muted hover:text-text hover:bg-surface-2'
                }`}
                aria-expanded={openDropdown === 'about'}
              >
                <span>{navGroups.about.label}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${openDropdown === 'about' ? 'rotate-180' : ''}`} />
              </button>

              {openDropdown === 'about' && (
                <div 
                  onMouseLeave={() => setOpenDropdown(null)}
                  className="absolute top-full left-0 mt-1.5 w-72 bg-surface/95 backdrop-blur-md border border-border rounded-xl shadow-xl p-2 z-50 animate-scale-in"
                >
                  {navGroups.about.items.map((sub) => {
                    const SubIcon = sub.icon;
                    const isActive = activeTab === sub.key;
                    return (
                      <button
                        key={sub.key}
                        type="button"
                        onClick={() => navigateToTab(sub.key)}
                        className={`w-full text-left p-2.5 rounded-lg flex items-start gap-3 transition-colors cursor-pointer ${
                          isActive 
                            ? 'bg-primary-soft text-primary font-bold' 
                            : 'hover:bg-surface-2 text-text'
                        }`}
                      >
                        <div className={`p-2 rounded-lg shrink-0 ${isActive ? 'bg-primary text-on-primary' : 'bg-surface-2 text-muted'}`}>
                          <SubIcon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold leading-tight">{sub.label}</div>
                          <div className="text-[11px] text-muted line-clamp-1 mt-0.5">{sub.desc}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 3. Dropdown: একাডেমিক */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setOpenDropdown(openDropdown === 'academics' ? null : 'academics')}
                onMouseEnter={() => setOpenDropdown('academics')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold inline-flex items-center gap-1 transition-all cursor-pointer ${
                  navGroups.academics.keys.includes(activeTab)
                    ? 'bg-primary text-on-primary shadow-xs'
                    : 'text-muted hover:text-text hover:bg-surface-2'
                }`}
                aria-expanded={openDropdown === 'academics'}
              >
                <span>{navGroups.academics.label}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${openDropdown === 'academics' ? 'rotate-180' : ''}`} />
              </button>

              {openDropdown === 'academics' && (
                <div 
                  onMouseLeave={() => setOpenDropdown(null)}
                  className="absolute top-full left-0 mt-1.5 w-72 bg-surface/95 backdrop-blur-md border border-border rounded-xl shadow-xl p-2 z-50 animate-scale-in"
                >
                  {navGroups.academics.items.map((sub) => {
                    const SubIcon = sub.icon;
                    const isActive = activeTab === sub.key;
                    return (
                      <button
                        key={sub.key}
                        type="button"
                        onClick={() => navigateToTab(sub.key)}
                        className={`w-full text-left p-2.5 rounded-lg flex items-start gap-3 transition-colors cursor-pointer ${
                          isActive 
                            ? 'bg-primary-soft text-primary font-bold' 
                            : 'hover:bg-surface-2 text-text'
                        }`}
                      >
                        <div className={`p-2 rounded-lg shrink-0 ${isActive ? 'bg-primary text-on-primary' : 'bg-surface-2 text-muted'}`}>
                          <SubIcon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold leading-tight">{sub.label}</div>
                          <div className="text-[11px] text-muted line-clamp-1 mt-0.5">{sub.desc}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 4. Admission Action */}
            <button
              type="button"
              onClick={() => navigateToTab('admission')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'admission'
                  ? 'bg-accent text-white shadow-xs'
                  : 'bg-accent-soft text-accent hover:bg-accent hover:text-white border border-accent-line'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>অনলাইন ভর্তি</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </button>

            {/* 5. Results */}
            <button
              type="button"
              onClick={() => navigateToTab('results')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'results'
                  ? 'bg-primary text-on-primary shadow-xs'
                  : 'text-muted hover:text-text hover:bg-surface-2'
              }`}
            >
              রেজাল্ট
            </button>

            {/* 6. Gallery */}
            <button
              type="button"
              onClick={() => navigateToTab('gallery')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'gallery'
                  ? 'bg-primary text-on-primary shadow-xs'
                  : 'text-muted hover:text-text hover:bg-surface-2'
              }`}
            >
              গ্যালারি
            </button>

            {/* 7. Contact */}
            <button
              type="button"
              onClick={() => navigateToTab('contact')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'contact'
                  ? 'bg-primary text-on-primary shadow-xs'
                  : 'text-muted hover:text-text hover:bg-surface-2'
              }`}
            >
              যোগাযোগ
            </button>
          </nav>

          {/* Right Header Actions */}
          <div className="flex items-center gap-3">
            <ThemeToggle mode={mode} toggleMode={toggleMode} lang="bn" />

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
              className="lg:hidden p-2 rounded-lg text-muted hover:text-text cursor-pointer"
              aria-label="মেনু খুলুন"
            >
              {mobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer / Backdrop (Rendered via createPortal to prevent header clipping) */}
        {mobileNavOpen && typeof document !== 'undefined' && createPortal(
          <div className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end animate-fade-in no-print">
            <div className="w-4/5 max-w-sm h-full bg-surface border-l border-border p-5 flex flex-col justify-between overflow-y-auto">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-border mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-primary text-on-primary font-bold flex items-center justify-center">
                      {school.name_bn[0]}
                    </div>
                    <span className="font-heading font-bold text-sm text-text truncate max-w-[170px]">{school.name_bn}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setMobileNavOpen(false)}
                    className="p-1.5 rounded-lg text-muted hover:text-text hover:bg-surface-2 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Section: মূল মেনু */}
                <div className="space-y-4">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-muted uppercase tracking-wider block mb-2">প্রধান মেনু</span>
                    <div className="space-y-1">
                      <button
                        type="button"
                        onClick={() => navigateToTab('home')}
                        className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-3 cursor-pointer ${
                          activeTab === 'home' ? 'bg-primary text-on-primary' : 'text-text hover:bg-surface-2'
                        }`}
                      >
                        <Home className="w-4 h-4" />
                        <span>হোমপেজ</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => navigateToTab('admission')}
                        className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-semibold flex items-center justify-between cursor-pointer ${
                          activeTab === 'admission' ? 'bg-primary text-on-primary' : 'text-text hover:bg-surface-2'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <GraduationCap className="w-4 h-4 text-accent" />
                          <span>অনলাইন ভর্তি আবেদন</span>
                        </div>
                        <Badge variant="accent" size="sm">চলছে</Badge>
                      </button>
                      <button
                        type="button"
                        onClick={() => navigateToTab('results')}
                        className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-3 cursor-pointer ${
                          activeTab === 'results' ? 'bg-primary text-on-primary' : 'text-text hover:bg-surface-2'
                        }`}
                      >
                        <FileText className="w-4 h-4 text-info" />
                        <span>রেজাল্ট ও মার্কশিট</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => navigateToTab('notices')}
                        className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-semibold flex items-center justify-between cursor-pointer ${
                          activeTab === 'notices' ? 'bg-primary text-on-primary' : 'text-text hover:bg-surface-2'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Bell className="w-4 h-4 text-accent" />
                          <span>প্রাতিষ্ঠানিক নোটিশ</span>
                        </div>
                        {urgentNotice && <span className="w-2 h-2 rounded-full bg-accent" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono font-bold text-muted uppercase tracking-wider block mb-2">আমাদের সম্পর্কে</span>
                    <div className="space-y-1">
                      <button
                        type="button"
                        onClick={() => navigateToTab('about')}
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-3 cursor-pointer ${
                          activeTab === 'about' ? 'bg-primary text-on-primary' : 'text-muted hover:text-text hover:bg-surface-2'
                        }`}
                      >
                        <BookOpen className="w-4 h-4" />
                        <span>বিদ্যালয় পরিচিতি ও ইতিহাস</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => navigateToTab('committee')}
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-3 cursor-pointer ${
                          activeTab === 'committee' ? 'bg-primary text-on-primary' : 'text-muted hover:text-text hover:bg-surface-2'
                        }`}
                      >
                        <Shield className="w-4 h-4" />
                        <span>পরিচালনা পর্ষদ</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => navigateToTab('teachers')}
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-3 cursor-pointer ${
                          activeTab === 'teachers' ? 'bg-primary text-on-primary' : 'text-muted hover:text-text hover:bg-surface-2'
                        }`}
                      >
                        <Users className="w-4 h-4" />
                        <span>শিক্ষক ও কর্মচারী পরিষদ</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono font-bold text-muted uppercase tracking-wider block mb-2">অন্যান্য</span>
                    <div className="space-y-1">
                      <button
                        type="button"
                        onClick={() => navigateToTab('academics')}
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-3 cursor-pointer ${
                          activeTab === 'academics' ? 'bg-primary text-on-primary' : 'text-muted hover:text-text hover:bg-surface-2'
                        }`}
                      >
                        <Calendar className="w-4 h-4" />
                        <span>ক্লাস ও পরীক্ষার রুটিন</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => navigateToTab('uniform')}
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-3 cursor-pointer ${
                          activeTab === 'uniform' ? 'bg-primary text-on-primary' : 'text-muted hover:text-text hover:bg-surface-2'
                        }`}
                      >
                        <Sparkles className="w-4 h-4" />
                        <span>পোশাক নীতিমালা (Uniform)</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => navigateToTab('gallery')}
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-3 cursor-pointer ${
                          activeTab === 'gallery' ? 'bg-primary text-on-primary' : 'text-muted hover:text-text hover:bg-surface-2'
                        }`}
                      >
                        <ImageIcon className="w-4 h-4" />
                        <span>ফটো গ্যালারি</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => navigateToTab('contact')}
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-3 cursor-pointer ${
                          activeTab === 'contact' ? 'bg-primary text-on-primary' : 'text-muted hover:text-text hover:bg-surface-2'
                        }`}
                      >
                        <Phone className="w-4 h-4" />
                        <span>যোগাযোগ ও লোকেশন</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Drawer Bottom Actions */}
              <div className="pt-4 border-t border-border space-y-3">
                <Link to={`/${school.slug}/login`} className="w-full block">
                  <Button variant="primary" size="md" className="w-full" icon={Users}>
                    অ্যাডমিন পোর্টাল লগইন
                  </Button>
                </Link>
                <div className="flex items-center justify-between text-xs text-muted">
                  <span>থিম পরিবর্তন</span>
                  <ThemeToggle mode={mode} toggleMode={toggleMode} lang="bn" />
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
      </header>

      {/* ================= 3. URGENT BREAKING NOTICE TICKER ================= */}
      {urgentNotice && (
        <div className="bg-accent-soft border-b border-accent-line text-accent py-2 px-4 text-xs font-medium">
          <div className="max-w-7xl mx-auto flex items-center gap-3 overflow-hidden">
            <span className="px-2 py-0.5 rounded-md bg-accent text-white font-bold text-[10px] shrink-0 uppercase tracking-wide">
              জরুরি নোটিশ
            </span>
            <div className="truncate flex-1">
              <span>{urgentNotice.title}</span>
            </div>
            <button
              type="button"
              onClick={() => {
                setActiveTab('notices');
                window.location.hash = 'notices';
                setReadingNotice(urgentNotice);
              }}
              className="underline text-[11px] font-bold shrink-0 hover:opacity-80 cursor-pointer"
            >
              বিস্তারিত দেখুন ›
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ================= TAB 1: HOME TAB (FULL FEATURED HOMEPAGE) ============== */}
      {/* ========================================================================= */}
      {activeTab === 'home' && (
        <main id="main" className="flex-1 space-y-12 pb-16 animate-fade-in">
          
          {/* Dynamic Hero Slider */}
          <section className="relative overflow-hidden bg-surface-2 border-b border-border">
            {sliders.length > 0 ? (
              <div className="relative h-[420px] sm:h-[480px] lg:h-[540px] w-full">
                {sliders.map((slide, idx) => (
                  <div
                    key={slide.id || idx}
                    className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                      idx === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none invisible'
                    }`}
                  >
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/35" />

                    <div className="absolute inset-0 flex items-center justify-center p-6 text-center">
                      <div className="max-w-3xl mx-auto space-y-4">
                        {slide.tag && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white border border-white/30 text-xs font-bold backdrop-blur-md">
                            <Sparkles className="w-3.5 h-3.5 text-accent" />
                            {slide.tag}
                          </span>
                        )}

                        <h2 className="text-2xl sm:text-4xl lg:text-5xl font-heading font-extrabold text-white leading-tight drop-shadow-lg">
                          {slide.title}
                        </h2>

                        <p className="text-xs sm:text-base text-white/90 max-w-2xl mx-auto drop-shadow-md leading-relaxed font-medium">
                          {slide.subtitle}
                        </p>

                        <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
                          <Button 
                            variant="primary" 
                            size="lg"
                            onClick={() => {
                              setActiveTab('admission');
                              window.location.hash = 'admission';
                            }}
                          >
                            অনলাইন ভর্তি আবেদন
                          </Button>
                          <Button 
                            variant="secondary" 
                            size="lg"
                            className="bg-white/10 text-white border-white/30 hover:bg-white/20 backdrop-blur-xs"
                            onClick={() => {
                              setActiveTab('results');
                              window.location.hash = 'results';
                            }}
                          >
                            রেজাল্ট অনুসন্ধান
                          </Button>
                          <Button 
                            variant="secondary" 
                            size="lg"
                            className="bg-white/10 text-white border-white/30 hover:bg-white/20 backdrop-blur-xs"
                            onClick={() => {
                              setActiveTab('uniform');
                              window.location.hash = 'uniform';
                            }}
                          >
                            পোশাক নীতিমালা
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Slider Controls */}
                {sliders.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() => setCurrentSlide(prev => (prev === 0 ? sliders.length - 1 : prev - 1))}
                      className="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 border border-white/20 backdrop-blur-md text-white items-center justify-center hover:bg-black/60 transition-colors cursor-pointer shadow-md"
                      aria-label="আগের স্লাইড"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrentSlide(prev => (prev + 1) % sliders.length)}
                      className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 border border-white/20 backdrop-blur-md text-white items-center justify-center hover:bg-black/60 transition-colors cursor-pointer shadow-md"
                      aria-label="পরের স্লাইড"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>

                    {/* Indicator Dots (D38: Accessible 44px Tap Target) */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1">
                      {sliders.map((_, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setCurrentSlide(i)}
                          className="p-3 inline-flex items-center justify-center cursor-pointer select-none"
                          aria-label={`স্লাইড ${i + 1}`}
                        >
                          <span
                            className={`h-2.5 rounded-full transition-all block ${
                              i === currentSlide ? 'w-7 bg-primary shadow-xs' : 'w-2.5 bg-white/50 hover:bg-white/80'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="relative py-20 px-6 sm:px-12 bg-gradient-to-br from-primary/15 via-surface to-surface-2 border-b border-border flex items-center justify-center text-center">
                <div className="max-w-3xl mx-auto space-y-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-soft text-primary border border-primary/30 text-xs font-bold">
                    <Sparkles className="w-3.5 h-3.5" />
                    {settings?.tagline_bn || 'জ্ঞানে আলো, কর্মে সফলতা'}
                  </span>
                  <h2 className="text-3xl sm:text-5xl font-heading font-extrabold text-text leading-tight">
                    {school.name_bn}
                  </h2>
                  <p className="text-sm sm:text-base text-muted max-w-2xl mx-auto leading-relaxed">
                    {settings?.motto_bn || 'শিক্ষা, শান্তি ও প্রগতির অনন্য বিদ্যাপীঠ। গুণগত শিক্ষা নিশ্চিতকরণে আমরা অঙ্গীকারাবদ্ধ।'}
                  </p>
                  <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
                    <Button 
                      variant="primary" 
                      size="lg"
                      onClick={() => {
                        setActiveTab('admission');
                        window.location.hash = 'admission';
                      }}
                    >
                      অনলাইন ভর্তি আবেদন
                    </Button>
                    <Button 
                      variant="secondary" 
                      size="lg"
                      onClick={() => {
                        setActiveTab('results');
                        window.location.hash = 'results';
                      }}
                    >
                      রেজাল্ট অনুসন্ধান
                    </Button>
                    <Button 
                      variant="secondary" 
                      size="lg"
                      onClick={() => {
                        setActiveTab('notices');
                        window.location.hash = 'notices';
                      }}
                    >
                      নোটিশ বোর্ড
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* Quick Metrics Bar */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <Card surface="surface" className="text-center p-5 border-l-4 border-l-primary">
                <span className="text-3xl sm:text-4xl font-mono font-extrabold text-primary block">
                  {settings?.established || '১৯৯০'}
                </span>
                <span className="text-xs text-muted font-medium mt-1 block">প্রতিষ্ঠা সাল</span>
              </Card>

              <Card surface="surface" className="text-center p-5 border-l-4 border-l-success">
                <span className="text-3xl sm:text-4xl font-mono font-extrabold text-success block">
                  {settings?.capacity || (students.length > 0 ? `${toBengaliNumber(students.length)}+` : `${toBengaliNumber(school.max_students || 850)}+`)}
                </span>
                <span className="text-xs text-muted font-medium mt-1 block">নিবন্ধিত শিক্ষার্থী</span>
              </Card>

              <Card surface="surface" className="text-center p-5 border-l-4 border-l-accent">
                <span className="text-3xl sm:text-4xl font-mono font-extrabold text-accent block">
                  {settings?.pass_rate || '৯৮.৫%'}
                </span>
                <span className="text-xs text-muted font-medium mt-1 block">বোর্ড পাসের গড় হার</span>
              </Card>

              <Card surface="surface" className="text-center p-5 border-l-4 border-l-indigo">
                <span className="text-3xl sm:text-4xl font-mono font-extrabold text-indigo block">
                  ৩টি
                </span>
                <span className="text-xs text-muted font-medium mt-1 block">বিভাগ (বিজ্ঞান, ব্যবসা, মানবিক)</span>
              </Card>
            </div>
          </section>

          {/* ================= BENTO GRID (UI/UX Phase 3) ================= */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Bento 1: Latest Notice (col-span-7) */}
              <div className="md:col-span-7 bg-surface rounded-2xl border border-border p-6 shadow-xs flex flex-col justify-between hover:border-primary/40 transition-colors">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-soft text-primary text-xs font-bold border border-primary/20">
                      <Bell className="w-3.5 h-3.5" />
                      <span>সর্বশেষ নোটিশ</span>
                    </div>
                    {filteredNotices[0] && (
                      <span className="text-xs text-muted font-mono">
                        {filteredNotices[0].date}
                      </span>
                    )}
                  </div>

                  {filteredNotices[0] ? (
                    <div className="space-y-2">
                      <h4 className="text-lg sm:text-xl font-heading font-bold text-text line-clamp-2">
                        {filteredNotices[0].title}
                      </h4>
                      <p className="text-xs sm:text-sm text-muted line-clamp-2 leading-relaxed">
                        {filteredNotices[0].desc || 'জরুরি প্রাতিষ্ঠানিক নির্দেশনাবলি দেখতে সম্পূর্ণ নোটিশটি পড়ুন বা ডাউনলোড করুন।'}
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-muted">বর্তমানে কোনো নতুন নোটিশ প্রকাশিত নেই।</p>
                  )}
                </div>

                <div className="pt-4 mt-4 border-t border-border flex flex-wrap items-center justify-between gap-3">
                  {filteredNotices[0] ? (
                    <div className="flex items-center gap-2">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => setReadingNotice(filteredNotices[0])}
                      >
                        নোটিশ পড়ুন
                      </Button>
                      <button
                        type="button"
                        onClick={() => {
                          showToast('নোটিশ পিডিএফ ডাউনলোড শুরু হয়েছে...', 'info');
                        }}
                        className="px-3 py-1.5 rounded-lg border border-border bg-surface-2 text-muted hover:text-text hover:bg-surface cursor-pointer text-xs flex items-center gap-1.5 font-semibold"
                        title="পিডিএফ ডাউনলোড"
                      >
                        <Download className="w-4 h-4" />
                        <span>পিডিএফ</span>
                      </button>
                    </div>
                  ) : <div />}

                  <button
                    type="button"
                    onClick={() => navigateToTab('notices')}
                    className="text-xs font-bold text-primary hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    সকল নোটিশ দেখুন ({notices.length}) <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Bento 2: Quick Result Search (col-span-5) */}
              <div className="md:col-span-5 bg-surface rounded-2xl border border-border p-6 shadow-xs flex flex-col justify-between hover:border-primary/40 transition-colors">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-soft text-accent text-xs font-bold border border-accent/25 mb-3">
                    <Search className="w-3.5 h-3.5" />
                    <span>দ্রুত রেজাল্ট অনুসন্ধান</span>
                  </div>
                  <h4 className="text-base sm:text-lg font-heading font-bold text-text mb-1">
                    অনলাইনে ফলাফল জানুন
                  </h4>
                  <p className="text-xs text-muted mb-4">
                    শ্রেণি ও রোল নম্বর দিয়ে তাৎক্ষণিক মার্কশিট ও জিপিএ দেখুন।
                  </p>

                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                      <label className="text-[11px] font-bold text-muted block mb-1">শ্রেণি</label>
                      <select
                        value={resultQuery.classVal}
                        onChange={(e) => setResultQuery(prev => ({ ...prev, classVal: e.target.value }))}
                        className="w-full px-3 py-2 rounded-xl border border-border bg-surface text-xs font-medium text-text focus:ring-2 focus:ring-primary/40 focus:outline-none"
                      >
                        <option value="6">৬ষ্ঠ শ্রেণি</option>
                        <option value="7">৭ম শ্রেণি</option>
                        <option value="8">৮ম শ্রেণি</option>
                        <option value="9">৯ম শ্রেণি</option>
                        <option value="10">১০ম শ্রেণি</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-muted block mb-1">রোল নম্বর</label>
                      <input
                        type="text"
                        placeholder="যেমন: ১"
                        value={resultQuery.rollVal}
                        onChange={(e) => setResultQuery(prev => ({ ...prev, rollVal: e.target.value }))}
                        className="w-full px-3 py-2 rounded-xl border border-border bg-surface text-xs font-medium text-text focus:ring-2 focus:ring-primary/40 focus:outline-none font-mono"
                      />
                    </div>
                  </div>
                </div>

                <Button
                  variant="primary"
                  size="md"
                  className="w-full"
                  onClick={(e) => {
                    handleResultSearch(e);
                    navigateToTab('results');
                  }}
                >
                  ফলাফল দেখুন
                </Button>
              </div>

              {/* Bento 3: Admission Callout & Track (col-span-6) */}
              <div className="md:col-span-6 bg-primary-soft border border-primary/25 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-mono font-bold text-primary uppercase tracking-wider">ADMISSION 2026</span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-success text-on-primary">ভর্তি চলছে</span>
                  </div>
                  <h4 className="text-lg sm:text-xl font-heading font-bold text-text mb-1">
                    ২০২৬ শিক্ষাবর্ষে অনলাইনে ভর্তি আবেদন
                  </h4>
                  <p className="text-xs sm:text-sm text-muted leading-relaxed mb-4">
                    ৬ষ্ঠ থেকে ১০ম শ্রেণিতে নতুন শিক্ষার্থী ভর্তি কার্যক্রম চলমান। ঘরে বসেই ৩টি সহজ ধাপে আবেদন করুন এবং ডিজিটাল প্রবেশপত্র ডাউনলোড করুন।
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => navigateToTab('admission')}
                  >
                    আবেদন ফরম পূরণ
                  </Button>
                  <Button
                    variant="secondary"
                    size="md"
                    onClick={() => setTrackingModalOpen(true)}
                  >
                    আবেদন ট্র্যাক ও প্রবেশপত্র
                  </Button>
                </div>
              </div>

              {/* Bento 4: Timetable & Direct Contact (col-span-6) */}
              <div className="md:col-span-6 bg-surface border border-border rounded-2xl p-6 shadow-xs flex flex-col justify-between">
                <div>
                  <span className="text-xs font-mono font-bold text-accent uppercase tracking-wider block mb-2">SCHEDULE & SUPPORT</span>
                  <h4 className="text-lg sm:text-xl font-heading font-bold text-text mb-1">
                    সময়সূচি ও অফিশিয়াল হেল্পলাইন
                  </h4>
                  <p className="text-xs sm:text-sm text-muted leading-relaxed mb-4">
                    ক্লাস ও অফিসের সময়সূচিতে সরাসরি যোগাযোগ করতে পারেন অথবা যেকোনো প্রয়োজনে আমাদের হেল্পলাইনে কল করুন।
                  </p>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-surface-2 border border-border space-y-0.5">
                      <span className="text-[10px] text-muted font-bold block">শ্রেণি পাঠদান</span>
                      <span className="font-bold text-text font-mono">সকাল ৯:০০ - বিকাল ৪:০০</span>
                    </div>
                    <div className="p-3 rounded-xl bg-surface-2 border border-border space-y-0.5">
                      <span className="text-[10px] text-muted font-bold block">অফিসিয়াল কার্যক্রম</span>
                      <span className="font-bold text-text font-mono">সকাল ৮:৩০ - বিকাল ৪:৩০</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-border mt-4">
                  <a href={`tel:${settings?.phone || '01812345678'}`} className="flex-1">
                    <Button variant="secondary" size="sm" className="w-full" icon={Phone}>
                      সরাসরি কল
                    </Button>
                  </a>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="flex-1 w-full"
                    icon={Mail}
                    onClick={() => navigateToTab('contact')}
                  >
                    বার্তা পাঠান
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* Headmaster Message & About Snippet */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-surface border border-border rounded-2xl p-6 sm:p-10 shadow-xs">
              <div className="lg:col-span-4 text-center lg:text-left">
                <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-2xl bg-surface-2 border-2 border-primary/30 mx-auto lg:mx-0 flex items-center justify-center text-primary mb-4 shadow-md overflow-hidden">
                  {settings?.headmaster_photo ? (
                    <img src={settings.headmaster_photo} alt={settings.headmaster_name} className="w-full h-full object-cover" />
                  ) : (
                    <Users className="w-16 h-16 opacity-75" />
                  )}
                </div>
                <h3 className="text-lg font-heading font-bold text-text">
                  {settings?.headmaster_name || 'ভারপ্রাপ্ত প্রধান শিক্ষক'}
                </h3>
                <p className="text-xs text-primary font-semibold">
                  {settings?.headmaster_designation || 'প্রধান শিক্ষক'}
                </p>
                <p className="text-[11px] text-muted mt-0.5 font-mono">
                  {school.name_bn}
                </p>
              </div>

              <div className="lg:col-span-8 space-y-4">
                <span className="text-xs font-mono font-bold text-primary uppercase tracking-wider">
                  প্রধান শিক্ষকের বাণী
                </span>
                <h3 className="text-xl sm:text-2xl font-heading font-bold text-text leading-snug">
                  জ্ঞান, নৈতিকতা ও আধুনিক প্রযুক্তির মেলবন্ধনে আমাদের পথচলা
                </h3>
                <p className="text-xs sm:text-sm text-muted leading-relaxed">
                  {settings?.headmaster_message || 'আমাদের ঐতিহ্যবাহী শিক্ষাপ্রতিষ্ঠান শিক্ষার্থীদের নৈতিক ও মানবিক গুণে বিকশিত করতে অঙ্গীকারাবদ্ধ।'}
                </p>
                <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('about');
                      window.location.hash = 'about';
                    }}
                    className="text-primary hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    আমাদের ইতিহাস ও লক্ষ্য দেখুন <ChevronRight className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('teachers');
                      window.location.hash = 'teachers';
                    }}
                    className="text-muted hover:text-text flex items-center gap-1 cursor-pointer"
                  >
                    শিক্ষক পরিষদের তালিকা <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Uniform Dress Code Teaser Card */}
          {uniform && (
            <section className="max-w-7xl mx-auto px-4 sm:px-6">
              <div className="bg-bg-alt border border-border rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-2">
                  <span className="text-xs font-mono font-bold text-accent uppercase tracking-wider">
                    DRESS CODE & DISCIPLINE
                  </span>
                  <h3 className="text-xl sm:text-2xl font-heading font-bold text-text">
                    বিদ্যালয়ের নির্ধারিত ইউনিফর্ম ও পোশাক নীতিমালা
                  </h3>
                  <p className="text-xs sm:text-sm text-muted max-w-2xl leading-relaxed">
                    ছাত্রদের নির্ধারিত সাদা শার্ট ও নেভি ব্লু প্যান্ট এবং ছাত্রীদের লাল ফ্রক/কামিজ, সাদা পায়জামা ও ওড়না পরিধান বাধ্যতামূলক।
                  </p>
                </div>
                <div className="shrink-0">
                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => {
                      setActiveTab('uniform');
                      window.location.hash = 'uniform';
                    }}
                  >
                    পূর্ণ পোশাক নির্দেশিকা দেখুন
                  </Button>
                </div>
              </div>
            </section>
          )}

          {/* Academic Disciplines (Science, Business, Humanities) */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center max-w-2xl mx-auto mb-8">
              <span className="text-xs font-mono font-bold text-primary uppercase tracking-wider">ACADEMICS</span>
              <h3 className="text-2xl sm:text-3xl font-heading font-bold text-text mt-1">
                মাধ্যমিক স্তরের শিক্ষাক্রম ও শাখাসমূহ
              </h3>
              <p className="text-xs text-muted mt-1">
                ৬ষ্ঠ থেকে ১০ম শ্রেণি পর্যন্ত কুমিল্লা শিক্ষা বোর্ডের আধুনিক ও মানসম্মত কারিকুলাম
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card surface="surface" className="border-t-4 border-t-primary p-6 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-primary-soft text-primary flex items-center justify-center font-bold text-sm">
                  ০১
                </div>
                <h4 className="text-lg font-heading font-bold text-text">বিজ্ঞান বিভাগ (Science)</h4>
                <p className="text-xs text-muted leading-relaxed">
                  পদার্থবিজ্ঞান, রসায়ন, জীববিজ্ঞান ও উচ্চতর গণিত সহ আধুনিক বিজ্ঞানাগারে সরাসরি ব্যবহারিক ক্লাসের ব্যবস্থা।
                </p>
                <div className="pt-2 text-[11px] font-mono text-primary font-semibold">
                  ল্যাব প্র্যাকটিক্যাল • শেখ রাসেল ডিজিটাল ল্যাব
                </div>
              </Card>

              <Card surface="surface" className="border-t-4 border-t-indigo p-6 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-soft text-indigo flex items-center justify-center font-bold text-sm">
                  ০২
                </div>
                <h4 className="text-lg font-heading font-bold text-text">ব্যবসায় শিক্ষা (Business Studies)</h4>
                <p className="text-xs text-muted leading-relaxed">
                  হিসাববিজ্ঞান, ফিন্যান্স ও ব্যাংকিং এবং ব্যবসায় উদ্যোগ বিষয়ে অভিজ্ঞ শিক্ষক দ্বারা হাতে-কলমে পাঠদান।
                </p>
                <div className="pt-2 text-[11px] font-mono text-indigo font-semibold">
                  বাণিজ্য শাখা • হিসাব লেজার ও প্রজেক্ট
                </div>
              </Card>

              <Card surface="surface" className="border-t-4 border-t-success p-6 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-success-soft text-success flex items-center justify-center font-bold text-sm">
                  ০৩
                </div>
                <h4 className="text-lg font-heading font-bold text-text">মানবিক বিভাগ (Humanities)</h4>
                <p className="text-xs text-muted leading-relaxed">
                  ইতিহাস, ভূগোল ও পরিবেশ, পৌরনীতি ও অর্থনীতি বিষয়ে গভীর ও বিশ্লেষণধর্মী শিক্ষাদানের মাধ্যমে মেধার বিকাশ।
                </p>
                <div className="pt-2 text-[11px] font-mono text-success font-semibold">
                  মানবিক শাখা • সাধারণ জ্ঞান ও বিতর্ক
                </div>
              </Card>
            </div>
          </section>

          {/* Campus Facilities Grid */}
          {facilities.length > 0 && (
            <section className="max-w-7xl mx-auto px-4 sm:px-6">
              <div className="text-center max-w-2xl mx-auto mb-8">
                <span className="text-xs font-mono font-bold text-primary uppercase tracking-wider">CAMPUS FACILITIES</span>
                <h3 className="text-2xl sm:text-3xl font-heading font-bold text-text mt-1">
                  ক্যাম্পাসের অত্যাধুনিক সুবিধাসমূহ
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {facilities.map((fac) => (
                  <Card key={fac.id} surface="surface" className="p-5 space-y-2">
                    <h4 className="text-sm font-bold text-text">{fac.title}</h4>
                    <span className="text-[11px] font-semibold text-primary block">{fac.subtitle}</span>
                    <p className="text-xs text-muted leading-relaxed">{fac.desc}</p>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {/* Recent Notices Preview */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl sm:text-2xl font-heading font-bold text-text">সর্বশেষ নোটিশ</h3>
                <p className="text-xs text-muted">প্রাতিষ্ঠানিক ঘোষণা ও পরীক্ষার সময়সূচি</p>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setActiveTab('notices');
                  window.location.hash = 'notices';
                }}
              >
                সব নোটিশ দেখুন
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {notices.slice(0, 3).map((n) => (
                <Card key={n.id} surface="surface" className="p-5 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      {renderCategoryBadge(n.category)}
                      <span className="text-[11px] font-mono text-muted">{n.date}</span>
                    </div>
                    <h4 className="text-sm font-bold text-text line-clamp-2">{n.title}</h4>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('notices');
                      window.location.hash = 'notices';
                      setReadingNotice(n);
                    }}
                    className="text-xs text-primary font-semibold hover:underline inline-flex items-center gap-1 cursor-pointer"
                  >
                    সম্পূর্ণ নোটিশ পড়ুন ›
                  </button>
                </Card>
              ))}
            </div>
          </section>

          {/* Photo Gallery Preview */}
          {gallery.length > 0 && (
            <section className="max-w-7xl mx-auto px-4 sm:px-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl sm:text-2xl font-heading font-bold text-text">ফটো অ্যালবাম</h3>
                  <p className="text-xs text-muted">বিদ্যালয় প্রাঙ্গণ ও সহশিক্ষা কার্যক্রমের চিত্র</p>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setActiveTab('gallery');
                    window.location.hash = 'gallery';
                  }}
                >
                  পুরো গ্যালারি দেখুন
                </Button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {gallery.slice(0, 4).map((g) => (
                  <div
                    key={g.id}
                    onClick={() => setLightboxImage(g)}
                    className="group relative aspect-video rounded-xl overflow-hidden bg-surface-2 cursor-pointer shadow-xs border border-border"
                  >
                    <img
                      src={g.image}
                      alt={g.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-3 flex items-end">
                      <span className="text-white text-xs font-medium line-clamp-1">{g.title}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Contact & Map Preview */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="bg-surface border border-border rounded-2xl p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <span className="text-xs font-mono font-bold text-primary uppercase tracking-wider">CONTACT US</span>
                <h3 className="text-2xl font-heading font-bold text-text">
                  যোগাযোগ ও অবস্থান
                </h3>
                <div className="space-y-2 text-xs text-muted">
                  <div className="flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span>{settings?.address_bn}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Phone className="w-4 h-4 text-primary shrink-0" />
                    <span className="font-mono">{settings?.phone} {settings?.phone_alt ? `• ${settings.phone_alt}` : ''}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Mail className="w-4 h-4 text-primary shrink-0" />
                    <span className="font-mono">{settings?.email}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Clock className="w-4 h-4 text-primary shrink-0" />
                    <span>{settings?.office_hours}</span>
                  </div>
                </div>

                <div className="pt-2">
                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => {
                      setActiveTab('contact');
                      window.location.hash = 'contact';
                    }}
                  >
                    যোগাযোগের বিস্তারিত ও মেসেজ পাঠান
                  </Button>
                </div>
              </div>

              {/* Map Embed or Card */}
              <div className="rounded-xl overflow-hidden border border-border bg-surface-2 aspect-video flex items-center justify-center text-center p-4">
                {settings?.map_embed_url ? (
                  <iframe
                    title="School Location Map"
                    src={settings.map_embed_url}
                    className="w-full h-full border-0"
                    loading="lazy"
                  />
                ) : (
                  <div className="space-y-2">
                    <MapPin className="w-8 h-8 text-primary mx-auto" />
                    <p className="text-xs font-bold text-text">{school.name_bn}</p>
                    <p className="text-[11px] text-muted">{settings?.address_bn}</p>
                  </div>
                )}
              </div>
            </div>
          </section>
        </main>
      )}

      {/* ========================================================================= */}
      {/* ================= TAB 2: ABOUT US (পরিচিতি) ============================= */}
      {/* ========================================================================= */}
      {activeTab === 'about' && (
        <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 py-12 w-full space-y-10 animate-fade-in">
          <div>
            <span className="text-xs font-mono font-bold text-primary uppercase tracking-wider">ABOUT US</span>
            <h2 className="text-3xl font-heading font-bold text-text mt-1 mb-2">
              বিদ্যালয়ের সংক্ষিপ্ত পরিচিতি ও ইতিহাস
            </h2>
            <p className="text-xs sm:text-sm text-muted">
              {school.name_bn} • স্থাপিত: {settings?.established || '১৯৯০'} • {settings?.recognized}
            </p>
          </div>

          <Card surface="surface" className="p-6 sm:p-8 space-y-6">
            <div>
              <h3 className="text-xl font-heading font-bold text-text mb-3">ইতিহাস ও ঐতিহ্য</h3>
              <p className="text-xs sm:text-sm text-muted leading-relaxed">
                {settings?.history_bn}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-border">
              <div className="p-5 rounded-xl bg-surface-2 border border-border space-y-2">
                <span className="text-xs font-mono font-bold text-primary uppercase">আমাদের ভিশন (Vision)</span>
                <p className="text-xs sm:text-sm text-text leading-relaxed font-medium">
                  {settings?.vision_bn}
                </p>
              </div>

              <div className="p-5 rounded-xl bg-surface-2 border border-border space-y-2">
                <span className="text-xs font-mono font-bold text-indigo uppercase">আমাদের মিশন (Mission)</span>
                <p className="text-xs sm:text-sm text-text leading-relaxed font-medium">
                  {settings?.mission_bn}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <h4 className="text-sm font-bold text-text mb-3">প্রাতিষ্ঠানিক তথ্যাবলী</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
                <div className="p-3 rounded-lg bg-surface-2 border border-border">
                  <span className="text-muted block text-[10px]">EIIN নম্বর</span>
                  <strong className="text-text">{school.eiin}</strong>
                </div>
                <div className="p-3 rounded-lg bg-surface-2 border border-border">
                  <span className="text-muted block text-[10px]">MPO কোড</span>
                  <strong className="text-text">{school.mpo_code}</strong>
                </div>
                <div className="p-3 rounded-lg bg-surface-2 border border-border">
                  <span className="text-muted block text-[10px]">স্কুল কোড</span>
                  <strong className="text-text">{school.school_code}</strong>
                </div>
                <div className="p-3 rounded-lg bg-surface-2 border border-border">
                  <span className="text-muted block text-[10px]">বোর্ড</span>
                  <strong className="text-text">{school.board}</strong>
                </div>
              </div>
            </div>
          </Card>
        </main>
      )}

      {/* ========================================================================= */}
      {/* ================= TAB 3: MANAGING COMMITTEE (পরিচালনা পর্ষদ) ============= */}
      {/* ========================================================================= */}
      {activeTab === 'committee' && (
        <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 py-12 w-full space-y-8 animate-fade-in">
          <div>
            <span className="text-xs font-mono font-bold text-primary uppercase tracking-wider">GOVERNING BODY</span>
            <h2 className="text-3xl font-heading font-bold text-text mt-1 mb-2">
              পরিচালনা পর্ষদ ও ম্যানেজিং কমিটি
            </h2>
            <p className="text-xs sm:text-sm text-muted">
              বিদ্যালয়ের পরিচালনা পরিষদ, সম্মানিত সভাপতি ও সদস্যবৃন্দ
            </p>
          </div>

          {/* President Card Highlight */}
          {settings?.chairman_name && (
            <Card surface="surface" className="p-6 sm:p-8 border-l-4 border-l-primary flex flex-col sm:flex-row items-center gap-6">
              <div className="w-24 h-24 rounded-full bg-primary-soft text-primary font-heading font-bold text-2xl flex items-center justify-center shrink-0 overflow-hidden border border-border">
                {settings.chairman_photo ? (
                  <img src={settings.chairman_photo} alt={settings.chairman_name} className="w-full h-full object-cover" />
                ) : (
                  settings.chairman_name[0]
                )}
              </div>
              <div className="space-y-2 text-center sm:text-left">
                <span className="text-xs font-mono font-bold text-primary uppercase">পরিচালনা পর্ষদের সম্মানিত সভাপতি</span>
                <h3 className="text-xl font-heading font-bold text-text">{settings.chairman_name}</h3>
                <p className="text-xs sm:text-sm text-muted leading-relaxed">
                  "{settings.chairman_message}"
                </p>
              </div>
            </Card>
          )}

          {/* Committee Roster Grid */}
          {committee.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {committee.map((member) => (
                <Card key={member.id} surface="surface" className="p-5 flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-surface-2 text-primary font-bold text-base flex items-center justify-center shrink-0 border border-border">
                    {member.name[0]}
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-text leading-tight">{member.name}</h4>
                    <p className="text-xs text-primary font-medium">{member.designation}</p>
                    <span className="text-[10px] text-muted block">{member.role_category}</span>
                    {member.phone && (
                      <span className="text-[11px] font-mono text-muted flex items-center gap-1 mt-1">
                        <Phone className="w-3 h-3" /> {member.phone}
                      </span>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card surface="surface" className="p-8 text-center">
              <EmptyState title="পরিচালনা পর্ষদের তথ্য পাওয়া যায়নি" description="পরিচালনা পর্ষদের তালিকা শীঘ্রই হালনাগাদ করা হবে।" />
            </Card>
          )}
        </main>
      )}

      {/* ========================================================================= */}
      {/* ================= TAB 4: FACULTY & STAFF (শিক্ষক ও কর্মচারী) ============= */}
      {/* ========================================================================= */}
      {activeTab === 'teachers' && (() => {
        const filteredTeachers = teachers.filter((t) => {
          if (teacherFilter !== 'all' && t.category !== teacherFilter) return false;
          if (teacherSearch.trim()) {
            const q = teacherSearch.toLowerCase();
            const matchName = t.name?.toLowerCase().includes(q);
            const matchDesig = t.designation?.toLowerCase().includes(q);
            const matchSub = t.subject?.toLowerCase().includes(q);
            const matchQual = t.qualification?.toLowerCase().includes(q);
            return matchName || matchDesig || matchSub || matchQual;
          }
          return true;
        });

        const teacherCount = teachers.filter(t => t.category === 'teacher').length;
        const staffCount = teachers.filter(t => t.category === 'staff').length;

        return (
          <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-12 w-full space-y-8 animate-fade-in font-bangla">
            {/* Header */}
            <div className="text-center max-w-2xl mx-auto mb-8">
              <div className="inline-flex items-center gap-1.5 bg-primary-soft text-primary text-xs font-bold px-4 py-1.5 rounded-full mb-3 shadow-xs border border-primary/20">
                <Users className="w-3.5 h-3.5 text-primary" />
                <span>শিক্ষক ও কর্মচারী পরিষদ</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold font-heading text-text leading-tight">
                আমাদের দক্ষ ও নিবেদিতপ্রাণ শিক্ষক ও কর্মকর্তা-কর্মচারী
              </h2>
              <p className="text-xs sm:text-sm text-muted mt-2 leading-relaxed">
                অভিজ্ঞ, উচ্চশিক্ষিত ও স্নেহশীল শিক্ষকদের নিবিড় তত্ত্বাবধানে {school.name_bn}-এর পাঠদান ও প্রশাসনিক কার্যক্রম পরিচালিত হয়।
              </p>
            </div>

            {/* Toolbar (Segmented Filter + Search) */}
            <div className="bg-surface p-3 sm:p-4 rounded-2xl border border-border flex flex-col md:flex-row items-center justify-between gap-4 shadow-xs">
              {/* Segmented Filter */}
              <div className="flex flex-wrap sm:flex-nowrap bg-surface-2 p-1 rounded-xl border border-border text-xs font-semibold w-full md:w-auto gap-1">
                <button
                  type="button"
                  onClick={() => setTeacherFilter('all')}
                  className={`flex-1 md:flex-initial px-4 py-2 rounded-lg transition cursor-pointer whitespace-nowrap ${
                    teacherFilter === 'all'
                      ? 'bg-primary text-on-primary shadow-xs font-bold'
                      : 'text-muted hover:text-text'
                  }`}
                >
                  সকল সদস্য ({teachers.length})
                </button>
                <button
                  type="button"
                  onClick={() => setTeacherFilter('teacher')}
                  className={`flex-1 md:flex-initial px-4 py-2 rounded-lg transition cursor-pointer whitespace-nowrap flex items-center justify-center gap-1.5 ${
                    teacherFilter === 'teacher'
                      ? 'bg-primary text-on-primary shadow-xs font-bold'
                      : 'text-muted hover:text-text'
                  }`}
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>শিক্ষক পরিষদ ({teacherCount})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTeacherFilter('staff')}
                  className={`flex-1 md:flex-initial px-4 py-2 rounded-lg transition cursor-pointer whitespace-nowrap flex items-center justify-center gap-1.5 ${
                    teacherFilter === 'staff'
                      ? 'bg-primary text-on-primary shadow-xs font-bold'
                      : 'text-muted hover:text-text'
                  }`}
                >
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>কর্মচারীবৃন্দ ({staffCount})</span>
                </button>
              </div>

              {/* Search Bar */}
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="নাম, পদবি বা বিষয় দিয়ে খুঁজুন..."
                  value={teacherSearch}
                  onChange={(e) => setTeacherSearch(e.target.value)}
                  className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-border bg-surface text-xs font-medium text-text placeholder:text-muted focus:ring-2 focus:ring-primary/40 focus:outline-none transition-all"
                />
                {teacherSearch && (
                  <button
                    type="button"
                    onClick={() => setTeacherSearch('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-text p-0.5 rounded cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Grid */}
            {filteredTeachers.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredTeachers.map((t) => {
                  const isHeadmaster = t.order === 1;
                  const isAsstHeadmaster = t.order === 2;

                  return (
                    <article
                      key={t.id}
                      className={`bg-surface rounded-2xl overflow-hidden border transition-all duration-300 flex flex-col justify-between group shadow-xs hover:-translate-y-1 hover:shadow-xl ${
                        isHeadmaster
                          ? 'border-accent ring-2 ring-accent/30'
                          : isAsstHeadmaster
                          ? 'border-primary/40 hover:border-primary'
                          : 'border-border hover:border-primary/40'
                      }`}
                    >
                      {/* Visual Header */}
                      <div className={`relative h-48 w-full overflow-hidden flex flex-col items-center justify-center pb-5 select-none ${
                        isHeadmaster
                          ? 'bg-gradient-to-br from-amber-950 via-slate-900 to-amber-900'
                          : isAsstHeadmaster
                          ? 'bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-900'
                          : t.category === 'staff'
                          ? 'bg-gradient-to-br from-slate-900 via-neutral-900 to-zinc-800'
                          : 'bg-gradient-to-br from-slate-900 via-slate-800 to-teal-950'
                      }`}>
                        {/* Glow & Rings */}
                        <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(circle_at_50%_40%,var(--accent),transparent_70%)]" />
                        <div className="absolute w-40 h-40 rounded-full border border-dashed border-white/10 pointer-events-none" />
                        <div className="absolute w-28 h-28 rounded-full border border-white/15 pointer-events-none" />

                        {/* Serial Badge */}
                        <span className="absolute top-3 left-3 z-20 bg-black/60 text-white border border-white/20 text-[10px] font-bold px-2.5 py-0.5 rounded-full font-mono backdrop-blur-xs">
                          #{t.order}
                        </span>

                        {/* Star for Head / Asst Head */}
                        {(isHeadmaster || isAsstHeadmaster) && (
                          <div className="relative z-10 mb-1 opacity-90 w-5 h-5 rounded-full border border-accent/40 bg-black/60 flex items-center justify-center shadow-xs">
                            <Star className="w-2.5 h-2.5 text-accent fill-accent" />
                          </div>
                        )}

                        {/* Avatar */}
                        <div className={`relative z-10 w-20 h-20 rounded-full border-[3px] shadow-lg flex items-center justify-center overflow-hidden transition-transform group-hover:scale-105 ${
                          isHeadmaster 
                            ? 'border-accent ring-4 ring-accent/20 bg-amber-950' 
                            : isAsstHeadmaster
                            ? 'border-primary ring-4 ring-primary/20 bg-emerald-950'
                            : 'border-white/30 ring-4 ring-white/10 bg-slate-800'
                        }`}>
                          {t.photo ? (
                            <img src={t.photo} alt={t.name} className="w-full h-full object-cover" />
                          ) : t.category === 'staff' ? (
                            <span className="font-heading font-extrabold text-xl text-accent drop-shadow-xs">
                              {getTeacherInitials(t.name)}
                            </span>
                          ) : (
                            <span className={`font-heading font-extrabold text-2xl drop-shadow-xs ${isHeadmaster ? 'text-accent' : isAsstHeadmaster ? 'text-primary' : 'text-white'}`}>
                              {getTeacherInitials(t.name)}
                            </span>
                          )}
                        </div>

                        {/* Designation Chip */}
                        <div className="absolute bottom-2.5 inset-x-3 z-20 flex items-center justify-center">
                          <span className={`text-[11px] font-bold px-3 py-1 rounded-full shadow-md inline-flex items-center gap-1.5 max-w-full truncate ${
                            isHeadmaster
                              ? 'bg-accent text-accent-ink font-bold'
                              : isAsstHeadmaster
                              ? 'bg-primary text-on-primary border border-accent/40 font-bold'
                              : 'bg-surface-2/95 text-text border border-border backdrop-blur-xs font-medium'
                          }`}>
                            {isHeadmaster ? (
                              <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                            ) : isAsstHeadmaster ? (
                              <Award className="w-3.5 h-3.5 shrink-0" />
                            ) : null}
                            <span className="truncate">{t.designation}</span>
                          </span>
                        </div>
                      </div>

                      {/* Body */}
                      <div className="p-4 space-y-2.5 bg-surface flex-1 flex flex-col justify-between">
                        <div className="space-y-2">
                          <h3 className="text-base font-bold text-text group-hover:text-primary transition-colors line-clamp-1 leading-snug">
                            {t.name}
                          </h3>

                          {t.subject && (
                            <div className="flex items-start gap-2 bg-primary-soft p-2 rounded-xl border border-primary/20 text-xs text-primary font-semibold">
                              <BookOpen className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                              <span className="line-clamp-2 leading-tight">{t.subject}</span>
                            </div>
                          )}

                          {t.qualification && (
                            <div className="flex items-start gap-2 text-[11px] text-muted bg-surface-2 px-2.5 py-1.5 rounded-lg border border-border">
                              <GraduationCap className="w-3.5 h-3.5 shrink-0 mt-0.5 text-muted" />
                              <span className="line-clamp-2 font-mono leading-tight">{t.qualification}</span>
                            </div>
                          )}
                        </div>

                        {/* Footer Contact */}
                        <div className="pt-2 border-t border-border flex items-center justify-between text-xs text-muted font-mono mt-auto">
                          {t.phone ? (
                            <a
                              href={`tel:${t.phone}`}
                              className="flex items-center gap-1.5 hover:text-primary font-semibold transition-colors"
                              title={`কল করুন: ${t.phone}`}
                            >
                              <Phone className="w-3.5 h-3.5 text-primary" />
                              <span className="text-[11px]">{t.phone}</span>
                            </a>
                          ) : (
                            <span className="text-[10px] text-muted">—</span>
                          )}

                          {t.email && (
                            <a
                              href={`mailto:${t.email}`}
                              className="p-1.5 text-muted hover:text-primary hover:bg-surface-2 rounded-full transition-colors"
                              title={`ইমেইল পাঠান: ${t.email}`}
                            >
                              <Mail className="w-3.5 h-3.5" />
                            </a>
                          )}
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <Card surface="surface" className="p-12 text-center">
                <EmptyState
                  title="কোনো শিক্ষক বা কর্মচারী পাওয়া যায়নি"
                  description={teacherSearch ? `"${teacherSearch}" দিয়ে কোনো তথ্য মেলেনি। অন্য কোনো নাম বা বিষয় লিখে চেষ্টা করুন।` : 'এই বিভাগে কোনো সদস্য তালিকাভুক্ত নেই।'}
                />
              </Card>
            )}
          </main>
        );
      })()}

      {/* ========================================================================= */}
      {/* ================= TAB 5: ACADEMICS & ROUTINES (একাডেমিক ও রুটিন) ========= */}
      {/* ========================================================================= */}
      {activeTab === 'academics' && (
        <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 py-12 w-full space-y-10 animate-fade-in">
          <div>
            <span className="text-xs font-mono font-bold text-primary uppercase tracking-wider">ACADEMICS & CURRICULUM</span>
            <h2 className="text-3xl font-heading font-bold text-text mt-1 mb-2">
              শিক্ষা ব্যবস্থা, পাঠ্যক্রম ও রুটিন
            </h2>
            <p className="text-xs sm:text-sm text-muted">
              জাতীয় শিক্ষাক্রম ও পাঠ্যপুস্তক বোর্ড (NCTB) অনুমোদিত পাঠ্যক্রম, বিভাগসমূহ ও সময়সূচি
            </p>
          </div>

          {/* Academic Overview Grid (D35) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card surface="surface" className="p-6 space-y-3 border-t-4 border-t-primary">
              <span className="text-xs font-mono font-bold text-primary uppercase">নিম্ন মাধ্যমিক (৬ষ্ঠ - ৮ম)</span>
              <h4 className="text-base font-bold text-text">সাধারণ সমন্বিত পাঠ্যক্রম</h4>
              <p className="text-xs text-muted leading-relaxed">
                নতুন জাতীয় শিক্ষাক্রম অনুসারে অভিজ্ঞতা ও কার্যক্রমভিত্তিক শিখন পদ্ধতি। বাংলা, ইংরেজি, গণিত, বিজ্ঞান ও তথ্যপ্রযুক্তিতে বিশেষ গুরুত্ব।
              </p>
              <div className="pt-2 text-[11px] font-mono text-primary font-semibold">
                শাখা: 'ক' ও 'খ' • বিষয় সংখ্যা: ১০টি
              </div>
            </Card>

            <Card surface="surface" className="p-6 space-y-3 border-t-4 border-t-accent">
              <span className="text-xs font-mono font-bold text-accent uppercase">মাধ্যমিক স্তর (৯ম - ১০ম)</span>
              <h4 className="text-base font-bold text-text">তিনটি পৃথক একাডেমিক বিভাগ</h4>
              <ul className="text-xs text-muted space-y-1.5 list-disc list-inside">
                <li><strong className="text-text">বিজ্ঞান বিভাগ:</strong> পদার্থ, রসায়ন, জীববিজ্ঞান ও উচ্চতর গণিত</li>
                <li><strong className="text-text">ব্যবসায় শিক্ষা:</strong> হিসাববিজ্ঞান ও ফিন্যান্স</li>
                <li><strong className="text-text">মানবিক বিভাগ:</strong> ইতিহাস, ভূগোল ও অর্থনীতি</li>
              </ul>
              <div className="pt-1 text-[11px] font-mono text-accent font-semibold">
                বোর্ড: {school.board} • SSC পরীক্ষার প্রস্তুতি
              </div>
            </Card>

            <Card surface="surface" className="p-6 space-y-3 border-t-4 border-t-indigo">
              <span className="text-xs font-mono font-bold text-indigo uppercase">মূল্যায়ন ও পরীক্ষা</span>
              <h4 className="text-base font-bold text-text">ধারাবাহিক ও সামষ্টিক মূল্যায়ন</h4>
              <p className="text-xs text-muted leading-relaxed">
                বছরে দুটি প্রধান প্রান্তিক পরীক্ষা (অর্ধ-বার্ষিক ও বার্ষিক) এবং নিয়মিত ক্লাস টেস্ট ও সাপ্তাহিক কুইজের সমন্বয়ে শিক্ষার্থীদের গ্রেডিং সম্পন্ন হয়।
              </p>
              <div className="pt-2 text-[11px] font-mono text-indigo font-semibold">
                গ্রেডিং স্কেল: GPA ৫.০০ (NCTB স্ট্যান্ডার্ড)
              </div>
            </Card>
          </div>

          {/* Routine Section Header */}
          <div className="pt-4 border-t border-border">
            <h3 className="text-xl font-heading font-bold text-text mb-1">
              ডাউনলোডযোগ্য ক্লাস রুটিন ও পরীক্ষার সময়সূচি
            </h3>
            <p className="text-xs text-muted mb-4">
              অফিশিয়াল রুটিনের কপি অফলাইনে সংরক্ষণ বা প্রিন্ট করার জন্য ডাউনলোড বাটনে ক্লিক করুন।
            </p>
          </div>

          {routines.length > 0 ? (
            <div className="space-y-4">
              {routines.map((rt) => (
                <Card key={rt.id} surface="surface" className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary-soft text-primary flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-text leading-tight">{rt.title}</h4>
                      <span className="text-[11px] text-muted font-mono mt-0.5 block">
                        কার্যকরের তারিখ: {rt.effective_date} • ফরম্যাট: {rt.type || 'PDF'}
                      </span>
                    </div>
                  </div>

                  <Button
                    variant="secondary"
                    size="sm"
                    icon={Download}
                    onClick={() => handleRoutineDownload(rt)}
                  >
                    ডাউনলোড (PDF / রুটিন)
                  </Button>
                </Card>
              ))}
            </div>
          ) : (
            <Card surface="surface" className="p-8 text-center">
              <EmptyState title="কোনো রুটিন প্রকাশিত হয়নি" description="রুটিন ও সিলেবাস প্রকাশের পর এখানে দেখা যাবে।" />
            </Card>
          )}
        </main>
      )}

      {/* ========================================================================= */}
      {/* ================= TAB 6: UNIFORM & DRESS CODE (পোশাক নীতিমালা) ========== */}
      {/* ========================================================================= */}
      {activeTab === 'uniform' && (
        <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 py-12 w-full space-y-8 animate-fade-in">
          <div>
            <span className="text-xs font-mono font-bold text-accent uppercase tracking-wider">DRESS CODE</span>
            <h2 className="text-3xl font-heading font-bold text-text mt-1 mb-2">
              বিদ্যালয়ের নির্ধারিত ইউনিফর্ম ও পোশাক নীতিমালা
            </h2>
            <p className="text-xs sm:text-sm text-muted">
              সকল ছাত্র-ছাত্রীর জন্য নির্ধারিত আনুষ্ঠানিক স্কুল ড্রেস কোড
            </p>
          </div>

          {uniform ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Boys Uniform Card */}
                <Card surface="surface" className="p-6 space-y-4 border-t-4 border-t-primary">
                  <span className="text-xs font-mono font-bold text-primary uppercase">ছাত্রদের পোশাক (Boys)</span>
                  <div className="space-y-3 text-xs">
                    <div className="p-3 rounded-lg bg-surface-2 border border-border">
                      <span className="text-muted block text-[10px]">শার্ট</span>
                      <strong className="text-text">{uniform.boys.shirt}</strong>
                    </div>
                    <div className="p-3 rounded-lg bg-surface-2 border border-border">
                      <span className="text-muted block text-[10px]">প্যান্ট</span>
                      <strong className="text-text">{uniform.boys.pant}</strong>
                    </div>
                    <div className="p-3 rounded-lg bg-surface-2 border border-border">
                      <span className="text-muted block text-[10px]">ব্যাজ</span>
                      <span className="text-text">{uniform.boys.badge}</span>
                    </div>
                    <div className="p-3 rounded-lg bg-surface-2 border border-border">
                      <span className="text-muted block text-[10px]">জুতো ও মোজা</span>
                      <span className="text-text">{uniform.boys.shoes}</span>
                    </div>
                  </div>
                </Card>

                {/* Girls Uniform Card */}
                <Card surface="surface" className="p-6 space-y-4 border-t-4 border-t-accent">
                  <span className="text-xs font-mono font-bold text-accent uppercase">ছাত্রীদের পোশাক (Girls)</span>
                  <div className="space-y-3 text-xs">
                    <div className="p-3 rounded-lg bg-surface-2 border border-border">
                      <span className="text-muted block text-[10px]">ফ্রক / কামিজ</span>
                      <strong className="text-text">{uniform.girls.dress}</strong>
                    </div>
                    <div className="p-3 rounded-lg bg-surface-2 border border-border">
                      <span className="text-muted block text-[10px]">পায়জামা / সালোয়ার</span>
                      <strong className="text-text">{uniform.girls.salwar}</strong>
                    </div>
                    <div className="p-3 rounded-lg bg-surface-2 border border-border">
                      <span className="text-muted block text-[10px]">ওড়না ও ফিতা</span>
                      <span className="text-text">{uniform.girls.orna} • {uniform.girls.hair}</span>
                    </div>
                    <div className="p-3 rounded-lg bg-surface-2 border border-border">
                      <span className="text-muted block text-[10px]">জুতো ও মোজা</span>
                      <span className="text-text">{uniform.girls.shoes}</span>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Winter Dress & Guidelines */}
              <Card surface="surface" className="p-6 space-y-4">
                <h4 className="text-sm font-bold text-text">শীতকালীন পোশাক ও সাধারণ নির্দেশিকা</h4>
                <p className="text-xs text-primary font-semibold">{uniform.winter}</p>
                <div className="space-y-1.5 text-xs text-muted leading-relaxed">
                  {uniform.guidelines?.map((gl, i) => (
                    <p key={i}>{gl}</p>
                  ))}
                </div>
              </Card>
            </>
          ) : (
            <Card surface="surface" className="p-8 text-center">
              <EmptyState title="পোশাক নীতিমালা সংরক্ষিত নেই" description="এই প্রতিষ্ঠানের পোশাক নীতিমালা শীঘ্রই যুক্ত করা হবে।" />
            </Card>
          )}
        </main>
      )}

      {/* ========================================================================= */}
      {/* ================= TAB 7: NOTICES (নোটিশ বোর্ড) ========================== */}
      {/* ========================================================================= */}
      {activeTab === 'notices' && (
        <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 py-12 w-full space-y-8 animate-fade-in">
          <div>
            <span className="text-xs font-mono font-bold text-primary uppercase tracking-wider">NOTICE BOARD</span>
            <h2 className="text-3xl font-heading font-bold text-text mt-1 mb-2">
              প্রাতিষ্ঠানিক নোটিশ বোর্ড
            </h2>
            <p className="text-xs sm:text-sm text-muted">পরীক্ষা, ভর্তি ও প্রশাসনিক সকল বিজ্ঞপ্তি</p>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {[
              { key: 'all', label: 'সকল নোটিশ' },
              { key: 'academic', label: 'একাডেমিক' },
              { key: 'exam', label: 'পরীক্ষা' },
              { key: 'admission', label: 'ভর্তি' },
              { key: 'general', label: 'সাধারণ' }
            ].map(f => (
              <button
                key={f.key}
                type="button"
                onClick={() => setActiveNoticeFilter(f.key)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-colors ${
                  activeNoticeFilter === f.key ? 'bg-primary text-on-primary' : 'bg-surface-2 text-muted hover:text-text'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {filteredNotices.length > 0 ? (
            <div className="space-y-4">
              {filteredNotices.map((n) => (
                <Card key={n.id} surface="surface" className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2 text-[11px]">
                      {renderCategoryBadge(n.category)}
                      {n.is_urgent && <Badge variant="danger">জরুরি</Badge>}
                      <span className="text-muted font-mono">{n.date}</span>
                    </div>
                    <h4 className="text-sm sm:text-base font-bold text-text">{n.title}</h4>
                    <p className="text-xs text-muted line-clamp-2">{n.description}</p>
                  </div>

                  <Button variant="secondary" size="sm" onClick={() => setReadingNotice(n)}>
                    সম্পূর্ণ পড়ুন
                  </Button>
                </Card>
              ))}
            </div>
          ) : (
            <Card surface="surface" className="p-8 text-center">
              <EmptyState title="এই ক্যাটাগরিতে কোনো নোটিশ নেই" description="অন্যান্য ফিল্টারে ক্লিক করে নোটিশ খুঁজুন।" />
            </Card>
          )}
        </main>
      )}

      {/* ========================================================================= */}
      {/* ================= TAB 8: ONLINE ADMISSION (অনলাইন ভর্তি) ================== */}
      {/* ========================================================================= */}
      {activeTab === 'admission' && (
        <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 py-12 w-full space-y-8 animate-fade-in">
          <div className="text-center">
            <span className="text-xs font-mono font-bold text-primary uppercase tracking-wider">ADMISSION 2027</span>
            <h2 className="text-3xl font-heading font-bold text-text mt-1 mb-2">
              অনলাইন ভর্তি আবেদন ফরম
            </h2>
            <p className="text-xs sm:text-sm text-muted">
              ৬ষ্ঠ থেকে ৯ম শ্রেণির ভর্তি ফরম পূরণ করে ডিজিটাল প্রবেশপত্র সংগ্রহ করুন।
            </p>
            <div className="mt-3">
              <button
                type="button"
                onClick={() => setTrackingModalOpen(true)}
                className="text-xs font-bold text-primary hover:underline inline-flex items-center gap-1 cursor-pointer"
              >
                আবেদনের অবস্থা দেখতে ট্র্যাকিং কোড দিয়ে খুঁজুন ›
              </button>
            </div>
          </div>

          {!submittedAdmission ? (
            <Card surface="surface" className="p-6 sm:p-8">
              <Stepper 
                steps={['শিক্ষার্থী', 'অভিভাবক ও যোগাযোগ', 'যাচাই ও জমা']} 
                currentStep={admissionStep} 
                className="mb-8"
              />

              <form onSubmit={handleAdmissionSubmit}>
                {admissionStep === 1 && (
                  <div className="space-y-4">
                    <div>
                      <FileUpload
                        label="শিক্ষার্থীর পাসপোর্ট সাইজ ছবি (Passport Photo) *"
                        helperText="JPG বা PNG ফরম্যাট। ডিজিটাল প্রবেশপত্রে এই ছবিটি প্রদর্শিত হবে।"
                        accept="image/*"
                        type="image"
                        aspectRatio="square"
                        value={admissionForm.photo}
                        onChange={(val) => {
                          setAdmissionForm({ ...admissionForm, photo: val });
                          if (step1Errors.photo) setStep1Errors({ ...step1Errors, photo: '' });
                        }}
                      />
                      {step1Errors.photo && (
                        <p className="text-xs text-danger font-medium mt-1">⚠️ {step1Errors.photo}</p>
                      )}
                    </div>

                    <div>
                      <Input
                        label="শিক্ষার্থীর নাম (বাংলায়) *"
                        placeholder="যেমন: মোঃ তানভীর আহমেদ"
                        value={admissionForm.name_bn}
                        onChange={(e) => {
                          setAdmissionForm({ ...admissionForm, name_bn: e.target.value });
                          if (step1Errors.name_bn) setStep1Errors({ ...step1Errors, name_bn: '' });
                        }}
                        error={step1Errors.name_bn}
                        required
                      />
                    </div>

                    <div>
                      <Input
                        label="Student Name (English Block Letters) *"
                        placeholder="e.g. MD. TANVIR AHMED"
                        value={admissionForm.name_en}
                        onChange={(e) => {
                          setAdmissionForm({ ...admissionForm, name_en: e.target.value });
                          if (step1Errors.name_en) setStep1Errors({ ...step1Errors, name_en: '' });
                        }}
                        error={step1Errors.name_en}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Select
                        label="ভর্তির শ্রেণি *"
                        value={admissionForm.applied_class}
                        onChange={(e) => setAdmissionForm({ ...admissionForm, applied_class: e.target.value })}
                        options={['6', '7', '8', '9']}
                      />
                      <div>
                        <Select
                          label="শাখা / বিভাগ *"
                          value={admissionForm.group}
                          onChange={(e) => {
                            setAdmissionForm({ ...admissionForm, group: e.target.value });
                            if (step1Errors.group) setStep1Errors({ ...step1Errors, group: '' });
                          }}
                          options={['General', 'Science', 'Business Studies', 'Humanities']}
                        />
                        {step1Errors.group && (
                          <p className="text-xs text-danger font-medium mt-1">⚠️ {step1Errors.group}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input
                        label="পূর্ববর্তী বিদ্যালয়ের নাম"
                        placeholder="যেমন: বন্দুয়া সরকারি প্রাথমিক বিদ্যালয়"
                        value={admissionForm.prev_school}
                        onChange={(e) => setAdmissionForm({ ...admissionForm, prev_school: e.target.value })}
                      />
                      <Input
                        label="পূর্ববর্তী পরীক্ষার জিপিএ (GPA)"
                        placeholder="যেমন: ৫.০০"
                        value={admissionForm.prev_gpa}
                        onChange={(e) => {
                          setAdmissionForm({ ...admissionForm, prev_gpa: e.target.value });
                          if (step1Errors.prev_gpa) setStep1Errors({ ...step1Errors, prev_gpa: '' });
                        }}
                        error={step1Errors.prev_gpa}
                      />
                    </div>

                    <div className="pt-4 flex justify-end">
                      <Button variant="primary" type="button" onClick={handleStep1Next}>
                        পরবর্তী ধাপ ›
                      </Button>
                    </div>
                  </div>
                )}

                {admissionStep === 2 && (
                  <div className="space-y-4">
                    <Input
                      label="পিতার নাম *"
                      placeholder="যেমন: মোঃ রফিকুল ইসলাম"
                      value={admissionForm.father_name}
                      onChange={(e) => {
                        setAdmissionForm({ ...admissionForm, father_name: e.target.value });
                        if (step2Errors.father_name) setStep2Errors({ ...step2Errors, father_name: '' });
                      }}
                      error={step2Errors.father_name}
                      required
                    />
                    <Input
                      label="মাতার নাম *"
                      placeholder="যেমন: নাজমুন নাহার"
                      value={admissionForm.mother_name}
                      onChange={(e) => {
                        setAdmissionForm({ ...admissionForm, mother_name: e.target.value });
                        if (step2Errors.mother_name) setStep2Errors({ ...step2Errors, mother_name: '' });
                      }}
                      error={step2Errors.mother_name}
                      required
                    />
                    <Input
                      label="অভিভাবকের সচল মোবাইল নম্বর *"
                      placeholder="018XXXXXXXX"
                      value={admissionForm.mobile}
                      onChange={(e) => {
                        setAdmissionForm({ ...admissionForm, mobile: e.target.value });
                        if (step2Errors.mobile) setStep2Errors({ ...step2Errors, mobile: '' });
                      }}
                      error={step2Errors.mobile}
                      helperText="ভর্তি পরীক্ষার ফলাফল ও রোল এই নম্বরে পাঠানো হবে।"
                      required
                    />
                    <Input
                      label="বর্তমান ঠিকানা *"
                      placeholder="গ্রাম, ডাকঘর, উপজেলা, জেলা"
                      value={admissionForm.address}
                      onChange={(e) => {
                        setAdmissionForm({ ...admissionForm, address: e.target.value });
                        if (step2Errors.address) setStep2Errors({ ...step2Errors, address: '' });
                      }}
                      error={step2Errors.address}
                      required
                    />
                    <div className="pt-4 flex items-center justify-between">
                      <Button variant="secondary" type="button" onClick={() => setAdmissionStep(1)}>
                        ‹ আগের ধাপ
                      </Button>
                      <Button variant="primary" type="button" onClick={handleStep2Next}>
                        পরবর্তী ধাপ ›
                      </Button>
                    </div>
                  </div>
                )}

                {admissionStep === 3 && (
                  <div className="space-y-5">
                    {admissionForm.photo && (
                      <div className="flex justify-center pb-1">
                        <img
                          src={admissionForm.photo}
                          alt="Applicant"
                          className="w-20 h-24 object-cover rounded-xl border-2 border-primary shadow-xs"
                        />
                      </div>
                    )}
                    <div className="p-4 rounded-xl bg-surface-2 border border-border space-y-2 text-xs">
                      <div className="flex justify-between py-1 border-b border-border/60">
                        <span className="text-muted">শিক্ষার্থীর নাম:</span>
                        <span className="font-bold text-text">{admissionForm.name_bn}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-border/60">
                        <span className="text-muted">ভর্তির শ্রেণি:</span>
                        <span className="font-bold text-primary">{admissionForm.applied_class}ম শ্রেণি</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-border/60">
                        <span className="text-muted">অভিভাবকের মোবাইল:</span>
                        <span className="font-mono text-text">{admissionForm.mobile}</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-muted">ঠিকানা:</span>
                        <span className="text-text">{admissionForm.address}</span>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-lg bg-warning-soft border border-warning-line text-xs text-warning">
                      ⚠️ তথ্য সঠিক আছে কিনা যাচাই করুন। সাবমিট করার পর স্বয়ংক্রিয় ট্র্যাকিং কোড ও ডিজিটাল প্রবেশপত্র জেনারেট হবে।
                    </div>

                    <div className="pt-2 flex items-center justify-between">
                      <Button variant="secondary" onClick={() => setAdmissionStep(2)}>
                        ‹ আগের ধাপ
                      </Button>
                      <Button type="submit" variant="primary">
                        আবেদন সম্পূর্ণ করুন ✓
                      </Button>
                    </div>
                  </div>
                )}
              </form>
            </Card>
          ) : (
            <Card surface="surface" className="text-center p-8 sm:p-12 border-2 border-success/40">
              <div className="w-16 h-16 rounded-full bg-success-soft text-success flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-heading font-bold text-text mb-1">
                ভর্তি আবেদন সফলভাবে জমা হয়েছে!
              </h3>
              <p className="text-xs text-muted mb-6">
                আপনার আবেদনের জন্য একটি ইউনিক ট্র্যাকিং আইডি বরাদ্দ করা হয়েছে।
              </p>

              <div className="p-5 rounded-2xl border-2 border-dashed border-primary bg-primary-soft/40 max-w-sm mx-auto mb-6">
                <span className="text-xs font-mono text-muted uppercase">আপনার ট্র্যাকিং কোড</span>
                <div className="text-2xl sm:text-3xl font-mono font-extrabold text-primary tracking-wider my-1">
                  {submittedAdmission.tracking_id}
                </div>
                <Badge variant="warning" symbol="●">অবস্থা: অপেক্ষমাণ</Badge>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3">
                <Button 
                  variant="primary" 
                  icon={Printer} 
                  onClick={() => setAdmitCardData(submittedAdmission)}
                >
                  প্রবেশপত্র দেখুন ও প্রিন্ট
                </Button>
                <Button 
                  variant="secondary" 
                  icon={Copy} 
                  onClick={() => {
                    navigator.clipboard.writeText(submittedAdmission.tracking_id);
                    showToast('ট্র্যাকিং কোড কপি করা হয়েছে!');
                  }}
                >
                  কোড কপি করুন
                </Button>
              </div>
            </Card>
          )}
        </main>
      )}

      {/* ========================================================================= */}
      {/* ================= TAB 9: RESULTS & MARKSHEET (রেজাল্ট) ================== */}
      {/* ========================================================================= */}
      {activeTab === 'results' && (
        <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-12 w-full space-y-8 animate-fade-in">
          <div className="text-center">
            <span className="text-xs font-mono font-bold text-primary uppercase tracking-wider">EXAMINATION RESULTS</span>
            <h2 className="text-3xl font-heading font-bold text-text mt-1 mb-2">
              পরীক্ষার ফলাফল ও মার্কশিট অনুসন্ধান
            </h2>
            <p className="text-xs sm:text-sm text-muted">
              শ্রেণি ও রোল নম্বর দিয়ে অফিশিয়াল ডিজিটাল ট্রান্সক্রিপ্ট সংগ্রহ করুন।
            </p>
          </div>

          <Card surface="surface" className="p-6">
            <form onSubmit={handleResultSearch} className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <Select
                  label="শ্রেণি"
                  value={resultQuery.classVal}
                  onChange={(e) => setResultQuery({ ...resultQuery, classVal: e.target.value })}
                  options={['6', '7', '8', '9', '10']}
                />
                <Input
                  label="রোল নম্বর"
                  placeholder="e.g. 1"
                  value={resultQuery.rollVal}
                  onChange={(e) => setResultQuery({ ...resultQuery, rollVal: e.target.value })}
                  required
                />
                <Select
                  label="পরীক্ষা"
                  value={resultQuery.examVal}
                  onChange={(e) => setResultQuery({ ...resultQuery, examVal: e.target.value })}
                  options={['First-Term', 'Half-Yearly', 'Annual', 'Pre-Test', 'Test']}
                />
                <Select
                  label="বছর"
                  value={resultQuery.yearVal}
                  onChange={(e) => setResultQuery({ ...resultQuery, yearVal: e.target.value })}
                  options={['2026', '2025', '2024']}
                />
              </div>

              <div className="pt-2 flex justify-end">
                <Button type="submit" variant="primary" size="md" icon={Search}>
                  ফলাফল খুঁজুন
                </Button>
              </div>
            </form>
          </Card>

          {hasSearched && (
            searchOutput ? (() => {
              const matchedStudent = students.find(
                s => s.class === searchOutput.class && String(s.roll) === String(searchOutput.roll)
              );
              const studentName = matchedStudent?.name_bn || searchOutput.student_name || 'মোহাম্মদ তানভীর আহমেদ';
              const studentFather = matchedStudent?.father_name || 'মোঃ রফিকুল ইসলাম';

              return (
                <Card surface="surface" className="p-6 sm:p-8 border-2 border-primary/30 shadow-lg printable-marksheet-sheet printable-document page-fit-single">
                  {/* Institutional Header Letterhead (D26) */}
                  <div className="text-center pb-6 border-b-2 border-primary/40 space-y-1">
                    <div className="flex items-center justify-center gap-3 mb-2">
                      {(settings?.logo || school.logo) ? (
                        <img src={settings?.logo || school.logo} alt="Logo" className="w-12 h-12 rounded-xl object-cover border border-border" />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-primary text-on-primary font-bold text-xl flex items-center justify-center">
                          {school.name_bn[0]}
                        </div>
                      )}
                      <div>
                        <h3 className="text-xl sm:text-2xl font-heading font-extrabold text-text">
                          {school.name_bn}
                        </h3>
                        <p className="text-xs text-muted font-mono">
                          EIIN: {school.eiin} • শিক্ষাবোর্ড: {school.board} • জেলা: {school.district}
                        </p>
                      </div>
                    </div>
                    <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-mono font-bold uppercase tracking-wider">
                      অফিশিয়াল একাডেমিক ট্রান্সক্রিপ্ট ও গ্রেড শিট
                    </span>
                  </div>

                  {/* Student & Exam Details Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4 text-xs bg-surface-2 rounded-xl p-4 my-6 border border-border">
                    <div>
                      <span className="text-muted block text-[10px]">শিক্ষার্থীর নাম:</span>
                      <strong className="text-text text-sm">{studentName}</strong>
                    </div>
                    <div>
                      <span className="text-muted block text-[10px]">পিতার নাম:</span>
                      <strong className="text-text">{studentFather}</strong>
                    </div>
                    <div>
                      <span className="text-muted block text-[10px]">শ্রেণি ও রোল:</span>
                      <strong className="text-primary font-mono text-sm">{searchOutput.class}ম শ্রেণি (রোল: {searchOutput.roll})</strong>
                    </div>
                    <div>
                      <span className="text-muted block text-[10px]">পরীক্ষা ও বছর:</span>
                      <strong className="text-text font-mono">{searchOutput.exam} ({searchOutput.year})</strong>
                    </div>
                  </div>

                  {/* GPA Box */}
                  <div className="my-6 p-4 rounded-xl bg-primary-soft border border-primary/25 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-mono text-muted uppercase">প্রাপ্ত সার্বিক GPA</span>
                      <div className="text-3xl sm:text-4xl font-mono font-extrabold text-primary">
                        {searchOutput.total_gpa}
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={searchOutput.status === 'PASSED' ? 'success' : 'danger'} symbol={searchOutput.status === 'PASSED' ? '✓' : '✕'} className="text-sm px-3.5 py-1">
                        {searchOutput.status === 'PASSED' ? 'উত্তীর্ণ (PASSED)' : 'অনুত্তীর্ণ (FAILED)'}
                      </Badge>
                      <span className="text-xs text-muted font-medium block mt-1">সর্বোচ্চ স্কেল: ৫.০০</span>
                    </div>
                  </div>

                  {/* Marksheet Grid with Full Marks Column (D26) */}
                  <GridTable
                    columns={[
                      { key: 'code', label: 'কোড', width: '70px', fontMono: true },
                      { key: 'name', label: 'বিষয়ের নাম', width: '2fr' },
                      { 
                        key: 'full_marks', 
                        label: 'পূর্ণমান', 
                        width: '70px', 
                        align: 'center', 
                        fontMono: true,
                        render: () => '১০০'
                      },
                      { key: 'marks', label: 'প্রাপ্ত নম্বর', width: '90px', align: 'right', fontMono: true },
                      { 
                        key: 'grade', 
                        label: 'গ্রেড', 
                        width: '80px', 
                        align: 'center',
                        render: (val) => (
                          <span className={`font-mono font-bold ${val === 'A+' ? 'text-primary' : val === 'F' ? 'text-danger' : 'text-text'}`}>
                            {val}
                          </span>
                        )
                      },
                      { key: 'gpa', label: 'পয়েন্ট', width: '80px', align: 'right', fontMono: true }
                    ]}
                    data={searchOutput.subjects}
                    zebra
                  />

                  {/* Official Signatures */}
                  <div className="pt-10 pb-3 flex justify-between items-end text-xs text-muted border-t border-dashed border-border mt-8">
                    <div className="text-center">
                      <div className="w-32 border-b border-text/40 mb-1 mx-auto" />
                      <span>শ্রেণি শিক্ষকের স্বাক্ষর</span>
                    </div>
                    <div className="text-center">
                      <div className="w-36 border-b border-text/40 mb-1 mx-auto" />
                      <span className="font-bold text-text">প্রধান শিক্ষকের স্বাক্ষর ও সিল</span>
                    </div>
                  </div>

                  {/* Digital QR Verification Stamp */}
                  <div className="mt-6 p-3 rounded-xl bg-surface-2 border border-border flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-surface border border-border flex items-center justify-center text-primary shrink-0">
                        <QrCode className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="font-bold text-text block">ডিজিটাল ভেরিফিকেশন সিস্টেম</span>
                        <span className="text-[10px] text-muted font-mono">আইডি: {school.eiin}-{searchOutput.year}-{searchOutput.class}-{searchOutput.roll} • অফিশিয়াল রেকর্ড সংরক্ষিত</span>
                      </div>
                    </div>
                    <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-success font-mono">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      যাচাইকৃত
                    </span>
                  </div>

                  {/* Action & Share Buttons */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-5 border-t border-border no-print">
                    <div className="flex flex-wrap items-center gap-2">
                      <Button variant="secondary" size="sm" onClick={() => setSearchOutput(null)}>
                        আবার খুঁজুন
                      </Button>
                      <button
                        type="button"
                        onClick={() => {
                          const shareText = `${school.name_bn}\nশিক্ষার্থী: ${studentName}\nশ্রেণি: ${searchOutput.class}ম (রোল: ${searchOutput.roll})\nপরীক্ষা: ${searchOutput.exam} (${searchOutput.year})\nপ্রাপ্ত GPA: ${searchOutput.total_gpa} (${searchOutput.status === 'PASSED' ? 'উত্তীর্ণ' : 'অনুত্তীর্ণ'})\nফলাফল দেখুন: ${window.location.origin}/${school.slug}#results`;
                          const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
                          window.open(url, '_blank');
                        }}
                        className="px-3 py-1.5 rounded-lg border border-border bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                        title="হোয়াটসঅ্যাপে শেয়ার করুন"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                        <span>হোয়াটসঅ্যাপ</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(window.location.href);
                          showToast('রেজাল্ট পেজের লিংক কপি করা হয়েছে!', 'success');
                        }}
                        className="px-3 py-1.5 rounded-lg border border-border bg-surface-2 text-muted hover:text-text text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                        title="রেজাল্ট লিংক কপি করুন"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>লিংক কপি</span>
                      </button>
                    </div>

                    <Button variant="primary" size="sm" icon={Printer} onClick={() => window.print()}>
                      প্রিন্ট / সেভ PDF
                    </Button>
                  </div>
                </Card>
              );
            })() : (
              <EmptyState
                icon={Search}
                title="কোনো ফলাফল পাওয়া যায়নি"
                description="আপনার দেওয়া শ্রেণি ও রোলের কোনো প্রকাশিত ফলাফল পাওয়া যায়নি। দয়া করে তথ্য সঠিক কিনা যাচাই করুন।"
              />
            )
          )}
        </main>
      )}

      {/* ========================================================================= */}
      {/* ================= TAB 10: MEDIA GALLERY (ফটো ও ভিডিও গ্যালারি) ========= */}
      {/* ========================================================================= */}
      {activeTab === 'gallery' && (
        <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 py-12 w-full space-y-8 animate-fade-in">
          <div>
            <span className="text-xs font-mono font-bold text-primary uppercase tracking-wider">MEDIA GALLERY</span>
            <h2 className="text-3xl font-heading font-bold text-text mt-1 mb-2">
              আলোকচিত্র ও ভিডিও কর্নার
            </h2>
            <p className="text-xs sm:text-sm text-muted">
              ক্যাম্পাস প্রাঙ্গণ, ক্রীড়া প্রতিযোগিতা, বিজ্ঞান মেলা ও সাংস্কৃতিক উৎসবের স্মারক স্থিরচিত্র ও ভিডিও
            </p>
          </div>

          {/* Media Switcher: Photos vs Videos */}
          <div className="flex items-center gap-2 p-1 bg-surface-2 rounded-xl border border-border max-w-xs">
            <button
              type="button"
              onClick={() => setActiveMediaTab('photos')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeMediaTab === 'photos'
                  ? 'bg-surface text-primary shadow-xs'
                  : 'text-muted hover:text-text'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>ছবি সমূহ ({gallery.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveMediaTab('videos')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeMediaTab === 'videos'
                  ? 'bg-surface text-primary shadow-xs'
                  : 'text-muted hover:text-text'
              }`}
            >
              <Film className="w-3.5 h-3.5" />
              <span>ভিডিও সমূহ ({videos.length})</span>
            </button>
          </div>

          {/* Category Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {[
              { key: 'all', label: activeMediaTab === 'photos' ? 'সকল ছবি' : 'সকল ভিডিও' },
              { key: 'campus', label: 'ক্যাম্পাস ও প্রাঙ্গণ' },
              { key: 'sports', label: 'খেলাধুলা ও ক্রীড়া' },
              { key: 'academic', label: 'বিজ্ঞান ও ল্যাব' },
              { key: 'cultural', label: 'সাংস্কৃতিক অনুষ্ঠান' }
            ].map(f => (
              <button
                key={f.key}
                type="button"
                onClick={() => setActiveGalleryFilter(f.key)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-colors ${
                  activeGalleryFilter === f.key ? 'bg-primary text-on-primary' : 'bg-surface-2 text-muted hover:text-text'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* PHOTOS GRID */}
          {activeMediaTab === 'photos' && (
            filteredGallery.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                {filteredGallery.map((g) => (
                  <Card
                    key={g.id}
                    surface="surface"
                    onClick={() => setLightboxImage(g)}
                    className="overflow-hidden p-0 group cursor-pointer hover:border-primary transition-colors"
                  >
                    <div className="aspect-video overflow-hidden bg-surface-2 relative">
                      <img
                        src={g.image}
                        alt={g.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-4 space-y-1">
                      <h4 className="text-sm font-bold text-text line-clamp-1">{g.title}</h4>
                      <p className="text-xs text-muted line-clamp-2">{g.description}</p>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card surface="surface" className="p-8 text-center">
                <EmptyState title="এই ক্যাটাগরিতে কোনো ছবি নেই" description="অন্যান্য ক্যাটাগরি ফিল্টার করে ছবি দেখুন।" />
              </Card>
            )
          )}

          {/* VIDEOS GRID */}
          {activeMediaTab === 'videos' && (
            filteredVideos.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                {filteredVideos.map((v) => (
                  <Card
                    key={v.id}
                    surface="surface"
                    onClick={() => setSelectedVideo(v)}
                    className="overflow-hidden p-0 group cursor-pointer hover:border-primary transition-colors"
                  >
                    <div className="aspect-video overflow-hidden bg-black relative flex items-center justify-center">
                      {v.embed_url?.startsWith('data:video') ? (
                        <video src={v.embed_url} className="w-full h-full object-cover opacity-80" />
                      ) : v.thumbnail ? (
                        <img
                          src={v.thumbnail}
                          alt={v.title}
                          className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full bg-slate-900 flex items-center justify-center text-slate-500">
                          <Film className="w-12 h-12" />
                        </div>
                      )}

                      {/* Play Button Overlay */}
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/20 transition-colors">
                        <div className="w-12 h-12 rounded-full bg-primary/95 text-on-primary flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                          <Play className="w-5 h-5 ml-0.5 fill-current" />
                        </div>
                      </div>

                      {/* Duration Badge */}
                      {v.duration && (
                        <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-black/85 text-white backdrop-blur-xs">
                          {v.duration}
                        </span>
                      )}
                    </div>

                    <div className="p-4 space-y-1">
                      <h4 className="text-sm font-bold text-text line-clamp-1 group-hover:text-primary transition-colors">{v.title}</h4>
                      <p className="text-xs text-muted line-clamp-2">{v.description}</p>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card surface="surface" className="p-8 text-center">
                <EmptyState title="এই ক্যাটাগরিতে কোনো ভিডিও নেই" description="অন্যান্য ক্যাটাগরি ফিল্টার করে ভিডিও দেখুন।" />
              </Card>
            )
          )}
        </main>
      )}

      {/* ========================================================================= */}
      {/* ================= TAB 11: CONTACT (যোগাযোগ) ============================= */}
      {/* ========================================================================= */}
      {activeTab === 'contact' && (
        <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 py-12 w-full space-y-10 animate-fade-in">
          <div>
            <span className="text-xs font-mono font-bold text-primary uppercase tracking-wider">CONTACT</span>
            <h2 className="text-3xl font-heading font-bold text-text mt-1 mb-2">
              যোগাযোগ ও অনুসন্ধান
            </h2>
            <p className="text-xs sm:text-sm text-muted">
              বিদ্যালয় কার্যালয়, ফোন, ইমেইল ও অবস্থান
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5 space-y-6">
              <Card surface="surface" className="p-6 space-y-4">
                <h4 className="text-sm font-bold text-text">বিদ্যালয় কার্যালয়ের ঠিকানা</h4>
                <div className="space-y-3 text-xs text-muted">
                  <div className="flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{settings?.address_bn}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Phone className="w-4 h-4 text-primary shrink-0" />
                    <span className="font-mono">{settings?.phone} {settings?.phone_alt ? `• ${settings.phone_alt}` : ''}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Mail className="w-4 h-4 text-primary shrink-0" />
                    <span className="font-mono">{settings?.email}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Clock className="w-4 h-4 text-primary shrink-0" />
                    <span>{settings?.office_hours}</span>
                  </div>
                </div>

                {settings?.facebook_url && (
                  <div className="pt-3 border-t border-border">
                    <a
                      href={settings.facebook_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary font-semibold hover:underline inline-flex items-center gap-1.5"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>অফিসিয়াল ফেসবুক পেজ / গ্রুপ</span>
                    </a>
                  </div>
                )}
              </Card>
            </div>

            <div className="lg:col-span-7">
              <Card surface="surface" className="p-6 space-y-4">
                <h4 className="text-sm font-bold text-text">ইনকোয়ারি বা মেসেজ পাঠান (Contact Form)</h4>

                {contactSuccess && (
                  <Alert variant="success">
                    ✓ আপনার বার্তাটি সফলভাবে পাঠানো হয়েছে! বিদ্যালয় কর্তৃপক্ষ দ্রুত আপনার মোবাইল বা ইমেইলে যোগাযোগ করবে।
                  </Alert>
                )}

                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div>
                    <Input
                      label="আপনার নাম *"
                      placeholder="যেমন: মোহাম্মদ আব্দুল্লাহ"
                      value={contactForm.name}
                      onChange={(e) => {
                        setContactForm({ ...contactForm, name: e.target.value });
                        if (contactErrors.name) setContactErrors({ ...contactErrors, name: '' });
                      }}
                      error={contactErrors.name}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <Input
                        label="মোবাইল নম্বর *"
                        placeholder="018XXXXXXXX"
                        value={contactForm.mobile}
                        onChange={(e) => {
                          setContactForm({ ...contactForm, mobile: e.target.value });
                          if (contactErrors.mobile) setContactErrors({ ...contactErrors, mobile: '' });
                        }}
                        error={contactErrors.mobile}
                        helperText="১১ ডিজিটের বাংলাদেশি মোবাইল"
                        required
                      />
                    </div>
                    <div>
                      <Input
                        label="ইমেইল (ঐচ্ছিক)"
                        placeholder="name@domain.com"
                        value={contactForm.email}
                        onChange={(e) => {
                          setContactForm({ ...contactForm, email: e.target.value });
                          if (contactErrors.email) setContactErrors({ ...contactErrors, email: '' });
                        }}
                        error={contactErrors.email}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-text">আপনার বার্তা বা অনুসন্ধানের বিষয়: *</label>
                    <textarea
                      rows={4}
                      placeholder="এখানে আপনার প্রশ্ন বা অনুসন্ধানের বিষয় লিখুন (কমপক্ষে ৫ অক্ষর)..."
                      value={contactForm.message}
                      onChange={(e) => {
                        setContactForm({ ...contactForm, message: e.target.value });
                        if (contactErrors.message) setContactErrors({ ...contactErrors, message: '' });
                      }}
                      className="w-full rounded-[10px] bg-surface-2 border border-border text-text p-3 text-xs outline-none focus:border-primary"
                      required
                    />
                    {contactErrors.message && (
                      <p className="text-xs text-danger font-medium">⚠️ {contactErrors.message}</p>
                    )}
                  </div>

                  <Button type="submit" variant="primary" size="md">
                    বার্তা প্রেরণ করুন
                  </Button>
                </form>
              </Card>
            </div>
          </div>
        </main>
      )}

      {/* ================= MODAL 1: NOTICE FULL VIEW ================= */}
      {readingNotice && (
        <Modal
          isOpen={!!readingNotice}
          onClose={() => setReadingNotice(null)}
          title="প্রাতিষ্ঠানিক নোটিশ"
          subtitle={`প্রকাশকাল: ${readingNotice.date} • ক্যাটাগরি: ${readingNotice.category}`}
          maxWidth="max-w-2xl"
        >
          <div className="space-y-5 text-xs">
            {/* Printable Notice Paper */}
            <div className="printable-notice-paper printable-document page-fit-single p-5 sm:p-6 bg-white text-black rounded-xl border border-slate-300 font-sans text-xs space-y-4 shadow-xs">
              {/* Institutional Header Letterhead */}
              <div className="flex items-center justify-between border-b-2 border-black pb-3">
                <div className="flex items-center gap-3">
                  {(settings?.logo || school.logo) ? (
                    <img src={settings?.logo || school.logo} alt="School Logo" className="w-12 h-12 object-contain rounded-lg border border-slate-300 p-0.5 bg-white shrink-0" />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-emerald-700 text-white font-bold text-xl flex items-center justify-center shrink-0">
                      {school.name_bn[0]}
                    </div>
                  )}
                  <div>
                    <h3 className="font-heading font-extrabold text-lg text-slate-900 leading-tight">
                      {school.name_bn}
                    </h3>
                    <p className="text-[11px] text-slate-700">
                      EIIN: {school.eiin} • {school.board} শিক্ষা বোর্ড • জেলা: {school.district}
                    </p>
                    <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                      {settings?.address_bn}
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="px-2.5 py-1 rounded bg-slate-100 font-bold text-[11px] border border-slate-300 block">
                    অফিসিয়াল বিজ্ঞপ্তি
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono block mt-1">
                    স্মারক: {school.code_prefix || 'BDHS'}-বিজ্ঞপ্তি-{readingNotice.id || '১'}
                  </span>
                </div>
              </div>

              {/* Notice Metadata */}
              <div className="flex justify-between items-center text-[11px] bg-slate-50 p-2.5 rounded border border-slate-200">
                <span><strong>বিষয়:</strong> {readingNotice.title}</span>
                <span className="font-mono"><strong>তারিখ:</strong> {readingNotice.date}</span>
              </div>

              {/* Notice Description Body */}
              <div className="p-4 rounded bg-white leading-relaxed text-slate-900 whitespace-pre-wrap text-xs sm:text-sm min-h-[140px]">
                {readingNotice.description}
              </div>

              {/* Official Signatures */}
              <div className="pt-8 flex justify-between items-end text-[11px] text-slate-600 border-t border-dashed border-slate-300">
                <div className="text-center">
                  <div className="w-32 border-b border-slate-400 mb-1 mx-auto" />
                  <span>নোটিশ ইনচার্জ</span>
                </div>
                <div className="text-center">
                  <div className="w-36 border-b border-slate-400 mb-1 mx-auto" />
                  <strong className="text-slate-900 block font-heading">{settings?.headmaster_name || 'প্রধান শিক্ষক'}</strong>
                  <span className="text-[10px]">প্রধান শিক্ষক • {school.name_bn}</span>
                </div>
              </div>
            </div>

            {readingNotice.attachment && (
              <div className="p-4 rounded-xl bg-primary-soft border border-primary/30 flex items-center justify-between gap-4 no-print">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary text-on-primary flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h5 className="font-bold text-text truncate">সংযুক্ত অফিসিয়াল ফাইল</h5>
                    <span className="text-[11px] text-muted font-mono">{readingNotice.attachment.name || 'Notice_Document.pdf'}</span>
                  </div>
                </div>
                <a
                  href={readingNotice.attachment.dataUrl || readingNotice.attachment}
                  download={readingNotice.attachment.name || 'Notice_Attachment.pdf'}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-primary text-on-primary font-bold text-xs flex items-center gap-1.5 hover:opacity-90 transition-opacity shrink-0 cursor-pointer shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" /> ডাউনলোড / সংযুক্তি দেখুন
                </a>
              </div>
            )}

            <div className="flex justify-between items-center pt-2 border-t border-border no-print">
              <Button variant="secondary" size="sm" onClick={() => setReadingNotice(null)}>
                বন্ধ করুন
              </Button>
              <Button variant="primary" size="sm" icon={Printer} onClick={() => window.print()}>
                প্রিন্ট / সেভ PDF
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* ================= MODAL 2: LIGHTBOX PHOTO VIEW ================= */}
      {lightboxImage && (
        <Modal
          isOpen={!!lightboxImage}
          onClose={() => setLightboxImage(null)}
          title={lightboxImage.title}
          subtitle={lightboxImage.category}
          maxWidth="max-w-3xl"
        >
          <div className="space-y-4">
            <div className="rounded-xl overflow-hidden bg-black max-h-[500px] flex items-center justify-center">
              <img
                src={lightboxImage.image}
                alt={lightboxImage.title}
                className="w-full h-auto max-h-[500px] object-contain"
              />
            </div>
            {lightboxImage.description && (
              <p className="text-xs text-muted leading-relaxed">
                {lightboxImage.description}
              </p>
            )}
            <div className="flex justify-end pt-2 border-t border-border">
              <Button variant="secondary" size="sm" onClick={() => setLightboxImage(null)}>
                বন্ধ করুন
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* ================= MODAL 2.5: VIDEO PLAYER LIGHTBOX ================= */}
      {selectedVideo && (
        <Modal
          isOpen={!!selectedVideo}
          onClose={() => setSelectedVideo(null)}
          title={selectedVideo.title}
          subtitle={`ভিডিও কর্নার • ব্যাপ্তি: ${selectedVideo.duration || 'ভিডিও'}`}
          maxWidth="max-w-3xl"
        >
          <div className="space-y-4">
            <div className="aspect-video w-full rounded-xl overflow-hidden bg-black flex items-center justify-center">
              {selectedVideo.embed_url?.startsWith('data:video') ? (
                <video src={selectedVideo.embed_url} controls autoPlay className="w-full h-full object-contain" />
              ) : (
                <iframe
                  src={selectedVideo.embed_url}
                  title={selectedVideo.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              )}
            </div>
            {selectedVideo.description && (
              <p className="text-xs text-muted leading-relaxed">
                {selectedVideo.description}
              </p>
            )}
            <div className="flex justify-end pt-2 border-t border-border">
              <Button variant="secondary" size="sm" onClick={() => setSelectedVideo(null)}>
                বন্ধ করুন
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* ================= MODAL 3: TRACKING SEARCH ================= */}
      {trackingModalOpen && (
        <Modal
          isOpen={trackingModalOpen}
          onClose={() => { setTrackingModalOpen(false); setTrackResult(null); }}
          title="ভর্তি আবেদনের অবস্থা অনুসন্ধান"
          subtitle="আপনার ট্র্যাকিং নম্বরটি প্রবেশ করান"
        >
          <form onSubmit={handleTrackingLookup} className="space-y-4">
            {trackError && <Alert variant="danger">{trackError}</Alert>}
            <Input
              label="ট্র্যাকিং নম্বর (যেমন: BDHS-ADM-2027-XXXX) *"
              placeholder="BDHS-ADM-..."
              value={searchTrackCode}
              onChange={(e) => setSearchTrackCode(e.target.value)}
              required
            />
            <Input
              label="আবেদনে দেওয়া অভিভাবকের মোবাইল নম্বর *"
              placeholder="018XXXXXXXX"
              value={searchTrackPhone}
              onChange={(e) => setSearchTrackPhone(e.target.value)}
              required
            />
            <Button type="submit" variant="primary" size="md" className="w-full">
              স্ট্যাটাস খুঁজুন
            </Button>

            {trackResult && (
              trackResult === 'NOT_FOUND' ? (
                <Alert variant="danger">প্রদত্ত ট্র্যাকিং কোড ও মোবাইল নম্বরের সাথে মিলে এমন কোনো আবেদন পাওয়া যায়নি। তথ্য সঠিকভাবে দিন।</Alert>
              ) : (
                <div className="p-4 rounded-xl bg-surface-2 border border-border space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted">শিক্ষার্থী:</span>
                    <span className="font-bold">{trackResult.name_bn}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">শ্রেণি:</span>
                    <span>{trackResult.applied_class}ম শ্রেণি</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-border">
                    <span className="text-muted">অবস্থা:</span>
                    <Badge variant={trackResult.status === 'approved' ? 'success' : trackResult.status === 'rejected' ? 'danger' : 'warning'}>
                      {trackResult.status === 'approved' ? `✓ অনুমোদিত (রোল: ${trackResult.assigned_roll})` : trackResult.status === 'rejected' ? '✕ বাতিল' : '● অপেক্ষমাণ'}
                    </Badge>
                  </div>
                  <div className="pt-2">
                    <Button 
                      type="button" 
                      variant="primary" 
                      size="sm" 
                      icon={Printer} 
                      className="w-full"
                      onClick={() => {
                        setTrackingModalOpen(false);
                        setAdmitCardData(trackResult);
                      }}
                    >
                      প্রবেশপত্র দেখুন ও প্রিন্ট করুন
                    </Button>
                  </div>
                </div>
              )
            )}
          </form>
        </Modal>
      )}

      {/* ================= MODAL 4: ADMIT CARD PRINT ================= */}
      {admitCardData && (
        <Modal
          isOpen={!!admitCardData}
          onClose={() => setAdmitCardData(null)}
          title="ভর্তি পরীক্ষার প্রবেশপত্র (Admit Card)"
          subtitle="সেশন ২০২৭ • অফিসিয়াল পরীক্ষার্থী কপি"
          maxWidth="max-w-2xl"
        >
          <div className="space-y-6">
            <div className="printable-admit-card printable-document page-fit-single p-5 sm:p-6 bg-white text-black rounded-xl border border-slate-300 font-sans text-xs space-y-4 shadow-inner">
              <div className="flex items-center justify-center gap-3 border-b-2 border-black pb-3">
                {(settings?.logo || school.logo) ? (
                  <img src={settings?.logo || school.logo} alt="School Logo" className="w-12 h-12 object-contain rounded-lg border border-slate-300 p-0.5 bg-white shrink-0" />
                ) : (
                  <div className="w-12 h-12 rounded-lg bg-emerald-700 text-white font-bold text-lg flex items-center justify-center shrink-0">
                    {school.name_bn[0]}
                  </div>
                )}
                <div className="text-center">
                  <h3 className="font-heading font-extrabold text-lg text-slate-900 leading-tight">
                    {school.name_bn}
                  </h3>
                  <p className="text-[11px] text-slate-700">
                    {settings?.address_bn} • EIIN: {school.eiin} • {school.board} শিক্ষা বোর্ড
                  </p>
                </div>
              </div>
              <div className="text-center">
                <div className="inline-block px-3 py-1 bg-slate-100 border border-slate-300 rounded font-bold text-xs uppercase tracking-wide">
                  ভর্তি পরীক্ষার প্রবেশপত্র — সেশন ২০২৭
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="flex-1 space-y-2 text-[11px]">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-slate-500 block text-[10px]">ট্র্যাকিং নম্বর:</span>
                      <strong className="font-mono text-sm text-slate-900">{admitCardData.tracking_id}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">ভর্তির শ্রেণি:</span>
                      <strong className="text-sm text-slate-900">{admitCardData.applied_class}ম শ্রেণি</strong>
                    </div>
                  </div>

                  <div>
                    <span className="text-slate-500 block text-[10px]">শিক্ষার্থীর নাম (বাংলা):</span>
                    <strong className="text-sm text-slate-900">{admitCardData.name_bn}</strong>
                  </div>

                  <div>
                    <span className="text-slate-500 block text-[10px]">Student Name (English):</span>
                    <strong className="font-mono text-xs text-slate-900">{admitCardData.name_en || '—'}</strong>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div>
                      <span className="text-slate-500 block text-[10px]">পিতার নাম:</span>
                      <strong>{admitCardData.father_name}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">মাতার নাম:</span>
                      <strong>{admitCardData.mother_name}</strong>
                    </div>
                  </div>

                  <div>
                    <span className="text-slate-500 block text-[10px]">যোগাযোগের মোবাইল:</span>
                    <span className="font-mono">{admitCardData.mobile}</span>
                  </div>
                </div>

                {admitCardData.photo ? (
                  <img
                    src={admitCardData.photo}
                    alt="Applicant Photo"
                    className="w-28 h-32 object-cover rounded border-2 border-slate-400 shrink-0 shadow-xs"
                  />
                ) : (
                  <div className="w-28 h-32 border-2 border-dashed border-slate-400 bg-slate-50 rounded flex flex-col items-center justify-center text-center p-2 text-slate-400 shrink-0">
                    <UserCheck className="w-6 h-6 mb-1 opacity-50" />
                    <span className="text-[9px] leading-tight">পাসপোর্ট সাইজ ছবি আঠা দিয়ে লাগান</span>
                  </div>
                )}
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-[11px] space-y-1">
                <div className="flex justify-between">
                  <span><strong>পরীক্ষার তারিখ ও সময়:</strong> ১০ ডিসেম্বর ২০২৬, সকাল ১০:০০ টা</span>
                  <span><strong>পরীক্ষার রোল:</strong> <span className="font-mono font-bold">{admitCardData.assigned_roll || 'পরীক্ষা কেন্দ্রে পূরণযোগ্য'}</span></span>
                </div>
                <div><strong>পরীক্ষার স্থান:</strong> বিদ্যালয় একাডেমিক ভবন</div>
              </div>

              <div className="pt-8 flex justify-between items-end text-[10px] text-slate-600">
                <div className="text-center">
                  <div className="w-28 border-b border-slate-400 mb-1" />
                  <span>শিক্ষার্থীর স্বাক্ষর</span>
                </div>
                <div className="text-center">
                  <div className="w-32 border-b border-slate-400 mb-1" />
                  <span>আহ্বায়ক, ভর্তি কমিটি</span>
                </div>
                <div className="text-center">
                  <div className="w-32 border-b border-slate-400 mb-1" />
                  <span className="font-bold text-slate-900">প্রধান শিক্ষকের সিল ও স্বাক্ষর</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <Button variant="secondary" size="sm" onClick={() => setAdmitCardData(null)}>
                বন্ধ করুন
              </Button>
              <Button variant="primary" size="sm" icon={Printer} onClick={() => window.print()}>
                প্রিন্ট করুন (Admit Slip)
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* ================= 12. INSTITUTIONAL FOOTER ================= */}
      <footer className="border-t border-border bg-surface py-12 mt-auto mb-16 lg:mb-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10 text-xs">
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                {(settings?.logo || school.logo) ? (
                  <img
                    src={settings?.logo || school.logo}
                    alt={school.name_bn}
                    className="w-9 h-9 rounded-xl object-cover border border-border shrink-0 bg-surface-2"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-xl bg-primary text-on-primary font-bold flex items-center justify-center shrink-0">
                    {school.name_bn[0]}
                  </div>
                )}
                <h4 className="font-heading font-bold text-text text-sm">{school.name_bn}</h4>
              </div>
              <p className="text-muted leading-relaxed">
                {settings?.motto_bn}
              </p>
              <p className="font-mono text-[11px] text-muted">
                EIIN: {school.eiin} • MPO: {school.mpo_code} • কোড: {school.school_code}
              </p>
            </div>

            <div className="space-y-2">
              <span className="font-bold text-text block uppercase font-mono text-[11px] tracking-wider">দ্রুত নেভিগেশন</span>
              <ul className="space-y-1.5 text-muted">
                <li><button type="button" onClick={() => navigateToTab('about')} className="hover:text-primary cursor-pointer">বিদ্যালয় পরিচিতি</button></li>
                <li><button type="button" onClick={() => navigateToTab('committee')} className="hover:text-primary cursor-pointer">পরিচালনা পর্ষদ</button></li>
                <li><button type="button" onClick={() => navigateToTab('teachers')} className="hover:text-primary cursor-pointer">শিক্ষক ও কর্মচারী পরিষদ</button></li>
                <li><button type="button" onClick={() => navigateToTab('uniform')} className="hover:text-primary cursor-pointer">পোশাক নীতিমালা</button></li>
              </ul>
            </div>

            <div className="space-y-2">
              <span className="font-bold text-text block uppercase font-mono text-[11px] tracking-wider">একাডেমিক সেবা</span>
              <ul className="space-y-1.5 text-muted">
                <li><button type="button" onClick={() => navigateToTab('admission')} className="hover:text-primary cursor-pointer">অনলাইন ভর্তি আবেদন</button></li>
                <li><button type="button" onClick={() => navigateToTab('results')} className="hover:text-primary cursor-pointer">রেজাল্ট ও মার্কশিট</button></li>
                <li><button type="button" onClick={() => navigateToTab('academics')} className="hover:text-primary cursor-pointer">রুটিন ও সিলেবাস ডাউনলোড</button></li>
                <li><button type="button" onClick={() => navigateToTab('notices')} className="hover:text-primary cursor-pointer">প্রাতিষ্ঠানিক নোটিশ</button></li>
              </ul>
            </div>

            <div className="space-y-2">
              <span className="font-bold text-text block uppercase font-mono text-[11px] tracking-wider">যোগাযোগের ঠিকানা</span>
              <p className="text-muted leading-relaxed">{settings?.address_bn}</p>
              <p className="font-mono text-muted">{settings?.phone}</p>
              <p className="font-mono text-muted">{settings?.email}</p>
            </div>
          </div>

          <div className="pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-muted">
            <p>© ২০২৬ {school.name_bn}। সর্বস্বত্ব সংরক্ষিত।</p>
            <div className="flex items-center gap-4">
              <span className="text-primary font-medium">সহজ পাঠশালা দ্বারা পরিচালিত</span>
              <span>•</span>
              <Link to={`/${school.slug}/login`} className="hover:underline">পোর্টাল লগইন</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* ================= 13. MOBILE STICKY BOTTOM 4-TAB NAVIGATION BAR (Master Prompt 7.3) ================= */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface/95 backdrop-blur-md border-t border-border shadow-lg px-2 py-1.5 flex items-center justify-around no-print" aria-label="মোবাইল দ্রুত মেনু">
        {/* হোম */}
        <button
          type="button"
          onClick={() => navigateToTab('home')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all cursor-pointer ${
            activeTab === 'home' ? 'text-primary font-bold' : 'text-muted hover:text-text'
          }`}
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">হোম</span>
        </button>

        {/* নোটিশ */}
        <button
          type="button"
          onClick={() => navigateToTab('notices')}
          className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all cursor-pointer ${
            activeTab === 'notices' ? 'text-primary font-bold' : 'text-muted hover:text-text'
          }`}
        >
          <div className="relative">
            <Bell className="w-5 h-5 mb-0.5" />
            {urgentNotice && (
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-accent animate-pulse" />
            )}
          </div>
          <span className="text-[10px]">নোটিশ</span>
        </button>

        {/* ভর্তি */}
        <button
          type="button"
          onClick={() => navigateToTab('admission')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all cursor-pointer ${
            activeTab === 'admission' ? 'text-primary font-bold' : 'text-muted hover:text-text'
          }`}
        >
          <div className="relative">
            <GraduationCap className="w-5 h-5 mb-0.5 text-accent" />
            <span className="absolute -top-1.5 -right-2.5 text-[8px] bg-accent text-white font-bold px-1 rounded-full leading-tight">
              নতুন
            </span>
          </div>
          <span className="text-[10px]">ভর্তি</span>
        </button>

        {/* রেজাল্ট */}
        <button
          type="button"
          onClick={() => navigateToTab('results')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all cursor-pointer ${
            activeTab === 'results' ? 'text-primary font-bold' : 'text-muted hover:text-text'
          }`}
        >
          <FileText className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">রেজাল্ট</span>
        </button>
      </nav>
    </div>
  );
}
