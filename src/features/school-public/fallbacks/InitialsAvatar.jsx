import React from 'react';

export default function InitialsAvatar({ name = '', size = 'md', className = '' }) {
  const clean = name.replace(/^(মো\.|মোঃ|জনাব|শ্রী|মুহাম্মদ|ড\.|ডঃ)\s*/i, '').trim();
  const parts = clean.split(/\s+/);
  const initials = parts.length >= 2 
    ? (parts[0][0] || '') + (parts[1][0] || '')
    : clean.slice(0, 2) || 'বি';

  const sizeClasses = {
    sm: 'w-9 h-9 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-16 h-16 text-lg',
    xl: 'w-24 h-24 text-2xl',
    huge: 'w-full h-full text-4xl'
  }[size] || 'w-12 h-12 text-sm';

  return (
    <div
      className={`rounded-full bg-[var(--primary)]/15 border border-[var(--primary)]/30 text-[var(--primary)] font-bold font-heading flex items-center justify-center select-none shadow-inner ${sizeClasses} ${className}`}
    >
      <span>{initials}</span>
    </div>
  );
}
