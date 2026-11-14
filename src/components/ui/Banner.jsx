import React from 'react';
import { AlertTriangle, Eye, ArrowRight, X } from 'lucide-react';

export default function Banner({
  children,
  variant = 'warning',
  actionLabel,
  onAction,
  onClose,
  fullWidth = false,
  className = '',
  icon: CustomIcon
}) {
  const isSupport = variant === 'support';
  const isDanger = variant === 'danger';

  const bgClasses = isSupport
    ? 'bg-warning-soft text-warning border-b border-warning-line'
    : isDanger
    ? 'bg-danger-soft text-danger border border-danger/30'
    : 'bg-warning-soft text-warning border border-warning-line';

  const DefaultIcon = isSupport ? Eye : AlertTriangle;
  const IconComp = CustomIcon || DefaultIcon;

  return (
    <div
      role="status"
      className={`py-3 px-4 sm:px-6 flex items-center justify-between gap-4 text-xs sm:text-sm font-semibold transition-colors ${
        fullWidth ? 'w-full' : 'rounded-[12px]'
      } ${bgClasses} ${className}`}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <IconComp className="w-4 h-4 shrink-0" aria-hidden="true" />
        <div className="truncate">{children}</div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        {actionLabel && (
          <button
            type="button"
            onClick={onAction}
            className="inline-flex items-center gap-1 font-bold underline hover:opacity-80 cursor-pointer focus:outline-none"
          >
            <span>{actionLabel}</span>
            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        )}

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="ব্যানার বন্ধ করুন"
            className="p-1 rounded hover:bg-black/10 cursor-pointer focus:outline-none"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        )}
      </div>
    </div>
  );
}

