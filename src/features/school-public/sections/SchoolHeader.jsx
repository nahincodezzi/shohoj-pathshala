import React, { useState } from 'react';
import { motion, useScroll, AnimatePresence } from 'motion/react';
import { Sun, Moon, Menu } from 'lucide-react';
import InitialsAvatar from '../fallbacks/InitialsAvatar';
import MobileDrawer from './MobileDrawer';
import { formatNumber } from '../../../shared/format/formatters';

export default function SchoolHeader({
  school,
  settings,
  navItems = [],
  lang,
  toggleLang,
  fontSize,
  setFontSize,
  isDark,
  toggleMode
}) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { scrollYProgress } = useScroll();

  const isBn = lang === 'bn';
  const schoolName = isBn ? (school?.name_bn || school?.name) : (school?.name_en || school?.name);
  const estYear = settings?.est_year || school?.established_year;
  const locationText = school?.district || settings?.district || '';

  return (
    <>
      <header className="sticky top-0 z-40 bg-[var(--header-bg)] backdrop-blur-md border-b border-[var(--border)] transition-colors duration-300">
        <div className="max-w-[1240px] mx-auto px-6 h-18 sm:h-20 flex items-center justify-between gap-4">
          {/* Logo & School Name */}
          <a href="#home" className="flex items-center gap-3.5 group shrink-0 min-w-0">
            <div className="relative">
              {school?.logo ? (
                <div className="w-[46px] h-[46px] rounded-full p-[2px] bg-gradient-to-tr from-[var(--primary)] via-[var(--accent)] to-[var(--primary)] shadow-sm group-hover:scale-105 transition-transform">
                  <img
                    src={school.logo}
                    alt={schoolName}
                    className="w-full h-full rounded-full object-cover border-2 border-[var(--bg)]"
                  />
                </div>
              ) : (
                <div className="w-[46px] h-[46px] rounded-full p-[2px] bg-gradient-to-tr from-[var(--primary)] via-[var(--accent)] to-[var(--primary)] shadow-sm group-hover:scale-105 transition-transform">
                  <InitialsAvatar name={schoolName} size="md" className="w-full h-full border-2 border-[var(--bg)]" />
                </div>
              )}
            </div>

            <div className="min-w-0">
              <span className="text-base sm:text-lg font-extrabold text-[var(--text)] font-heading leading-tight truncate block group-hover:text-[var(--primary-text)] transition-colors">
                {schoolName}
              </span>
              {(estYear || locationText) && (
                <span className="text-[11px] sm:text-xs text-[var(--subtle)] font-body truncate block mt-0.5">
                  {estYear ? `${isBn ? 'স্থাপিত:' : 'Est:'} ${formatNumber(estYear, isBn)}` : ''}
                  {estYear && locationText ? ' • ' : ''}
                  {locationText}
                </span>
              )}
            </div>
          </a>

          {/* Desktop Navigation (>= 1080px) */}
          <nav className="hidden xl:flex items-center gap-1.5 p-1 rounded-full bg-[rgba(var(--ink-rgb),0.03)] border border-[rgba(var(--ink-rgb),0.05)]">
            {navItems.map((item) => {
              const isAdmission = item.id === 'admission';

              if (isAdmission) {
                return (
                  <a
                    key={item.id}
                    href={item.href || '#admission'}
                    onClick={(e) => {
                      if (item.onClick) {
                        e.preventDefault();
                        item.onClick(e);
                      }
                    }}
                    className="relative inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold rounded-full bg-[var(--accent-soft)] border border-[var(--accent)] text-[var(--accent-text)] hover:brightness-110 shadow-xs transition-all select-none"
                  >
                    {item.hasPing && (
                      <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-ping-dot" />
                    )}
                    <span>{item.label}</span>
                  </a>
                );
              }

              return (
                <a
                  key={item.id}
                  href={item.href || '#'}
                  onClick={(e) => {
                    if (item.onClick) {
                      e.preventDefault();
                      item.onClick(e);
                    }
                  }}
                  className="relative px-3.5 py-1.5 text-xs font-semibold text-[var(--muted)] hover:text-[var(--text)] rounded-full transition-colors group cursor-pointer"
                >
                  <span>{item.label}</span>
                  {/* Gold hover underline */}
                  <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-[var(--accent)] scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-200" />
                </a>
              );
            })}
          </nav>

          {/* Right Actions: Theme Toggle + Mobile Hamburger */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Theme Toggle Button (44x44px) */}
            <button
              type="button"
              onClick={toggleMode}
              className="w-11 h-11 rounded-xl bg-[var(--surface)] hover:bg-[var(--surface-hover)] border border-[var(--border)] flex items-center justify-center text-[var(--text)] transition-colors cursor-pointer relative overflow-hidden"
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              title={isDark ? 'লাইট মোড চালু করুন' : 'ডার্ক মোড চালু করুন'}
            >
              <AnimatePresence mode="wait">
                {isDark ? (
                  <motion.div
                    key="sun"
                    initial={{ rotate: -90, opacity: 0, scale: 0.7 }}
                    animate={{ rotate: 0, opacity: 1, scale: 1 }}
                    exit={{ rotate: 90, opacity: 0, scale: 0.7 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Sun className="w-4 h-4 text-[var(--warning)]" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="moon"
                    initial={{ rotate: 90, opacity: 0, scale: 0.7 }}
                    animate={{ rotate: 0, opacity: 1, scale: 1 }}
                    exit={{ rotate: -90, opacity: 0, scale: 0.7 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Moon className="w-4 h-4 text-[var(--indigo)]" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>

            {/* Mobile Hamburger (< 1080px) */}
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="xl:hidden w-11 h-11 rounded-xl bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center text-[var(--text)] hover:border-[var(--primary)] cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scroll Progress Bar at Header Bottom */}
        <motion.div
          style={{ scaleX: scrollYProgress, transformOrigin: 'left' }}
          className="h-[2px] bg-gradient-to-r from-[var(--primary)] via-[var(--accent)] to-[var(--primary)] w-full"
        />
      </header>

      {/* Mobile Drawer (Mounted via React Portal into document.body) */}
      <MobileDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        navItems={navItems}
        school={school}
        lang={lang}
        toggleLang={toggleLang}
        fontSize={fontSize}
        setFontSize={setFontSize}
        isDark={isDark}
        toggleMode={toggleMode}
      />
    </>
  );
}
