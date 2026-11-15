import React from 'react';
import { GraduationCap, ArrowUp, Shield, Mail, Phone, MapPin, Heart } from 'lucide-react';

export default function Footer({ t }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[var(--surface)] border-t border-[var(--border)] pt-16 pb-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Column (2 cols wide) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[var(--primary)] text-[var(--on-primary)] flex items-center justify-center shadow-[0_0_16px_var(--glow)]">
                <GraduationCap className="w-6 h-6" />
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-[var(--text)] font-heading">
                সহজ পাঠশালা
              </span>
            </div>

            <p className="text-sm text-[var(--muted)] leading-relaxed max-w-sm font-body">
              {t('footer.brandDesc') || 'বাংলাদেশের শিক্ষা প্রতিষ্ঠানসমূহের জন্য সম্পূর্ণ মাল্টি-টেন্যান্ট ক্লাউড এডুকেশন ম্যানেজমেন্ট ইকোসিস্টেম। সহজ, দ্রুত ও শতভাগ নিরাপদ।'}
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--bg-alt)] border border-[var(--border)] text-xs text-[var(--subtle)]">
              <span className="w-2 h-2 rounded-full bg-[var(--primary)] animate-ping-dot" />
              <span>{t('footer.systemStatus') || 'সকল সিস্টেম সক্রিয় ও কার্যকর'}</span>
            </div>
          </div>

          {/* Quick Links 1: Platform & Modules */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-[var(--text)] uppercase tracking-wider font-heading">
              {t('footer.col1.title') || 'প্ল্যাটফর্ম'}
            </h4>
            <ul className="space-y-2 text-sm text-[var(--muted)] font-body">
              <li><a href="#hero" className="hover:text-[var(--primary-text)] transition-colors">মূল পাতা</a></li>
              <li><a href="#modules" className="hover:text-[var(--primary-text)] transition-colors">মডিউলসমূহ</a></li>
              <li><a href="#steps" className="hover:text-[var(--primary-text)] transition-colors">অনবোর্ডিং ধাপ</a></li>
              <li><a href="#security" className="hover:text-[var(--primary-text)] transition-colors">নিরাপত্তা ও প্রাইভেসি</a></li>
              <li><a href="#pricing" className="hover:text-[var(--primary-text)] transition-colors">প্যাকেজ ও মূল্যতালিকা</a></li>
            </ul>
          </div>

          {/* Quick Links 2: Direct Portals */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-[var(--text)] uppercase tracking-wider font-heading">
              {t('footer.col2.title') || 'অ্যাক্সেস পোর্টাল'}
            </h4>
            <ul className="space-y-2 text-sm text-[var(--muted)] font-body">
              <li><a href="#schools" className="hover:text-[var(--primary-text)] transition-colors">স্কুল তালিকা</a></li>
              <li><a href="/owner" className="hover:text-[var(--primary-text)] transition-colors">সুপার অ্যাডমিন ড্যাশবোর্ড</a></li>
              <li><a href="/owner" className="hover:text-[var(--primary-text)] transition-colors">ল্যান্ডিং পেজ CMS</a></li>
              <li><a href="/bdhs" className="hover:text-[var(--primary-text)] transition-colors">ডেমো স্কুল পোর্টাল</a></li>
              <li><a href="/bdhs/admin" className="hover:text-[var(--primary-text)] transition-colors">স্কুল অ্যাডমিন লগইন</a></li>
            </ul>
          </div>

          {/* Quick Links 3: Contact & Support */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-[var(--text)] uppercase tracking-wider font-heading">
              {t('footer.col3.title') || 'যোগাযোগ ও সহায়তা'}
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-[var(--muted)] font-body">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[var(--primary)] shrink-0 mt-0.5" />
                <span>ঢাকা, বাংলাদেশ</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[var(--primary)] shrink-0" />
                <span className="font-mono">০১৯XX-XXXXXX</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[var(--primary)] shrink-0" />
                <span className="font-mono">support@sohojpathshala.app</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Back to Top */}
        <div className="pt-8 border-t border-[var(--border)] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--muted)]">
          <p className="flex items-center gap-1">
            <span>© ২০২৬ সহজ পাঠশালা (Shohoj Pathshala)। সর্বস্বত্ব সংরক্ষিত।</span>
          </p>

          <div className="flex items-center gap-4">
            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--bg-alt)] border border-[var(--border)] hover:border-[var(--primary)] text-[var(--text)] hover:text-[var(--primary)] transition-all"
            >
              <span>উপরে যান</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
