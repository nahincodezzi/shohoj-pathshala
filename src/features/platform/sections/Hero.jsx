import React from 'react';
import { ArrowRight, Play, Sparkles } from 'lucide-react';
import Stagger, { StaggerItem } from '../motion/Stagger';
import RotatingWord from '../motion/RotatingWord';
import CountUp from '../motion/CountUp';
import DashboardMockup from './DashboardMockup';

export default function Hero({ t, landing, lang = 'bn' }) {
  const handleScrollTo = (e, id) => {
    e.preventDefault();
    const elem = document.querySelector(id);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const rotatingWords = t.rotating_words || [
    'অনলাইন ভর্তি',
    'রেজাল্ট প্রকাশ',
    'ফি আদায়',
    'নোটিশ বোর্ড'
  ];

  const heroTitleLine1 = lang === 'en'
    ? (landing?.hero_title_en || t.hero_title_line1)
    : (landing?.hero_title ? landing.hero_title.split('\n')[0] : t.hero_title_line1);

  const heroTitleLine2 = lang === 'en'
    ? (landing?.hero_title_en_line2 || t.hero_title_line2)
    : (landing?.hero_title && landing.hero_title.split('\n')[1] ? landing.hero_title.split('\n')[1] : t.hero_title_line2);

  const heroSubtitle = lang === 'en'
    ? (landing?.hero_subtitle_en || t.hero_sub)
    : (landing?.hero_subtitle || t.hero_sub);

  return (
    <section className="relative overflow-hidden pt-12 pb-20 sm:pt-16 sm:pb-28">
      {/* Background Layer 1: Aurora Glow 1 (Top-Left Green Radial 620px) */}
      <div
        className="pointer-events-none absolute -top-40 -left-40 w-[620px] h-[620px] rounded-full bg-[radial-gradient(circle_at_center,var(--primary)_0%,transparent_70%)] opacity-35 filter blur-[90px] animate-aurora-1 -z-10"
        aria-hidden="true"
      />

      {/* Background Layer 2: Aurora Glow 2 (Top-Right Indigo Radial 680px) */}
      <div
        className="pointer-events-none absolute -top-48 right-[-10%] w-[680px] h-[680px] rounded-full bg-[radial-gradient(circle_at_center,var(--indigo)_0%,transparent_70%)] opacity-30 filter blur-[110px] animate-aurora-2 -z-10"
        aria-hidden="true"
      />

      {/* Background Layer 3: 28px Dot Grid with Radial Mask */}
      <div
        className="pointer-events-none absolute inset-0 bg-dot-grid -z-10"
        aria-hidden="true"
      />

      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_1fr] gap-12 lg:gap-14 items-center">
          {/* Left Column: Staggered Content */}
          <Stagger className="space-y-6 sm:space-y-8" staggerChildren={0.09}>
            {/* 1. Badge Pill */}
            <StaggerItem>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[rgba(var(--ink-rgb),0.04)] border border-[rgba(var(--ink-rgb),0.09)] backdrop-blur-md shadow-xs text-xs">
                <span className="px-2 py-0.5 rounded-full bg-primary text-on-primary font-bold text-[10px] uppercase tracking-wider">
                  {t.badge_new}
                </span>
                <span className="text-muted font-medium">
                  {t.badge_now_online}
                </span>
                <RotatingWord words={rotatingWords} />
              </div>
            </StaggerItem>

            {/* 2. Main Title (H1) with Shimmer */}
            <StaggerItem>
              <h1 className="text-4xl sm:text-5xl lg:text-[68px] font-heading font-extrabold text-text leading-[1.08] tracking-tight">
                <span>{heroTitleLine1}</span>
                <br />
                <span className="text-shimmer inline-block">
                  {heroTitleLine2}
                </span>
              </h1>
            </StaggerItem>

            {/* 3. Subtext */}
            <StaggerItem>
              <p className="text-base sm:text-lg text-muted max-w-[540px] leading-relaxed font-normal">
                {heroSubtitle}
              </p>
            </StaggerItem>

            {/* 4. Action Buttons */}
            <StaggerItem>
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-1">
                {/* Primary Button */}
                <a
                  href="#schools"
                  onClick={(e) => handleScrollTo(e, '#schools')}
                  className="group inline-flex items-center justify-center h-12 px-7 rounded-[14px] bg-primary text-on-primary font-bold text-sm shadow-[0_12px_32px_-8px_var(--glow)] hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-8px_var(--glow)] active:scale-[0.98] transition-all duration-200 cursor-pointer gap-2"
                >
                  <span>{t.hero_cta_admin}</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                </a>

                {/* Ghost / Feature Button */}
                <a
                  href="#modules"
                  onClick={(e) => handleScrollTo(e, '#modules')}
                  className="inline-flex items-center justify-center h-12 px-6 rounded-[14px] bg-transparent hover:bg-surface-hover border border-[rgba(var(--ink-rgb),0.14)] hover:border-[rgba(var(--ink-rgb),0.3)] text-text font-bold text-sm transition-all duration-200 cursor-pointer gap-2"
                >
                  <Play className="w-3.5 h-3.5 text-primary-text fill-current" />
                  <span>{t.hero_cta_features}</span>
                </a>
              </div>
            </StaggerItem>

            {/* 5. Metrics / Stats Row */}
            <StaggerItem>
              <div className="pt-6 border-t border-[rgba(var(--ink-rgb),0.08)] grid grid-cols-3 gap-4 sm:gap-6">
                <div>
                  <div className="text-2xl sm:text-3xl font-heading font-extrabold text-text tracking-tight">
                    <CountUp to={8} suffix="টি" isBengali={lang === 'bn'} />
                  </div>
                  <div className="text-xs text-muted font-medium mt-0.5">
                    {t.stat_modules_label}
                  </div>
                </div>

                <div>
                  <div className="text-2xl sm:text-3xl font-heading font-extrabold text-text tracking-tight">
                    <CountUp to={2} suffix="টি" isBengali={lang === 'bn'} />
                  </div>
                  <div className="text-xs text-muted font-medium mt-0.5">
                    {t.stat_langs_label}
                  </div>
                </div>

                <div>
                  <div className="text-2xl sm:text-3xl font-heading font-extrabold text-text tracking-tight flex items-center gap-1">
                    <span className="text-primary-text font-mono">∞</span>
                  </div>
                  <div className="text-xs text-muted font-medium mt-0.5">
                    {t.stat_schools_label}
                  </div>
                </div>
              </div>
            </StaggerItem>
          </Stagger>

          {/* Right Column: Interactive 3D Tilt Dashboard Mockup */}
          <div className="pt-4 lg:pt-0 flex justify-center">
            <DashboardMockup t={t} />
          </div>
        </div>
      </div>
    </section>
  );
}
