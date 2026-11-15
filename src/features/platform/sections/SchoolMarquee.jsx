import React from 'react';
import { Link } from 'react-router-dom';

export default function SchoolMarquee({ schools = [], t }) {
  const activeSchools = schools.filter(s => s.status === 'active');
  const items = activeSchools.length > 0 ? activeSchools : [
    { id: '1', slug: 'bdhs', name_bn: 'বন্দুয়া দৌলতপুর উচ্চ বিদ্যালয়', name_en: 'Bondua Daulatpur High School' },
    { id: '2', slug: 'dmhs', name_bn: 'ধানমন্ডি মডেল হাই স্কুল', name_en: 'Dhanmondi Model High School' },
    { id: '3', slug: 'bahs', name_bn: 'বরুড়া আদর্শ উচ্চ বিদ্যালয়', name_en: 'Barura Adarsha High School' }
  ];

  return (
    <div className="w-full border-y border-[rgba(var(--ink-rgb),0.06)] bg-[rgba(var(--ink-rgb),0.02)] py-4 overflow-hidden relative select-none">
      {/* Edge gradient mask for smooth fade-in/fade-out */}
      <div 
        className="overflow-hidden w-full"
        style={{
          maskImage: 'linear-gradient(to right, transparent, black 12%, black 88%, transparent)',
          WebkitMaskImage: 'linear-gradient(to right, transparent, black 12%, black 88%, transparent)'
        }}
      >
        <div className="animate-marquee flex items-center gap-8 text-xs font-semibold text-muted">
          {/* First loop */}
          {items.map((school) => (
            <Link
              key={school.id || school.slug}
              to={`/${school.slug}`}
              className="inline-flex items-center gap-2.5 hover:text-primary-text transition-colors whitespace-nowrap cursor-pointer shrink-0"
            >
              <span className="w-2 h-2 rounded-full bg-primary" />
              <span className="font-heading font-bold text-text hover:text-primary-text text-sm">
                {school.name_bn}
              </span>
              <span className="text-[11px] text-subtle font-mono">
                ({school.name_en || school.slug})
              </span>
            </Link>
          ))}
          <div className="inline-flex items-center gap-2 text-primary-text font-bold text-sm whitespace-nowrap shrink-0 px-3 py-1 rounded-full bg-primary-soft border border-primary/20">
            <span className="w-2 h-2 rounded-full bg-primary animate-ping-dot" />
            <span>{t.marquee_ending}</span>
          </div>

          {/* Second loop for infinite stream */}
          {items.map((school) => (
            <Link
              key={`dup-${school.id || school.slug}`}
              to={`/${school.slug}`}
              className="inline-flex items-center gap-2.5 hover:text-primary-text transition-colors whitespace-nowrap cursor-pointer shrink-0"
            >
              <span className="w-2 h-2 rounded-full bg-primary" />
              <span className="font-heading font-bold text-text hover:text-primary-text text-sm">
                {school.name_bn}
              </span>
              <span className="text-[11px] text-subtle font-mono">
                ({school.name_en || school.slug})
              </span>
            </Link>
          ))}
          <div className="inline-flex items-center gap-2 text-primary-text font-bold text-sm whitespace-nowrap shrink-0 px-3 py-1 rounded-full bg-primary-soft border border-primary/20">
            <span className="w-2 h-2 rounded-full bg-primary animate-ping-dot" />
            <span>{t.marquee_ending}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
