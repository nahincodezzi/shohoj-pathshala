import React from 'react';
import { Home, Bell, Award, UserPlus, Phone } from 'lucide-react';

/**
 * BottomTabBar (Section 8)
 * Fixed bottom mobile tab bar for phones & tablets (hidden on xl/desktop).
 * Hidden in print media automatically.
 */
export default function BottomTabBar({ tabs = [], lang = 'bn' }) {
  if (!tabs || tabs.length === 0) return null;

  const getIcon = (id) => {
    switch (id) {
      case 'home':
        return <Home className="w-5 h-5" />;
      case 'notices':
        return <Bell className="w-5 h-5" />;
      case 'result':
        return <Award className="w-5 h-5" />;
      case 'admission':
        return <UserPlus className="w-5 h-5" />;
      case 'contact':
        return <Phone className="w-5 h-5" />;
      default:
        return <Home className="w-5 h-5" />;
    }
  };

  return (
    <nav 
      aria-label="Mobile Navigation"
      className="xl:hidden fixed bottom-0 left-0 right-0 z-40 bg-[var(--surface)]/95 backdrop-blur-lg border-t border-[var(--border)] px-2 py-1.5 safe-area-bottom shadow-lg print:hidden transition-colors"
    >
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {tabs.map((tab) => {
          const content = (
            <>
              <div className="w-5 h-5 flex items-center justify-center">
                {getIcon(tab.id)}
              </div>
              <span className="text-[10px] font-semibold tracking-tight truncate max-w-[64px]">
                {tab.label}
              </span>
            </>
          );

          if (tab.onClick) {
            return (
              <button
                key={tab.id}
                type="button"
                onClick={tab.onClick}
                className="flex-1 flex flex-col items-center justify-center gap-1 py-1 px-1 rounded-xl text-[var(--muted)] hover:text-[var(--primary)] hover:bg-[var(--primary-soft)] transition-all cursor-pointer"
              >
                {content}
              </button>
            );
          }

          return (
            <a
              key={tab.id}
              href={tab.href}
              className="flex-1 flex flex-col items-center justify-center gap-1 py-1 px-1 rounded-xl text-[var(--muted)] hover:text-[var(--primary)] hover:bg-[var(--primary-soft)] transition-all"
            >
              {content}
            </a>
          );
        })}
      </div>
    </nav>
  );
}
