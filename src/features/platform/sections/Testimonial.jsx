import React, { useState, useEffect } from 'react';
import { Quote, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { Reveal } from '../motion/Reveal';

export default function Testimonial({ t, testimonials = [] }) {
  const defaultTestimonials = [
    {
      id: 1,
      quote: t('testimonials.t1.quote') || 'সহজ পাঠশালা ব্যবহারের পর থেকে আমাদের বিদ্যালয়ের ফি আদায় ও রেজাল্ট প্রস্তুতের সময় প্রায় ৮০% কমে গেছে। শিক্ষকদের কাজ এখন অনেক সহজ!',
      author: t('testimonials.t1.author') || 'জনাব নজরুল ইসলাম',
      role: t('testimonials.t1.role') || 'প্রধান শিক্ষক',
      school: t('testimonials.t1.school') || 'বাংলাদেশ আদর্শ উচ্চ বিদ্যালয়',
      rating: 5
    },
    {
      id: 2,
      quote: t('testimonials.t2.quote') || 'অভিভাবকরা তাৎক্ষণিক এসএমএস ও অনলাইন মার্কশিট প্রিন্ট পেয়ে দারুণ খুশি। কাগজের হিসাবের দিন এখন অতীত!',
      author: t('testimonials.t2.author') || 'শাহিনুর রহমান',
      role: t('testimonials.t2.role') || 'ম্যানেজিং কমিটি সভাপতি',
      school: t('testimonials.t2.school') || 'ধানমন্ডি মডেল হাই স্কুল',
      rating: 5
    }
  ];

  const list = (testimonials && testimonials.length > 0) ? testimonials : defaultTestimonials;
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused || list.length <= 1) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % list.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isPaused, list.length]);

  const active = list[activeIndex] || list[0];

  return (
    <section id="testimonials" className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="max-w-5xl mx-auto">
        <Reveal>
          <div
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            className="relative rounded-3xl bg-[var(--surface)] border border-[var(--border)] p-8 sm:p-14 lg:p-16 shadow-2xl overflow-hidden"
          >
            {/* Background watermark quote icon */}
            <div className="absolute top-6 right-8 text-[var(--primary)] opacity-10 pointer-events-none select-none">
              <Quote className="w-32 h-32 sm:w-44 sm:h-44 -rotate-12" />
            </div>

            <div className="relative space-y-8">
              {/* Star rating */}
              <div className="flex items-center gap-1.5 text-[var(--warning)]">
                {[...Array(active.rating || 5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current" />
                ))}
              </div>

              {/* Quote text */}
              <blockquote className="text-xl sm:text-2xl lg:text-3xl font-bold text-[var(--text)] leading-relaxed font-heading">
                “{active.quote}”
              </blockquote>

              {/* Author & School info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pt-6 border-t border-[var(--border)]">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-[var(--primary)]/15 border border-[var(--primary)]/30 text-[var(--primary)] flex items-center justify-center font-bold text-xl font-heading shadow-inner">
                    {active.avatar || (active.author ? active.author.charAt(0) : 'শ')}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-[var(--text)] text-lg sm:text-xl font-heading">
                      {active.author}
                    </h4>
                    <p className="text-xs sm:text-sm text-[var(--muted)] font-body">
                      {active.role || active.designation || 'প্রধান শিক্ষক'} • <span className="text-[var(--primary-text)] font-semibold">{active.school || active.meta}</span>
                    </p>
                  </div>
                </div>

                {/* Carousel Controls */}
                {list.length > 1 && (
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setActiveIndex((prev) => (prev - 1 + list.length) % list.length)}
                      aria-label="Previous Testimonial"
                      className="w-10 h-10 rounded-xl bg-[var(--bg-alt)] border border-[var(--border)] text-[var(--text)] hover:border-[var(--primary)] hover:text-[var(--primary)] flex items-center justify-center transition-all"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>

                    <div className="flex items-center gap-1.5 px-2">
                      {list.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setActiveIndex(i)}
                          aria-label={`Go to slide ${i + 1}`}
                          className={`h-2 rounded-full transition-all duration-300 ${
                            i === activeIndex
                              ? 'w-6 bg-[var(--primary)]'
                              : 'w-2 bg-[var(--border)] hover:bg-[var(--muted)]'
                          }`}
                        />
                      ))}
                    </div>

                    <button
                      onClick={() => setActiveIndex((prev) => (prev + 1) % list.length)}
                      aria-label="Next Testimonial"
                      className="w-10 h-10 rounded-xl bg-[var(--bg-alt)] border border-[var(--border)] text-[var(--text)] hover:border-[var(--primary)] hover:text-[var(--primary)] flex items-center justify-center transition-all"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
