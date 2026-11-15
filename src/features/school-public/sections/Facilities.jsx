import React from 'react';
import { Sparkles, Building, BookOpen, Laptop, Trophy } from 'lucide-react';
import { Reveal, Stagger, StaggerItem } from '../../../shared/motion';

export default function Facilities({
  facilities = [],
  sections = {},
  lang = 'bn'
}) {
  if (sections.facilities === false) return null;

  const isBn = lang === 'bn';

  const defaultFacilities = [
    {
      id: 1,
      title_bn: 'আধুনিক কম্পিউটার ল্যাব',
      title_en: 'Modern Computer Lab',
      meta_bn: '৫০টি আধুনিক কম্পিউটার ও উচ্চগতির ইন্টারনেট',
      meta_en: '50 Modern PCs & High-speed Internet',
      desc_bn: 'শিক্ষার্থীদের প্রোগ্রামিং, তথ্যপ্রযুক্তি ও ডিজিটাল দক্ষতা বিকাশে স্বয়ংসম্পূর্ণ আইসিটি ল্যাব।',
      desc_en: 'Equipped with modern workstations for coding and ICT literacy.',
      icon: Laptop
    },
    {
      id: 2,
      title_bn: 'সমৃদ্ধ লাইব্রেরি ও রিডিং রুম',
      title_en: 'Rich Library & Reading Hall',
      meta_bn: '৫,০০০+ রেফারেন্স ও পাঠ্যবইয়ের সংগ্রহ',
      meta_en: '5,000+ Books & Reading Resources',
      desc_bn: 'জ্ঞানচর্চা ও নিয়মিত গবেষণার জন্য নিরিবিলি ও শীতাতপ নিয়ন্ত্রিত পাঠাগার সুবিধা।',
      desc_en: 'Quiet, air-conditioned environment fostering a culture of reading.',
      icon: BookOpen
    },
    {
      id: 3,
      title_bn: 'মাল্টিমিডিয়া স্মার্ট ক্লাসরুম',
      title_en: 'Smart Multimedia Classrooms',
      meta_bn: 'ইন্টারেক্টিভ প্রজেক্টর ও অডিও ভিজ্যুয়াল',
      meta_en: 'Interactive Projectors & Audio-Visuals',
      desc_bn: 'কঠিন বিষয়বস্তু সহজ ও দৃশ্যমান পদ্ধতিতে উপস্থাপনের মাধ্যমে শ্রেণিকক্ষে আনন্দময় শিক্ষাদান।',
      desc_en: 'Engaging visual education using interactive presentation displays.',
      icon: Building
    },
    {
      id: 4,
      title_bn: 'বিশাল খেলার মাঠ ও ক্রীড়া একাডেমি',
      title_en: 'Playground & Sports Academy',
      meta_bn: 'ফুটবল, ক্রিকেট ও ইনডোর গেমস',
      meta_en: 'Football, Cricket & Indoor Sports',
      desc_bn: 'শিক্ষার্থীদের শারীরিক সুস্থতা ও ক্রীড়া নৈপুণ্য বিকাশে পূর্ণাঙ্গ খেলার মাঠ ও ইনডোর স্পোর্টস।',
      desc_en: 'Expansive field and coaching for athletics and sports excellence.',
      icon: Trophy
    }
  ];

  const items = (facilities && facilities.length > 0) ? facilities : defaultFacilities;
  if (items.length === 0) return null;

  return (
    <section className="py-24 px-6 max-w-[1240px] mx-auto space-y-12">
      <Reveal>
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--accent-soft)] border border-[var(--accent)] text-xs font-bold text-[var(--accent-text)]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isBn ? 'ক্যাম্পাস সুবিধা' : 'CAMPUS FACILITIES'}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-heading text-[var(--text)] tracking-tight">
            {isBn ? 'শিক্ষার্থীবান্ধব আধুনিক অবকাঠামো' : 'Modern Campus Infrastructure'}
          </h2>

          <p className="text-sm sm:text-base text-[var(--muted)] font-body">
            {isBn ? 'একটি পরিপূর্ণ অ্যাকাডেমিক পরিবেশ নিশ্চিত করতে আমাদের রয়েছে যুগোপযোগী ব্যবস্থা।' : 'State-of-the-art facilities designed for holistic academic growth.'}
          </p>
        </div>
      </Reveal>

      <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.slice(0, 4).map((item, idx) => {
          const Icon = item.icon || Building;

          return (
            <StaggerItem key={item.id || idx}>
              <div className="group h-full rounded-3xl bg-[var(--surface)] border border-[var(--border)] overflow-hidden flex flex-col justify-between card-lift shadow-md">
                {/* 170px Image or Icon Banner */}
                <div className="h-[170px] w-full overflow-hidden bg-[var(--bg-alt)] relative flex items-center justify-center">
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt={item.title_bn || item.title}
                      className="w-full h-full object-cover img-zoom"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-2xl bg-[var(--primary)]/15 text-[var(--primary)] flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon className="w-8 h-8" />
                    </div>
                  )}
                </div>

                <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold text-[var(--accent-text)] uppercase tracking-wider block font-mono">
                      {isBn ? (item.meta_bn || item.meta) : (item.meta_en || item.meta)}
                    </span>

                    <h3 className="text-lg font-bold font-heading text-[var(--text)] group-hover:text-[var(--primary-text)] transition-colors">
                      {isBn ? (item.title_bn || item.title) : (item.title_en || item.title)}
                    </h3>

                    <p className="text-xs text-[var(--muted)] leading-relaxed font-body line-clamp-3">
                      {isBn ? (item.desc_bn || item.desc) : (item.desc_en || item.desc)}
                    </p>
                  </div>
                </div>
              </div>
            </StaggerItem>
          );
        })}
      </Stagger>
    </section>
  );
}
