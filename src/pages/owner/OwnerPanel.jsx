import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../hooks/useTheme';
import { TenantRepository, hashPassword } from '../../services/tenantStorage';
import { ownerTranslations } from '../../i18n/owner';
import ThemeToggle from '../../components/common/ThemeToggle';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Badge from '../../components/ui/Badge';
import FilterChip from '../../components/ui/FilterChip';
import GridTable from '../../components/ui/GridTable';
import Modal from '../../components/ui/Modal';
import { useToast } from '../../components/ui/ToastContext';
import { 
  Building2, 
  Users, 
  Plus, 
  Search, 
  Globe,
  ExternalLink, 
  Eye, 
  Key, 
  Calendar, 
  ShieldCheck, 
  ArrowLeft, 
  CheckCircle2, 
  Copy,
  Clock,
  Layers,
  Sparkles,
  LogOut,
  Save,
  Trash2,
  HelpCircle,
  Phone,
  Mail,
  Quote,
  LayoutTemplate
} from 'lucide-react';

export default function OwnerPanel() {
  const navigate = useNavigate();
  const { currentUser, login, logout, enterSupportMode } = useAuth();
  const { mode, toggleMode } = useTheme({ isOwner: true });
  const { showToast } = useToast();

  const [lang, setLang] = useState(() => localStorage.getItem('owner_lang') || 'bn');
  const t = ownerTranslations[lang] || ownerTranslations.bn;

  // D03: Owner Authentication State
  const [ownerUsername, setOwnerUsername] = useState('owner');
  const [ownerPassword, setOwnerPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const [activeTab, setActiveTab] = useState('schools'); // 'schools', 'audit', 'plans', 'cms'
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Landing Page CMS State
  const [landingForm, setLandingForm] = useState(() => TenantRepository.getLandingSettings());
  const [cmsSaved, setCmsSaved] = useState(false);
  const [newFaq, setNewFaq] = useState({ q: '', a: '' });

  // Onboarding Modal State
  const [onboardModalOpen, setOnboardModalOpen] = useState(false);
  const [createdResult, setCreatedResult] = useState(null);
  const [onboardError, setOnboardError] = useState('');

  const [onboardForm, setOnboardForm] = useState({
    name_bn: '',
    name_en: '',
    slug: '',
    eiin: '',
    school_code: '',
    mpo_code: '',
    board: 'কুমিল্লা',
    district: '',
    code_prefix: '',
    theme: 'emerald',
    plan: 'standard',
    expires_at: '2027-12-31',
    max_students: 1000,
    admin_username: 'admin'
  });

  // Password Reset Modal State
  const [confirmResetSchool, setConfirmResetSchool] = useState(null);
  const [resetModalSchool, setResetModalSchool] = useState(null);
  const [newTempPassword, setNewTempPassword] = useState('');

  const schools = TenantRepository.getSchools();
  const allStudents = TenantRepository.getStudents('sch_bdhs').concat(TenantRepository.getStudents('sch_bahs'));
  const auditLogs = TenantRepository.getAuditLogs(null);

  const activeSchools = schools.filter(s => s.status === 'active');
  const expiringSoonSchools = schools.filter(s => {
    const d = Math.ceil((new Date(s.expires_at) - new Date()) / (1000 * 60 * 60 * 24));
    return d <= 30;
  });

  const toggleLanguage = () => {
    const nextLang = lang === 'bn' ? 'en' : 'bn';
    setLang(nextLang);
    localStorage.setItem('owner_lang', nextLang);
  };

  const handleOwnerLogin = (e) => {
    e.preventDefault();
    setLoginError('');
    try {
      login(ownerUsername, ownerPassword, null);
      showToast(lang === 'bn' ? 'সুপার অ্যাডমিন হিসেবে সফলভাবে লগইন হয়েছে' : 'Successfully logged in as Super Admin');
    } catch (err) {
      setLoginError(err.message || 'অথেনটিকেশন ব্যর্থ হয়েছে');
    }
  };

  const handleSaveCms = (e) => {
    if (e) e.preventDefault();
    TenantRepository.updateLandingSettings(landingForm);
    setCmsSaved(true);
    showToast(lang === 'bn' ? 'ল্যান্ডিং পেজের সকল কনটেন্ট সফলভাবে সংরক্ষিত হয়েছে!' : 'Landing Page content saved successfully!');
    setTimeout(() => setCmsSaved(false), 3000);
  };

  const handleAddFaq = () => {
    if (!newFaq.q.trim() || !newFaq.a.trim()) return;
    setLandingForm(prev => ({
      ...prev,
      faqs: [...(prev.faqs || []), { q: newFaq.q.trim(), a: newFaq.a.trim() }]
    }));
    setNewFaq({ q: '', a: '' });
  };

  const handleRemoveFaq = (index) => {
    setLandingForm(prev => ({
      ...prev,
      faqs: prev.faqs.filter((_, i) => i !== index)
    }));
  };

  const filteredSchools = schools.filter(s => {
    if (statusFilter !== 'all' && s.status !== statusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        s.name_bn.toLowerCase().includes(q) ||
        s.name_en.toLowerCase().includes(q) ||
        s.slug.toLowerCase().includes(q) ||
        s.eiin.includes(q)
      );
    }
    return true;
  });

  // Handle New School Onboarding
  const handleOnboardSubmit = (e) => {
    e.preventDefault();
    setOnboardError('');

    const cleanSlug = (onboardForm.slug || '').toLowerCase().trim();
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(cleanSlug)) {
      setOnboardError('Slug শুধুমাত্র ছোট হাতের ইংরেজি অক্ষর (a-z), সংখ্যা (0-9) এবং হাইফেন (-) হতে পারে। স্পেস বা চিহ্ন চলবে না।');
      return;
    }
    const reserved = ['owner', 'admin', 'api', 'login', 'superadmin', 'platform', 'system', 'root', 'public'];
    if (reserved.includes(cleanSlug)) {
      setOnboardError(`"${cleanSlug}" একটি সংরক্ষিত সিস্টেম নাম। এটি ব্যবহার করা যাবে না।`);
      return;
    }

    try {
      const result = TenantRepository.createSchool({
        ...onboardForm,
        slug: cleanSlug
      }, {
        username: onboardForm.admin_username,
        name: `অ্যাডমিন (${onboardForm.name_bn})`
      });

      setCreatedResult(result);
      showToast(lang === 'bn' ? 'নতুন স্কুল সফলভাবে অনবোর্ড করা হয়েছে!' : 'New school onboarded successfully!');
    } catch (err) {
      setOnboardError(err.message);
    }
  };

  // Handle Support Mode
  const handleEnterSupport = (school) => {
    try {
      enterSupportMode(school);
      navigate(`/${school.slug}/admin`);
    } catch (err) {
      showToast(err.message || 'সাপোর্ট মোডে প্রবেশে সমস্যা হয়েছে', 'error');
    }
  };

  // Handle Admin Password Reset (Confirmed)
  const handleAdminPasswordReset = (school) => {
    try {
      const tempPass = `Pass@${Math.floor(1000 + Math.random() * 9000)}`;
      const schoolUsers = TenantRepository.getUsers(school.id);
      const superAdmin = schoolUsers.find(u => u.role === 'school_superadmin');

      if (superAdmin) {
        TenantRepository.updateUser(superAdmin.id, {
          password: hashPassword(tempPass),
          failed_attempts: 0,
          locked_until: null,
          must_change_password: true
        });
        setNewTempPassword(tempPass);
        setResetModalSchool(school);
        setConfirmResetSchool(null);
        showToast(lang === 'bn' ? 'অস্থায়ী পাসওয়ার্ড সফলভাবে তৈরি হয়েছে!' : 'Temporary password generated successfully!');
      } else {
        showToast(lang === 'bn' ? 'স্কুল অ্যাডমিন ইউজার পাওয়া যায়নি।' : 'School admin user not found.', 'error');
      }
    } catch (err) {
      showToast(err.message || 'পাসওয়ার্ড রিসেট করা যায়নি', 'error');
    }
  };

  // D03: If not logged in as platform_owner, show Owner Login Screen
  if (!currentUser || currentUser.role !== 'platform_owner') {
    return (
      <div className="min-h-screen bg-bg text-text flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-surface rounded-2xl border border-border p-8 shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-indigo text-white font-heading font-bold text-2xl flex items-center justify-center mx-auto shadow-md">
              সপ
            </div>
            <h1 className="text-2xl font-heading font-bold text-text">সহজ পাঠশালা · Platform Core</h1>
            <p className="text-xs text-muted">প্ল্যাটফর্ম Owner অথেনটিকেশন ও কেন্দ্রীয় নিয়ন্ত্রণ</p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-danger-soft text-danger text-[11px] font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" /> শুধুমাত্র অনুমোদিত Platform Owner-দের জন্য
            </div>
          </div>

          {loginError && (
            <div className="p-3 rounded-xl bg-danger-soft border border-danger/30 text-xs text-danger font-semibold text-center">
              {loginError}
            </div>
          )}

          <form onSubmit={handleOwnerLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-text mb-1">Owner ইউজারনেম</label>
              <Input
                value={ownerUsername}
                onChange={(e) => setOwnerUsername(e.target.value)}
                required
                placeholder="যেমন: owner"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-text mb-1">পাসওয়ার্ড</label>
              <Input
                type="password"
                value={ownerPassword}
                onChange={(e) => setOwnerPassword(e.target.value)}
                required
                placeholder="আপনার গোপন পাসওয়ার্ড দিন"
              />
            </div>

            <div className="p-2.5 rounded-xl bg-surface-2 border border-border text-[11px] text-muted space-y-1">
              <span className="font-semibold text-text block">ডিফল্ট Owner ক্রেডেনশিয়াল:</span>
              <span className="font-mono">ইউজার: <strong className="text-text">owner</strong> | পাসওয়ার্ড: <strong className="text-text">password123</strong></span>
            </div>

            <Button type="submit" variant="primary" className="w-full bg-indigo hover:bg-indigo/90">
              প্ল্যাটফর্ম সেন্টারে প্রবেশ করুন
            </Button>
          </form>

          <div className="text-center pt-2">
            <Link to="/" className="text-xs text-muted hover:text-text">
              ← প্ল্যাটফর্মের পাবলিক হোমপেজে ফিরে যান
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg text-text flex flex-col font-sans transition-colors duration-200">
      
      {/* ================= 1. OWNER TOP BAR & HEADER ================= */}
      <header className="sticky top-0 z-40 bg-surface/90 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-indigo text-white font-heading font-bold text-base flex items-center justify-center shadow-md">
                সপ
              </div>
              <div>
                <span className="text-lg font-heading font-bold text-text leading-tight block">
                  {t.brand_title} <strong className="text-indigo">· {t.owner_badge}</strong>
                </span>
                <span className="text-[11px] text-muted font-mono tracking-wide">Multi-School Platform Core</span>
              </div>
            </Link>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-2 p-1 rounded-xl bg-surface-2 border border-border">
            <button
              type="button"
              onClick={() => setActiveTab('schools')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'schools' ? 'bg-indigo text-white shadow-xs' : 'text-muted hover:text-text'
              }`}
            >
              {t.schools}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('plans')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'plans' ? 'bg-indigo text-white shadow-xs' : 'text-muted hover:text-text'
              }`}
            >
              {t.plans_validity}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('cms')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'cms' ? 'bg-indigo text-white shadow-xs' : 'text-muted hover:text-text'
              }`}
            >
              ল্যান্ডিং পেজ (CMS)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('audit')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'audit' ? 'bg-indigo text-white shadow-xs' : 'text-muted hover:text-text'
              }`}
            >
              {t.audit_log}
            </button>
          </nav>

          {/* Right Controls: Language & Mode Toggle */}
          <div className="flex items-center gap-3">
            {/* Language Switcher */}
            <button
              type="button"
              onClick={toggleLanguage}
              className="px-3 h-10 rounded-[10px] bg-surface-2 hover:bg-surface border border-border-strong text-xs font-bold text-text cursor-pointer transition-colors"
            >
              {lang === 'bn' ? 'English' : 'বাংলা'}
            </button>

            <ThemeToggle mode={mode} toggleMode={toggleMode} lang={lang} />

            {/* Logout Button */}
            <Button
              variant="secondary"
              size="sm"
              icon={LogOut}
              onClick={logout}
              title={t.logout}
              className="h-10 text-xs text-danger border-danger/30 hover:bg-danger-soft cursor-pointer"
            >
              {t.logout}
            </Button>
          </div>
        </div>
      </header>

      {/* ================= 2. MAIN WORKSPACE ================= */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-8 w-full space-y-8">
        
        {/* Metric Cards (Section 7.7) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <Card surface="surface" shadow className="flex items-center justify-between">
            <div>
              <span className="text-xs text-muted block mb-1 font-medium">{t.total_schools}</span>
              <p className="text-3xl font-mono font-extrabold text-indigo">
                {schools.length.toLocaleString(lang === 'bn' ? 'bn-BD' : 'en-US')}
              </p>
              <span className="text-[11px] text-muted">{t.total_schools_sub}</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-indigo-soft text-indigo flex items-center justify-center shrink-0">
              <Building2 className="w-6 h-6" />
            </div>
          </Card>

          <Card surface="surface" shadow className="flex items-center justify-between">
            <div>
              <span className="text-xs text-muted block mb-1 font-medium">{t.active_schools}</span>
              <p className="text-3xl font-mono font-extrabold text-success">
                {activeSchools.length.toLocaleString(lang === 'bn' ? 'bn-BD' : 'en-US')}
              </p>
              <span className="text-[11px] text-muted">{t.active_schools_sub}</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-success-soft text-success flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </Card>

          <Card surface="surface" shadow className="flex items-center justify-between">
            <div>
              <span className="text-xs text-muted block mb-1 font-medium">{t.total_students}</span>
              <p className="text-3xl font-mono font-extrabold text-primary">
                {allStudents.length.toLocaleString(lang === 'bn' ? 'bn-BD' : 'en-US')}
              </p>
              <span className="text-[11px] text-muted">{t.total_students_sub}</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-primary-soft text-primary flex items-center justify-center shrink-0">
              <Users className="w-6 h-6" />
            </div>
          </Card>

          <Card surface="surface" shadow className="flex items-center justify-between">
            <div>
              <span className="text-xs text-muted block mb-1 font-medium">{t.expiring_soon}</span>
              <p className="text-3xl font-mono font-extrabold text-warning">
                {expiringSoonSchools.length.toLocaleString(lang === 'bn' ? 'bn-BD' : 'en-US')}
              </p>
              <span className="text-[11px] text-muted">{t.expiring_soon_sub}</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-warning-soft text-warning flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6" />
            </div>
          </Card>
        </div>

        {/* Tab 1: Schools Directory */}
        {activeTab === 'schools' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-heading font-bold text-text">{t.schools}</h2>
                <p className="text-xs text-muted">{t.school_management_sub}</p>
              </div>

              <Button 
                variant="primary" 
                size="md" 
                icon={Plus} 
                className="bg-indigo hover:bg-indigo/90"
                onClick={() => {
                  setCreatedResult(null);
                  setOnboardModalOpen(true);
                }}
              >
                {t.add_school}
              </Button>
            </div>

            {/* Filter and Search Bar */}
            <Card surface="surface" className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
                <FilterChip selected={statusFilter === 'all'} onClick={() => setStatusFilter('all')}>
                  {t.all}
                </FilterChip>
                <FilterChip selected={statusFilter === 'active'} onClick={() => setStatusFilter('active')}>
                  {t.active}
                </FilterChip>
                <FilterChip selected={statusFilter === 'grace'} onClick={() => setStatusFilter('grace')}>
                  {t.grace}
                </FilterChip>
                <FilterChip selected={statusFilter === 'suspended'} onClick={() => setStatusFilter('suspended')}>
                  {t.suspended}
                </FilterChip>
              </div>

              <div className="w-full sm:w-72">
                <Input
                  placeholder={t.search_placeholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  icon={Search}
                />
              </div>
            </Card>

            {/* Schools Grid Table */}
            <GridTable
              columns={[
                { key: 'name_bn', label: t.col_school, width: '2fr' },
                { key: 'slug', label: t.col_slug, width: '100px', fontMono: true },
                { key: 'eiin', label: t.col_eiin, width: '90px', fontMono: true },
                { 
                  key: 'plan', 
                  label: t.col_plan, 
                  width: '100px',
                  render: (val) => (
                    <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold uppercase border border-indigo/40 bg-indigo-soft text-indigo">
                      {val}
                    </span>
                  )
                },
                {
                  key: 'status',
                  label: t.col_status,
                  width: '100px',
                  render: (val) => (
                    <Badge variant={val === 'active' ? 'success' : val === 'grace' ? 'warning' : 'danger'} symbol="●">
                      {val === 'active' ? t.active : val === 'grace' ? t.grace : t.suspended}
                    </Badge>
                  )
                },
                { key: 'expires_at', label: t.col_expires, width: '110px', fontMono: true },
                {
                  key: 'actions',
                  label: t.col_actions,
                  width: '320px',
                  align: 'right',
                  noTruncate: true,
                  render: (_, row) => (
                    <div className="flex items-center justify-end gap-2">
                      <Button 
                        href={`/${row.slug}`}
                        target="_blank"
                        variant="outline" 
                        size="sm" 
                        icon={Globe}
                        title={lang === 'bn' ? `${row.name_bn}-এর ওয়েবসাইট দেখুন (নতুন ট্যাবে)` : `Visit ${row.name_en || row.slug} Website (new tab)`}
                      >
                        {t.btn_site}
                      </Button>
                      <Button 
                        variant="outlineIndigo" 
                        size="sm" 
                        icon={Eye}
                        onClick={() => handleEnterSupport(row)}
                        title={lang === 'bn' ? 'সাপোর্ট মোডে ড্যাশবোর্ড দেখুন' : 'Enter Support Mode'}
                      >
                        {t.btn_support}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={Key}
                        onClick={() => setConfirmResetSchool(row)}
                        title={t.btn_reset_pass}
                        className="text-muted hover:text-text hover:bg-surface-2 shrink-0 cursor-pointer"
                      />
                    </div>
                  )
                }
              ]}
              data={filteredSchools}
              minWidth="960px"
            />
          </div>
        )}

        {/* Tab 2: Global Audit Log */}
        {activeTab === 'audit' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-heading font-bold text-text">{t.audit_log}</h2>
              <p className="text-xs text-muted">{t.audit_log_sub}</p>
            </div>

            <GridTable
              columns={[
                { key: 'created_at', label: 'সময়কাল', width: '150px', fontMono: true },
                { key: 'school_id', label: 'স্কুল আইডি', width: '120px', fontMono: true, render: (val) => val || 'Platform' },
                { key: 'username', label: 'ইউজার', width: '120px', fontMono: true },
                { key: 'role', label: 'রোল', width: '130px' },
                { 
                  key: 'action', 
                  label: 'কাজ', 
                  width: '160px',
                  render: (_, row) => (
                    <span className="font-bold text-text">
                      {lang === 'en' ? row.action_en || row.action : row.action}
                    </span>
                  )
                },
                { key: 'details', label: 'বিবরণ', width: '2fr' }
              ]}
              data={auditLogs}
              minWidth="880px"
            />
          </div>
        )}

        {/* Tab 3: Plans & Validity (D25) */}
        {activeTab === 'plans' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-heading font-bold text-text">{t.plans_validity}</h2>
              <p className="text-xs text-muted">{t.plans_sub}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Basic Plan */}
              <Card surface="surface" className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <Badge variant="muted">বেসিক প্ল্যান (Basic)</Badge>
                  <span className="text-xs font-mono font-bold text-muted">
                    {schools.filter(s => s.plan === 'basic').length} স্কুল সক্রিয়
                  </span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold font-mono text-text">Basic</h3>
                  <p className="text-xs text-muted mt-0.5">ছোট ও প্রাথমিক স্তরের প্রতিষ্ঠান</p>
                </div>
                <div className="pt-2 border-t border-border space-y-2 text-xs">
                  <div className="flex items-center justify-between"><span className="text-muted">শিক্ষার্থী সীমা:</span><strong className="font-mono">৫০০ জন</strong></div>
                  <div className="flex items-center justify-between"><span className="text-muted">পাবলিক ওয়েবসাইট:</span><span className="text-success font-semibold">✓ সক্রিয়</span></div>
                  <div className="flex items-center justify-between"><span className="text-muted">অনলাইন ভর্তি:</span><span className="text-danger font-semibold">✕ অন্তর্ভুক্ত নয়</span></div>
                  <div className="flex items-center justify-between"><span className="text-muted">ফি ও রসিদ আদায়:</span><span className="text-danger font-semibold">✕ অন্তর্ভুক্ত নয়</span></div>
                  <div className="flex items-center justify-between"><span className="text-muted">রেজাল্ট প্রকাশ:</span><span className="text-danger font-semibold">✕ অন্তর্ভুক্ত নয়</span></div>
                </div>
              </Card>

              {/* Standard Plan */}
              <Card surface="surface" className="p-6 space-y-4 border-2 border-indigo">
                <div className="flex items-center justify-between">
                  <Badge variant="indigo">স্ট্যান্ডার্ড প্ল্যান (Standard)</Badge>
                  <span className="text-xs font-mono font-bold text-indigo">
                    {schools.filter(s => s.plan === 'standard').length} স্কুল সক্রিয়
                  </span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold font-mono text-indigo">Standard</h3>
                  <p className="text-xs text-muted mt-0.5">মাধ্যমিক স্তরের বিদ্যালয় ও মাদ্রাসা</p>
                </div>
                <div className="pt-2 border-t border-border space-y-2 text-xs">
                  <div className="flex items-center justify-between"><span className="text-muted">শিক্ষার্থী সীমা:</span><strong className="font-mono">১৫০০ জন</strong></div>
                  <div className="flex items-center justify-between"><span className="text-muted">পাবলিক ওয়েবসাইট:</span><span className="text-success font-semibold">✓ সক্রিয়</span></div>
                  <div className="flex items-center justify-between"><span className="text-muted">অনলাইন ভর্তি ও এডমিট:</span><span className="text-success font-semibold">✓ সক্রিয়</span></div>
                  <div className="flex items-center justify-between"><span className="text-muted">রেজাল্ট ও মার্কশিট:</span><span className="text-success font-semibold">✓ সক্রিয়</span></div>
                  <div className="flex items-center justify-between"><span className="text-muted">ফি ও ডিজিটাল রসিদ:</span><span className="text-success font-semibold">✓ সক্রিয়</span></div>
                </div>
              </Card>

              {/* Premium Plan */}
              <Card surface="surface" className="p-6 space-y-4 border border-primary/40">
                <div className="flex items-center justify-between">
                  <Badge variant="primary">প্রিমিয়াম প্ল্যান (Premium)</Badge>
                  <span className="text-xs font-mono font-bold text-primary">
                    {schools.filter(s => s.plan === 'premium').length} স্কুল সক্রিয়
                  </span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold font-mono text-primary">Premium</h3>
                  <p className="text-xs text-muted mt-0.5">বৃহৎ বিদ্যাপীঠ, কলেজ ও মডেল স্কুল</p>
                </div>
                <div className="pt-2 border-t border-border space-y-2 text-xs">
                  <div className="flex items-center justify-between"><span className="text-muted">শিক্ষার্থী সীমা:</span><strong className="font-mono text-primary">আনলিমিটেড</strong></div>
                  <div className="flex items-center justify-between"><span className="text-muted">সব স্ট্যান্ডার্ড ফিচার:</span><span className="text-success font-semibold">✓ অন্তর্ভুক্ত</span></div>
                  <div className="flex items-center justify-between"><span className="text-muted">এসএমএস গেটওয়ে:</span><span className="text-success font-semibold">✓ সক্রিয়</span></div>
                  <div className="flex items-center justify-between"><span className="text-muted">কাস্টম ডোমেইন সাপোর্ট:</span><span className="text-success font-semibold">✓ সক্রিয়</span></div>
                  <div className="flex items-center justify-between"><span className="text-muted">২৪/৭ প্রায়োরিটি সাপোর্ট:</span><span className="text-success font-semibold">✓ সক্রিয়</span></div>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* ================= 5. LANDING PAGE CMS TAB (SUPER ADMIN ONLY) ================= */}
        {activeTab === 'cms' && (
          <div className="space-y-8 animate-fade-in">
            {/* Top Bar for CMS */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5 rounded-2xl bg-surface border border-border shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-indigo/10 text-indigo flex items-center justify-center">
                  <LayoutTemplate className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-heading font-bold text-text">
                    ল্যান্ডিং পেজ কনটেন্ট ম্যানেজমেন্ট (CMS)
                  </h2>
                  <p className="text-xs text-muted mt-0.5">
                    মূল পাবলিক ল্যান্ডিং পেজের টেক্সট, হেডলাইন, মডিউল, প্রাইসিং প্ল্যান ও প্রায়শই জিজ্ঞাসিত প্রশ্ন সরাসরি পরিবর্তন ও সেভ করুন।
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  to="/"
                  target="_blank"
                  className="px-3.5 py-2 rounded-xl border border-border text-xs font-semibold text-text hover:bg-surface-2 transition-colors flex items-center gap-1.5"
                >
                  <ExternalLink className="w-4 h-4 text-muted" />
                  লাইভ প্রিভিউ দেখুন
                </Link>
                <Button
                  variant="primary"
                  className="bg-indigo hover:bg-indigo/90 shadow-sm"
                  icon={Save}
                  onClick={handleSaveCms}
                >
                  {cmsSaved ? 'সংরক্ষিত হয়েছে!' : 'সব পরিবর্তন সেভ করুন'}
                </Button>
              </div>
            </div>

            {/* Section 1: Hero & Contact Settings */}
            <Card surface="surface" className="p-6 space-y-6 border border-border">
              <div className="flex items-center gap-2 pb-3 border-b border-border">
                <Sparkles className="w-5 h-5 text-indigo" />
                <h3 className="text-base font-heading font-bold text-text">হিরো ব্যানার ও হেডলাইন</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="হিরো ব্যাজ ট্যাগলাইন (Badge Tag)"
                  value={landingForm.hero_tag || ''}
                  onChange={(e) => setLandingForm({ ...landingForm, hero_tag: e.target.value })}
                  placeholder="যেমন: মাল্টি-স্কুল প্ল্যাটফর্ম · বাংলা + English"
                />
                <Input
                  label="হেল্পলাইন ফোন নম্বর"
                  value={landingForm.helpline_phone || ''}
                  onChange={(e) => setLandingForm({ ...landingForm, helpline_phone: e.target.value })}
                  placeholder="যেমন: ০১৮১২-৩৪৫৬৭৮"
                />
                <Input
                  label="হেল্পলাইন ইমেইল"
                  value={landingForm.helpline_email || ''}
                  onChange={(e) => setLandingForm({ ...landingForm, helpline_email: e.target.value })}
                  placeholder="যেমন: onboard@sohojpathshala.app"
                />
                <Input
                  label="অ্যাডমিন বাটন টেক্সট (CTA 1)"
                  value={landingForm.hero_btn_admin || ''}
                  onChange={(e) => setLandingForm({ ...landingForm, hero_btn_admin: e.target.value })}
                  placeholder="যেমন: স্কুল অ্যাডমিন প্যানেল"
                />
                <Input
                  label="ফিচার বাটন টেক্সট (CTA 2)"
                  value={landingForm.hero_btn_features || ''}
                  onChange={(e) => setLandingForm({ ...landingForm, hero_btn_features: e.target.value })}
                  placeholder="যেমন: প্ল্যাটফর্ম ফিচার দেখুন"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text">মূল শিরোনাম (Hero Title - নতুন লাইনের জন্য সরাসরি Enter দিন)</label>
                <textarea
                  rows={2}
                  value={landingForm.hero_title || ''}
                  onChange={(e) => setLandingForm({ ...landingForm, hero_title: e.target.value })}
                  className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm text-text focus:outline-none focus:ring-2 focus:ring-indigo/40"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text">উপশিরোনাম (Hero Subtitle)</label>
                <textarea
                  rows={3}
                  value={landingForm.hero_subtitle || ''}
                  onChange={(e) => setLandingForm({ ...landingForm, hero_subtitle: e.target.value })}
                  className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm text-text focus:outline-none focus:ring-2 focus:ring-indigo/40"
                />
              </div>
            </Card>

            {/* Section 2: Core Modules */}
            <Card surface="surface" className="p-6 space-y-6 border border-border">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <div className="flex items-center gap-2">
                  <Layers className="w-5 h-5 text-indigo" />
                  <h3 className="text-base font-heading font-bold text-text">মূল মডিউলসমূহ (Core Modules)</h3>
                </div>
                <Badge variant="secondary">{landingForm.modules?.length || 0} টি মডিউল</Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(landingForm.modules || []).map((mod, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-surface-2 border border-border space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-indigo">মডিউল {mod.num}</span>
                    </div>
                    <Input
                      label="শিরোনাম"
                      value={mod.title}
                      onChange={(e) => {
                        const updated = [...landingForm.modules];
                        updated[idx].title = e.target.value;
                        setLandingForm({ ...landingForm, modules: updated });
                      }}
                    />
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-text">বিবরণ</label>
                      <textarea
                        rows={2}
                        value={mod.desc}
                        onChange={(e) => {
                          const updated = [...landingForm.modules];
                          updated[idx].desc = e.target.value;
                          setLandingForm({ ...landingForm, modules: updated });
                        }}
                        className="w-full rounded-lg border border-border bg-surface px-3 py-1.5 text-xs text-text focus:outline-none focus:ring-2 focus:ring-indigo/40"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Section 3: Pricing Plans */}
            <Card surface="surface" className="p-6 space-y-6 border border-border">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-indigo" />
                  <h3 className="text-base font-heading font-bold text-text">সাবস্ক্রিপশন প্রাইসিং প্ল্যানসমূহ (3 Tiers)</h3>
                </div>
                <Badge variant="indigo">Basic · Standard · Premium</Badge>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {(landingForm.pricing_plans || []).map((plan, idx) => (
                  <div
                    key={plan.id || idx}
                    className={`p-5 rounded-2xl bg-surface-2 border space-y-4 ${
                      plan.isPopular ? 'border-indigo ring-1 ring-indigo/50' : 'border-border'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono uppercase font-bold text-indigo">{plan.id}</span>
                      <label className="flex items-center gap-1.5 text-xs cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={!!plan.isPopular}
                          onChange={(e) => {
                            const updated = [...landingForm.pricing_plans];
                            updated[idx].isPopular = e.target.checked;
                            setLandingForm({ ...landingForm, pricing_plans: updated });
                          }}
                          className="rounded border-border text-indigo focus:ring-indigo"
                        />
                        <span className="text-muted font-medium">পপুলার ব্যাজ</span>
                      </label>
                    </div>

                    <Input
                      label="প্ল্যানের নাম"
                      value={plan.name}
                      onChange={(e) => {
                        const updated = [...landingForm.pricing_plans];
                        updated[idx].name = e.target.value;
                        setLandingForm({ ...landingForm, pricing_plans: updated });
                      }}
                    />

                    <Input
                      label="ট্যাগলাইন / লক্ষ্য"
                      value={plan.tagline}
                      onChange={(e) => {
                        const updated = [...landingForm.pricing_plans];
                        updated[idx].tagline = e.target.value;
                        setLandingForm({ ...landingForm, pricing_plans: updated });
                      }}
                    />

                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        label="মূল্য"
                        value={plan.price}
                        onChange={(e) => {
                          const updated = [...landingForm.pricing_plans];
                          updated[idx].price = e.target.value;
                          setLandingForm({ ...landingForm, pricing_plans: updated });
                        }}
                      />
                      <Input
                        label="মেয়াদ / সাবটেক্সট"
                        value={plan.subtext}
                        onChange={(e) => {
                          const updated = [...landingForm.pricing_plans];
                          updated[idx].subtext = e.target.value;
                          setLandingForm({ ...landingForm, pricing_plans: updated });
                        }}
                      />
                    </div>

                    <Input
                      label="বাটন টেক্সট (CTA)"
                      value={plan.cta || ''}
                      onChange={(e) => {
                        const updated = [...landingForm.pricing_plans];
                        updated[idx].cta = e.target.value;
                        setLandingForm({ ...landingForm, pricing_plans: updated });
                      }}
                    />

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold text-text">ফিচার তালিকা</label>
                        <span className="text-[11px] text-muted">প্রতি লাইনে একটি ফিচার</span>
                      </div>
                      <textarea
                        rows={6}
                        value={(plan.features || []).join('\n')}
                        onChange={(e) => {
                          const updated = [...landingForm.pricing_plans];
                          updated[idx].features = e.target.value.split('\n').filter(Boolean);
                          setLandingForm({ ...landingForm, pricing_plans: updated });
                        }}
                        className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-xs font-sans text-text focus:outline-none focus:ring-2 focus:ring-indigo/40"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Section 4: Principal Testimonial */}
            <Card surface="surface" className="p-6 space-y-6 border border-border">
              <div className="flex items-center gap-2 pb-3 border-b border-border">
                <Quote className="w-5 h-5 text-indigo" />
                <h3 className="text-base font-heading font-bold text-text">প্রধান শিক্ষকের প্রশংসাপত্র (Testimonial)</h3>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text">বাণী / মন্তব্য (Quote)</label>
                <textarea
                  rows={3}
                  value={landingForm.testimonial?.quote || ''}
                  onChange={(e) => setLandingForm({
                    ...landingForm,
                    testimonial: { ...(landingForm.testimonial || {}), quote: e.target.value }
                  })}
                  className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm text-text focus:outline-none focus:ring-2 focus:ring-indigo/40"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Input
                  label="নাম"
                  value={landingForm.testimonial?.author || ''}
                  onChange={(e) => setLandingForm({
                    ...landingForm,
                    testimonial: { ...(landingForm.testimonial || {}), author: e.target.value }
                  })}
                />
                <Input
                  label="পদবি ও প্রতিষ্ঠান"
                  value={landingForm.testimonial?.designation || ''}
                  onChange={(e) => setLandingForm({
                    ...landingForm,
                    testimonial: { ...(landingForm.testimonial || {}), designation: e.target.value }
                  })}
                />
                <Input
                  label="EIIN ও জেলা"
                  value={landingForm.testimonial?.meta || ''}
                  onChange={(e) => setLandingForm({
                    ...landingForm,
                    testimonial: { ...(landingForm.testimonial || {}), meta: e.target.value }
                  })}
                />
                <Input
                  label="প্রোফাইল ইনিশিয়াল"
                  value={landingForm.testimonial?.avatar || ''}
                  onChange={(e) => setLandingForm({
                    ...landingForm,
                    testimonial: { ...(landingForm.testimonial || {}), avatar: e.target.value }
                  })}
                />
              </div>
            </Card>

            {/* Section 5: FAQs */}
            <Card surface="surface" className="p-6 space-y-6 border border-border">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-indigo" />
                  <h3 className="text-base font-heading font-bold text-text">সচরাচর জিজ্ঞাসিত প্রশ্ন (FAQ Management)</h3>
                </div>
                <Badge variant="secondary">{landingForm.faqs?.length || 0} টি প্রশ্ন</Badge>
              </div>

              <div className="space-y-4">
                {(landingForm.faqs || []).map((faq, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-surface-2 border border-border space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-indigo">প্রশ্ন #{idx + 1}</span>
                      <Button
                        variant="danger"
                        size="xs"
                        icon={Trash2}
                        onClick={() => handleRemoveFaq(idx)}
                      >
                        মুছে ফেলুন
                      </Button>
                    </div>
                    <Input
                      label="প্রশ্ন"
                      value={faq.q}
                      onChange={(e) => {
                        const updated = [...landingForm.faqs];
                        updated[idx].q = e.target.value;
                        setLandingForm({ ...landingForm, faqs: updated });
                      }}
                    />
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-text">উত্তর</label>
                      <textarea
                        rows={2}
                        value={faq.a}
                        onChange={(e) => {
                          const updated = [...landingForm.faqs];
                          updated[idx].a = e.target.value;
                          setLandingForm({ ...landingForm, faqs: updated });
                        }}
                        className="w-full rounded-lg border border-border bg-surface px-3 py-1.5 text-xs text-text focus:outline-none focus:ring-2 focus:ring-indigo/40"
                      />
                    </div>
                  </div>
                ))}

                {/* Add New FAQ Form */}
                <div className="p-4 rounded-xl border border-dashed border-border bg-surface/50 space-y-3">
                  <h4 className="text-xs font-heading font-bold text-text flex items-center gap-2">
                    <Plus className="w-4 h-4 text-indigo" />
                    নতুন প্রশ্ন ও উত্তর যোগ করুন
                  </h4>
                  <Input
                    placeholder="প্রশ্ন লিখুন..."
                    value={newFaq.q}
                    onChange={(e) => setNewFaq({ ...newFaq, q: e.target.value })}
                  />
                  <textarea
                    rows={2}
                    placeholder="উত্তর লিখুন..."
                    value={newFaq.a}
                    onChange={(e) => setNewFaq({ ...newFaq, a: e.target.value })}
                    className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-xs text-text focus:outline-none focus:ring-2 focus:ring-indigo/40"
                  />
                  <div className="flex justify-end">
                    <Button
                      variant="secondary"
                      size="sm"
                      icon={Plus}
                      onClick={handleAddFaq}
                      disabled={!newFaq.q.trim() || !newFaq.a.trim()}
                    >
                      তালিকায় যোগ করুন
                    </Button>
                  </div>
                </div>
              </div>
            </Card>

            {/* Section 6: Footer & Copyright */}
            <Card surface="surface" className="p-6 space-y-4 border border-border">
              <h3 className="text-base font-heading font-bold text-text">ফুটার ও কপিরাইট টেক্সট</h3>
              <Input
                label="কপিরাইট লাইন"
                value={landingForm.footer_copyright || ''}
                onChange={(e) => setLandingForm({ ...landingForm, footer_copyright: e.target.value })}
              />
            </Card>

            {/* Bottom Floating Save Bar */}
            <div className="p-4 rounded-2xl bg-surface border border-indigo/30 shadow-lg flex items-center justify-between">
              <div>
                <span className="text-sm font-bold text-text block">সব পরিবর্তন প্রস্তুত?</span>
                <span className="text-xs text-muted">সেভ করার সাথে সাথে মূল ল্যান্ডিং পেজে লাইভ আপডেট দেখা যাবে।</span>
              </div>
              <Button
                variant="primary"
                size="lg"
                className="bg-indigo hover:bg-indigo/90 shadow-md"
                icon={Save}
                onClick={handleSaveCms}
              >
                {cmsSaved ? 'সংরক্ষিত হয়েছে!' : 'সব পরিবর্তন সেভ করুন'}
              </Button>
            </div>
          </div>
        )}
      </main>

      {/* D14: Admin Password Reset Confirmation Modal */}
      {confirmResetSchool && (
        <Modal
          isOpen={!!confirmResetSchool}
          onClose={() => setConfirmResetSchool(null)}
          title={t.confirm_reset_title}
          maxWidth="max-w-md"
        >
          <div className="space-y-4">
            <p className="text-sm text-text leading-relaxed">
              আপনি কি নিশ্চিত যে <strong>{confirmResetSchool.name_bn}</strong>-এর স্কুল অ্যাডমিন পাসওয়ার্ড রিসেট করতে চান?
            </p>
            <p className="text-xs text-muted">
              {t.confirm_reset_msg}
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <Button variant="secondary" size="sm" onClick={() => setConfirmResetSchool(null)}>
                {lang === 'bn' ? 'বাতিল' : 'Cancel'}
              </Button>
              <Button variant="dangerSolid" size="sm" onClick={() => handleAdminPasswordReset(confirmResetSchool)}>
                {lang === 'bn' ? 'হ্যাঁ, রিসেট করুন' : 'Yes, Reset Password'}
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* ================= NEW SCHOOL ONBOARDING WIZARD MODAL (Section 15) ================= */}
      <Modal
        isOpen={onboardModalOpen}
        onClose={() => setOnboardModalOpen(false)}
        title={t.onboarding_title}
        subtitle={t.onboarding_subtitle}
        maxWidth="max-w-xl"
      >
        {!createdResult ? (
          <form onSubmit={handleOnboardSubmit} className="space-y-4 text-xs sm:text-sm">
            {onboardError && (
              <div className="p-3 rounded-lg bg-danger-soft text-danger font-semibold border border-danger/30">
                {onboardError}
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="স্কুলের নাম (বাংলা)"
                placeholder="যেমন: ফুলগাজী পাইলট উচ্চ বিদ্যালয়"
                value={onboardForm.name_bn}
                onChange={(e) => setOnboardForm({ ...onboardForm, name_bn: e.target.value })}
                required
              />
              <Input
                label="School Name (English)"
                placeholder="e.g. Fulgazi Pilot High School"
                value={onboardForm.name_en}
                onChange={(e) => setOnboardForm({ ...onboardForm, name_en: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <Input
                label="ইউনিক Slug"
                placeholder="e.g. fphs"
                value={onboardForm.slug}
                onChange={(e) => setOnboardForm({ ...onboardForm, slug: e.target.value })}
                helperText="URL: /{slug}"
                required
              />
              <Input
                label="EIIN নম্বর"
                placeholder="106644"
                value={onboardForm.eiin}
                onChange={(e) => setOnboardForm({ ...onboardForm, eiin: e.target.value })}
                required
              />
              <Input
                label="Prefix কোড"
                placeholder="FPHS"
                value={onboardForm.code_prefix}
                onChange={(e) => setOnboardForm({ ...onboardForm, code_prefix: e.target.value })}
                helperText="ID তৈরিতে লাগবে"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="জেলা"
                placeholder="যেমন: ফেনী"
                value={onboardForm.district}
                onChange={(e) => setOnboardForm({ ...onboardForm, district: e.target.value })}
                required
              />
              <Select
                label="শিক্ষা বোর্ড"
                value={onboardForm.board}
                onChange={(e) => setOnboardForm({ ...onboardForm, board: e.target.value })}
                options={['কুমিল্লা', 'ঢাকা', 'চট্টগ্রাম', 'রাজশাহী', 'দিনাজপুর', 'বরিশাল', 'সিলেট', 'যশোর', 'ময়মনসিংহ']}
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <Select
                label="প্ল্যান"
                value={onboardForm.plan}
                onChange={(e) => setOnboardForm({ ...onboardForm, plan: e.target.value })}
                options={['basic', 'standard', 'premium']}
              />
              <Select
                label="ডিফল্ট থিম"
                value={onboardForm.theme}
                onChange={(e) => setOnboardForm({ ...onboardForm, theme: e.target.value })}
                options={[
                  { value: 'emerald', label: 'Emerald (সবুজ)' },
                  { value: 'indigo', label: 'Indigo (নীল)' }
                ]}
              />
              <Input
                label="স্কুল অ্যাডমিন ইউজারনেম"
                value={onboardForm.admin_username}
                onChange={(e) => setOnboardForm({ ...onboardForm, admin_username: e.target.value })}
                required
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
              <Button variant="secondary" onClick={() => setOnboardModalOpen(false)}>
                বাতিল
              </Button>
              <Button type="submit" variant="primary" className="bg-indigo hover:bg-indigo/90">
                স্কুল তৈরি সম্পন্ন করুন
              </Button>
            </div>
          </form>
        ) : (
          /* Temporary Password Display (Shown ONLY ONCE - Section 15.2) */
          <div className="p-6 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-success-soft text-success flex items-center justify-center mx-auto mb-2">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="text-xl font-heading font-bold text-text">
              স্কুল সফলভাবে অনবোর্ড হয়েছে!
            </h3>

            <p className="text-xs text-muted leading-relaxed">
              {t.temp_pass_alert}
            </p>

            <div className="p-4 rounded-xl bg-surface-2 border border-border flex items-center justify-between gap-4 max-w-sm mx-auto">
              <div className="text-left font-mono">
                <span className="text-[10px] text-muted block">অস্থায়ী পাসওয়ার্ড:</span>
                <span className="text-lg font-bold text-primary">{createdResult.tempPassword}</span>
              </div>
              <Button
                variant="secondary"
                size="sm"
                icon={Copy}
                onClick={() => {
                  navigator.clipboard.writeText(createdResult.tempPassword);
                  showToast('পাসওয়ার্ড কপি করা হয়েছে!');
                }}
              >
                কপি
              </Button>
            </div>

            <div className="pt-4 flex justify-center">
              <Button variant="primary" onClick={() => setOnboardModalOpen(false)}>
                সম্পন্ন
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* ================= PASSWORD RESET SUCCESS MODAL ================= */}
      {resetModalSchool && (
        <Modal
          isOpen={!!resetModalSchool}
          onClose={() => setResetModalSchool(null)}
          title="স্কুল অ্যাডমিন পাসওয়ার্ড রিসেট"
          subtitle={`স্কুল: ${resetModalSchool.name_bn}`}
        >
          <div className="p-4 text-center space-y-4">
            <p className="text-xs text-muted">
              স্কুল অ্যাডমিনের জন্য নতুন একটি অস্থায়ী পাসওয়ার্ড তৈরি করা হয়েছে। পরবর্তী লগইনে পরিবর্তন বাধ্যতামূলক:
            </p>

            <div className="p-4 rounded-xl bg-surface-2 border border-border font-mono text-center max-w-xs mx-auto">
              <span className="text-xl font-bold text-primary">{newTempPassword}</span>
            </div>

            <div className="flex justify-center pt-2">
              <Button variant="secondary" size="sm" onClick={() => setResetModalSchool(null)}>
                বন্ধ করুন
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Footer */}
      <footer className="border-t border-border bg-surface py-6 text-center text-xs text-muted">
        <span>সহজ পাঠশালা (Sohoj Pathshala) · Platform Owner Control Center</span>
      </footer>
    </div>
  );
}

