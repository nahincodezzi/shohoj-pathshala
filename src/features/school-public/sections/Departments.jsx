import React from 'react';
import { FlaskConical, BarChart3, BookOpen, ArrowRight, Layers } from 'lucide-react';
import { Reveal, Stagger, StaggerItem } from '../../../shared/motion';

export default function Departments({
  school,
  settings,
  academicGroups = [],
  sections = {},
  lang = 'bn'
}) {
  if (sections.departments === false) return null;

  const defaultGroups = [
    { id: 'science', num: '০১', title_bn: 'বিজ্ঞান বিভাগ', title_en: 'Science Group', icon: 'FlaskConical', desc_bn: 'আধুনিক পদার্থ, রসায়ন ও জীববিজ্ঞান ল্যাবসহ অভিজ্ঞ শিক্ষকদের সার্বক্ষণিক তত্ত্বাবধানে পাঠদান।' },
    { id: 'business', num: '০২', title_bn: 'ব্যবসায় শিক্ষা', title_en: 'Business Studies', icon: 'BarChart3', desc_bn: 'হিসাববিজ্ঞান ও ফিন্যান্সের প্রায়োগিক জ্ঞান ও ব্যবসায়িক নেতৃত্বের সমন্বিত শিক্ষাক্রম।' },
    { id: 'humanities', num: '০৩', title_bn: 'মানবিক বিভাগ', title_en: 'Humanities Group', icon: 'BookOpen', desc_bn: 'ইতিহাস, সাহিত্য, অর্থনীতি ও পৌরনীতি বিষয়ে সৃজনশীল চিন্তাশক্তি বিকাশের শিক্ষা।' }
  ];

  const groups = academicGroups.length > 0 ? academicGroups : (settings?.academic_groups || defaultGroups);
  if (groups.length === 0) return null;

  const isBn = lang === 'bn';
  const board = school?.board || settings?.board || (isBn ? 'কুমিল্লা' : 'Cumilla');
  const classRange = settings?.class_range || (isBn ? '৬ষ্ঠ থেকে ১০ম শ্রেণি' : 'Class 6 to Class 10');

  const getIcon = (iconName) => {
    switch (iconName) {
      case 'FlaskConical': return FlaskConical;
      case 'BarChart3': return BarChart3;
      case 'BookOpen': return BookOpen;
      default: return Layers;
    }
  };

  return (
    <section id="departments" className="py-24 px-6 bg-[var(--bg-alt)] border-y border-[var(--border)] transition-colors duration-300">
      <div className="max-w-[1240px] mx-auto space-y-12">
        {/* Header */}
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--primary)]/10 border border-[var(--primary)]/30 text-xs font-bold text-[var(--primary-text)] font-mono">
                <Layers className="w-3.5 h-3.5" />
                <span>{isBn ? 'একাডেমিক বিভাগ' : 'ACADEMIC GROUPS'}</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-[var(--text)] tracking-tight">
                {isBn ? 'মাধ্যমিক ও উচ্চ মাধ্যমিক শিক্ষা' : 'Curriculum & Study Programs'}
              </h2>
            </div>

            <div className="text-xs sm:text-sm text-[var(--muted)] font-mono">
              <span>{classRange} • {board} {isBn ? 'শিক্ষা বোর্ড' : 'Education Board'}</span>
            </div>
          </div>
        </Reveal>

        {/* Groups Grid */}
        <Stagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map((group, idx) => {
            const Icon = getIcon(group.icon);
            const num = group.num || (idx === 0 ? '০১' : idx === 1 ? '০২' : '০৩');

            return (
              <StaggerItem key={group.id || idx}>
                <div className="group h-full p-8 rounded-3xl bg-[var(--surface)] border border-[var(--border)] relative overflow-hidden flex flex-col justify-between card-lift">
                  {/* Faded Background Number */}
                  <span className="absolute -bottom-6 -right-3 text-8xl font-black font-heading text-[var(--text)] opacity-5 select-none pointer-events-none group-hover:scale-110 transition-transform">
                    {num}
                  </span>

                  <div className="space-y-4 relative z-10">
                    <div className="w-12 h-12 rounded-2xl bg-[var(--primary)]/15 border border-[var(--primary)]/30 text-[var(--primary)] flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
                      <Icon className="w-6 h-6" />
                    </div>

                    <h3 className="text-xl font-bold font-heading text-[var(--text)] group-hover:text-[var(--primary-text)] transition-colors">
                      {isBn ? (group.title_bn || group.title) : (group.title_en || group.title)}
                    </h3>

                    <p className="text-sm text-[var(--muted)] leading-relaxed font-body">
                      {isBn ? (group.desc_bn || group.desc) : (group.desc_en || group.desc)}
                    </p>
                  </div>

                  {/* Dashed Separator + Gold Tagline */}
                  <div className="pt-6 mt-6 border-t border-dashed border-[var(--border)] flex items-center justify-between text-xs relative z-10">
                    <span className="font-semibold text-[var(--accent-text)]">
                      {isBn ? 'আধুনিক কারিকুলাম' : 'Modern Curriculum'}
                    </span>
                    <ArrowRight className="w-4 h-4 text-[var(--accent)] arrow-nudge" />
                  </div>
                </div>
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}
