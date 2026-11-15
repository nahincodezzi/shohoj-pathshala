import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react';
import { Layers, Sparkles, Check } from 'lucide-react';
import Reveal from '../motion/Reveal';

export default function OnboardingSteps({ t, landing }) {
  const containerRef = useRef(null);
  const shouldReduce = useReducedMotion();

  const steps = landing?.onboarding_steps || [
    { step: '১', title: 'স্কুল তৈরি', desc: 'EIIN, নাম, কোড ও সাবডোমেইন দিয়ে নতুন টেন্যান্ট তৈরি।' },
    { step: '২', title: 'অ্যাডমিন অ্যাকাউন্ট', desc: 'স্কুল অ্যাডমিনের জন্য সুরক্ষিত অ্যাকাউন্ট ও পাসওয়ার্ড বরাদ্দ।' },
    { step: '৩', title: 'সেটআপ উইজার্ড', desc: 'লোগো, প্রধান শিক্ষকের বাণী, রুটিন ও প্রাতিষ্ঠানিক তথ্য কনফিগার।' },
    { step: '৪', title: 'সাইট লাইভ', desc: 'তাত্ক্ষণিকভাবে পাবলিক পোর্টাল ও অ্যাডমিন প্যানেল সক্রিয়।' }
  ];

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 85%', 'end 50%']
  });

  const scaleProgress = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section id="flow" ref={containerRef} className="py-24 sm:py-28 relative overflow-hidden transition-colors duration-300">
      <div className="max-w-[1200px] mx-auto px-6 space-y-16">
        {/* Header */}
        <Reveal className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-soft text-primary-text font-mono font-bold text-[11px] uppercase tracking-wider border border-primary/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t.onboarding_tag}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold text-text tracking-tight">
            {t.onboarding_title}
          </h2>
          <p className="text-sm sm:text-base text-muted">
            {t.onboarding_sub}
          </p>
        </Reveal>

        {/* 4 Steps Container */}
        <div className="relative">
          {/* Desktop Connecting Horizontal Line (behind number boxes) */}
          <div 
            className="hidden lg:block absolute top-8 left-[12%] right-[12%] h-[2px] bg-[rgba(var(--ink-rgb),0.1)] z-0"
            aria-hidden="true"
          >
            {/* Scroll fill line */}
            <motion.div
              style={{ scaleX: shouldReduce ? 1 : scaleProgress, transformOrigin: 'left' }}
              className="absolute inset-0 bg-primary/60"
            />
            {/* Pulsing Light Stream */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="w-1/3 h-full bg-gradient-to-r from-transparent via-primary to-transparent animate-line-pulse opacity-85" />
            </div>
          </div>

          {/* Steps Grid */}
          <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-6 relative z-10 list-none p-0 m-0">
            {steps.map((st, idx) => (
              <Reveal key={st.step} delay={idx * 0.1} className="flex flex-col items-center text-center space-y-4">
                {/* 64px Number Box with 8px --bg ring */}
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl bg-surface border-2 border-primary/60 text-primary-text font-heading font-extrabold text-2xl flex items-center justify-center shadow-lg ring-8 ring-bg group hover:scale-105 hover:border-primary transition-all duration-200">
                    <span>{st.step}</span>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-xs">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                </div>

                {/* Step Info */}
                <div className="space-y-1.5 max-w-[240px]">
                  <h3 className="text-lg font-heading font-bold text-text">
                    {st.title}
                  </h3>
                  <p className="text-xs text-muted leading-relaxed">
                    {st.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
