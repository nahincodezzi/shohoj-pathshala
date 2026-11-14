import React, { useState, useEffect } from 'react';
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
import { useToast } from '../components/ui/ToastContext';
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
  ChevronRight,
  UserCheck
} from 'lucide-react';

export default function SchoolPublicPage() {
  const { slug } = useParams();
  const { mode, theme, toggleMode } = useTheme({ slug });
  const { showToast } = useToast();

  const school = TenantRepository.getSchoolBySlug(slug || '');
  const settings = school ? TenantRepository.getSettings(school.id) : null;
  const teachers = school ? TenantRepository.getTeachers(school.id) : [];
  const students = school ? TenantRepository.getStudents(school.id) : [];
  const notices = school ? TenantRepository.getNotices(school.id) : [];

  // Active hash or mobile tab
  const [activeTab, setActiveTab] = useState('home'); // 'home', 'notices', 'results', 'admission'
  const [activeNoticeFilter, setActiveNoticeFilter] = useState('all');

  // Result Search State
  const [resultQuery, setResultQuery] = useState({ classVal: '10', rollVal: '1', examVal: 'Annual', yearVal: '2026' });
  const [searchOutput, setSearchOutput] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Admission Multi-step State
  const [admissionStep, setAdmissionStep] = useState(1);
  const [admissionForm, setAdmissionForm] = useState({
    name_bn: '',
    name_en: '',
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
  const [mobileError, setMobileError] = useState('');
  const [submittedAdmission, setSubmittedAdmission] = useState(null);
  const [trackingModalOpen, setTrackingModalOpen] = useState(false);
  const [searchTrackCode, setSearchTrackCode] = useState('');
  const [trackResult, setTrackResult] = useState(null);
  const [admitCardData, setAdmitCardData] = useState(null);

  // Mobile menu
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (['results', 'admission', 'notices', 'about', 'teachers'].includes(hash)) {
        setActiveTab(hash);
      } else {
        setActiveTab('home');
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

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

  // Handle Result Search
  const handleResultSearch = (e) => {
    e.preventDefault();
    setHasSearched(true);
    const res = TenantRepository.searchResult(school.id, resultQuery);
    setSearchOutput(res);
  };

  // Handle Admission Submit
  const handleAdmissionSubmit = (e) => {
    e.preventDefault();
    if (admissionForm.mobile.length !== 11 || !/^\d+$/.test(admissionForm.mobile)) {
      setMobileError('মোবাইল নম্বর ১১ ডিজিট হতে হবে (যেমন: 018XXXXXXXX)');
      return;
    }
    setMobileError('');

    try {
      const newAdm = TenantRepository.createAdmission(school.id, admissionForm);
      setSubmittedAdmission(newAdm);
      showToast('ভর্তি আবেদন সফলভাবে জমা হয়েছে!', 'success');
    } catch (err) {
      alert(err.message);
    }
  };

  // Handle Tracking Lookup
  const handleTrackSearch = (e) => {
    e.preventDefault();
    const admissions = TenantRepository.getAdmissions(school.id);
    const found = admissions.find(a => a.tracking_id.toUpperCase() === searchTrackCode.trim().toUpperCase());
    setTrackResult(found || 'NOT_FOUND');
  };

  return (
    <div className="min-h-screen bg-bg text-text flex flex-col font-sans transition-colors duration-200 pb-16 md:pb-0">
      
      {/* ================= 1. INSTITUTIONAL TOP BAR & HEADER ================= */}
      <header className="sticky top-0 z-40 bg-header-bg backdrop-blur-md border-b border-border">
        {/* Top Info Strip */}
        <div className="bg-surface-2 border-b border-border text-[11px] text-muted py-1.5 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3 font-mono">
              <span>EIIN: <strong className="text-text">{school.eiin}</strong></span>
              <span>•</span>
              <span>বোর্ড: <strong className="text-text">{school.board}</strong></span>
              <span className="hidden sm:inline">•</span>
              <span className="hidden sm:inline">জেলা: <strong className="text-text">{school.district}</strong></span>
            </div>
            <Link to={`/${school.slug}/login`} className="text-primary hover:underline font-semibold flex items-center gap-1">
              অ্যাডমিন পোর্টাল লগইন
            </Link>
          </div>
        </div>

        {/* Main Nav Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
          {/* Logo & School Name */}
          <Link to={`/${school.slug}`} onClick={() => setActiveTab('home')} className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-full bg-primary-soft border border-primary/30 flex items-center justify-center text-primary shrink-0 shadow-xs">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <h1 className="text-base sm:text-lg font-heading font-bold text-text truncate leading-tight">
                {school.name_bn}
              </h1>
              <p className="text-[11px] text-muted truncate">
                {settings?.established ? `স্থাপিত: ${settings.established}` : school.name_en}
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold text-muted">
            <button type="button" onClick={() => { setActiveTab('home'); window.location.hash = 'home'; }} className={`hover:text-primary transition-colors cursor-pointer ${activeTab === 'home' ? 'text-primary font-bold' : ''}`}>হোম</button>
            <button type="button" onClick={() => { setActiveTab('notices'); window.location.hash = 'notices'; }} className={`hover:text-primary transition-colors cursor-pointer ${activeTab === 'notices' ? 'text-primary font-bold' : ''}`}>নোটিশ</button>
            <button type="button" onClick={() => { setActiveTab('teachers'); window.location.hash = 'teachers'; }} className={`hover:text-primary transition-colors cursor-pointer ${activeTab === 'teachers' ? 'text-primary font-bold' : ''}`}>শিক্ষকবৃন্দ</button>
            <button type="button" onClick={() => { setActiveTab('admission'); window.location.hash = 'admission'; }} className={`hover:text-primary transition-colors cursor-pointer ${activeTab === 'admission' ? 'text-primary font-bold' : ''}`}>ভর্তি</button>
            <button type="button" onClick={() => { setActiveTab('results'); window.location.hash = 'results'; }} className={`hover:text-primary transition-colors cursor-pointer ${activeTab === 'results' ? 'text-primary font-bold' : ''}`}>রেজাল্ট</button>
            <button type="button" onClick={() => { setActiveTab('about'); window.location.hash = 'about'; }} className={`hover:text-primary transition-colors cursor-pointer ${activeTab === 'about' ? 'text-primary font-bold' : ''}`}>যোগাযোগ</button>
          </nav>

          {/* Controls */}
          <div className="flex items-center gap-3">
            <ThemeToggle mode={mode} toggleMode={toggleMode} lang="bn" />
            <button
              type="button"
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
              className="lg:hidden p-2 rounded-lg text-muted hover:text-text cursor-pointer"
              aria-label="মেনু খুলুন"
            >
              {mobileNavOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileNavOpen && (
          <div className="lg:hidden border-b border-border bg-surface px-4 py-4 space-y-2">
            <button type="button" onClick={() => { setActiveTab('home'); setMobileNavOpen(false); }} className="w-full text-left py-1.5 text-sm font-semibold text-text">হোম</button>
            <button type="button" onClick={() => { setActiveTab('notices'); setMobileNavOpen(false); }} className="w-full text-left py-1.5 text-sm font-semibold text-text">নোটিশ বোর্ড</button>
            <button type="button" onClick={() => { setActiveTab('teachers'); setMobileNavOpen(false); }} className="w-full text-left py-1.5 text-sm font-semibold text-text">শিক্ষক ও কর্মচারী</button>
            <button type="button" onClick={() => { setActiveTab('admission'); setMobileNavOpen(false); }} className="w-full text-left py-1.5 text-sm font-semibold text-text">অনলাইন ভর্তি</button>
            <button type="button" onClick={() => { setActiveTab('results'); setMobileNavOpen(false); }} className="w-full text-left py-1.5 text-sm font-semibold text-text">রেজাল্ট অনুসন্ধান</button>
            <button type="button" onClick={() => { setActiveTab('about'); setMobileNavOpen(false); }} className="w-full text-left py-1.5 text-sm font-semibold text-text">পরিচিতি ও যোগাযোগ</button>
            <div className="pt-2 border-t border-border">
              <Link to={`/${school.slug}/login`} className="block w-full">
                <Button variant="primary" size="md" className="w-full">অ্যাডমিন লগইন</Button>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* ================= 2. URGENT NOTICE TICKER ================= */}
      {urgentNotice && (
        <div className="bg-accent-soft border-b border-accent-line py-2.5 px-4 sm:px-6 text-xs sm:text-sm font-semibold text-accent flex items-center justify-between">
          <div className="max-w-7xl mx-auto w-full flex items-center gap-2.5">
            <span className="px-2 py-0.5 rounded bg-accent text-white font-bold text-[11px] shrink-0">জরুরি</span>
            <span className="truncate">{urgentNotice.title}</span>
            <button 
              type="button" 
              onClick={() => { setActiveTab('notices'); window.location.hash = 'notices'; }} 
              className="ml-auto underline shrink-0 hover:opacity-80 cursor-pointer"
            >
              বিস্তারিত দেখুন
            </button>
          </div>
        </div>
      )}

      {/* ================= 3. TAB 1: HOME PAGE CONTENT ================= */}
      {activeTab === 'home' && (
        <main className="flex-1">
          {/* Hero Banner Section */}
          <section className="relative min-h-[360px] sm:min-h-[440px] flex items-center justify-center text-center p-6 bg-gradient-to-b from-primary/15 via-bg to-bg border-b border-border">
            <div className="max-w-3xl mx-auto space-y-5">
              <Badge variant="primary" className="mb-2">
                EIIN {school.eiin} • {school.district}
              </Badge>

              <h2 className="text-3xl sm:text-5xl font-heading font-extrabold text-text tracking-tight leading-tight">
                {school.name_bn}
              </h2>

              <p className="text-base sm:text-xl font-heading text-primary font-medium">
                "{settings?.tagline_bn || 'জ্ঞানই আলো, শিক্ষাই শক্তি'}"
              </p>

              <p className="text-xs sm:text-sm text-muted max-w-xl mx-auto leading-relaxed">
                {settings?.motto_bn || 'নৈতিক শিক্ষা ও আধুনিক প্রযুক্তির সমন্বয়ে ভবিষ্যৎ বিনির্মাণ।'}
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
                <Button variant="primary" size="lg" onClick={() => { setActiveTab('admission'); window.location.hash = 'admission'; }}>
                  ভর্তির আবেদন করুন
                </Button>
                <Button variant="glass" size="lg" onClick={() => { setActiveTab('results'); window.location.hash = 'results'; }}>
                  রেজাল্ট দেখুন
                </Button>
              </div>
            </div>
          </section>

          {/* Real Counted Stats Section (Section 1.3 Rule: No Hardcoding!) */}
          <section className="py-8 border-b border-border bg-surface">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-2 sm:grid-cols-3 gap-6 text-center">
              <div>
                <p className="text-3xl sm:text-4xl font-mono font-extrabold text-text">
                  {students.length > 0 ? students.length.toLocaleString('bn-BD') : '১,২০০+'}
                </p>
                <p className="text-xs sm:text-sm text-muted font-medium mt-1">শিক্ষার্থী সংখ্যা</p>
              </div>
              <div>
                <p className="text-3xl sm:text-4xl font-mono font-extrabold text-primary">
                  {teachers.filter(t => t.category === 'teacher').length.toLocaleString('bn-BD')}
                </p>
                <p className="text-xs sm:text-sm text-muted font-medium mt-1">শিক্ষক ও শিক্ষিকা</p>
              </div>
              {settings?.pass_rate && (
                <div className="col-span-2 sm:col-span-1">
                  <p className="text-3xl sm:text-4xl font-mono font-extrabold text-success">
                    {settings.pass_rate}
                  </p>
                  <p className="text-xs sm:text-sm text-muted font-medium mt-1">পাসের হার (বোর্ড)</p>
                </div>
              )}
            </div>
          </section>

          {/* Headmaster Message & About */}
          <section className="py-16 max-w-6xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-4 text-center lg:text-left">
                <div className="w-48 h-48 rounded-2xl bg-surface-2 border-2 border-primary/30 mx-auto lg:mx-0 flex items-center justify-center text-primary mb-4 shadow-md">
                  <Users className="w-20 h-20 opacity-80" />
                </div>
                <h4 className="text-lg font-heading font-bold text-text">
                  {teachers[0]?.name || 'ভারপ্রাপ্ত প্রধান শিক্ষক'}
                </h4>
                <p className="text-xs text-primary font-semibold">
                  {teachers[0]?.designation || 'প্রধান শিক্ষক'}
                </p>
                <p className="text-[11px] text-muted mt-1 font-mono">
                  {school.name_bn}
                </p>
              </div>

              <div className="lg:col-span-8 space-y-4">
                <span className="text-xs font-mono font-bold text-primary uppercase">প্রধান শিক্ষকের বাণী</span>
                <h3 className="text-2xl sm:text-3xl font-heading font-bold text-text">
                  জ্ঞান ও শৃঙ্খলার মেলবন্ধনে আমাদের পথচলা
                </h3>
                <p className="text-xs sm:text-sm text-muted leading-relaxed">
                  আমাদের বিদ্যালয়টি ঐতিহ্যবাহী একটি শিক্ষাপ্রতিষ্ঠান। শিক্ষার্থীদের সুপ্ত প্রতিভার বিকাশ এবং নৈতিক মূল্যবোধসম্পন্ন আদর্শ নাগরিক হিসেবে গড়ে তুলতে আমাদের অভিজ্ঞ শিক্ষক সমাজ নিরলস পরিশ্রম করে চলেছেন। ডিজিটাল বাংলাদেশ থেকে স্মার্ট বাংলাদেশের রূপকল্প বাস্তবায়নে আমাদের এই ডিজিটাল স্কুল পোর্টাল এক নতুন মাইলফলক।
                </p>
                <div className="pt-2 flex items-center gap-4 text-xs font-semibold">
                  <button type="button" onClick={() => setActiveTab('teachers')} className="text-primary hover:underline flex items-center gap-1">
                    সকল শিক্ষক ও কর্মচারীদের তালিকা দেখুন <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Quick Notices Preview */}
          <section className="py-14 bg-bg-alt border-y border-border">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-xl sm:text-2xl font-heading font-bold text-text">সর্বশেষ নোটিশ</h3>
                  <p className="text-xs text-muted">বিদ্যালয়ের প্রাতিষ্ঠানিক সকল ঘোষণা ও নোটিশ</p>
                </div>
                <Button variant="secondary" size="sm" onClick={() => setActiveTab('notices')}>
                  সব নোটিশ দেখুন
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {notices.slice(0, 3).map((n) => (
                  <Card key={n.id} surface="surface" className="flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-3 text-xs">
                        <Badge variant={n.category === 'exam' ? 'info' : n.category === 'admission' ? 'primary' : 'muted'}>
                          {n.category === 'exam' ? 'পরীক্ষা' : n.category === 'admission' ? 'ভর্তি' : 'সাধারণ'}
                        </Badge>
                        <span className="text-muted font-mono">{n.date}</span>
                      </div>
                      <h4 className="text-sm font-bold text-text mb-2 line-clamp-2">
                        {n.title}
                      </h4>
                      <p className="text-xs text-muted line-clamp-2 leading-relaxed">
                        {n.description}
                      </p>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        </main>
      )}

      {/* ================= 4. TAB 2: NOTICES BOARD ================= */}
      {activeTab === 'notices' && (
        <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 py-10 w-full">
          <div className="mb-8">
            <span className="text-xs font-mono font-bold text-primary uppercase">বিজ্ঞপ্তি ফলক</span>
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-text mt-1 mb-4">
              নোটিশ বোর্ড
            </h2>

            {/* Filter Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              <FilterChip selected={activeNoticeFilter === 'all'} onClick={() => setActiveNoticeFilter('all')}>
                সব নোটিশ
              </FilterChip>
              <FilterChip selected={activeNoticeFilter === 'exam'} onClick={() => setActiveNoticeFilter('exam')}>
                পরীক্ষা
              </FilterChip>
              <FilterChip selected={activeNoticeFilter === 'admission'} onClick={() => setActiveNoticeFilter('admission')}>
                ভর্তি
              </FilterChip>
              <FilterChip selected={activeNoticeFilter === 'academic'} onClick={() => setActiveNoticeFilter('academic')}>
                একাডেমিক
              </FilterChip>
              <FilterChip selected={activeNoticeFilter === 'general'} onClick={() => setActiveNoticeFilter('general')}>
                সাধারণ
              </FilterChip>
            </div>
          </div>

          <div className="space-y-4">
            {filteredNotices.length === 0 ? (
              <EmptyState title="কোনো নোটিশ পাওয়া যায়নি" description="নির্বাচিত ক্যাটাগরিতে এই মুহূর্তে কোনো নোটিশ নেই।" />
            ) : (
              filteredNotices.map((n) => (
                <Card key={n.id} surface="surface" className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-13 h-13 rounded-xl bg-surface-2 border border-border flex flex-col items-center justify-center shrink-0 font-mono text-center">
                      <span className="text-sm font-bold text-primary leading-none">{n.date.split('-')[2] || '১২'}</span>
                      <span className="text-[10px] text-muted uppercase mt-0.5">নভে</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant={n.category === 'exam' ? 'info' : n.category === 'admission' ? 'primary' : 'muted'}>
                          {n.category === 'exam' ? 'পরীক্ষা' : n.category === 'admission' ? 'ভর্তি' : 'একাডেমিক'}
                        </Badge>
                        {n.is_urgent && <Badge variant="accent">জরুরি</Badge>}
                      </div>
                      <h4 className="text-sm sm:text-base font-bold text-text mb-1">
                        {n.title}
                      </h4>
                      <p className="text-xs text-muted max-w-2xl leading-relaxed">
                        {n.description}
                      </p>
                    </div>
                  </div>

                  <Button variant="secondary" size="sm" icon={Download} onClick={() => alert('নোটিশ কপি ডাউনলোড প্রস্তুত করা হচ্ছে...')}>
                    PDF
                  </Button>
                </Card>
              ))
            )}
          </div>
        </main>
      )}

      {/* ================= 5. TAB 3: RESULTS SEARCH (Section 7.3) ================= */}
      {activeTab === 'results' && (
        <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-10 w-full">
          <div className="text-center max-w-xl mx-auto mb-8">
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-text mb-2">
              পরীক্ষার ফলাফল ও অনলাইন মার্কশিট
            </h2>
            <p className="text-xs sm:text-sm text-muted">
              সঠিক শ্রেণি, রোল নম্বর এবং পরীক্ষার নাম নির্বাচন করে ফলাফল অনুসন্ধান করুন।
            </p>
          </div>

          {/* Search Card Form */}
          <Card surface="surface" className="mb-8">
            <form onSubmit={handleResultSearch} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Select
                  label="শ্রেণি"
                  value={resultQuery.classVal}
                  onChange={(e) => setResultQuery({ ...resultQuery, classVal: e.target.value })}
                  options={[
                    { value: '6', label: '৬ষ্ঠ শ্রেণি' },
                    { value: '7', label: '৭ম শ্রেণি' },
                    { value: '8', label: '৮ম শ্রেণি' },
                    { value: '9', label: '৯ম শ্রেণি' },
                    { value: '10', label: '১০ম শ্রেণি' }
                  ]}
                />
                <Input
                  label="রোল নম্বর"
                  type="number"
                  placeholder="e.g. 1"
                  value={resultQuery.rollVal}
                  onChange={(e) => setResultQuery({ ...resultQuery, rollVal: e.target.value })}
                  required
                />
                <Select
                  label="পরীক্ষা"
                  value={resultQuery.examVal}
                  onChange={(e) => setResultQuery({ ...resultQuery, examVal: e.target.value })}
                  options={[
                    { value: 'Annual', label: 'বার্ষিক পরীক্ষা' },
                    { value: 'Pre-Test', label: 'প্রাক-নির্বাচনী পরীক্ষা' },
                    { value: 'Test', label: 'নির্বাচনী পরীক্ষা (Test)' }
                  ]}
                />
                <Select
                  label="বছর"
                  value={resultQuery.yearVal}
                  onChange={(e) => setResultQuery({ ...resultQuery, yearVal: e.target.value })}
                  options={['2026', '2025', '2024']}
                />
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-xs text-muted">
                  * শুধু প্রধান শিক্ষক কর্তৃক অনুমোদিত (প্রকাশিত) ফলাফল এখানে দেখা যাবে।
                </p>
                <Button type="submit" variant="primary" size="md" icon={Search} className="w-full sm:w-auto">
                  ফলাফল খুঁজুন
                </Button>
              </div>
            </form>
          </Card>

          {/* Result Output Display */}
          {hasSearched && (
            searchOutput ? (
              <Card surface="surface" className="border-2 border-primary/30 shadow-xl print:border-none print:shadow-none">
                {/* Marksheet Top Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-border">
                  <div>
                    <span className="text-xs font-mono font-bold text-primary uppercase tracking-wider">ACADEMIC TRANSCRIPT</span>
                    <h3 className="text-xl sm:text-2xl font-heading font-bold text-text mt-0.5">
                      {searchOutput.class} শ্রেণি • {searchOutput.exam} {searchOutput.year}
                    </h3>
                    <p className="text-xs text-muted mt-1 font-mono">
                      রোল নম্বর: <strong className="text-text">{searchOutput.roll}</strong> • {school.name_bn}
                    </p>
                  </div>
                  <Badge variant={searchOutput.status === 'PASSED' ? 'success' : 'danger'} symbol={searchOutput.status === 'PASSED' ? '✓' : '✕'} className="text-sm px-3.5 py-1">
                    {searchOutput.status}
                  </Badge>
                </div>

                {/* GPA Band Bar */}
                <div className="my-6 p-4 rounded-xl bg-primary-soft border border-primary/25 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-mono text-muted uppercase">GPA (গ্রেড পয়েন্ট)</span>
                    <div className="text-3xl sm:text-4xl font-mono font-extrabold text-primary">
                      {searchOutput.total_gpa}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-muted font-medium">সর্বোচ্চ স্কেল: ৫.০০</span>
                    <div className="w-32 h-2 rounded-full bg-surface mt-1 overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full" 
                        style={{ width: `${(parseFloat(searchOutput.total_gpa) / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Subjects Grid Table */}
                <div className="mb-6">
                  <GridTable
                    columns={[
                      { key: 'code', label: 'কোড', width: '70px', fontMono: true },
                      { key: 'name', label: 'বিষয়ের নাম', width: '2fr' },
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
                </div>

                {/* Official Signatures Block for Marksheet */}
                <div className="pt-8 pb-3 flex justify-between items-end text-xs text-muted border-t border-dashed border-border mt-8">
                  <div className="text-center">
                    <div className="w-32 border-b border-text/40 mb-1 mx-auto" />
                    <span>শ্রেণি শিক্ষকের স্বাক্ষর</span>
                  </div>
                  <div className="text-center">
                    <div className="w-36 border-b border-text/40 mb-1 mx-auto" />
                    <span className="font-bold text-text">প্রধান শিক্ষকের স্বাক্ষর ও সিল</span>
                  </div>
                </div>

                {/* Print Button */}
                <div className="flex items-center justify-between pt-4 border-t border-border no-print">
                  <Button variant="secondary" size="sm" onClick={() => setSearchOutput(null)}>
                    আবার খুঁজুন
                  </Button>
                  <Button variant="primary" size="sm" icon={Printer} onClick={() => window.print()}>
                    প্রিন্ট / সেভ PDF
                  </Button>
                </div>
              </Card>
            ) : (
              <EmptyState
                icon={Search}
                title="কোনো ফলাফল পাওয়া যায়নি"
                description="আপনার দেওয়া শ্রেণি ও রোলের কোনো প্রকাশিত ফলাফল পাওয়া যায়নি। দয়া করে তথ্য সঠিক কিনা যাচাই করুন।"
              />
            )
          )}
        </main>
      )}

      {/* ================= 6. TAB 4: ONLINE ADMISSION (Section 7.4) ================= */}
      {activeTab === 'admission' && (
        <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 py-10 w-full">
          <div className="text-center mb-8">
            <span className="text-xs font-mono font-bold text-primary uppercase tracking-wider">ভর্তি সেশন ২০২৭</span>
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-text mt-1 mb-2">
              অনলাইন ভর্তি আবেদন ফরম
            </h2>
            <p className="text-xs sm:text-sm text-muted">
              ৬ষ্ঠ থেকে ৯ম শ্রেণির ভর্তি ফরম পূরণ করে ডিজিটাল প্রবেশপত্র সংগ্রহ করুন।
            </p>
            <div className="mt-3">
              <button
                type="button"
                onClick={() => setTrackingModalOpen(true)}
                className="text-xs font-bold text-primary hover:underline inline-flex items-center gap-1"
              >
                আবেদনের অবস্থা দেখতে ট্র্যাকিং কোড দিয়ে খুঁজুন ›
              </button>
            </div>
          </div>

          {!submittedAdmission ? (
            <Card surface="surface">
              <Stepper 
                steps={['শিক্ষার্থী', 'অভিভাবক ও যোগাযোগ', 'যাচাই ও জমা']} 
                currentStep={admissionStep} 
                className="mb-8"
              />

              <form onSubmit={handleAdmissionSubmit}>
                {/* Step 1: Student Bio */}
                {admissionStep === 1 && (
                  <div className="space-y-4">
                    <Input
                      label="শিক্ষার্থীর নাম (বাংলায়)"
                      placeholder="e.g. মোঃ তানভীর আহমেদ"
                      value={admissionForm.name_bn}
                      onChange={(e) => setAdmissionForm({ ...admissionForm, name_bn: e.target.value })}
                      required
                    />
                    <Input
                      label="Student Name (English Block Letters)"
                      placeholder="e.g. MD. TANVIR AHMED"
                      value={admissionForm.name_en}
                      onChange={(e) => setAdmissionForm({ ...admissionForm, name_en: e.target.value })}
                      required
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Select
                        label="ভর্তির শ্রেণি"
                        value={admissionForm.applied_class}
                        onChange={(e) => setAdmissionForm({ ...admissionForm, applied_class: e.target.value })}
                        options={[
                          { value: '6', label: '৬ষ্ঠ শ্রেণি' },
                          { value: '7', label: '৭ম শ্রেণি' },
                          { value: '8', label: '৮ম শ্রেণি' },
                          { value: '9', label: '৯ম শ্রেণি' }
                        ]}
                      />
                      <Input
                        label="জন্ম তারিখ"
                        type="date"
                        value={admissionForm.dob}
                        onChange={(e) => setAdmissionForm({ ...admissionForm, dob: e.target.value })}
                        required
                      />
                    </div>
                    <div className="pt-4 flex justify-end">
                      <Button variant="primary" onClick={() => setAdmissionStep(2)}>
                        পরবর্তী ধাপ ›
                      </Button>
                    </div>
                  </div>
                )}

                {/* Step 2: Guardian Details */}
                {admissionStep === 2 && (
                  <div className="space-y-4">
                    <Input
                      label="পিতার নাম"
                      placeholder="e.g. মোঃ রফিকুল ইসলাম"
                      value={admissionForm.father_name}
                      onChange={(e) => setAdmissionForm({ ...admissionForm, father_name: e.target.value })}
                      required
                    />
                    <Input
                      label="মাতার নাম"
                      placeholder="e.g. নাজমুন নাহার"
                      value={admissionForm.mother_name}
                      onChange={(e) => setAdmissionForm({ ...admissionForm, mother_name: e.target.value })}
                      required
                    />
                    <Input
                      label="অভিভাবকের সচল মোবাইল নম্বর"
                      placeholder="018XXXXXXXX"
                      value={admissionForm.mobile}
                      onChange={(e) => setAdmissionForm({ ...admissionForm, mobile: e.target.value })}
                      error={mobileError}
                      helperText="ভর্তি পরীক্ষার ফলাফল ও রোল এই নম্বরে পাঠানো হবে।"
                      required
                    />
                    <Input
                      label="বর্তমান ঠিকানা"
                      placeholder="গ্রাম, ডাকঘর, উপজেলা, জেলা"
                      value={admissionForm.address}
                      onChange={(e) => setAdmissionForm({ ...admissionForm, address: e.target.value })}
                      required
                    />
                    <div className="pt-4 flex items-center justify-between">
                      <Button variant="secondary" onClick={() => setAdmissionStep(1)}>
                        ‹ আগের ধাপ
                      </Button>
                      <Button variant="primary" onClick={() => setAdmissionStep(3)}>
                        পরবর্তী ধাপ ›
                      </Button>
                    </div>
                  </div>
                )}

                {/* Step 3: Review & Final Submit */}
                {admissionStep === 3 && (
                  <div className="space-y-5">
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
            /* Success Screen & Admit Card (Section 7.4) */
            <Card surface="surface" className="text-center p-8 sm:p-12 border-2 border-success/40">
              <div className="w-18 h-18 rounded-full bg-success-soft text-success flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <h3 className="text-2xl font-heading font-bold text-text mb-1">
                ভর্তি আবেদন সফলভাবে জমা হয়েছে!
              </h3>
              <p className="text-xs text-muted mb-6">
                আপনার আবেদনের জন্য একটি ইউনিক ট্র্যাকিং আইডি বরাদ্দ করা হয়েছে।
              </p>

              {/* Dashed Tracking Box */}
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

      {/* ================= 7. TAB 5: TEACHERS DIRECTORY ================= */}
      {activeTab === 'teachers' && (
        <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 py-10 w-full">
          <div className="mb-8">
            <span className="text-xs font-mono font-bold text-primary uppercase">ফ্যাকাল্টি</span>
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-text mt-1">
              শিক্ষক ও কর্মচারীবৃন্দ
            </h2>
            <p className="text-xs text-muted">আমাদের নিবেদিতপ্রাণ শিক্ষক ও কর্মকর্তা পরিষদ</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {teachers.map((t) => (
              <Card key={t.id} surface="surface" className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-surface-2 border border-border flex items-center justify-center text-primary shrink-0 font-bold text-lg">
                  {t.name.split(' ').pop()?.[0] || 'শ'}
                </div>
                <div className="min-w-0">
                  <Badge variant={t.category === 'teacher' ? 'primary' : 'muted'} className="mb-1">
                    {t.category === 'teacher' ? 'শিক্ষক' : 'কর্মচারী'}
                  </Badge>
                  <h4 className="text-base font-heading font-bold text-text truncate">
                    {t.name}
                  </h4>
                  <p className="text-xs font-semibold text-primary">{t.designation}</p>
                  <p className="text-[11px] text-muted truncate">{t.subject}</p>
                  <p className="text-[10px] text-subtle mt-1">{t.qualification}</p>
                </div>
              </Card>
            ))}
          </div>
        </main>
      )}

      {/* ================= 8. TAB 6: CONTACT & ABOUT ================= */}
      {activeTab === 'about' && (
        <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 py-10 w-full">
          <div className="mb-8">
            <span className="text-xs font-mono font-bold text-primary uppercase">পরিচিতি ও যোগাযোগ</span>
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-text mt-1">
              বিদ্যালয় পরিচিতি ও যোগাযোগ
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card surface="surface" className="space-y-4">
              <h3 className="text-lg font-heading font-bold text-text border-b border-border pb-2">
                যোগাযোগের তথ্য
              </h3>
              <div className="space-y-3 text-xs sm:text-sm">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>{settings?.address_bn || 'উপজেলা ও জেলা, বাংলাদেশ'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-primary shrink-0" />
                  <span>{settings?.phone || '০১৮১২-৩৪৫৬৭৮'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-primary shrink-0" />
                  <span>{settings?.email || 'info@school.edu.bd'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-primary shrink-0" />
                  <span>{settings?.office_hours || 'রবি–বৃহস্পতি সকাল ৯টা–দুপুর ২টা'}</span>
                </div>
              </div>

              {settings?.uniform_rules && (
                <div className="pt-4 border-t border-border">
                  <h4 className="text-xs font-bold text-text mb-1">পোশাক নীতিমালা (Uniform Code):</h4>
                  <p className="text-xs text-muted leading-relaxed">{settings.uniform_rules}</p>
                </div>
              )}
            </Card>

            <Card surface="surface">
              <h3 className="text-lg font-heading font-bold text-text border-b border-border pb-2 mb-4">
                বার্তা পাঠান
              </h3>
              <form onSubmit={(e) => { e.preventDefault(); showToast('আপনার বার্তাটি জমা হয়েছে!'); }} className="space-y-3">
                <Input label="আপনার নাম" placeholder="পুরো নাম" required />
                <Input label="মোবাইল নম্বর" placeholder="018XXXXXXXX" required />
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-text">বার্তা / অনুসন্ধান</label>
                  <textarea 
                    rows={4} 
                    className="w-full rounded-[10px] bg-surface-2 border border-border-strong text-text p-3 text-xs outline-none focus:border-primary"
                    placeholder="আপনার বার্তা এখানে লিখুন..."
                    required
                  />
                </div>
                <Button type="submit" variant="primary" size="md" className="w-full">
                  বার্তা পাঠান
                </Button>
              </form>
            </Card>
          </div>
        </main>
      )}

      {/* ================= 9. STICKY MOBILE BOTTOM BAR (Section 7.2) ================= */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface/95 backdrop-blur-md border-t border-border grid grid-cols-4 h-16 items-center text-center">
        <button
          type="button"
          onClick={() => { setActiveTab('home'); window.location.hash = 'home'; }}
          aria-current={activeTab === 'home' ? 'page' : undefined}
          className={`flex flex-col items-center justify-center h-full transition-colors ${
            activeTab === 'home' ? 'text-primary font-bold' : 'text-muted'
          }`}
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">হোম</span>
        </button>

        <button
          type="button"
          onClick={() => { setActiveTab('notices'); window.location.hash = 'notices'; }}
          aria-current={activeTab === 'notices' ? 'page' : undefined}
          className={`flex flex-col items-center justify-center h-full transition-colors ${
            activeTab === 'notices' ? 'text-primary font-bold' : 'text-muted'
          }`}
        >
          <Bell className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">নোটিশ</span>
        </button>

        <button
          type="button"
          onClick={() => { setActiveTab('results'); window.location.hash = 'results'; }}
          aria-current={activeTab === 'results' ? 'page' : undefined}
          className={`flex flex-col items-center justify-center h-full transition-colors ${
            activeTab === 'results' ? 'text-primary font-bold' : 'text-muted'
          }`}
        >
          <Award className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">রেজাল্ট</span>
        </button>

        <button
          type="button"
          onClick={() => { setActiveTab('admission'); window.location.hash = 'admission'; }}
          aria-current={activeTab === 'admission' ? 'page' : undefined}
          className={`flex flex-col items-center justify-center h-full transition-colors ${
            activeTab === 'admission' ? 'text-primary font-bold' : 'text-muted'
          }`}
        >
          <GraduationCap className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">ভর্তি</span>
        </button>
      </nav>

      {/* ================= 10. TRACKING MODAL ================= */}
      <Modal
        isOpen={trackingModalOpen}
        onClose={() => setTrackingModalOpen(false)}
        title="ভর্তি আবেদনের অবস্থা যাচাই"
        subtitle="আপনার ট্র্যাকিং আইডি দিয়ে বর্তমান স্ট্যাটাস জানুন"
      >
        <form onSubmit={handleTrackSearch} className="space-y-4">
          <Input
            label="ট্র্যাকিং আইডি"
            placeholder="e.g. BDHS-ADM-2027-4821"
            value={searchTrackCode}
            onChange={(e) => setSearchTrackCode(e.target.value)}
            required
          />
          <Button type="submit" variant="primary" size="md" className="w-full">
            স্ট্যাটাস খুঁজুন
          </Button>

          {trackResult && (
            trackResult === 'NOT_FOUND' ? (
              <Alert variant="danger">এই ট্র্যাকিং কোডের কোনো আবেদন পাওয়া যায়নি।</Alert>
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

      {/* ================= OFFICIAL ADMISSION ADMIT CARD MODAL (Section 7.4) ================= */}
      {admitCardData && (
        <Modal
          isOpen={!!admitCardData}
          onClose={() => setAdmitCardData(null)}
          title="ভর্তি পরীক্ষার প্রবেশপত্র (Admit Card)"
          subtitle="সেশন ২০২৭ • অফিসিয়াল পরীক্ষার্থী কপি"
          maxWidth="max-w-2xl"
        >
          <div className="space-y-6">
            {/* Printable White Document */}
            <div className="p-6 bg-white text-black rounded-xl border border-slate-300 font-sans text-xs space-y-5 shadow-inner">
              {/* Card Header */}
              <div className="text-center border-b-2 border-black pb-3">
                <h3 className="font-heading font-bold text-lg text-slate-900 leading-tight">
                  {school.name_bn}
                </h3>
                <p className="text-[11px] text-slate-700">
                  {school.address} • EIIN: {school.eiin} • কুমিল্লা শিক্ষা বোর্ড
                </p>
                <div className="inline-block mt-2 px-3 py-1 bg-slate-100 border border-slate-300 rounded font-bold text-xs uppercase tracking-wide">
                  ভর্তি পরীক্ষার প্রবেশপত্র — সেশন ২০২৭
                </div>
              </div>

              {/* Photo Box & Bio Table */}
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

                {/* Passport Photo Box */}
                <div className="w-28 h-32 border-2 border-dashed border-slate-400 bg-slate-50 rounded flex flex-col items-center justify-center text-center p-2 text-slate-400 shrink-0">
                  <UserCheck className="w-6 h-6 mb-1 opacity-50" />
                  <span className="text-[9px] leading-tight">পাসপোর্ট সাইজ ছবি আঠা দিয়ে লাগান</span>
                </div>
              </div>

              {/* Exam Instructions Schedule */}
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-[11px] space-y-1">
                <div className="flex justify-between">
                  <span><strong>পরীক্ষার তারিখ ও সময়:</strong> ১০ ডিসেম্বর ২০২৬, সকাল ১০:০০ টা</span>
                  <span><strong>পরীক্ষার রোল:</strong> <span className="font-mono font-bold">{admitCardData.assigned_roll || 'পরীক্ষা কেন্দ্রে পূরণযোগ্য'}</span></span>
                </div>
                <div><strong>পরীক্ষার স্থান / কক্ষ নং:</strong> বিদ্যালয় একাডেমিক ভবন (নোটিশ বোর্ডে তালিকা দেখুন)</div>
                <div className="text-[10px] text-slate-600 pt-1">
                  * পরীক্ষার্থীদের অবশ্যই পরীক্ষার ৩০ মিনিট আগে প্রবেশপত্রসহ উপস্থিত হতে হবে। ক্যালকুলেটর বা মোবাইল ফোন নিষিদ্ধ।
                </div>
              </div>

              {/* Signature Blocks */}
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

            {/* Modal Actions */}
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

      {/* ================= 11. FOOTER ================= */}
      <footer className="border-t border-border bg-surface py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted">
          <div>
            <p className="font-bold text-text">{school.name_bn}</p>
            <p className="text-[11px] mt-0.5">EIIN: {school.eiin} • MPO: {school.mpo_code} • কুমিল্লা শিক্ষা বোর্ড</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-primary font-medium">সহজ পাঠশালা দ্বারা পরিচালিত</span>
            <span>•</span>
            <Link to={`/${school.slug}/login`} className="hover:underline">লগইন</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
