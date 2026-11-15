import React, { useState, useMemo } from 'react';
import { Search, School as SchoolIcon, ExternalLink, MapPin, ArrowRight, Shield } from 'lucide-react';
import { Stagger, StaggerItem } from '../motion/Stagger';
import { Reveal } from '../motion/Reveal';

export default function Schools({ t, schools = [] }) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSchools = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return schools;
    return schools.filter(s => 
      (s.name && s.name.toLowerCase().includes(q)) ||
      (s.code && s.code.toLowerCase().includes(q)) ||
      (s.eiin && String(s.eiin).toLowerCase().includes(q)) ||
      (s.location && s.location.toLowerCase().includes(q)) ||
      (s.district && s.district.toLowerCase().includes(q))
    );
  }, [schools, searchQuery]);

  return (
    <section id="schools" className="py-24 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Section Header & Search Input */}
        <Reveal>
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--primary)]/10 border border-[var(--primary)]/30 text-xs font-semibold text-[var(--primary-text)]">
              <SchoolIcon className="w-3.5 h-3.5" />
              <span>{t('schools.badge') || 'সংযুক্ত শিক্ষাপ্রতিষ্ঠান'}</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[var(--text)] tracking-tight font-heading">
              {t('schools.title') || 'সহজ পাঠশালা নেটওয়ার্কের'}{' '}
              <span className="text-shimmer">{t('schools.titleHighlight') || 'স্কুলসমূহ'}</span>
            </h2>

            <p className="text-[var(--muted)] text-base sm:text-lg font-body">
              {t('schools.subtitle') || 'দেশজুড়ে বিভিন্ন স্কুলের ডিজিটাল পোর্টাল দেখুন এবং তাদের কার্যক্রম পর্যবেক্ষণ করুন।'}
            </p>

            {/* Live Search Input */}
            <div className="pt-4 max-w-md mx-auto relative">
              <div className="relative flex items-center">
                <Search className="w-5 h-5 absolute left-4 text-[var(--muted)] pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('schools.searchPlaceholder') || 'স্কুলের নাম, ইআইআইএন বা জেলা দিয়ে খুঁজুন...'}
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 text-[var(--text)] placeholder-[var(--muted)] shadow-sm transition-all text-sm font-medium"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 text-xs text-[var(--muted)] hover:text-[var(--text)] px-2 py-1 rounded-lg bg-[var(--bg-alt)] border border-[var(--border)]"
                  >
                    মুছুন
                  </button>
                )}
              </div>
            </div>
          </div>
        </Reveal>

        {/* Dynamic School Cards Grid */}
        {filteredSchools.length > 0 ? (
          <Stagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSchools.map((school) => {
              const schoolSlug = school.slug || school.code || school.id;
              const publicUrl = `/${schoolSlug}`;
              const adminUrl = `/${schoolSlug}/admin`;

              return (
                <StaggerItem key={school.id || school.code}>
                  <div className="group h-full flex flex-col justify-between p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--primary)]/60 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 relative overflow-hidden">
                    {/* Top ambient color edge */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--primary)] via-[var(--indigo)] to-[var(--primary)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    <div className="space-y-4">
                      {/* Top Bar: Icon + Live Ping Status */}
                      <div className="flex items-center justify-between">
                        <div className="w-12 h-12 rounded-xl bg-[var(--bg-alt)] border border-[var(--border)] flex items-center justify-center text-[var(--primary)] group-hover:scale-105 transition-transform">
                          <SchoolIcon className="w-6 h-6" />
                        </div>
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--primary)]/10 border border-[var(--primary)]/25 text-[11px] font-semibold text-[var(--primary-text)]">
                          <span className="w-2 h-2 rounded-full bg-[var(--primary)] animate-ping-dot" />
                          <span>{t('schools.activeStatus') || 'চালু'}</span>
                        </div>
                      </div>

                      {/* Title & Info */}
                      <div>
                        <h3 className="text-xl font-bold text-[var(--text)] group-hover:text-[var(--primary-text)] transition-colors line-clamp-1 font-heading">
                          {school.name}
                        </h3>
                        <p className="text-xs text-[var(--muted)] mt-1 flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-[var(--subtle)] shrink-0" />
                          <span className="truncate">{school.location || school.district || 'বাংলাদেশ'}</span>
                        </p>
                      </div>

                      {/* EIIN / Code Tags */}
                      <div className="flex items-center gap-2 text-xs">
                        <span className="px-2.5 py-0.5 rounded-md bg-[var(--bg-alt)] border border-[var(--border)] text-[var(--subtle)] font-mono">
                          EIIN: {school.eiin || 'N/A'}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-md bg-[var(--bg-alt)] border border-[var(--border)] text-[var(--subtle)] font-mono">
                          CODE: {school.code}
                        </span>
                      </div>
                    </div>

                    {/* Bottom Action Buttons */}
                    <div className="pt-6 mt-4 border-t border-[var(--border)] flex items-center justify-between gap-3">
                      <a
                        href={publicUrl}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[var(--primary)] text-[var(--on-primary)] text-xs font-bold hover:brightness-110 transition-all shadow-sm"
                      >
                        <span>{t('schools.viewSite') || 'ওয়েবসাইট ভিজিট'}</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                      <a
                        href={adminUrl}
                        className="inline-flex items-center justify-center p-2 rounded-xl bg-[var(--bg-alt)] hover:bg-[var(--surface-hover)] border border-[var(--border)] text-[var(--text)] text-xs font-medium hover:border-[var(--primary)] transition-all"
                        title={t('schools.adminPortal') || 'অ্যাডমিন প্যানেল'}
                      >
                        <Shield className="w-4 h-4 text-[var(--primary)]" />
                      </a>
                    </div>
                  </div>
                </StaggerItem>
              );
            })}
          </Stagger>
        ) : (
          <Reveal>
            <div className="text-center py-16 px-4 rounded-3xl bg-[var(--surface)] border border-[var(--border)] max-w-xl mx-auto space-y-3">
              <SchoolIcon className="w-12 h-12 text-[var(--muted)] mx-auto opacity-50" />
              <h3 className="text-lg font-bold text-[var(--text)]">
                {t('schools.emptyTitle') || 'কোনো স্কুল খুঁজে পাওয়া যায়নি'}
              </h3>
              <p className="text-sm text-[var(--muted)]">
                {t('schools.emptyDesc') || 'আপনার সার্চ কিওয়ার্ড পরিবর্তন করে পুনরায় চেষ্টা করুন।'}
              </p>
              <button
                onClick={() => setSearchQuery('')}
                className="mt-2 text-xs font-semibold text-[var(--primary)] hover:underline"
              >
                সব স্কুল দেখুন
              </button>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
