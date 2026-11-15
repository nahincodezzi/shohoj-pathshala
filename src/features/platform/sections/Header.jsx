import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Sun, Moon, Menu, X, ArrowRight } from 'lucide-react';

export default function Header({
  t,
  lang,
  toggleLang,
  onToggleLang,
  isDark,
  mode,
  toggleMode,
  onToggleTheme
}) {
  const handleToggleLang = toggleLang || onToggleLang;
  const handleToggleMode = toggleMode || onToggleTheme;
  const darkActive = isDark !== undefined ? isDark : mode === 'dark';

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('modules');

  const navItems = [
    { id: 'modules', label: t.nav_modules, href: '#modules' },
    { id: 'flow', label: t.nav_flow, href: '#flow' },
    { id: 'security', label: t.nav_security, href: '#security' },
    { id: 'schools', label: t.nav_schools, href: '#schools' },
    { id: 'pricing', label: t.nav_pricing, href: '#pricing' },
    { id: 'faq', label: t.nav_faq, href: '#faq' }
  ];

  // Active section observer on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 140;
      for (const item of navItems) {
        const element = document.getElementById(item.id);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(item.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e, href) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-[var(--header-bg)] backdrop-blur-xl border-b border-[rgba(var(--ink-rgb),0.06)] transition-colors duration-300">
      <div className="max-w-[1200px] mx-auto px-6 h-18 flex items-center justify-between">
        {/* Left: Brand Logo & Title */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-[38px] h-[38px] rounded-[11px] bg-primary text-on-primary font-heading font-extrabold text-base flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-200">
            সপ
          </div>
          <div>
            <span className="text-lg font-heading font-extrabold text-text leading-tight block tracking-tight">
              {t.brand_title}
            </span>
            <span className="text-[11px] font-medium text-subtle tracking-wider uppercase block">
              {t.brand_sub}
            </span>
          </div>
        </Link>

        {/* Center: Desktop Navigation with Sliding Pill */}
        <nav className="hidden lg:flex items-center gap-1.5 p-1 rounded-full bg-[rgba(var(--ink-rgb),0.03)] border border-[rgba(var(--ink-rgb),0.05)]">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <a
                key={item.id}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className={`relative px-4 py-1.5 text-xs font-semibold rounded-full transition-colors duration-200 cursor-pointer ${
                  isActive ? 'text-text' : 'text-muted hover:text-text'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-pill"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    className="absolute inset-0 bg-surface rounded-full shadow-xs border border-[rgba(var(--ink-rgb),0.08)] z-0"
                  />
                )}
                <span className="relative z-10">{item.label}</span>
              </a>
            );
          })}
        </nav>

        {/* Right: Controls & CTAs */}
        <div className="flex items-center gap-2.5">
          {/* Language Toggle */}
          <button
            type="button"
            onClick={handleToggleLang}
            className="h-10 px-3 rounded-[12px] bg-surface hover:bg-surface-hover border border-[rgba(var(--ink-rgb),0.08)] text-xs font-bold text-text transition-colors cursor-pointer select-none"
            title={lang === 'bn' ? 'Switch to English' : 'বাংলায় দেখুন'}
          >
            {lang === 'bn' ? 'EN' : 'বাং'}
          </button>

          {/* Theme Mode Toggle (Circular Reveal + Rotate Fade) */}
          <button
            type="button"
            onClick={handleToggleMode}
            className="w-11 h-11 rounded-[12px] bg-surface hover:bg-surface-hover border border-[rgba(var(--ink-rgb),0.08)] flex items-center justify-center text-text transition-colors cursor-pointer relative overflow-hidden"
            aria-label={darkActive ? 'Switch to light mode' : 'Switch to dark mode'}
            title={darkActive ? 'লাইট মোড চালু করুন' : 'ডার্ক মোড চালু করুন'}
          >
            <AnimatePresence mode="wait">
              {darkActive ? (
                <motion.div
                  key="sun"
                  initial={{ rotate: -90, opacity: 0, scale: 0.7 }}
                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  exit={{ rotate: 90, opacity: 0, scale: 0.7 }}
                  transition={{ duration: 0.2 }}
                >
                  <Sun className="w-4 h-4 text-warning" />
                </motion.div>
              ) : (
                <motion.div
                  key="moon"
                  initial={{ rotate: 90, opacity: 0, scale: 0.7 }}
                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  exit={{ rotate: -90, opacity: 0, scale: 0.7 }}
                  transition={{ duration: 0.2 }}
                >
                  <Moon className="w-4 h-4 text-indigo" />
                </motion.div>
              )}
            </AnimatePresence>
          </button>

          {/* Admin Login Button */}
          <a
            href="#schools"
            onClick={(e) => handleNavClick(e, '#schools')}
            className="btn-primary-action hidden sm:inline-flex items-center justify-center h-11 px-5 text-xs font-bold rounded-[14px] hover:brightness-110 shadow-xs active:scale-[0.98] transition-all cursor-pointer gap-1.5"
          >
            <span>{t.btn_admin_login || 'অ্যাডমিন লগইন'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden w-11 h-11 rounded-[12px] bg-surface border border-[rgba(var(--ink-rgb),0.08)] flex items-center justify-center text-text cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="lg:hidden border-t border-[rgba(var(--ink-rgb),0.06)] bg-surface px-6 py-5 overflow-hidden shadow-lg"
          >
            <div className="flex flex-col gap-2">
              {navItems.map((item) => (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                    activeSection === item.id
                      ? 'bg-primary-soft text-primary-text font-bold'
                      : 'text-muted hover:text-text hover:bg-surface-hover'
                  }`}
                >
                  {item.label}
                </a>
              ))}
              <div className="pt-3 mt-1 border-t border-[rgba(var(--ink-rgb),0.06)]">
                <a
                  href="#schools"
                  onClick={(e) => handleNavClick(e, '#schools')}
                  className="btn-primary-action w-full flex items-center justify-center h-12 rounded-[14px] font-bold text-sm"
                >
                  <span>{t.btn_admin_login || 'অ্যাডমিন লগইন'}</span>
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
