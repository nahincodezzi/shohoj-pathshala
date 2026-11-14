import React from 'react';
import { AlertCircle, AlertTriangle, CheckCircle2, Info } from 'lucide-react';

export default function Alert({
  children,
  variant = 'danger',
  title,
  className = '',
  icon: CustomIcon,
  ...props
}) {
  const configs = {
    danger: {
      bg: "bg-danger-soft text-danger border-danger/30",
      icon: AlertCircle
    },
    warning: {
      bg: "bg-warning-soft text-warning border-warning-line",
      icon: AlertTriangle
    },
    success: {
      bg: "bg-success-soft text-success border-success/30",
      icon: CheckCircle2
    },
    info: {
      bg: "bg-info-soft text-info border-info/30",
      icon: Info
    }
  }[variant] || {
    bg: "bg-danger-soft text-danger border-danger/30",
    icon: AlertCircle
  };

  const IconComp = CustomIcon || configs.icon;

  return (
    <div
      role="alert"
      className={`p-4 rounded-[10px] border flex items-start gap-3 text-xs sm:text-sm font-medium ${configs.bg} ${className}`}
      {...props}
    >
      <IconComp className="w-5 h-5 shrink-0 mt-0.5" aria-hidden="true" />
      <div className="flex-1">
        {title && <h5 className="font-bold mb-0.5">{title}</h5>}
        <div>{children}</div>
      </div>
    </div>
  );
}
