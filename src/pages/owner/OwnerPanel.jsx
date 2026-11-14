import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../hooks/useTheme';
import { TenantRepository } from '../../services/tenantStorage';
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
  Sparkles
} from 'lucide-react';

export default function OwnerPanel() {
  const navigate = useNavigate();
  const { currentUser, enterSupportMode } = useAuth();
  const { mode, toggleMode } = useTheme({ isOwner: true });
  const { showToast } = useToast();

  const [lang, setLang] = useState(() => localStorage.getItem('owner_lang') || 'bn');
  const t = ownerTranslations[lang] || ownerTranslations.bn;

  const [activeTab, setActiveTab] = useState('schools'); // 'schools', 'audit', 'plans'
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

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

    try {
      const result = TenantRepository.createSchool({
        name_bn: onboardForm.name_bn,
        name_en: onboardForm.name_en,
        slug: onboardForm.slug.toLowerCase().trim(),
        eiin: onboardForm.eiin.trim(),
        school_code: onboardForm.school_code,
        mpo_code: onboardForm.mpo_code,
        board: onboardForm.board,
        district: onboardForm.district,
        code_prefix: onboardForm.code_prefix.toUpperCase().trim(),
        theme: onboardForm.theme,
        plan: onboardForm.plan,
        expires_at: onboardForm.expires_at,
        max_students: Number(onboardForm.max_students)
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

  // Handle Admin Password Reset
  const handleAdminPasswordReset = (school) => {
    const tempPass = `Pass@${Math.floor(1000 + Math.random() * 9000)}`;
    const schoolUsers = TenantRepository.getUsers(school.id);
    const superAdmin = schoolUsers.find(u => u.role === 'school_superadmin');

    if (superAdmin) {
      TenantRepository.updateUser(superAdmin.id, {
        password: tempPass,
        failed_attempts: 0,
        locked_until: null,
        must_change_password: true
      });
      setNewTempPassword(tempPass);
      setResetModalSchool(school);
    } else {
      alert('সুপার অ্যাডমিন ইউজার পাওয়া যায়নি।');
    }
  };

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
              <span className="text-[11px] text-muted">অনবোর্ডকৃত প্রতিষ্ঠান</span>
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
              <span className="text-[11px] text-muted">সক্রিয় লাইভ স্কুল</span>
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
              <span className="text-[11px] text-muted">প্ল্যাটফর্মের সর্বমোট শিক্ষার্থী</span>
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
              <span className="text-[11px] text-muted">নবায়ন আবশ্যক স্কুল</span>
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
                <p className="text-xs text-muted">সহজ পাঠশালা মাল্টি-স্কুল টেন্যান্ট নিয়ন্ত্রণ ও পরিচালনা</p>
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
                        onClick={() => handleAdminPasswordReset(row)}
                        title={t.btn_reset_pass}
                        className="text-muted hover:text-text hover:bg-surface-2 shrink-0"
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
              <p className="text-xs text-muted">প্ল্যাটফর্মের প্রতিটি স্কুলের গুরুত্বপূর্ণ পরিবর্তন ও প্রশাসনিক ট্র্যাকিং</p>
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

        {/* Tab 3: Plans & Validity */}
        {activeTab === 'plans' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-heading font-bold text-text">{t.plans_validity}</h2>
              <p className="text-xs text-muted">স্কুল প্যাকেজ টিয়ার এবং শিক্ষার্থী সীমার তালিকা</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card surface="surface" className="p-6 space-y-4">
                <Badge variant="muted">বেসিক প্ল্যান</Badge>
                <h3 className="text-2xl font-bold font-mono">Basic</h3>
                <ul className="text-xs space-y-2 text-muted">
                  <li>• সর্বোচ্চ ৫০০ শিক্ষার্থী</li>
                  <li>• ২-ভাষিক ওয়েবসাইট</li>
                  <li>• রেজাল্ট ও নোটিশ বোর্ড</li>
                </ul>
              </Card>

              <Card surface="surface" className="p-6 space-y-4 border-2 border-indigo">
                <Badge variant="indigo">স্ট্যান্ডার্ড প্ল্যান</Badge>
                <h3 className="text-2xl font-bold font-mono text-indigo">Standard</h3>
                <ul className="text-xs space-y-2 text-muted">
                  <li>• সর্বোচ্চ ১৫০০ শিক্ষার্থী</li>
                  <li>• অনলাইন ভর্তি ও প্রবেশপত্র</li>
                  <li>• ২-পার্ট মানি রিসিট ও ফি আদায়</li>
                  <li>• এসএমএস নোটিফিকেশন সাপোর্ট</li>
                </ul>
              </Card>

              <Card surface="surface" className="p-6 space-y-4">
                <Badge variant="primary">প্রিমিয়াম প্ল্যান</Badge>
                <h3 className="text-2xl font-bold font-mono">Premium</h3>
                <ul className="text-xs space-y-2 text-muted">
                  <li>• আনলিমিটেড শিক্ষার্থী</li>
                  <li>• কাস্টম ডোমেইন সাপোর্ট</li>
                  <li>• ২৪/৭ প্রায়োরিটি সাপোর্ট</li>
                  <li>• ফুল ব্যাকআপ ও রিস্টোর</li>
                </ul>
              </Card>
            </div>
          </div>
        )}
      </main>

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
                label="সুপার অ্যাডমিন ইউজারনেম"
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
          title="সুপার অ্যাডমিন পাসওয়ার্ড রিসেট"
          subtitle={`স্কুল: ${resetModalSchool.name_bn}`}
        >
          <div className="p-4 text-center space-y-4">
            <p className="text-xs text-muted">
              সুপার অ্যাডমিনের জন্য নতুন একটি অস্থায়ী পাসওয়ার্ড তৈরি করা হয়েছে। পরবর্তী লগইনে পরিবর্তন বাধ্যতামূলক:
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

