import React from 'react';
import { ArrowRight, Sparkles, CheckCircle2, ShieldCheck, Headphones } from 'lucide-react';
import { Reveal } from '../motion/Reveal';

export default function FinalCta({ t, onOpenOnboard }) {
  return (
    <section id="contact" className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <Reveal>
          <div className="relative rounded-[32px] bg-[var(--surface)] border border-[var(--border)] p-8 sm:p-14 lg:p-20 overflow-hidden shadow-2xl text-center">
            {/* Background Multi-layer Glow */}
            <div 
              className="absolute -top-40 -left-40 w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-30"
              style={{ background: 'radial-gradient(circle, var(--glow) 0%, transparent 70%)' }}
            />
            <div 
              className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-25"
              style={{ background: 'radial-gradient(circle, var(--indigo) 0%, transparent 70%)' }}
            />

            <div className="relative max-w-3xl mx-auto space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--primary)]/10 border border-[var(--primary)]/30 text-xs font-semibold text-[var(--primary-text)]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{t('finalCta.badge') || 'স্মার্ট বাংলাদেশ গড়ার অগ্রযাত্রায়'}</span>
              </div>

              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[var(--text)] tracking-tight font-heading leading-tight">
                {t('finalCta.title') || 'আপনার স্কুলকে ডিজিটাল করতে'}{' '}
                <span className="text-shimmer">{t('finalCta.titleHighlight') || 'প্রস্তুত?'}</span>
              </h2>

              <p className="text-[var(--muted)] text-base sm:text-xl font-body leading-relaxed max-w-2xl mx-auto">
                {t('finalCta.subtitle') || 'কাগজের জটিলতা দূর করুন, প্রশাসনিক সময় বাঁচান এবং শিক্ষক ও অভিভাবকদের জন্য উন্মোচন করুন এক আধুনিক অভিজ্ঞতা।'}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <button
                  type="button"
                  onClick={onOpenOnboard}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-[var(--primary)] text-[var(--on-primary)] font-extrabold text-base hover:brightness-110 shadow-[0_4px_24px_var(--glow)] transition-all hover:scale-105 active:scale-95"
                >
                  <span>{t('finalCta.primaryBtn') || 'অনবোর্ডিং শুরু করুন'}</span>
                  <ArrowRight className="w-5 h-5" />
                </button>

                <a
                  href="#schools"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-[var(--bg-alt)] hover:bg-[var(--surface-hover)] border border-[var(--border)] hover:border-[var(--primary)] text-[var(--text)] font-bold text-base transition-all"
                >
                  <span>{t('finalCta.secondaryBtn') || 'বিদ্যমান স্কুল তালিকা দেখুন'}</span>
                </a>
              </div>

              {/* Guarantee highlights row */}
              <div className="flex flex-wrap items-center justify-center gap-6 pt-6 text-xs sm:text-sm text-[var(--muted)] border-t border-[var(--border)] max-w-xl mx-auto">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[var(--primary)]" />
                  <span>{t('finalCta.perk1') || '১৪ দিনের সম্পূর্ণ ফ্রি ট্রায়াল'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[var(--primary)]" />
                  <span>{t('finalCta.perk2') || '১০০% ক্লাউড ডেটা সিকিউরিটি'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Headphones className="w-4 h-4 text-[var(--primary)]" />
                  <span>{t('finalCta.perk3') || '২৪/৭ সার্বক্ষণিক সহায়তা'}</span>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
