import React from 'react';

/**
 * Sohoj Pathshala Button Component
 * Heights: 44px default, 48px hero/mobile
 * Radius: 10px, Weight: 600
 * Variants: primary, secondary, danger, ghost, glass
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon: Icon,
  iconRight: IconRight,
  className = '',
  type = 'button',
  href,
  target,
  rel,
  onClick,
  ...props
}) {
  const baseClasses = "inline-flex items-center justify-center font-semibold rounded-[10px] transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/45 disabled:opacity-50 disabled:cursor-not-allowed select-none gap-2 shrink-0";
  
  const sizeClasses = {
    sm: "h-9 px-3.5 text-xs",
    md: "h-11 px-5 text-sm", // 44px
    lg: "h-12 px-6 text-base" // 48px
  }[size] || "h-11 px-5 text-sm";

  const variantClasses = {
    primary: "bg-primary text-on-primary hover:bg-primary-hover shadow-xs active:scale-[0.98]",
    secondary: "bg-transparent border border-border-strong text-text hover:bg-surface-2 hover:border-text active:scale-[0.98]",
    danger: "bg-transparent border border-danger text-danger hover:bg-danger-soft active:scale-[0.98]",
    dangerSolid: "bg-danger text-white hover:bg-danger/90 active:scale-[0.98]",
    ghost: "bg-transparent text-text hover:bg-surface-2",
    glass: "glass-panel border border-border text-text hover:bg-surface-2/80"
  }[variant] || "bg-primary text-on-primary";

  const innerContent = (
    <>
      {loading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" aria-hidden="true" />
      ) : Icon ? (
        <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
      ) : null}
      
      {children && <span>{children}</span>}

      {!loading && IconRight && (
        <IconRight className="w-4 h-4 shrink-0" aria-hidden="true" />
      )}
    </>
  );

  if (href && !disabled) {
    return (
      <a
        href={href}
        target={target}
        rel={target === '_blank' ? (rel || 'noopener noreferrer') : rel}
        onClick={onClick}
        className={`${baseClasses} ${sizeClasses} ${variantClasses} ${className}`}
        {...props}
      >
        {innerContent}
      </a>
    );
  }

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseClasses} ${sizeClasses} ${variantClasses} ${className}`}
      {...props}
    >
      {innerContent}
    </button>
  );
}

