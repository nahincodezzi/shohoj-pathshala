import React from 'react';
import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { formatNumber } from '../../../shared/format/formatters';

export default function UtilityBar({
  school,
  settings,
  lang,
  toggleLang,
  fontSize,
  setFontSize
}) {
  const isBn = lang === 'bn';
  const eiin = school?.eiin ? formatNumber(school.eiin, isBn) : '';
  const board = school?.board || settings?.board || '';
  const district = school?.district || settings?.district || '';

  return (
    <div className="hidden lg:block bg-[var(--bg-alt)] border-b border-[var(--border)] text-xs text-[var(--muted)] select-none">
      <div className="max-w-[1240px] mx-auto px-6 h-10 flex items-center justify-between">
        {/* Left: EIIN, Board, District */}
        <div className="flex items-center gap-3">
          {eiin && (
            <span className="flex items-center gap-1">
              <span>{isBn ? 'ইআইআইএন:' : 'EIIN:'}</span>
              <strong className="text-[var(--text)] font-semibold font-mono">{eiin}</strong>
            </span>
          )}
          {board && (
            <>
              <span className="text-[var(--border)]">•</span>
              <span className="flex items-center gap-1">
                <span>{isBn ? 'বোর্ড:' : 'Board:'}</span>
                <strong className="text-[var(--text)] font-semibold">{board}</strong>
              </span>
            </>
          )}
          {district && (
            <>
              <span className="text-[var(--border)]">•</span>
              <span className="flex items-center gap-1">
                <span>{isBn ? 'জেলা:' : 'District:'}</span>
                <strong className="text-[var(--text)] font-semibold">{district}</strong>
              </span>
            </>
          )}
        </div>

        {/* Right: Language, Font Size Scale, Admin Login */}
        <div className="flex items-center gap-4">
          {/* Font Scale (A-, A, A+) */}
          <div className="flex items-center gap-1 bg-[var(--surface)] px-2 py-0.5 rounded-lg border border-[var(--border)]" aria-label="Font scale adjustment">
            <span className="text-[10px] text-[var(--subtle)] mr-1">{isBn ? 'ফন্ট:' : 'Font:'}</span>
            <button
              type="button"
              onClick={() => setFontSize('sm')}
              className={`px-1.5 py-0.5 rounded text-[11px] font-bold transition-colors cursor-pointer ${fontSize === 'sm' ? 'bg-[var(--primary)] text-[var(--on-primary)]' : 'hover:text-[var(--text)]'}`}
              title="ছোট ফন্ট (14px)"
            >
              A-
            </button>
            <button
              type="button"
              onClick={() => setFontSize('md')}
              className={`px-1.5 py-0.5 rounded text-[11px] font-bold transition-colors cursor-pointer ${fontSize === 'md' ? 'bg-[var(--primary)] text-[var(--on-primary)]' : 'hover:text-[var(--text)]'}`}
              title="ডিফল্ট ফন্ট (16px)"
            >
              A
            </button>
            <button
              type="button"
              onClick={() => setFontSize('lg')}
              className={`px-1.5 py-0.5 rounded text-[11px] font-bold transition-colors cursor-pointer ${fontSize === 'lg' ? 'bg-[var(--primary)] text-[var(--on-primary)]' : 'hover:text-[var(--text)]'}`}
              title="বড় ফন্ট (18px)"
            >
              A+
            </button>
          </div>

          {/* Language Toggle (বাং | EN) */}
          <button
            type="button"
            onClick={toggleLang}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[var(--surface)] border border-[var(--border)] font-bold text-[11px] text-[var(--text)] hover:border-[var(--primary)] transition-colors cursor-pointer"
          >
            <span>{isBn ? 'বাং' : 'EN'}</span>
            <span className="text-[var(--subtle)]">|</span>
            <span className="text-[var(--muted)]">{isBn ? 'EN' : 'বাং'}</span>
          </button>

          {/* Admin Portal Link */}
          <Link
            to={`/${school?.slug}/login`}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[var(--surface)] hover:bg-[var(--surface-hover)] border border-[var(--border)] text-[var(--text)] hover:text-[var(--primary-text)] font-semibold transition-colors"
          >
            <Shield className="w-3.5 h-3.5 text-[var(--primary)]" />
            <span>{isBn ? 'অ্যাডমিন পোর্টাল' : 'Admin Portal'}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
