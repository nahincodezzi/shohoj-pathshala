import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Sun, Moon, ArrowRight, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function MobileDrawer({
  isOpen,
  onClose,
  navItems = [],
  school,
  lang,
  toggleLang,
  fontSize,
  setFontSize,
  isDark,
  toggleMode
}) {
  const isBn = lang === 'bn';

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-xs h-full bg-[var(--surface)] border-l border-[var(--border)] shadow-2xl p-6 flex flex-col justify-between z-10 overflow-y-auto">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-[var(--border)]">
            <span className="font-bold text-base text-[var(--text)] font-heading">
              {isBn ? 'মেনু' : 'Menu'}
            </span>
            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-[var(--bg-alt)] border border-[var(--border)] text-[var(--text)] flex items-center justify-center hover:border-[var(--primary)] cursor-pointer"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Nav Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isAdmission = item.id === 'admission';
              return (
                <a
                  key={item.id}
                  href={item.href || '#'}
                  onClick={(e) => {
                    onClose();
                    if (item.onClick) {
                      e.preventDefault();
                      item.onClick(e);
                    }
                  }}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    isAdmission
                      ? 'border border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent-text)] font-bold'
                      : 'text-[var(--text)] hover:bg-[var(--bg-alt)] hover:text-[var(--primary-text)]'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {item.label}
                    {isAdmission && item.hasPing && (
                      <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-ping-dot" />
                    )}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-50" />
                </a>
              );
            })}
          </nav>

          {/* Language & Font scale in drawer for mobile */}
          <div className="pt-4 border-t border-[var(--border)] space-y-3">
            <span className="text-xs font-semibold text-[var(--subtle)] block uppercase tracking-wider">
              {isBn ? 'ভাষা ও ফন্ট সাইজ' : 'Language & Font Scale'}
            </span>

            <div className="flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={toggleLang}
                className="flex-1 py-2 px-3 rounded-xl bg-[var(--bg-alt)] border border-[var(--border)] text-xs font-bold text-[var(--text)] text-center cursor-pointer"
              >
                {isBn ? 'English (EN)' : 'বাংলা (বাং)'}
              </button>

              <div className="flex items-center gap-1 bg-[var(--bg-alt)] p-1 rounded-xl border border-[var(--border)]">
                <button
                  type="button"
                  onClick={() => setFontSize('sm')}
                  className={`px-2 py-1 rounded-lg text-xs font-bold ${fontSize === 'sm' ? 'bg-[var(--primary)] text-[var(--on-primary)]' : ''}`}
                >
                  A-
                </button>
                <button
                  type="button"
                  onClick={() => setFontSize('md')}
                  className={`px-2 py-1 rounded-lg text-xs font-bold ${fontSize === 'md' ? 'bg-[var(--primary)] text-[var(--on-primary)]' : ''}`}
                >
                  A
                </button>
                <button
                  type="button"
                  onClick={() => setFontSize('lg')}
                  className={`px-2 py-1 rounded-lg text-xs font-bold ${fontSize === 'lg' ? 'bg-[var(--primary)] text-[var(--on-primary)]' : ''}`}
                >
                  A+
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Drawer Actions */}
        <div className="pt-6 border-t border-[var(--border)] space-y-3">
          <Link
            to={`/${school?.slug}/login`}
            onClick={onClose}
            className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-[var(--bg-alt)] border border-[var(--border)] text-xs font-bold text-[var(--text)] hover:border-[var(--primary)]"
          >
            <Shield className="w-4 h-4 text-[var(--primary)]" />
            <span>{isBn ? 'স্কুল অ্যাডমিন লগইন' : 'School Admin Login'}</span>
          </Link>
        </div>
      </div>
    </div>,
    document.body
  );
}
