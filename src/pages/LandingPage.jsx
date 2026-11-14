import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import { TenantRepository } from '../services/tenantStorage';
import ThemeToggle from '../components/common/ThemeToggle';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import Card from '../components/ui/Card';
import Modal from '../components/ui/Modal';
import { 
  GraduationCap, 
  Users, 
  FileText, 
  CreditCard, 
  UserCheck, 
  Bell, 
  Globe, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Lock, 
  ExternalLink, 
  Sparkles, 
  ChevronRight, 
  ChevronDown,
  Check,
  Star,
  Quote,
  Search,
  Building2,
  Menu,
  X,
  Phone,
  Mail
} from 'lucide-react';

export default function LandingPage() {
  const { mode, toggleMode } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaq, setOpenFaq] = useState(null);
  const schools = TenantRepository.getSchools();
  const landing = TenantRepository.getLandingSettings();

  const filteredSchools = schools.filter(s => 
    s.name_bn.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.eiin.includes(searchQuery)
  );

  const moduleIconList = [Users, GraduationCap, FileText, CreditCard, UserCheck, Bell, Globe, ShieldCheck];
  const modules = (landing.modules || []).map((m, i) => ({
    ...m,
    icon: moduleIconList[i % moduleIconList.length]
  }));

  const onboardingSteps = landing.onboarding_steps || [
    { step: '১', title: 'স্কুল তৈরি', desc: 'EIIN, নাম, কোড ও সাবডোমেইন দিয়ে নতুন টেন্যান্ট তৈরি।' },
    { step: '২', title: 'অ্যাডমিন অ্যাকাউন্ট', desc: 'স্কুল অ্যাডমিনের জন্য সুরক্ষিত অ্যাকাউন্ট ও পাসওয়ার্ড বরাদ্দ।' },
    { step: '৩', title: 'সেটআপ উইজার্ড', desc: 'লোগো, প্রধান শিক্ষকের বাণী, রুটিন ও প্রাতিষ্ঠানিক তথ্য কনফিগার।' },
    { step: '৪', title: 'সাইট লাইভ', desc: 'তাত্ক্ষণিকভাবে পাবলিক পোর্টাল ও অ্যাডমিন প্যানেল সক্রিয়।' },
  ];

  const pricingPlans = landing.pricing_plans || [];
  const testimonial = landing.testimonial || {
    quote: 'সহজ পাঠশালা ব্যবহারের পর থেকে আমাদের বিদ্যালয়ের ভর্তি আবেদন গ্রহণ, পরীক্ষার ফলাফল প্রকাশ এবং শিক্ষার্থীদের ফি আদায় প্রক্রিয়া কয়েক ঘণ্টার মধ্যে শতভাগ নির্ভুলভাবে সম্পন্ন হচ্ছে।',
    author: 'মো. বাহার উদ্দিন ভূঁইয়া',
    designation: 'প্রধান শিক্ষক • বন্দুয়া দৌলতপুর উচ্চ বিদ্যালয় (BDHS)',
    meta: 'EIIN: ১০৫৮৬৫ • ফেনী সদর, ফেনী',
    avatar: 'বূ'
  };
  const faqs = landing.faqs || [];

  return (
    <div className="min-h-screen bg-bg text-text flex flex-col font-sans transition-colors duration-200">
      {/* ================= 1. STICKY HEADER ================= */}
      <header className="sticky top-0 z-50 bg-header-bg backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[10px] bg-primary text-on-primary font-heading font-bold text-lg flex items-center justify-center shadow-md">
              সপ
            </div>
            <div>
              <span className="text-xl font-heading font-bold text-text leading-tight block">সহজ পাঠশালা</span>
              <span className="text-[11px] text-muted font-medium tracking-wide">Sohoj Pathshala</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-muted">
            <a href="#modules" className="hover:text-primary transition-colors">মডিউল</a>
            <a href="#flow" className="hover:text-primary transition-colors">পদ্ধতি</a>
            <a href="#security" className="hover:text-primary transition-colors">নিরাপত্তা</a>
            <a href="#schools" className="hover:text-primary transition-colors">স্কুলসমূহ</a>
            <a href="#pricing" className="hover:text-primary transition-colors">প্ল্যান ও মূল্য</a>
            <a href="#faq" className="hover:text-primary transition-colors">প্রশ্নোত্তর</a>
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-3">
            <ThemeToggle mode={mode} toggleMode={toggleMode} lang="bn" />
            <Link to="/bdhs/login" className="hidden sm:inline-flex">
              <Button variant="primary" size="sm">
                অ্যাডমিন লগইন
              </Button>
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-muted hover:text-text cursor-pointer"
              aria-label="মেনু খুলুন"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-border bg-surface px-4 py-4 space-y-3">
            <a href="#modules" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-semibold text-text py-1">মডিউল</a>
            <a href="#flow" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-semibold text-text py-1">পদ্ধতি</a>
            <a href="#security" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-semibold text-text py-1">নিরাপত্তা</a>
            <a href="#schools" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-semibold text-text py-1">স্কুলসমূহ</a>
            <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-semibold text-text py-1">প্ল্যান ও মূল্য</a>
            <a href="#faq" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-semibold text-text py-1">প্রশ্নোত্তর</a>
            <div className="pt-2 border-t border-border">
              <Link to="/bdhs/login">
                <Button variant="primary" size="md" className="w-full">
                  অ্যাডমিন লগইন
                </Button>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* ================= 2. HERO SECTION ================= */}
      <section className="relative overflow-hidden py-16 lg:py-24 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headlines & CTA */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-soft text-primary text-xs font-semibold border border-primary/25">
              <Sparkles className="w-3.5 h-3.5" />
              {landing.hero_tag || 'মাল্টি-স্কুল প্ল্যাটফর্ম · বাংলা + English'}
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-extrabold text-text tracking-tight leading-[1.15]">
              {(landing.hero_title || 'সব স্কুল,\nএক সহজ প্ল্যাটফর্মে।').split('\n')[0]} <br />
              <span className="text-primary">{(landing.hero_title || 'সব স্কুল,\nএক সহজ প্ল্যাটফর্মে।').split('\n')[1] || ''}</span>
            </h1>

            <p className="text-base sm:text-lg text-muted max-w-xl leading-relaxed">
              {landing.hero_subtitle || 'বাংলাদেশের প্রতিটি শিক্ষাপ্রতিষ্ঠানের জন্য সম্পূর্ণ ক্লাউডভিত্তিক আধুনিক ওয়েবসাইট, রেজাল্ট পাবলিশিং, অনলাইন ভর্তি ও প্রাতিষ্ঠানিক হিসাবরক্ষণ সমাধান।'}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link to="/bdhs/login">
                <Button variant="primary" size="lg" iconRight={ArrowRight}>
                  {landing.hero_btn_admin || 'স্কুল অ্যাডমিন প্যানেল'}
                </Button>
              </Link>
              <a href="#modules">
                <Button variant="secondary" size="lg">
                  {landing.hero_btn_features || 'প্ল্যাটফর্ম ফিচার দেখুন'}
                </Button>
              </a>
            </div>

            {/* Quick Metrics Bar */}
            <div className="pt-8 border-t border-border grid grid-cols-3 gap-4 max-w-lg">
              <div>
                <p className="text-2xl sm:text-3xl font-heading font-bold text-text">৮টি</p>
                <p className="text-xs text-muted font-medium mt-0.5">ম্যানেজমেন্ট মডিউল</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-heading font-bold text-text">২টি</p>
                <p className="text-xs text-muted font-medium mt-0.5">ভাষা (বাংলা ও EN)</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-heading font-bold text-primary">∞</p>
                <p className="text-xs text-muted font-medium mt-0.5">অসীম স্কুল টেন্যান্ট</p>
              </div>
            </div>
          </div>

          {/* Right Column: Live Product Preview Frame */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-border-strong bg-surface shadow-2xl p-4 sm:p-5">
              {/* Browser Header Bar */}
              <div className="flex items-center gap-2 pb-3 mb-4 border-b border-border">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-danger/80" />
                  <span className="w-3 h-3 rounded-full bg-warning/80" />
                  <span className="w-3 h-3 rounded-full bg-success/80" />
                </div>
                <div className="flex-1 max-w-[260px] mx-auto bg-surface-2 rounded-md px-3 py-1 text-[11px] font-mono text-muted truncate text-center border border-border">
                  sohojpathshala.app/<strong className="text-primary">bdhs</strong>/admin
                </div>
              </div>

              {/* Inside Mock Mini App UI */}
              <div className="grid grid-cols-12 gap-3">
                {/* Mini Sidebar */}
                <div className="col-span-4 bg-surface-2 rounded-xl p-2.5 space-y-1.5 text-[11px] font-medium border border-border">
                  <div className="px-2 py-1 rounded bg-primary-soft text-primary font-bold border-l-2 border-primary">
                    ড্যাশবোর্ড
                  </div>
                  <div className="px-2 py-1 text-muted">শিক্ষার্থী</div>
                  <div className="px-2 py-1 text-muted">অনলাইন ভর্তি</div>
                  <div className="px-2 py-1 text-muted">রেজাল্ট পাবলিশ</div>
                  <div className="px-2 py-1 text-muted">ফি রসিদ</div>
                </div>

                {/* Mini Main Dashboard */}
                <div className="col-span-8 space-y-2.5">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-surface-2 p-2 rounded-lg border border-border">
                      <span className="text-[10px] text-muted block">মোট শিক্ষার্থী</span>
                      <span className="text-sm font-bold text-primary font-mono">১,২৮৫</span>
                    </div>
                    <div className="bg-surface-2 p-2 rounded-lg border border-border">
                      <span className="text-[10px] text-muted block">অপেক্ষমাণ ভর্তি</span>
                      <span className="text-sm font-bold text-warning font-mono">৪২</span>
                    </div>
                  </div>

                  {/* Class-wise Bar Graph Preview */}
                  <div className="bg-surface-2 p-2.5 rounded-lg border border-border">
                    <span className="text-[10px] text-muted block mb-1.5 font-medium">শ্রেণিভিত্তিক শিক্ষার্থী অনুপাত</span>
                    <div className="flex items-end gap-1.5 h-12 pt-2">
                      <div className="w-1/5 bg-primary/60 rounded-t h-70%" />
                      <div className="w-1/5 bg-primary/75 rounded-t h-85%" />
                      <div className="w-1/5 bg-primary/90 rounded-t h-95%" />
                      <div className="w-1/5 bg-primary rounded-t h-100%" />
                      <div className="w-1/5 bg-primary/80 rounded-t h-80%" />
                    </div>
                    <div className="flex justify-between text-[9px] text-subtle font-mono mt-1">
                      <span>৬ষ্ঠ</span><span>৭ম</span><span>৮ম</span><span>৯ম</span><span>১০ম</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Quick Access Pills */}
              <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-[11px]">
                <Link to="/bdhs" className="text-primary hover:underline flex items-center gap-1 font-semibold">
                  🌐 পাবলিক সাইট /bdhs
                </Link>
                <Link to="/bdhs/admin" className="text-muted hover:text-text flex items-center gap-1 font-semibold">
                  🔒 অ্যাডমিন প্যানেল
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 3. MODULES SECTION (--bg-alt) ================= */}
      <section id="modules" className="py-20 bg-bg-alt border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-mono font-bold text-primary uppercase tracking-wider">MODULES</span>
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-text mt-1.5 mb-3">
              ৮টি সম্পূর্ণ ইন্টিগ্রেটেড মডিউল
            </h2>
            <p className="text-sm sm:text-base text-muted">
              স্কুলের প্রতিটি প্রশাসনিক, অ্যাকাডেমিক এবং আর্থিক কার্যক্রম পরিচালনার জন্য স্বতন্ত্র মডিউল ব্যবস্থা।
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {modules.map((m, idx) => {
              const IconComp = m.icon;
              return (
                <Card key={idx} surface="surface" hoverEffect className="flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-11 h-11 rounded-xl bg-primary-soft text-primary flex items-center justify-center">
                        <IconComp className="w-5 h-5" aria-hidden="true" />
                      </div>
                      <span className="font-mono text-xs font-bold text-muted">{m.num}</span>
                    </div>
                    <h3 className="text-lg font-heading font-bold text-text mb-2">
                      {m.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-muted leading-relaxed">
                      {m.desc}
                    </p>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= 4. ONBOARDING FLOW ================= */}
      <section id="flow" className="py-20 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-mono font-bold text-primary uppercase tracking-wider">ONBOARDING</span>
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-text mt-1.5 mb-3">
              ৪ ধাপে আপনার স্কুল অনলাইনে
            </h2>
            <p className="text-sm text-muted">
              জটিল কোনো প্রক্রিয়া নেই। মাত্র কয়েক মিনিটেই প্রস্তুত হয়ে যাবে আপনার বিদ্যালয়ের ডিজিটাল ক্যাম্পাস।
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {onboardingSteps.map((st, i) => (
              <div key={i} className="p-6 rounded-2xl border border-border bg-surface relative">
                <div className="w-10 h-10 rounded-full border-2 border-primary text-primary font-heading font-bold text-base flex items-center justify-center mb-4">
                  {st.step}
                </div>
                <h4 className="text-base font-heading font-bold text-text mb-1.5">
                  {st.title}
                </h4>
                <p className="text-xs text-muted leading-relaxed">
                  {st.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= 5. SECURITY ARCHITECTURE ================= */}
      <section id="security" className="py-20 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="rounded-3xl border border-border-strong bg-surface p-8 sm:p-12 lg:p-16 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-success-soft text-success flex items-center justify-center mb-2">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-heading font-bold text-text">
                এক স্কুলের ডেটা আরেক স্কুল কখনো দেখে না
              </h2>
              <p className="text-sm text-muted leading-relaxed">
                প্রতিটি শিক্ষাপ্রতিষ্ঠান সম্পূর্ণ স্বতন্ত্র টেন্যান্ট (Isolated Tenant) হিসেবে নিবন্ধিত। ডেটাবেজ লেয়ারে কঠোর স্কুল আইডি ভ্যালিডেশন থাকার কারণে ডেটা ফাঁসের কোনো সুযোগ নেই।
              </p>
            </div>

            <div className="lg:col-span-6 space-y-3">
              <div className="p-4 rounded-xl bg-surface-2 border border-border flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-success shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-text mb-0.5">রোলভিত্তিক পারমিশন (RBAC)</h4>
                  <p className="text-xs text-muted">স্কুল অ্যাডমিন, প্রধান শিক্ষক, সহকারী শিক্ষক ও অফিস সহকারীর ক্ষমতার সুস্পষ্ট বিভাজন।</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-surface-2 border border-border flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-success shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-text mb-0.5">৫ বার ভুল পাসওয়ার্ডে লকআউট</h4>
                  <p className="text-xs text-muted">ব্রুট-ফোর্স হামলা ঠেকাতে টানা ৫ বার ভুল ইনপুটে সংশ্লিষ্ট অ্যাকাউন্ট ১৫ মিনিটের জন্য স্বয়ংক্রিয় লক।</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-surface-2 border border-border flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-success shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-text mb-0.5">৩০ দিন নবায়ন ও গ্রেস সুরক্ষা</h4>
                  <p className="text-xs text-muted">মেয়াদ শেষ হওয়ার শেষ ৩০ দিন নবায়ন পিরিয়ড এবং মেয়াদোত্তীর্ণ হলেও গ্রেস পিরিয়ড পাওয়া যাবে। কোনো অবস্থাতেই স্কুলের ডেটা মোছা হবে না।</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 6. NETWORK SCHOOLS (--bg-alt) ================= */}
      <section id="schools" className="py-20 bg-bg-alt border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-xs font-mono font-bold text-primary uppercase tracking-wider">NETWORK</span>
              <h2 className="text-3xl font-heading font-bold text-text mt-1">
                সহজ পাঠশালা নেটওয়ার্কের স্কুলসমূহ
              </h2>
            </div>

            <div className="w-full sm:w-72">
              <Input
                placeholder="নাম বা EIIN দিয়ে খুঁজুন..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={Search}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSchools.map((s) => (
              <Card key={s.id} surface="surface" hoverEffect className="flex flex-col justify-between">
                <div>
                  {/* Photo or Placeholder Banner */}
                  <div className="h-32 rounded-xl bg-primary-soft text-primary flex items-center justify-center mb-4 border border-primary/20">
                    <Building2 className="w-10 h-10 opacity-70" />
                  </div>

                  <div className="flex items-center justify-between gap-2 mb-2">
                    <Badge variant={s.status === 'active' ? 'success' : 'warning'} symbol="●">
                      {s.status === 'active' ? 'চালু' : 'Grace'}
                    </Badge>
                    <span className="text-xs font-mono text-muted">EIIN: {s.eiin}</span>
                  </div>

                  <h3 className="text-lg font-heading font-bold text-text mb-1">
                    {s.name_bn}
                  </h3>
                  <p className="text-xs text-muted mb-4">
                    {s.district} জেলা · {s.board} শিক্ষা বোর্ড
                  </p>
                </div>

                <div className="pt-4 border-t border-border flex items-center justify-between">
                  <Link to={`/${s.slug}`} className="text-xs font-bold text-primary hover:underline inline-flex items-center gap-1">
                    পাবলিক সাইট দেখুন <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <Link to={`/${s.slug}/login`} className="text-xs font-semibold text-muted hover:text-text">
                    লগইন
                  </Link>
                </div>
              </Card>
            ))}

            {/* Request School Card */}
            <div className="p-6 rounded-2xl border-2 border-dashed border-border-strong bg-surface/50 flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 rounded-full bg-surface-2 text-muted flex items-center justify-center mb-3">
                <Building2 className="w-6 h-6" />
              </div>
              <h4 className="text-base font-heading font-bold text-text mb-1">আপনার স্কুল যুক্ত করতে চান?</h4>
              <p className="text-xs text-muted mb-4 max-w-xs">সহজ পাঠশালা প্ল্যাটফর্মে যুক্ত হতে আমাদের সাথে যোগাযোগ করুন।</p>
              <a href="#cta">
                <Button variant="secondary" size="sm">যোগাযোগ করুন</Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 7. PRICING & PLANS SECTION ================= */}
      <section id="pricing" className="py-20 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-mono font-bold text-primary uppercase tracking-wider">PRICING & PLANS</span>
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-text mt-1.5 mb-3">
              সহজ ও স্বচ্ছ মূল্যতালিকা
            </h2>
            <p className="text-sm sm:text-base text-muted">
              স্কুলের আকার ও সামর্থ্য অনুযায়ী উপযুক্ত প্ল্যান বেছে নিন। কোনো লুকানো চার্জ বা জটিলতা নেই।
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {pricingPlans.map((plan) => (
              <div
                key={plan.id}
                className={`rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 relative ${
                  plan.isPopular
                    ? 'bg-surface border-2 border-primary shadow-xl ring-4 ring-primary/10'
                    : 'bg-surface border border-border shadow-xs hover:border-border-strong'
                }`}
              >
                {plan.isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-primary text-on-primary font-bold text-xs px-4 py-1 rounded-full shadow-md">
                    সর্বাধিক জনপ্রিয়
                  </div>
                )}

                <div>
                  <div className="mb-4">
                    <h3 className="text-xl font-heading font-bold text-text">{plan.name}</h3>
                    <p className="text-xs text-muted mt-1">{plan.tagline}</p>
                  </div>

                  <div className="my-6 pb-6 border-b border-border">
                    <span className="text-3xl sm:text-4xl font-mono font-extrabold text-text">{plan.price}</span>
                    <span className="text-xs text-muted block mt-1">{plan.subtext}</span>
                  </div>

                  <div className="space-y-3 mb-8">
                    <span className="text-xs font-bold text-text block uppercase tracking-wider">প্ল্যানে যা যা থাকছে:</span>
                    {plan.features.map((feat, fi) => (
                      <div key={fi} className="flex items-start gap-2.5 text-xs text-muted">
                        <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Button
                  variant={plan.isPopular ? 'primary' : 'secondary'}
                  size="lg"
                  className="w-full"
                  onClick={() => setContactModalOpen(true)}
                >
                  {plan.cta}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= 8. PRINCIPAL TESTIMONIAL / SOCIAL PROOF ================= */}
      <section className="py-20 bg-bg-alt border-b border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="bg-surface rounded-3xl border border-border p-8 sm:p-12 shadow-md relative overflow-hidden">
            <Quote className="w-20 h-20 text-primary/10 absolute -right-2 -bottom-2 pointer-events-none" />
            
            <div className="flex items-center gap-1 mb-6 text-accent">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-accent" />
              ))}
            </div>

            <blockquote className="text-base sm:text-xl text-text font-medium leading-relaxed italic mb-8">
              "{testimonial.quote}"
            </blockquote>

            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-primary text-on-primary font-heading font-extrabold text-xl flex items-center justify-center shadow-md shrink-0">
                {testimonial.avatar || 'বূ'}
              </div>
              <div>
                <h4 className="text-base font-heading font-bold text-text">{testimonial.author}</h4>
                <p className="text-xs text-primary font-semibold">{testimonial.designation}</p>
                <p className="text-[11px] text-muted font-mono">{testimonial.meta}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 9. FAQ ACCORDION SECTION ================= */}
      <section id="faq" className="py-20 border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-mono font-bold text-primary uppercase tracking-wider">FAQS</span>
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-text mt-1.5 mb-3">
              সাধারণ জিজ্ঞাসা (FAQ)
            </h2>
            <p className="text-sm text-muted">
              সহজ পাঠশালা ব্যবহারের নিয়মাবলী ও সচরাচর জিজ্ঞাসিত প্রশ্নাবলির উত্তর
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-border bg-surface overflow-hidden transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-surface-2/60 transition-colors"
                    aria-expanded={isOpen}
                  >
                    <span className="text-sm sm:text-base font-bold text-text">
                      {faq.q}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-muted shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-primary' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 text-xs sm:text-sm text-muted leading-relaxed border-t border-border/50 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= 10. CTA SECTION ================= */}
      <section id="cta" className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="p-8 sm:p-12 rounded-3xl bg-primary-soft border border-primary/20 text-center space-y-4">
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-text">
              আপনার স্কুলকে ডিজিটাল করতে প্রস্তুত?
            </h2>
            <p className="text-sm text-muted max-w-md mx-auto">
              প্ল্যাটফর্মে উন্মুক্ত পাবলিক রেজিস্ট্রেশন নেই। সরাসরি স্কুল বোর্ডের অনুমোদনে নতুন স্কুল অনবোর্ড করা হয়।
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Button variant="primary" size="lg" onClick={() => setContactModalOpen(true)}>
                যোগাযোগ ও অনবোর্ডিং
              </Button>
              <a href="#schools">
                <Button variant="secondary" size="lg">
                  স্কুল তালিকা দেখুন
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Onboarding & Contact Modal */}
      {contactModalOpen && (
        <Modal
          isOpen={contactModalOpen}
          onClose={() => setContactModalOpen(false)}
          title="নতুন স্কুল অনবোর্ডিং যোগাযোগ"
          size="md"
        >
          <div className="space-y-4 text-xs">
            <p className="text-muted leading-relaxed">
              সহজ পাঠশালা প্ল্যাটফর্মে আপনার স্কুল যুক্ত করতে আমাদের প্রতিনিধি দলের সাথে যোগাযোগ করুন। আমরা আপনার প্রতিষ্ঠানের EIIN ও প্রাথমিক তথ্য দিয়ে মাত্র ২৪ ঘণ্টার মধ্যে পূর্ণাঙ্গ সিস্টেম প্রস্তুত করে দেব।
            </p>

            <div className="p-4 rounded-xl bg-surface-2 border border-border space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary-soft text-primary flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-muted block">সরাসরি কল করুন (Helpline)</span>
                  <a href={`tel:${landing.helpline_phone || '01812345678'}`} className="text-sm font-bold font-mono text-primary hover:underline">
                    {landing.helpline_phone || '০১৮১২-৩৪৫৬৭৮'}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-accent-soft text-accent flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-muted block">অফিসিয়াল ইমেইল</span>
                  <a href={`mailto:${landing.helpline_email || 'onboard@sohojpathshala.app'}`} className="text-sm font-bold font-mono text-accent hover:underline">
                    {landing.helpline_email || 'onboard@sohojpathshala.app'}
                  </a>
                </div>
              </div>
            </div>

            <div className="space-y-1.5 pt-2">
              <span className="font-bold text-text block">অনবোর্ডিং প্রক্রিয়া:</span>
              <ul className="space-y-1 text-muted list-disc list-inside">
                <li>প্রতিষ্ঠানের EIIN, প্রধান শিক্ষকের নাম ও রেজুলেশন কপি প্রদান</li>
                <li>নিরাপদ স্কুল অ্যাডমিন ক্রেডেনশিয়াল ও ডোমেইন সক্রিয়করণ</li>
                <li>বিনামূল্যে শিক্ষক ও স্টাফদের জন্য সম্পূর্ণ অনলাইন প্রশিক্ষণ</li>
              </ul>
            </div>

            <div className="pt-3 flex justify-end">
              <Button variant="secondary" size="sm" onClick={() => setContactModalOpen(false)}>
                বন্ধ করুন
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* ================= 8. FOOTER ================= */}
      <footer className="border-t border-border bg-surface py-10 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-muted">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary text-on-primary font-heading font-bold text-sm flex items-center justify-center">
              সপ
            </div>
            <span>{landing.footer_copyright || '© ২০২৬ সহজ পাঠশালা (Sohoj Pathshala) — সর্বস্বত্ব সংরক্ষিত।'}</span>
          </div>

          <div className="flex flex-wrap items-center gap-6 font-semibold">
            <Link to="/bdhs/login" className="hover:text-primary transition-colors">স্কুল অ্যাডমিন লগইন</Link>
            <Link to="/owner" className="hover:text-primary transition-colors">প্ল্যাটফর্ম সুপার অ্যাডমিন প্যানেল</Link>
            <Link to="/design" className="hover:text-primary transition-colors">ডিজাইন শোকেস</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

