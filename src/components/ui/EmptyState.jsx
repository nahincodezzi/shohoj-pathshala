import React from 'react';
import { Inbox } from 'lucide-react';
import Button from './Button';

export default function EmptyState({
  icon: Icon = Inbox,
  title = 'কোনো তথ্য পাওয়া যায়নি',
  description = 'এখানে প্রদর্শনের মতো কোনো রেকর্ড বর্তমানে উপস্থিত নেই।',
  actionLabel,
  onAction,
  className = ''
}) {
  return (
    <div 
      className={`w-full p-8 sm:p-12 rounded-2xl border-2 border-dashed border-border-strong bg-surface/50 flex flex-col items-center justify-center text-center ${className}`}
    >
      <div className="w-14 h-14 rounded-full bg-primary-soft text-primary flex items-center justify-center mb-4">
        <Icon className="w-7 h-7" aria-hidden="true" />
      </div>

      <h4 className="text-base sm:text-lg font-heading font-bold text-text mb-1">
        {title}
      </h4>

      <p className="text-xs sm:text-sm text-muted max-w-sm mb-6 leading-relaxed">
        {description}
      </p>

      {actionLabel && onAction && (
        <Button variant="secondary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

