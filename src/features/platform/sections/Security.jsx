import React from 'react';
import { ShieldCheck, Lock, KeyRound, Clock, CheckCircle2 } from 'lucide-react';
import { Reveal } from '../motion/Reveal';

export default function Security({ t }) {
  const points = [
    {
      icon: KeyRound,
      title: t('security.points.rbac.title') || 'রোল ভিত্তিক নিয়ন্ত্রণ (RBAC)',
      desc: t('security.points.rbac.desc') || 'হেডমাস্টার, শিক্ষক, ক্যাশিয়ার, অভিভাবক — যার যতটুকু প্রয়োজন ঠিক ততটুকুই দেখতে ও সম্পাদন করতে পারবেন।'
    },
    {
      icon: Lock,
      title: t('security.points.lockout.title') || '৫ বার ভুল পাসওয়ার্ডে সাময়িক লকআউট',
      desc: t('security.points.lockout.desc') || 'ব্রুট-ফোর্স আক্রমণ প্রতিরোধে স্বয়ংক্রিয় লকআউট ও সম্পূর্ণ সেশন ক্রিপ্টোগ্রাফিক সুরক্ষা।'
    },
    {
      icon: Clock,
      title: t('security.points.grace.title') || '৩০ দিন সময়সীমা ও গ্রেস সুরক্ষা',
      desc: t('security.points.grace.desc') || 'সাবস্ক্রিপশন শেষে কোনো জরুরি ডেটা হারাবে না, নিরবচ্ছিন্ন ব্যাকআপ ও পূর্ণ ডেটা অখণ্ডতা বজায় থাকে।'
    }
  ];

  return (
    <section id="security" className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <Reveal>
          <div className="relative rounded-[28px] bg-[var(--surface)] border border-[var(--border)] p-8 sm:p-12 lg:p-16 overflow-hidden shadow-2xl">
            {/* Background ambient radial glow */}
            <div 
              className="absolute -top-32 -right-32 w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-40"
              style={{ background: 'radial-gradient(circle, var(--glow) 0%, transparent 70%)' }}
            />
            <div 
              className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-20"
              style={{ background: 'radial-gradient(circle, var(--indigo) 0%, transparent 70%)' }}
            />

            <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              {/* Left Column: Multi-ring Orbit & Shield Box */}
              <div className="lg:col-span-5 flex justify-center items-center py-8">
                <div className="relative w-72 h-72 sm:w-80 sm:h-80 flex items-center justify-center">
                  {/* Outer Orbit Ring (300px, green dashed) */}
                  <div className="absolute w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] rounded-full border border-dashed border-[var(--primary)]/30 animate-orbit flex items-start justify-center">
                    <div className="w-4 h-4 rounded-full bg-[var(--primary)] shadow-[0_0_12px_var(--primary)] -mt-2 animate-ping-dot" />
                  </div>

                  {/* Inner Orbit Ring (210px, indigo dashed) */}
                  <div className="absolute w-[200px] h-[200px] sm:w-[220px] sm:h-[220px] rounded-full border border-dashed border-[var(--indigo)]/40 animate-orbit-reverse flex items-end justify-center">
                    <div className="w-3.5 h-3.5 rounded-full bg-[var(--indigo)] shadow-[0_0_10px_var(--indigo)] -mb-2" />
                  </div>

                  {/* Center Core Shield Box (110px) */}
                  <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-[var(--surface-hover)] border-2 border-[var(--primary)]/50 flex flex-col items-center justify-center shadow-[0_0_35px_var(--glow)] z-10">
                    <ShieldCheck className="w-14 h-14 text-[var(--primary)] animate-float" />
                    <span className="text-[10px] font-bold tracking-widest uppercase text-[var(--primary)] mt-1">100% ISOLATED</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Copy & Checklist Cards */}
              <div className="lg:col-span-7 space-y-8">
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--primary)]/10 border border-[var(--primary)]/30 text-xs font-semibold text-[var(--primary-text)]">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>{t('security.badge') || 'এন্টারপ্রাইজ-গ্রেড নিরাপত্তা'}</span>
                  </div>

                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[var(--text)] tracking-tight font-heading leading-tight">
                    {t('security.title') || 'এক স্কুলের ডেটা আরেক স্কুল'}{' '}
                    <span className="text-shimmer">{t('security.titleHighlight') || 'কখনো দেখে না'}</span>
                  </h2>

                  <p className="text-[var(--muted)] text-base sm:text-lg leading-relaxed max-w-2xl font-body">
                    {t('security.subtitle') || 'প্রতিটি স্কুলের জন্য রয়েছে সুনির্দিষ্ট আইসোলেশন ও কঠোর রোল-বেসড অ্যাক্সেস কন্ট্রোল। কোনো ডেটা ওভারল্যাপ বা তথ্য ফাঁসের সুযোগ নেই।'}
                  </p>
                </div>

                <div className="space-y-4">
                  {points.map((pt, i) => {
                    const Icon = pt.icon;
                    return (
                      <div
                        key={i}
                        className="flex items-start gap-4 p-4 sm:p-5 rounded-2xl bg-[var(--bg-alt)]/60 border border-[var(--border)] hover:border-[var(--primary)]/50 transition-colors duration-300"
                      >
                        <div className="w-10 h-10 rounded-xl bg-[var(--primary)]/10 border border-[var(--primary)]/20 flex items-center justify-center shrink-0 text-[var(--primary)] mt-0.5">
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-[var(--text)] text-base sm:text-lg">
                              {pt.title}
                            </h3>
                            <CheckCircle2 className="w-4 h-4 text-[var(--primary)]" />
                          </div>
                          <p className="text-[var(--muted)] text-sm leading-relaxed">
                            {pt.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
