import React from 'react';
import { Calendar, Users, Award, Layers, GraduationCap, Building2 } from 'lucide-react';
import { CountUp } from '../../../shared/motion';
import { Reveal } from '../../../shared/motion';

export default function StatsGlass({
  school,
  settings,
  stats = [],
  teachers = [],
  students = [],
  sections = {},
  lang = 'bn'
}) {
  if (!sections.stats) return null;

  const isBn = lang === 'bn';

  // Compute dynamic stats if not explicitly entered in CMS
  const defaultStats = [
    {
      id: 'students',
      value: students.length > 0 ? students.length : 850,
      suffix: '+',
      label_bn: 'মোট শিক্ষার্থী',
      label_en: 'Total Students',
      icon: Users
    },
    {
      id: 'teachers',
      value: teachers.length > 0 ? teachers.length : 32,
      suffix: '+',
      label_bn: 'শিক্ষক ও কর্মচারী',
      label_en: 'Faculty & Staff',
      icon: GraduationCap
    },
    {
      id: 'success',
      value: 98,
      suffix: '%',
      label_bn: 'পাসের হার',
      label_en: 'Passing Rate',
      icon: Award
    },
    {
      id: 'est',
      value: settings?.est_year || school?.established_year || 1994,
      suffix: '',
      isYear: true,
      label_bn: 'প্রতিষ্ঠার গৌরবময় সাল',
      label_en: 'Established Year',
      icon: Calendar
    }
  ];

  const items = stats && stats.length >= 2 ? stats : defaultStats;
  if (items.length < 2) return null;

  const colClasses = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-3',
    4: 'grid-cols-2 lg:grid-cols-4'
  }[Math.min(items.length, 4)] || 'grid-cols-2 lg:grid-cols-4';

  return (
    <div className="relative z-20 max-w-[1240px] mx-auto px-6 -mt-16 sm:-mt-20">
      <Reveal>
        <div className={`grid ${colClasses} gap-4 sm:gap-6`}>
          {items.slice(0, 4).map((item, idx) => {
            const Icon = item.icon || (idx === 0 ? Users : idx === 1 ? GraduationCap : idx === 2 ? Award : Calendar);
            const numVal = parseInt(String(item.value).replace(/\D/g, ''), 10) || 0;
            const isYear = item.isYear || numVal > 1900 && numVal < 2100 && !item.suffix;

            return (
              <div
                key={item.id || idx}
                className="p-5 sm:p-6 rounded-2xl bg-[var(--glass)] backdrop-blur-md border border-[var(--border)] shadow-xl hover:border-[var(--accent)]/50 transition-all card-lift flex items-center gap-4"
              >
                {/* Gold Icon Box */}
                <div className="w-12 h-12 rounded-xl bg-[var(--accent)]/15 border border-[var(--accent)]/30 text-[var(--accent-text)] flex items-center justify-center shrink-0 shadow-xs">
                  <Icon className="w-6 h-6" />
                </div>

                {/* Number & Label */}
                <div className="min-w-0">
                  <div className="text-2xl sm:text-3xl font-bold font-heading text-[var(--text)] tracking-tight tabular-nums">
                    {isYear ? (
                      <span>{item.value}</span>
                    ) : (
                      <CountUp to={numVal} suffix={item.suffix || ''} isBengali={isBn} />
                    )}
                  </div>
                  <div className="text-xs sm:text-sm text-[var(--muted)] font-body truncate mt-0.5">
                    {isBn ? (item.label_bn || item.label) : (item.label_en || item.label)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Reveal>
    </div>
  );
}
