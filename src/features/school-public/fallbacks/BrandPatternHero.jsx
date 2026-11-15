import React from 'react';
import { School, Calendar, MapPin } from 'lucide-react';

export default function BrandPatternHero({ school, settings }) {
  const estYear = settings?.est_year || school?.established_year || school?.created_at?.slice(0, 4) || '';

  return (
    <div className="relative w-full h-[480px] sm:h-[540px] flex items-center justify-center overflow-hidden bg-gradient-to-br from-[var(--bg)] via-[var(--surface)] to-[var(--bg-alt)] border-b border-[var(--border)]">
      {/* Decorative Brand SVG Pattern */}
      <div 
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at 25px 25px, var(--primary) 2px, transparent 0)',
          backgroundSize: '50px 50px'
        }}
      />

      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center space-y-6">
        <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-3xl bg-[var(--primary)]/15 border-2 border-[var(--primary)]/40 flex items-center justify-center text-[var(--primary)] shadow-[0_0_35px_var(--glow)]">
          <School className="w-10 h-10 sm:w-12 sm:h-12" />
        </div>

        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[var(--surface)] border border-[var(--border)] text-xs font-semibold text-[var(--subtle)] font-mono">
            <span>EIIN: {school?.eiin || 'N/A'}</span>
            {school?.board && <span>• {school.board} বোর্ড</span>}
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-[var(--text)] font-heading tracking-tight">
            {school?.name_bn || school?.name}
          </h1>

          <p className="text-base sm:text-lg text-[var(--muted)] max-w-xl mx-auto font-body">
            {school?.location || school?.district || 'গণপ্রজাতন্ত্রী বাংলাদেশ'}
            {estYear && ` • স্থাপিত: ${estYear}`}
          </p>
        </div>
      </div>
    </div>
  );
}
