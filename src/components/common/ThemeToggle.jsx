import React from 'react';
import { Sun, Moon } from 'lucide-react';

/**
 * ThemeToggle Component for Sohoj Pathshala
 * Size: 44x44px, radius 10px, border var(--border-strong), bg var(--surface)
 * Shows Sun in Dark mode (to switch to light), Moon in Light mode (to switch to dark)
 * Strict accessibility: aria-label in Bangla & English
 * Strict icon coloring: currentColor
 */
export default function ThemeToggle({ mode, toggleMode, lang = 'bn' }) {
  const isDark = mode === 'dark';
  
  const ariaLabel = isDark
    ? (lang === 'bn' ? 'লাইট মোড চালু করুন' : 'Switch to light mode')
    : (lang === 'bn' ? 'ডার্ক মোড চালু করুন' : 'Switch to dark mode');

  const tooltip = isDark
    ? (lang === 'bn' ? 'লাইট মোড' : 'Light Mode')
    : (lang === 'bn' ? 'ডার্ক মোড' : 'Dark Mode');

  return (
    <button
      type="button"
      onClick={toggleMode}
      aria-label={ariaLabel}
      title={tooltip}
      className="w-11 h-11 rounded-[10px] bg-surface hover:bg-surface-2 border border-border-strong text-text flex items-center justify-center transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/45 shrink-0"
    >
      {isDark ? (
        <Sun className="w-5 h-5 text-accent hover:rotate-45 transition-transform duration-300" aria-hidden="true" />
      ) : (
        <Moon className="w-5 h-5 text-indigo hover:-rotate-12 transition-transform duration-300" aria-hidden="true" />
      )}
    </button>
  );
}

