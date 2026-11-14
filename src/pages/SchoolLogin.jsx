import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../hooks/useTheme';
import { TenantRepository } from '../services/tenantStorage';
import ThemeToggle from '../components/common/ThemeToggle';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Checkbox from '../components/ui/Checkbox';
import Alert from '../components/ui/Alert';
import Badge from '../components/ui/Badge';
import { Lock, User, ShieldAlert, ArrowLeft, GraduationCap } from 'lucide-react';

export default function SchoolLogin() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const { mode, toggleMode } = useTheme({ slug });

  const school = TenantRepository.getSchoolBySlug(slug || '');

  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('password123');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!school) {
    return (
      <div className="min-h-screen bg-bg text-text flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-danger-soft text-danger flex items-center justify-center mb-4">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-heading font-bold mb-2">স্কুল পাওয়া যায়নি (404)</h2>
        <p className="text-sm text-muted max-w-md mb-6">
          "{slug}" স্লাগের কোনো স্কুল সিস্টেমে নিবন্ধিত নেই। অনুগ্রহ করে সঠিক লিংক ব্যবহার করুন।
        </p>
        <Link to="/">
          <Button variant="secondary" icon={ArrowLeft}>
            মূল প্ল্যাটফর্মে ফিরে যান
          </Button>
        </Link>
      </div>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      login(username, password, school.slug);
      navigate(`/${school.slug}/admin`);
    } catch (err) {
      setError(err.message || 'লগইন ব্যর্থ হয়েছে।');
    } finally {
      setLoading(false);
    }
  };

  // Quick Demo Autofill
  const fillCredentials = (u, p) => {
    setUsername(u);
    setPassword(p);
    setError('');
  };

  return (
    <div className="min-h-screen bg-bg text-text flex flex-col lg:flex-row">
      {/* ================= LEFT BRAND PANEL (--bg-alt) ================= */}
      <div className="lg:w-1/2 bg-bg-alt border-b lg:border-b-0 lg:border-r border-border p-8 sm:p-12 lg:p-16 flex flex-col justify-between">
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <Link to={`/${school.slug}`} className="inline-flex items-center gap-2 text-xs font-semibold text-muted hover:text-text">
            <ArrowLeft className="w-4 h-4" />
            স্কুল সাইটে ফিরুন
          </Link>
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-primary text-on-primary font-heading font-bold text-sm flex items-center justify-center shadow-xs">
              সপ
            </span>
            <span className="text-xs font-heading font-bold text-text">সহজ পাঠশালা</span>
          </div>
        </div>

        {/* School Showcase in the Middle */}
        <div className="my-10 lg:my-0 max-w-lg">
          <div className="w-22 h-22 rounded-full bg-surface border-2 border-primary/40 shadow-xl flex items-center justify-center text-primary mb-6">
            <GraduationCap className="w-11 h-11" />
          </div>

          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-text mb-3 leading-tight">
            {school.name_bn}
          </h2>
          <p className="text-sm sm:text-base text-muted mb-6 leading-relaxed">
            স্কুল অ্যাডমিন প্যানেল — শুধু অনুমোদিত শিক্ষক ও প্রশাসনিক কর্মকর্তা-কর্মচারীদের ব্যবহারের জন্য।
          </p>

          <div className="flex flex-wrap gap-2.5">
            <Badge variant="primary">EIIN: {school.eiin}</Badge>
            <Badge variant="muted">Code: {school.school_code}</Badge>
            <Badge variant="indigo">/{school.slug}/login</Badge>
          </div>
        </div>

        {/* Bottom Platform Credit */}
        <div className="pt-6 border-t border-border/80 text-xs text-muted">
          <span>সহজ পাঠশালা দ্বারা পরিচালিত · Powered by Sohoj Pathshala</span>
        </div>
      </div>

      {/* ================= RIGHT LOGIN FORM ================= */}
      <div className="lg:w-1/2 p-6 sm:p-12 lg:p-16 flex flex-col justify-between bg-bg">
        {/* Top Right Controls */}
        <div className="flex items-center justify-end gap-3 mb-8">
          <ThemeToggle mode={mode} toggleMode={toggleMode} lang="bn" />
        </div>

        {/* Center 400px Form Box */}
        <div className="w-full max-w-[420px] mx-auto my-auto">
          <div className="mb-6">
            <h3 className="text-2xl sm:text-3xl font-heading font-bold text-text mb-2">
              লগইন করুন
            </h3>
            <p className="text-xs sm:text-sm text-muted">
              আপনার ইউজারনেম ও পাসওয়ার্ড দিয়ে অ্যাকাউন্টে প্রবেশ করুন।
            </p>
          </div>

          {error && (
            <Alert variant="danger" className="mb-6">
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="ইউজারনেম (Username)"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. admin"
              icon={User}
              required
              surface="surface"
            />

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs sm:text-sm font-medium text-text">পাসওয়ার্ড</span>
                <span className="text-xs text-primary hover:underline cursor-pointer" onClick={() => alert('পাসওয়ার্ড রিসেট করতে স্কুলের সুপার অ্যাডমিন বা প্রধান শিক্ষকের সাথে যোগাযোগ করুন।')}>
                  পাসওয়ার্ড ভুলে গেছেন?
                </span>
              </div>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="আপনার পাসওয়ার্ড দিন"
                icon={Lock}
                required
                surface="surface"
              />
            </div>

            <Checkbox
              label="এই ডিভাইসে মনে রাখুন"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              className="w-full"
            >
              লগইন করুন
            </Button>
          </form>

          {/* Quick Demo Login Credentials Bar */}
          <div className="mt-8 p-3.5 rounded-xl bg-surface border border-border text-xs">
            <span className="font-bold text-text block mb-1.5">ডেমো লগইন রোল নির্বাচন করুন:</span>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => fillCredentials('admin', 'password123')}
                className="px-2 py-1 rounded bg-surface-2 hover:bg-primary-soft hover:text-primary text-muted cursor-pointer"
              >
                সুপার অ্যাডমিন
              </button>
              <button
                type="button"
                onClick={() => fillCredentials('headmaster', 'password123')}
                className="px-2 py-1 rounded bg-surface-2 hover:bg-primary-soft hover:text-primary text-muted cursor-pointer"
              >
                প্রধান শিক্ষক
              </button>
              <button
                type="button"
                onClick={() => fillCredentials('teacher', 'password123')}
                className="px-2 py-1 rounded bg-surface-2 hover:bg-primary-soft hover:text-primary text-muted cursor-pointer"
              >
                সহকারী শিক্ষক
              </button>
              <button
                type="button"
                onClick={() => fillCredentials('office', 'password123')}
                className="px-2 py-1 rounded bg-surface-2 hover:bg-primary-soft hover:text-primary text-muted cursor-pointer"
              >
                অফিস সহকারী
              </button>
            </div>
          </div>
        </div>

        {/* STRICT Security Notice at the Bottom (NO PUBLIC REGISTRATION) */}
        <div className="mt-8 pt-6 border-t border-border text-center text-xs text-muted max-w-[420px] mx-auto">
          <p>
            অ্যাকাউন্ট নেই? স্কুলের সুপার অ্যাডমিনের সাথে যোগাযোগ করুন। এখানে নিজে অ্যাকাউন্ট খোলা যায় না।
          </p>
        </div>
      </div>
    </div>
  );
}

