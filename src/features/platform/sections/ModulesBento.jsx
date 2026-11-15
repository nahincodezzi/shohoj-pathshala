import React from 'react';
import { 
  Users, 
  ClipboardCheck, 
  FileBarChart, 
  Receipt, 
  GraduationCap, 
  Bell, 
  Globe, 
  ShieldCheck,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import Reveal from '../motion/Reveal';
import Stagger, { StaggerItem } from '../motion/Stagger';
import Spotlight from '../motion/Spotlight';

export default function ModulesBento({ t, landing }) {
  const rawModules = landing?.modules || [
    { num: '01', title: 'শিক্ষার্থী ব্যবস্থাপনা', desc: 'শ্রেণিভিত্তিক রোল, ডিজিটাল স্টুডেন্ট আইডি ও ছবিসহ তথ্যভাণ্ডার।' },
    { num: '02', title: 'অনলাইন ভর্তি', desc: '৩-ধাপের আবেদন ফরম, তাৎক্ষণিক ট্র্যাকিং কোড ও ডিজিটাল প্রবেশপত্র প্রিন্ট।' },
    { num: '03', title: 'রেজাল্ট ও GPA', desc: 'বোর্ড গ্রেডিং অনুযায়ী বিষয়ভিত্তিক নম্বর, জিপিএ ও মার্কশিট জেনারেশন।' },
    { num: '04', title: 'ফি ও রসিদ', desc: 'বিকাশ/নগদ/ক্যাশ ফি আদায়, ২-কপি মানি রিসিট ও কারণসহ Void নীতি।' },
    { num: '05', title: 'শিক্ষক ও কর্মচারী', desc: 'পদবি ও শিক্ষাগত যোগ্যতাসহ পূর্ণাঙ্গ অ্যাকাডেমিক ডিরেক্টরি।' },
    { num: '06', title: 'নোটিশ বোর্ড', desc: 'হেডার জরুরি টিকার, ক্যাটাগরি ফিল্টার ও পিডিএফ ডাউনলোড সুবিধা।' },
    { num: '07', title: 'ওয়েবসাইট ও ব্র্যান্ডিং', desc: 'হিরো স্লাইডার, বাণী, পোশাক নীতিমালা, ফটো গ্যালারি ও কাস্টম থিম।' },
    { num: '08', title: 'নিরাপত্তা ও অডিট', desc: 'রোলভিত্তিক অনুমতি, ৫ বার ভুলে লকআউট ও পূর্ণাঙ্গ অডিট ট্রেইল।' }
  ];

  const icons = [Users, ClipboardCheck, FileBarChart, Receipt, GraduationCap, Bell, Globe, ShieldCheck];

  return (
    <section id="modules" className="py-24 sm:py-28 bg-bg-alt border-b border-[rgba(var(--ink-rgb),0.06)] transition-colors duration-300">
      <div className="max-w-[1200px] mx-auto px-6 space-y-12">
        {/* Section Header */}
        <Reveal className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-soft text-primary-text font-mono font-bold text-[11px] uppercase tracking-wider border border-primary/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t.modules_tag}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold text-text tracking-tight">
            {t.modules_title}
          </h2>
          <p className="text-sm sm:text-base text-muted">
            {t.modules_sub}
          </p>
        </Reveal>

        {/* Bento Grid */}
        <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" staggerChildren={0.06}>
          {/* Card 1: Large Featured Card (শিক্ষার্থী ব্যবস্থাপনা - 2x2 on lg) */}
          <StaggerItem className="sm:col-span-2 lg:col-span-2 lg:row-span-2">
            <Spotlight className="h-full rounded-[22px] bg-surface hover:bg-surface-hover border border-[rgba(var(--ink-rgb),0.08)] hover:border-primary/45 p-6 sm:p-8 flex flex-col justify-between shadow-xs hover:-translate-y-1.5 transition-all duration-300 relative group overflow-hidden">
              {/* Corner radial glow */}
              <div 
                className="absolute top-0 right-0 w-64 h-64 bg-radial from-primary/15 to-transparent rounded-full -mr-16 -mt-16 pointer-events-none group-hover:scale-125 transition-transform duration-500" 
                aria-hidden="true" 
              />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-13 h-13 rounded-2xl bg-primary-soft text-primary-text border border-primary/25 flex items-center justify-center group-hover:rotate-[-8deg] group-hover:scale-108 group-hover:bg-primary group-hover:text-on-primary transition-all duration-300 shadow-sm">
                    <Users className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-mono font-bold text-subtle px-2.5 py-1 rounded-full bg-[rgba(var(--ink-rgb),0.04)] border border-[rgba(var(--ink-rgb),0.06)]">
                    {rawModules[0]?.num || '০১'}
                  </span>
                </div>

                <div className="space-y-2 pt-2">
                  <h3 className="text-2xl font-heading font-extrabold text-text tracking-tight group-hover:text-primary-text transition-colors">
                    {rawModules[0]?.title || 'শিক্ষার্থী ব্যবস্থাপনা'}
                  </h3>
                  <p className="text-sm text-muted leading-relaxed max-w-md">
                    {rawModules[0]?.desc || 'শ্রেণিভিত্তিক রোল, ডিজিটাল স্টুডেন্ট আইডি ও ছবিসহ তথ্যভাণ্ডার।'}
                  </p>
                </div>
              </div>

              {/* 3 Interactive Feature Chips */}
              <div className="pt-6 border-t border-[rgba(var(--ink-rgb),0.06)] flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-2 border border-[rgba(var(--ink-rgb),0.07)] text-xs font-bold text-text shadow-xs">
                  <CheckCircle2 className="w-3.5 h-3.5 text-primary-text" />
                  <span>ডিজিটাল আইডি কার্ড</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-2 border border-[rgba(var(--ink-rgb),0.07)] text-xs font-bold text-text shadow-xs">
                  <CheckCircle2 className="w-3.5 h-3.5 text-primary-text" />
                  <span>অটো প্রমোশন</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-2 border border-[rgba(var(--ink-rgb),0.07)] text-xs font-bold text-text shadow-xs">
                  <CheckCircle2 className="w-3.5 h-3.5 text-primary-text" />
                  <span>অভিভাবক তথ্য</span>
                </span>
              </div>
            </Spotlight>
          </StaggerItem>

          {/* Cards 2-5 (Standard single slot cards) */}
          {rawModules.slice(1, 5).map((mod, idx) => {
            const IconComp = icons[idx + 1] || Users;
            return (
              <StaggerItem key={mod.title} className="col-span-1">
                <Spotlight className="h-full rounded-[22px] bg-surface hover:bg-surface-hover border border-[rgba(var(--ink-rgb),0.08)] hover:border-primary/45 p-5 flex flex-col justify-between shadow-xs hover:-translate-y-1.5 transition-all duration-300 group">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-11 h-11 rounded-xl bg-primary-soft text-primary-text border border-primary/20 flex items-center justify-center group-hover:rotate-[-8deg] group-hover:scale-108 group-hover:bg-primary group-hover:text-on-primary transition-all duration-300">
                      <IconComp className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-mono font-bold text-subtle">
                      {mod.num}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-base font-heading font-bold text-text group-hover:text-primary-text transition-colors">
                      {mod.title}
                    </h3>
                    <p className="text-xs text-muted leading-relaxed line-clamp-2">
                      {mod.desc}
                    </p>
                  </div>
                </Spotlight>
              </StaggerItem>
            );
          })}

          {/* Card 6: Notice Board (2 Columns Wide on lg) */}
          <StaggerItem className="sm:col-span-2 lg:col-span-2">
            <Spotlight className="h-full rounded-[22px] bg-surface hover:bg-surface-hover border border-[rgba(var(--ink-rgb),0.08)] hover:border-primary/45 p-6 flex flex-col justify-between shadow-xs hover:-translate-y-1.5 transition-all duration-300 group">
              <div className="flex items-center justify-between mb-3">
                <div className="w-11 h-11 rounded-xl bg-primary-soft text-primary-text border border-primary/20 flex items-center justify-center group-hover:rotate-[-8deg] group-hover:scale-108 group-hover:bg-primary group-hover:text-on-primary transition-all duration-300">
                  <Bell className="w-5 h-5" />
                </div>
                <span className="text-xs font-mono font-bold text-subtle">
                  {rawModules[5]?.num || '০৬'}
                </span>
              </div>

              <div className="space-y-1">
                <h3 className="text-lg font-heading font-bold text-text group-hover:text-primary-text transition-colors">
                  {rawModules[5]?.title || 'নোটিশ বোর্ড'}
                </h3>
                <p className="text-xs text-muted leading-relaxed">
                  {rawModules[5]?.desc || 'হেডার জরুরি টিকার, ক্যাটাগরি ফিল্টার ও পিডিএফ ডাউনলোড সুবিধা।'}
                </p>
              </div>
            </Spotlight>
          </StaggerItem>

          {/* Cards 7 & 8 */}
          {rawModules.slice(6, 8).map((mod, idx) => {
            const IconComp = icons[idx + 6] || Globe;
            return (
              <StaggerItem key={mod.title} className="col-span-1">
                <Spotlight className="h-full rounded-[22px] bg-surface hover:bg-surface-hover border border-[rgba(var(--ink-rgb),0.08)] hover:border-primary/45 p-5 flex flex-col justify-between shadow-xs hover:-translate-y-1.5 transition-all duration-300 group">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-11 h-11 rounded-xl bg-primary-soft text-primary-text border border-primary/20 flex items-center justify-center group-hover:rotate-[-8deg] group-hover:scale-108 group-hover:bg-primary group-hover:text-on-primary transition-all duration-300">
                      <IconComp className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-mono font-bold text-subtle">
                      {mod.num}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-base font-heading font-bold text-text group-hover:text-primary-text transition-colors">
                      {mod.title}
                    </h3>
                    <p className="text-xs text-muted leading-relaxed line-clamp-2">
                      {mod.desc}
                    </p>
                  </div>
                </Spotlight>
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}
