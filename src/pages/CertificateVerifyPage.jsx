import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { TenantRepository } from '../services/tenantStorage';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import ThemeToggle from '../components/common/ThemeToggle';
import { toBengaliNumber } from '../utils/dateFormatter';
import { 
  ShieldCheck, 
  Award, 
  Building2, 
  Calendar, 
  UserCheck, 
  CheckCircle2, 
  FileText, 
  Printer, 
  ArrowLeft,
  AlertTriangle,
  QrCode,
  Share2
} from 'lucide-react';

export default function CertificateVerifyPage() {
  const { slug, certCode } = useParams();
  const [cert, setCert] = useState(null);
  const [school, setSchool] = useState(null);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Find Certificate by Verification Code
    const foundCert = TenantRepository.getCertificateByCode(certCode);
    if (foundCert) {
      setCert(foundCert);
      const foundSchool = TenantRepository.getSchoolById(foundCert.school_id);
      setSchool(foundSchool);
      if (foundSchool) {
        const foundSettings = TenantRepository.getSettings(foundSchool.id);
        setSettings(foundSettings);
      }
    } else if (slug) {
      // Fallback: look under slug's school
      const s = TenantRepository.getSchoolBySlug(slug);
      if (s) {
        setSchool(s);
        const certs = TenantRepository.getCertificates(s.id);
        const match = certs.find(c => c.verification_code === certCode || c.certificate_no === certCode);
        if (match) {
          setCert(match);
          setSettings(TenantRepository.getSettings(s.id));
        }
      }
    }
    setLoading(false);
  }, [slug, certCode]);

  if (loading) {
    return (
      <div className="min-h-screen bg-bg text-text flex items-center justify-center p-6">
        <div className="animate-pulse text-center space-y-3">
          <Award className="w-12 h-12 text-primary mx-auto animate-bounce" />
          <p className="text-sm text-muted">ডিজিটাল সনদ যাচাই করা হচ্ছে...</p>
        </div>
      </div>
    );
  }

  // Not Found or Invalid Code State
  if (!cert || !school) {
    return (
      <div className="min-h-screen bg-bg text-text flex flex-col items-center justify-center p-6">
        <Card surface="surface" className="max-w-md w-full p-8 text-center space-y-4 border border-border">
          <div className="w-16 h-16 rounded-2xl bg-danger-soft text-danger flex items-center justify-center mx-auto">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold font-heading text-text">
            সনদ খুঁজে পাওয়া যায়নি
          </h2>
          <p className="text-xs text-muted leading-relaxed">
            কোড: <code className="font-mono font-bold text-danger">{certCode}</code>
            <br />
            এই ভেরিফিকেশন কোডের কোনো ডিজিটাল সনদ ডাটাবেজে রেকর্ড করা নেই অথবা সনদটি ইতিমধ্যে বাতিল করা হয়েছে।
          </p>
          <div className="pt-2">
            <Link to="/">
              <Button variant="secondary" icon={ArrowLeft} size="sm">
                মূল হোমপেজে ফিরে যান
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  const isTc = cert.type === 'tc';
  const isAtt = cert.type === 'attestation';

  return (
    <div className="min-h-screen bg-bg text-text selection:bg-primary selection:text-on-primary">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-surface/80 backdrop-blur-md border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to={`/${school.slug}`} className="flex items-center gap-2.5 hover:opacity-85 transition-opacity">
            <img
              src={school.logo || school.logo_url || '/favicon.svg'}
              alt={school.name_bn}
              className="w-9 h-9 rounded-full object-contain border border-border p-0.5"
            />
            <div>
              <span className="text-sm font-bold font-heading text-text block leading-tight">
                {school.name_bn}
              </span>
              <span className="text-[10px] text-muted font-mono block">
                EIIN: {school.eiin} • {school.board} বোর্ড
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <ThemeToggle slug={school.slug} />
            <Link to={`/${school.slug}`}>
              <Button variant="secondary" size="xs" icon={ArrowLeft}>
                স্কুল সাইট
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-6">
        {/* Verification Success Hero Banner */}
        <div className="p-6 rounded-3xl bg-success-soft border border-success/30 flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
          <div className="w-14 h-14 rounded-2xl bg-success text-on-primary flex items-center justify-center shrink-0 shadow-lg">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-success/20 text-success text-[11px] font-bold font-mono uppercase tracking-wider">
              <CheckCircle2 className="w-3.5 h-3.5" />
              অফিশিয়াল ডিজিটাল সনদ যাচাইকৃত
            </div>
            <h1 className="text-xl sm:text-2xl font-bold font-heading text-text">
              সনদটি ১০০% সঠিক ও শিক্ষাপ্রতিষ্ঠান কর্তৃক অনুমোদিত
            </h1>
            <p className="text-xs text-muted leading-relaxed">
              সহজ পাঠশালা ভেরিফিকেশন ইঞ্জিন দ্বারা যাচাইকৃত। এই সনদটি মূল প্রাতিষ্ঠানিক ডাটাবেজ থেকে লাইভ প্রদর্শন করা হচ্ছে।
            </p>
          </div>
        </div>

        {/* Certificate Particulars Card */}
        <Card surface="surface" className="p-6 sm:p-8 space-y-6 border border-border shadow-lg">
          {/* Institution Header */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4 pb-6 border-b border-border text-center sm:text-left">
            <div>
              <span className="text-[10px] font-mono text-muted uppercase tracking-wider block">
                ইস্যুকারী শিক্ষাপ্রতিষ্ঠান
              </span>
              <h2 className="text-lg sm:text-xl font-bold font-heading text-primary mt-0.5">
                {school.name_bn}
              </h2>
              <p className="text-xs text-muted mt-0.5">
                {school.name_en || school.nameAlt}
              </p>
              <div className="text-[11px] text-muted font-mono mt-1">
                EIIN: {school.eiin} • MPO: {school.mpo_code || '০৯০৫১৭১৩০১'} • কোড: {school.school_code || '৪৩২'}
              </div>
            </div>

            <div className="text-center sm:text-right shrink-0">
              <Badge variant={isTc ? 'warning' : isAtt ? 'info' : 'primary'} size="lg">
                {isTc ? 'ছাড়পত্র (TC)' : isAtt ? 'প্রত্যয়নপত্র' : 'প্রশংসাপত্র (Testimonial)'}
              </Badge>
              <div className="text-[11px] font-mono font-bold text-text mt-2">
                সনদ নং: {cert.certificate_no}
              </div>
              <div className="text-[10px] font-mono text-muted">
                ইস্যু তারিখ: {cert.issued_date}
              </div>
            </div>
          </div>

          {/* Student Identity Grid */}
          <div className="space-y-4">
            <h3 className="text-xs font-mono font-bold text-muted uppercase tracking-wider">
              শিক্ষার্থীর মূল পরিচয় ও তথ্যাবলি
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-surface-2 border border-border">
              <div>
                <span className="text-[11px] text-muted block">শিক্ষার্থীর নাম (বাংলা)</span>
                <span className="text-base font-bold text-text block mt-0.5">
                  {cert.student_name_bn}
                </span>
                {cert.student_name_en && (
                  <span className="text-xs text-muted block font-sans">
                    {cert.student_name_en}
                  </span>
                )}
              </div>

              <div>
                <span className="text-[11px] text-muted block">শিক্ষার্থী আইডি ও রোল</span>
                <span className="text-sm font-mono font-bold text-text block mt-0.5">
                  ID: {cert.student_id || 'BDHS-2026-1001'}
                </span>
                <span className="text-xs text-muted font-mono">
                  {toBengaliNumber(cert.class)}ম শ্রেণি • রোল: {toBengaliNumber(cert.roll)}
                </span>
              </div>

              <div>
                <span className="text-[11px] text-muted block">পিতার নাম</span>
                <span className="text-sm font-semibold text-text block mt-0.5">
                  {cert.father_name_bn || '—'}
                </span>
              </div>

              <div>
                <span className="text-[11px] text-muted block">মাতার নাম</span>
                <span className="text-sm font-semibold text-text block mt-0.5">
                  {cert.mother_name_bn || '—'}
                </span>
              </div>

              <div>
                <span className="text-[11px] text-muted block">শিক্ষাবর্ষ / সেশন</span>
                <span className="text-sm font-semibold text-text block mt-0.5">
                  {cert.session || '২০২৫-২০২৬'}
                </span>
              </div>

              <div>
                <span className="text-[11px] text-muted block">শিক্ষা বোর্ড</span>
                <span className="text-sm font-semibold text-text block mt-0.5">
                  {cert.board || school.board} শিক্ষা বোর্ড
                </span>
              </div>
            </div>
          </div>

          {/* Academic Result / Conduct Details */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono font-bold text-muted uppercase tracking-wider">
              পরীক্ষা ও চারিত্রিক ফলাফল
            </h3>

            <div className="p-4 rounded-2xl bg-surface-2 border border-border space-y-3">
              {cert.exam_name && (
                <div className="flex flex-col sm:flex-row justify-between text-xs gap-1 border-b border-border/50 pb-2">
                  <span className="text-muted">অংশগ্রহণকৃত পরীক্ষা:</span>
                  <span className="font-bold text-text">{cert.exam_name}</span>
                </div>
              )}

              {cert.gpa && (
                <div className="flex justify-between items-center text-xs border-b border-border/50 pb-2">
                  <span className="text-muted">অর্জিত ফলাফল (GPA):</span>
                  <span className="font-mono font-bold text-success text-sm bg-success-soft px-2.5 py-0.5 rounded">
                    GPA: {cert.gpa}
                  </span>
                </div>
              )}

              {cert.exam_roll && (
                <div className="flex justify-between text-xs border-b border-border/50 pb-2">
                  <span className="text-muted">বোর্ড পরীক্ষার রোল ও রেজি:</span>
                  <span className="font-mono text-text">
                    রোল: {cert.exam_roll} {cert.exam_reg ? `• রেজি: ${cert.exam_reg}` : ''}
                  </span>
                </div>
              )}

              {isTc && cert.tc_reason && (
                <div className="flex justify-between text-xs border-b border-border/50 pb-2">
                  <span className="text-muted">বিদ্যালয় ত্যাগের কারণ:</span>
                  <span className="font-semibold text-warning">{cert.tc_reason}</span>
                </div>
              )}

              <div className="flex flex-col sm:flex-row justify-between text-xs gap-1">
                <span className="text-muted">আচরণ ও মন্তব্য:</span>
                <span className="font-medium text-text sm:text-right max-w-md">
                  {cert.remarks || 'তাহার নৈতিক চরিত্র প্রশংসনীয়।'}
                </span>
              </div>
            </div>
          </div>

          {/* Official Issuing Authority */}
          <div className="pt-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-primary-soft text-primary flex items-center justify-center font-bold">
                ✓
              </div>
              <div>
                <span className="text-[10px] text-muted block">ইস্যুকারী কর্তৃপক্ষ:</span>
                <span className="font-bold text-text">
                  {settings?.headmaster_name || cert.issued_by || 'প্রধান শিক্ষক'}
                </span>
                <span className="text-[11px] text-muted block">
                  {settings?.headmaster_designation || 'প্রধান শিক্ষক'}, {school.name_bn}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="primary"
                size="sm"
                icon={Printer}
                onClick={() => window.print()}
              >
                সত্যায়িত কপি প্রিন্ট
              </Button>
            </div>
          </div>
        </Card>
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-border text-center text-xs text-muted font-mono">
        সহজ পাঠশালা ডিজিটাল এডুকেশন ম্যানেজমেন্ট নেটওয়ার্ক • নিরাপদ কিউআর সনদ ভেরিফিকেশন সিস্টেম
      </footer>
    </div>
  );
}
