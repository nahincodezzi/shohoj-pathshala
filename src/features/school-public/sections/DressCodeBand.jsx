import React from 'react';
import { Shirt, ArrowRight } from 'lucide-react';
import { Reveal } from '../../../shared/motion';

export default function DressCodeBand({
  uniform,
  sections = {},
  onOpenUniform,
  lang = 'bn'
}) {
  if (sections.uniform === false) return null;

  const isBn = lang === 'bn';
  const summary = uniform?.summary_bn || uniform?.summary || (isBn ? 'সাদা শার্ট, নেভি ব্লু প্যান্ট/স্কার্ট এবং প্রাতিষ্ঠানিক ব্যাজ ও আইডি কার্ড বাধ্যতামূলক।' : 'White shirt, navy blue trousers/skirt with official institutional badge & ID card.');

  return (
    <section id="uniform" className="py-8 px-6 max-w-[1240px] mx-auto">
      <Reveal>
        <div className="p-6 sm:p-7 rounded-3xl bg-[var(--surface)] border-2 border-[var(--accent)]/45 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden card-lift">
          {/* Subtle Ambient Gold Glow in Background */}
          <div 
            className="absolute -right-20 -top-20 w-64 h-64 rounded-full blur-3xl pointer-events-none opacity-20"
            style={{ background: 'var(--accent)' }}
          />

          <div className="flex items-center gap-4 relative z-10 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-[var(--accent)]/15 border border-[var(--accent)]/30 text-[var(--accent-text)] flex items-center justify-center shrink-0 shadow-xs">
              <Shirt className="w-6 h-6" />
            </div>

            <div className="min-w-0">
              <span className="text-[11px] font-bold text-[var(--accent-text)] uppercase tracking-wider block font-mono">
                {isBn ? 'পোশাক ও শৃঙ্খলা' : 'DRESS CODE & DISCIPLINE'}
              </span>
              <p className="text-sm sm:text-base font-semibold text-[var(--text)] font-body truncate mt-0.5">
                {summary}
              </p>
            </div>
          </div>

          <div className="relative z-10 shrink-0 w-full md:w-auto">
            <button
              type="button"
              onClick={onOpenUniform}
              className="w-full md:w-auto inline-flex items-center justify-center gap-2 h-11 px-6 rounded-xl border-2 border-[var(--accent)] text-[var(--accent-text)] hover:bg-[var(--accent)] hover:text-[var(--on-accent)] font-bold text-xs transition-all cursor-pointer shadow-xs active:scale-95"
            >
              <span>{isBn ? 'পূর্ণ নির্দেশিকা ও নমুনা' : 'Full Guidelines'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
