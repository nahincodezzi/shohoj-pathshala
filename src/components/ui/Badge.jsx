import React from 'react';

/**
 * Sohoj Pathshala Badge Component
 * Formula: *-soft background + full color text, radius 999px, padding 2px 10px, 13px
 * Never color alone: always includes symbol (✓ / ✕ / ●) or explicit text
 */
export default function Badge({
  children,
  variant = 'primary',
  symbol,
  className = '',
  ...props
}) {
  const variantClasses = {
    primary: "bg-primary-soft text-primary border border-primary/25",
    success: "bg-success-soft text-success border border-success/30",
    warning: "bg-warning-soft text-warning border border-warning-line",
    danger: "bg-danger-soft text-danger border border-danger/30",
    info: "bg-info-soft text-info border border-info/30",
    indigo: "bg-indigo-soft text-indigo border border-indigo/30",
    accent: "bg-accent-soft text-accent border border-accent-line",
    muted: "bg-surface-2 text-muted border border-border-strong"
  }[variant] || "bg-primary-soft text-primary border border-primary/25";

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[13px] font-semibold leading-normal shrink-0 ${variantClasses} ${className}`}
      {...props}
    >
      {symbol && <span aria-hidden="true" className="font-bold">{symbol}</span>}
      <span>{children}</span>
    </span>
  );
}
