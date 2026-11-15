import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Play, Pause, Sparkles, Shirt, FileText, Search } from 'lucide-react';
import BrandPatternHero from '../fallbacks/BrandPatternHero';

export default function HeroSlider({
  school,
  settings,
  sliders = [],
  features = {},
  sections = {},
  lang = 'bn',
  onOpenAdmission,
  onOpenResult
}) {
  const isBn = lang === 'bn';

  // Fallback to Brand Pattern if no slides are uploaded
  if (!sliders || sliders.length === 0) {
    return <BrandPatternHero school={school} settings={settings} />;
  }

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef(0);
  const slideCount = sliders.length;

  // Auto-play interval (6 seconds per slide)
  useEffect(() => {
    if (isPaused || slideCount <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slideCount);
    }, 6000);
    return () => clearInterval(interval);
  }, [isPaused, slideCount]);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % slideCount);
  }, [slideCount]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + slideCount) % slideCount);
  }, [slideCount]);

  // Touch Swipe Handlers for mobile
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) nextSlide();
      else prevSlide();
    }
  };

  const currentSlide = sliders[currentIndex] || sliders[0];
  const admissionYear = settings?.admission_year || '২০২৬';

  // Build Action Buttons
  const buttons = [];
  if (features.admissionForm) {
    buttons.push({
      id: 'admission',
      label: isBn ? `অনলাইন ভর্তি আবেদন ${admissionYear} →` : `Apply for Admission →`,
      variant: 'gold',
      onClick: () => {
        if (onOpenAdmission) onOpenAdmission();
        else {
          const el = document.querySelector('#admission');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  }

  if (features.resultSearch) {
    buttons.push({
      id: 'result',
      label: isBn ? 'রেজাল্ট অনুসন্ধান' : 'Search Results',
      variant: buttons.length === 0 ? 'gold' : 'glass',
      icon: Search,
      onClick: () => {
        if (onOpenResult) onOpenResult();
        else {
          const el = document.querySelector('#results');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  }

  if (sections.uniform) {
    buttons.push({
      id: 'uniform',
      label: isBn ? 'পোশাক নীতিমালা' : 'Dress Code',
      variant: buttons.length === 0 ? 'gold' : 'glass',
      icon: Shirt,
      onClick: () => {
        const el = document.querySelector('#uniform');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  const slideTitle = isBn 
    ? (currentSlide.title_bn || currentSlide.title || school?.name_bn)
    : (currentSlide.title_en || currentSlide.title || school?.name_en);

  const titleLines = slideTitle ? slideTitle.split('\n') : [school?.name_bn || ''];
  const slideSubtitle = isBn
    ? (currentSlide.subtitle_bn || currentSlide.subtitle || school?.tagline_bn || settings?.motto)
    : (currentSlide.subtitle_en || currentSlide.subtitle || school?.tagline_en || settings?.motto);

  const slideBadge = currentSlide.badge_bn || (isBn ? 'স্বাগতম' : 'WELCOME');

  return (
    <section
      id="home"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="relative w-full h-[560px] sm:h-[640px] overflow-hidden select-none bg-[#040E0A]"
      aria-roledescription="carousel"
      aria-label="School Hero Banner"
    >
      {/* 1. Background Image with Ken-Burns Transition */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`img-${currentIndex}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 w-full h-full"
        >
          {currentSlide.image_url ? (
            <img
              src={currentSlide.image_url}
              alt={slideTitle}
              fetchpriority={currentIndex === 0 ? 'high' : 'auto'}
              className="w-full h-full object-cover ken-burns"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[var(--surface)] to-[var(--bg)]" />
          )}
        </motion.div>
      </AnimatePresence>

      {/* 2. Vertical Dark Gradients & Radial Light Overlays */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(to top, rgba(4, 14, 10, 0.94) 0%, rgba(4, 14, 10, 0.65) 50%, rgba(4, 14, 10, 0.40) 100%)'
        }}
      />
      <div 
        className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-40"
        style={{ background: 'radial-gradient(circle, var(--primary) 0%, transparent 70%)' }}
      />
      <div 
        className="absolute -top-24 -right-24 w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-30"
        style={{ background: 'radial-gradient(circle, var(--accent) 0%, transparent 70%)' }}
      />

      {/* 3. Hero Content Container */}
      <div className="relative z-10 max-w-[1240px] h-full mx-auto px-6 flex flex-col justify-end pb-24 sm:pb-28">
        <div className="max-w-[780px] space-y-5">
          {/* Animated Text Entrance: Mode Wait guarantees clean exit before enter */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`text-${currentIndex}`}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-4"
            >
              {/* Badge Pill */}
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[rgba(13,29,23,0.75)] backdrop-blur-md border border-[var(--accent)]/40 text-xs font-bold text-[var(--accent-text)] shadow-lg">
                <Sparkles className="w-3.5 h-3.5 text-[var(--accent)]" />
                <span>{slideBadge}</span>
              </div>

              {/* Title (Single H1 for current slide, 2nd line shimmer) */}
              <h1 className="text-3xl sm:text-5xl lg:text-[62px] font-extrabold font-heading text-white leading-[1.12] tracking-tight">
                <span>{titleLines[0]}</span>
                {titleLines[1] && (
                  <>
                    <br />
                    <span className="text-gold-shimmer inline-block mt-1">
                      {titleLines[1]}
                    </span>
                  </>
                )}
              </h1>

              {/* Subtitle */}
              {slideSubtitle && (
                <p className="text-base sm:text-lg text-white/85 max-w-[620px] leading-relaxed font-body">
                  {slideSubtitle}
                </p>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Action Buttons Row */}
          {buttons.length > 0 && (
            <div className="flex flex-wrap items-center gap-3 pt-2">
              {buttons.map((btn) => {
                const isGold = btn.variant === 'gold';
                const Icon = btn.icon;

                return (
                  <button
                    key={btn.id}
                    type="button"
                    onClick={btn.onClick}
                    className={`inline-flex items-center justify-center gap-2 h-12 px-6 rounded-xl font-bold text-sm transition-all duration-200 cursor-pointer shadow-md active:scale-95 ${
                      isGold
                        ? 'bg-[var(--accent)] text-[var(--on-accent)] hover:brightness-110 shadow-[0_4px_20px_rgba(233,185,73,0.3)]'
                        : 'bg-[rgba(13,29,23,0.75)] hover:bg-[rgba(13,29,23,0.95)] backdrop-blur-md border border-white/20 text-white hover:border-[var(--accent)]'
                    }`}
                  >
                    {Icon && <Icon className="w-4 h-4 text-[var(--accent)]" />}
                    <span>{btn.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* 4. StoryProgress Controls & Pause Button (Bottom Right) */}
      {slideCount > 1 && (
        <div className="absolute bottom-6 right-6 z-20 flex items-center gap-3 bg-[rgba(6,18,14,0.65)] backdrop-blur-md border border-white/10 px-3.5 py-2 rounded-2xl">
          {/* Pause / Play button */}
          <button
            type="button"
            onClick={() => setIsPaused(!isPaused)}
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer transition-colors"
            aria-label={isPaused ? 'Play slider' : 'Pause slider'}
          >
            {isPaused ? <Play className="w-3.5 h-3.5 fill-current" /> : <Pause className="w-3.5 h-3.5 fill-current" />}
          </button>

          {/* 56x3px Slide Progress Bars */}
          <div className="flex items-center gap-2">
            {sliders.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className="w-12 sm:w-14 h-1.5 rounded-full bg-white/25 overflow-hidden cursor-pointer relative"
              >
                {idx === currentIndex ? (
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: isPaused ? 0.5 : 1 }}
                    transition={{ duration: 6, ease: 'linear' }}
                    style={{ transformOrigin: 'left' }}
                    className="w-full h-full bg-[var(--accent)]"
                  />
                ) : idx < currentIndex ? (
                  <div className="w-full h-full bg-white/80" />
                ) : null}
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
