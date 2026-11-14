import React from 'react';

/**
 * Sohoj Pathshala FilterChip Component
 * Height: 36px, radius: 999px
 * Selected = var(--primary) fill + var(--on-primary) text
 * Unselected = border var(--border-strong) + text var(--muted)
 */
export default function FilterChip({
  children,
  selected = false,
  onClick,
  count,
  className = '',
  ...props
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`h-9 px-4 rounded-full text-xs sm:text-sm font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 focus:outline-none focus:ring-2 focus:ring-primary/45 ${
        selected
          ? 'bg-primary text-on-primary shadow-xs'
          : 'bg-transparent border border-border-strong text-muted hover:text-text hover:bg-surface-2'
      } ${className}`}
      {...props}
    >
      <span>{children}</span>
      {count !== undefined && (
        <span 
          className={`px-1.5 py-0.2 rounded-full text-[11px] font-mono ${
            selected 
              ? 'bg-on-primary/20 text-on-primary' 
              : 'bg-surface-2 text-muted'
          }`}
        >
          {count}
        </span>
      )}
    </button>
  );
}
