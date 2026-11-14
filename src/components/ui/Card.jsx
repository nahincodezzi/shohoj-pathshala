import React from 'react';

/**
 * Sohoj Pathshala Card Component
 * --surface + 1px --border + radius 16px, padding 18–24px
 * Optional shadow for stat cards or elevated containers
 */
export default function Card({
  children,
  className = '',
  shadow = false,
  surface = 'surface',
  hoverEffect = false,
  ...props
}) {
  const bgClass = surface === 'surface-2' ? 'bg-surface-2' : 'bg-surface';
  const shadowClass = shadow ? 'shadow-md shadow-black/10' : '';
  const hoverClass = hoverEffect ? 'hover:border-border-strong transition-all' : '';

  return (
    <div
      className={`rounded-2xl border border-border ${bgClass} p-5 sm:p-6 ${shadowClass} ${hoverClass} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
