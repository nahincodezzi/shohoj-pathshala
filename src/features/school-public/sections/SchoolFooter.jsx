import React from 'react';
import { ArrowUp, MapPin, Phone, Mail, ExternalLink, Shield } from 'lucide-react';
import InitialsAvatar from '../fallbacks/InitialsAvatar';
import { formatNumber } from '../../../shared/format/formatters';

/**
 * SchoolFooter Section (Section 6.14)
 * Strict rules:
 * - Background is --bg-alt
 * - Dynamic school identity with fallback InitialsAvatar
 * - Only approved navigation links (no Owner panel or Design showcase)
 * - Platform attribution on the right
 */
export default function SchoolFooter({ school, navItems = [], lang = 'bn' }) {
  if (!school) return null;

  const currentYear = new Date().getFullYear();
  const yearText = formatNumber(currentYear, lang);
  const eiinText = school.eiin ? formatNumber(school.eiin, lang) : '';

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const t = {
    slogan: school.slogan || (lang === 'bn' ? 'জ্ঞানই আলো · সুশিক্ষা দেশ গড়ার মূল ভিত্তি' : 'Excellence in Education'),
    quickLinks: lang === 'bn' ? 'প্রয়োজনীয় লিংক' : 'Quick Links',
    contact: lang === 'bn' ? 'যোগাযোগ' : 'Contact',
    adminLogin: lang === 'bn' ? 'অ্যাডমিন পোর্টাল' : 'Admin Portal',
    poweredBy: lang === 'bn' ? 'সহজ পাঠশালা প্ল্যাটফর্মে পরিচালিত' : 'Powered by Sohoj Pathshala',
    copyright: lang === 'bn' ? 'সর্বস্বত্ব সংরক্ষিত।' : 'All rights reserved.',
    backToTop: lang === 'bn' ? 'উপরে উঠুন' : 'Back to top'
  };

  return (
    <footer className="bg-[var(--bg-alt)] border-t border-[var(--border)] text-[var(--text)] transition-colors relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          {/* Col 1: School Identity (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              {school.logo ? (
                <img
                  src={school.logo}
                  alt={school.name}
                  className="w-12 h-12 rounded-2xl object-cover border border-[var(--border)] shadow-xs"
                />
              ) : (
                <InitialsAvatar name={school.name} size="md" />
              )}
              <div>
                <h3 className="font-heading font-black text-xl text-[var(--text)] tracking-tight">
                  {school.name}
                </h3>
                <div className="flex items-center gap-2 text-xs text-[var(--muted)] font-mono">
                  {school.eiin && <span>EIIN: {school.eiin}</span>}
                  {school.board && <span>· {school.board} {lang === 'bn' ? 'বোর্ড' : 'Board'}</span>}
                </div>
              </div>
            </div>

            <p className="text-sm text-[var(--muted)] leading-relaxed max-w-sm">
              {t.slogan}
            </p>

            {/* School Admin Quick Access */}
            <div className="pt-2">
              <a
                href={`/${school.slug}/login`}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[var(--surface)] hover:bg-[var(--surface-hover)] border border-[var(--border)] hover:border-[var(--primary)] text-xs font-semibold text-[var(--text)] transition-all shadow-2xs"
              >
                <Shield className="w-3.5 h-3.5 text-[var(--primary)]" />
                <span>{t.adminLogin}</span>
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--subtle)] font-mono">
              {t.quickLinks}
            </h4>
            <ul className="space-y-2.5 text-sm">
              {navItems.map((item) => (
                <li key={item.id}>
                  {item.onClick ? (
                    <button
                      type="button"
                      onClick={item.onClick}
                      className="text-[var(--muted)] hover:text-[var(--primary)] transition-colors text-left"
                    >
                      {item.label}
                    </button>
                  ) : (
                    <a
                      href={item.href}
                      className="text-[var(--muted)] hover:text-[var(--primary)] transition-colors inline-block"
                    >
                      {item.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Contact Summary (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--subtle)] font-mono">
              {t.contact}
            </h4>
            <div className="space-y-2.5 text-sm text-[var(--muted)]">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[var(--primary)] shrink-0 mt-0.5" />
                <span>{school.address || (lang === 'bn' ? 'স্কুল রোড, সদর' : 'School Road')}, {school.district || ''}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[var(--primary)] shrink-0" />
                <a href={`tel:${school.phone || '01812345678'}`} className="hover:text-[var(--primary)] font-mono">
                  {school.phone || '০১৮১২-৩৪৫৬৭৮'}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[var(--primary)] shrink-0" />
                <a href={`mailto:${school.email || 'info@school.edu.bd'}`} className="hover:text-[var(--primary)] break-all">
                  {school.email || `info@${school.slug || 'school'}.edu.bd`}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Platform Credit */}
        <div className="mt-14 pt-8 border-t border-[var(--border)] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--muted)]">
          <div>
            © {yearText} <span className="font-bold text-[var(--text)]">{school.name}</span>
            {eiinText && ` · EIIN ${eiinText}`} · {t.copyright}
          </div>

          <div className="flex items-center gap-4">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 hover:text-[var(--primary)] transition-colors font-medium"
            >
              <span>{t.poweredBy}</span>
              <ExternalLink className="w-3 h-3 opacity-70" />
            </a>

            {/* Back to top button */}
            <button
              type="button"
              onClick={scrollToTop}
              aria-label={t.backToTop}
              className="w-8 h-8 rounded-lg bg-[var(--surface)] hover:bg-[var(--surface-hover)] border border-[var(--border)] flex items-center justify-center text-[var(--text)] hover:text-[var(--primary)] transition-all shadow-2xs"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
