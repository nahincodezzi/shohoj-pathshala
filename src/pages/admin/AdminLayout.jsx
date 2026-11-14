import React, { useState } from 'react';
import { useParams, Link, useNavigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../hooks/useTheme';
import { TenantRepository } from '../../services/tenantStorage';
import ThemeToggle from '../../components/common/ThemeToggle';
import Banner from '../../components/ui/Banner';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { 
  LayoutDashboard, 
  Users, 
  GraduationCap, 
  FileText, 
  CreditCard, 
  UserCheck, 
  Bell, 
  Globe, 
  ShieldCheck, 
  Settings, 
  LogOut, 
  Search, 
  Menu, 
  X, 
  ChevronRight,
  Eye,
  AlertTriangle
} from 'lucide-react';

export default function AdminLayout({ activeModule = 'dashboard' }) {
  const { slug } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout, supportMode, exitSupportMode } = useAuth();
  const { mode, toggleMode } = useTheme({ slug });

  const school = TenantRepository.getSchoolBySlug(slug || '');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');

  // Determine current active subview from path
  const currentPath = location.pathname;
  const pathParts = currentPath.split('/');
  const subview = pathParts[3] || 'dashboard';

  if (!school) {
    return (
      <div className="min-h-screen bg-bg text-text p-6 flex flex-col items-center justify-center text-center">
        <h2 className="text-xl font-bold mb-2">স্কুল পাওয়া যায়নি</h2>
        <Link to="/"><Button variant="secondary">হোমপেজে ফিরুন</Button></Link>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!currentUser && !supportMode) {
    return (
      <div className="min-h-screen bg-bg text-text p-6 flex flex-col items-center justify-center text-center">
        <AlertTriangle className="w-12 h-12 text-warning mb-3" />
        <h2 className="text-2xl font-heading font-bold mb-2">লগইন প্রয়োজন</h2>
        <p className="text-xs text-muted mb-6">এই প্যানেলে প্রবেশ করতে আগে লগইন করুন।</p>
        <Link to={`/${school.slug}/login`}><Button variant="primary">লগইন পেজে যান</Button></Link>
      </div>
    );
  }

  // Calculate days remaining in school plan
  const expiresDate = new Date(school.expires_at || '2027-12-31');
  const daysLeft = Math.ceil((expiresDate - new Date()) / (1000 * 60 * 60 * 24));
  const isExpiringSoon = daysLeft <= 30;

  // Navigation Items with RBAC permissions
  const menuItems = [
    { key: 'dashboard', label: 'ড্যাশবোর্ড', icon: LayoutDashboard, path: `/${school.slug}/admin` },
    { key: 'students', label: 'শিক্ষার্থী', icon: Users, path: `/${school.slug}/admin/students` },
    { key: 'admissions', label: 'ভর্তি আবেদন', icon: GraduationCap, path: `/${school.slug}/admin/admissions` },
    { key: 'results', label: 'রেজাল্ট ও মার্কস', icon: FileText, path: `/${school.slug}/admin/results` },
    { key: 'fees', label: 'ফি ও রসিদ', icon: CreditCard, path: `/${school.slug}/admin/fees`, hideForTeacher: true },
    { key: 'teachers', label: 'শিক্ষক ও কর্মচারী', icon: UserCheck, path: `/${school.slug}/admin/teachers` },
    { key: 'notices', label: 'নোটিশ বোর্ড', icon: Bell, path: `/${school.slug}/admin/notices` },
    { key: 'cms', label: 'ওয়েবসাইট (CMS)', icon: Globe, path: `/${school.slug}/admin/cms`, requireAdmin: true },
    { key: 'users', label: 'ইউজার ও সিকিউরিটি', icon: ShieldCheck, path: `/${school.slug}/admin/users`, requireSuperAdmin: true },
    { key: 'settings', label: 'স্কুল সেটিংস', icon: Settings, path: `/${school.slug}/admin/settings`, requireAdmin: true },
  ];

  const visibleMenuItems = menuItems.filter(item => {
    if (currentUser?.role === 'teacher' && item.hideForTeacher) return false;
    if (item.requireSuperAdmin && currentUser?.role !== 'school_superadmin' && !supportMode) return false;
    if (item.requireAdmin && !['school_superadmin', 'headmaster'].includes(currentUser?.role) && !supportMode) return false;
    return true;
  });

  const roleNameMap = {
    platform_owner: 'প্ল্যাটফর্ম Owner',
    school_superadmin: 'সুপার অ্যাডমিন',
    headmaster: 'প্রধান শিক্ষক',
    asst_headmaster: 'সহ-প্রধান শিক্ষক',
    teacher: 'সহকারী শিক্ষক',
    office_assistant: 'অফিস সহকারী'
  };

  return (
    <div className="min-h-screen bg-bg text-text flex flex-col font-sans transition-colors duration-200">
      
      {/* Support Mode Persistent Top Bar (Section 7.7 Rule) */}
      {supportMode && (
        <div className="sticky top-0 z-50 bg-warning-soft border-b border-warning-line px-4 sm:px-6 py-2.5 text-xs sm:text-sm font-semibold text-warning flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            <span><strong>সাপোর্ট মোড (Support Mode)</strong> — {school.name_bn} — শুধু দেখা যাবে (View Only)</span>
          </div>
          <button
            type="button"
            onClick={() => {
              exitSupportMode();
              navigate('/owner');
            }}
            className="px-3 py-1 rounded-md bg-warning text-black font-bold text-xs hover:opacity-90 cursor-pointer"
          >
            সাপোর্ট মোড থেকে বের হন ✕
          </button>
        </div>
      )}

      {/* Plan Expiry Alert Bar (if <= 30 days) */}
      {isExpiringSoon && !supportMode && (
        <div className="bg-warning-soft border-b border-warning-line px-4 py-2 text-xs font-semibold text-warning flex items-center justify-between">
          <span>⏱ আপনার স্কুল প্ল্যানের মেয়াদ শেষ হতে আর মাত্র {daysLeft} দিন বাকি।</span>
          <span className="underline cursor-pointer" onClick={() => alert('প্ল্যান নবায়নের জন্য Platform Owner-এর সাথে যোগাযোগ করুন।')}>
            নবায়ন করুন →
          </span>
        </div>
      )}

      <div className="flex flex-1">
        {/* ================= LEFT SIDEBAR (240px, Section 7.6) ================= */}
        <aside className={`fixed inset-y-0 left-0 z-40 w-60 bg-surface border-r border-border flex flex-col justify-between transition-transform duration-200 lg:translate-x-0 ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <div>
            {/* School Profile in Sidebar */}
            <div className="p-4 border-b border-border flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary-soft text-primary font-heading font-bold text-base flex items-center justify-center shrink-0 border border-primary/25">
                সপ
              </div>
              <div className="min-w-0">
                <h2 className="text-xs font-bold text-text truncate leading-tight">
                  {school.name_bn}
                </h2>
                <p className="text-[10px] font-mono text-primary truncate mt-0.5">
                  /{school.slug}/admin
                </p>
              </div>
            </div>

            {/* Menu List */}
            <nav className="p-2 space-y-1">
              {visibleMenuItems.map((item) => {
                const IconComp = item.icon;
                const isActive = subview === item.key || (item.key === 'dashboard' && subview === 'admin');

                return (
                  <Link
                    key={item.key}
                    to={item.path}
                    onClick={() => setMobileSidebarOpen(false)}
                    className={`flex items-center gap-3 px-3.5 h-11 rounded-[10px] text-xs sm:text-sm font-semibold transition-all relative select-none ${
                      isActive
                        ? 'bg-primary-soft text-primary'
                        : 'text-muted hover:text-text hover:bg-surface-2'
                    }`}
                  >
                    {/* Active Left 3px line */}
                    {isActive && (
                      <span className="absolute left-0 top-2 bottom-2 w-[3px] bg-primary rounded-r" />
                    )}
                    <IconComp className="w-4 h-4 shrink-0" aria-hidden="true" />
                    <span className="truncate">{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Sidebar Bottom View Site & Logout */}
          <div className="p-3 border-t border-border space-y-2">
            <Link
              to={`/${school.slug}`}
              target="_blank"
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-muted hover:text-text hover:bg-surface-2"
            >
              <Globe className="w-4 h-4" />
              <span>পাবলিক সাইট দেখুন</span>
            </Link>

            <button
              type="button"
              onClick={() => {
                logout();
                navigate(`/${school.slug}/login`);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-danger hover:bg-danger-soft transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>লগআউট করুন</span>
            </button>
          </div>
        </aside>

        {/* Mobile Sidebar Backdrop */}
        {mobileSidebarOpen && (
          <div 
            className="fixed inset-0 z-30 bg-black/60 lg:hidden"
            onClick={() => setMobileSidebarOpen(false)}
          />
        )}

        {/* ================= RIGHT MAIN WORKSPACE ================= */}
        <div className="flex-1 flex flex-col min-w-0 lg:pl-60">
          {/* Top Bar Header */}
          <header className="sticky top-0 z-20 h-16 bg-surface/90 backdrop-blur-md border-b border-border px-4 sm:px-6 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg text-muted hover:text-text cursor-pointer"
                aria-label="সাইডবার মেনু"
              >
                <Menu className="w-5 h-5" />
              </button>

              <div>
                <span className="text-[11px] text-muted hidden sm:block">হোম / ড্যাশবোর্ড</span>
                <h1 className="text-base sm:text-lg font-heading font-bold text-text truncate">
                  {visibleMenuItems.find(m => m.key === subview)?.label || 'অ্যাডমিন ড্যাশবোর্ড'}
                </h1>
              </div>
            </div>

            {/* Topbar Right Controls */}
            <div className="flex items-center gap-3">
              {/* Quick Search */}
              <div className="relative hidden md:block w-64">
                <Search className="w-4 h-4 absolute left-3 top-3 text-muted pointer-events-none" />
                <input
                  type="text"
                  placeholder="খুঁজুন (Ctrl+K)..."
                  value={globalSearch}
                  onChange={(e) => setGlobalSearch(e.target.value)}
                  className="w-full h-10 rounded-lg bg-surface-2 border border-border pl-9 pr-3 text-xs outline-none focus:border-primary text-text placeholder:text-subtle"
                />
              </div>

              <ThemeToggle mode={mode} toggleMode={toggleMode} lang="bn" />

              {/* User Profile Pill */}
              <div className="flex items-center gap-2 pl-2 border-l border-border">
                <div className="w-8 h-8 rounded-full bg-primary-soft text-primary font-bold text-xs flex items-center justify-center">
                  {currentUser?.name?.[0] || 'অ'}
                </div>
                <div className="hidden sm:block text-left text-xs leading-tight">
                  <span className="font-bold text-text block truncate max-w-[120px]">
                    {currentUser?.name || 'অ্যাডমিন'}
                  </span>
                  <span className="text-[10px] text-muted">
                    {roleNameMap[currentUser?.role] || 'ইউজার'}
                  </span>
                </div>
              </div>
            </div>
          </header>

          {/* Dynamic Module Outlet Component Rendering */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            <Outlet context={{ school, currentUser, supportMode }} />
          </main>
        </div>
      </div>
    </div>
  );
}

