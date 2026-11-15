import React, { useState } from 'react';
import { Bell, ArrowRight, X } from 'lucide-react';

export default function UrgentTicker({
  school,
  urgentNotice,
  onOpenNotice,
  lang = 'bn'
}) {
  const isBn = lang === 'bn';
  const slug = school?.slug || '';
  const storageKey = `${slug}_urgent_ticker_dismissed`;

  const [dismissed, setDismissed] = useState(() => {
    try {
      return sessionStorage.getItem(storageKey) === 'true';
    } catch (e) {
      return false;
    }
  });

  if (!urgentNotice || dismissed) return null;

  const handleDismiss = () => {
    setDismissed(true);
    try {
      sessionStorage.setItem(storageKey, 'true');
    } catch (e) {}
  };

  const title = isBn 
    ? (urgentNotice.title_bn || urgentNotice.title)
    : (urgentNotice.title_en || urgentNotice.title);

  return (
    <div className="w-full bg-[var(--surface)] border-b border-[var(--border)] overflow-hidden text-xs select-none">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 h-11 flex items-center justify-between gap-4">
        {/* Left: Gold Badge with Bell Sway */}
        <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-[var(--accent)] text-[var(--on-accent)] font-bold font-heading shrink-0 shadow-xs">
          <Bell className="w-3.5 h-3.5 bell-sway" />
          <span>{isBn ? 'জরুরি নোটিশ' : 'URGENT'}</span>
        </div>

        {/* Center: Streaming Ticker with Fade Mask */}
        <div 
          className="flex-1 overflow-hidden relative cursor-pointer"
          onClick={() => onOpenNotice && onOpenNotice(urgentNotice)}
          style={{
            maskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)',
            WebkitMaskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)'
          }}
        >
          <div className="ticker flex items-center gap-6 text-[var(--text)] font-medium hover:text-[var(--primary-text)] transition-colors">
            <span>{title}</span>
            <span className="text-[var(--accent)]">◆</span>
            <span>{title}</span>
            <span className="text-[var(--accent)]">◆</span>
            <span>{title}</span>
          </div>
        </div>

        {/* Right: Details & Dismiss Button */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => onOpenNotice && onOpenNotice(urgentNotice)}
            className="hidden sm:inline-flex items-center gap-1 text-[var(--primary-text)] hover:text-[var(--primary)] font-bold cursor-pointer"
          >
            <span>{isBn ? 'বিস্তারিত' : 'Details'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={handleDismiss}
            className="w-7 h-7 rounded-lg bg-[var(--bg-alt)] hover:bg-[var(--surface-hover)] border border-[var(--border)] text-[var(--muted)] hover:text-[var(--text)] flex items-center justify-center cursor-pointer transition-colors"
            title={isBn ? 'নোটিশটি লুকান' : 'Dismiss'}
            aria-label="Dismiss urgent notice"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
