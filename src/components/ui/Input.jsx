import React, { useState } from 'react';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

/**
 * Sohoj Pathshala Input Component
 * Height: 48px, Radius: 10px, Background: var(--surface-2) or var(--surface)
 * Label always on top (14px, weight 500)
 * Error state: 2px border var(--danger), aria-invalid, icon + reason
 * Password toggle with accessible button
 */
export default function Input({
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  error,
  helperText,
  icon: Icon,
  required = false,
  disabled = false,
  className = '',
  id,
  surface = 'surface-2',
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false);
  const inputId = id || name || `input-${Math.random().toString(36).substr(2, 9)}`;
  const isPassword = type === 'password';
  const effectiveType = isPassword ? (showPassword ? 'text' : 'password') : type;

  const bgClass = surface === 'surface' ? 'bg-surface' : 'bg-surface-2';

  return (
    <div className={`w-full flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label 
          htmlFor={inputId} 
          className="text-xs sm:text-sm font-medium text-text flex items-center justify-between"
        >
          <span>
            {label} {required && <span className="text-danger">*</span>}
          </span>
          {helperText && !error && (
            <span className="text-xs text-muted font-normal">{helperText}</span>
          )}
        </label>
      )}

      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-3.5 text-muted pointer-events-none flex items-center">
            <Icon className="w-5 h-5" aria-hidden="true" />
          </div>
        )}

        <input
          id={inputId}
          name={name}
          type={effectiveType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${inputId}-error` : undefined}
          className={`w-full h-12 rounded-[10px] ${bgClass} text-text border text-sm transition-all outline-none placeholder:text-subtle disabled:opacity-50 disabled:cursor-not-allowed ${
            Icon ? 'pl-11' : 'pl-4'
          } ${isPassword ? 'pr-12' : 'pr-4'} ${
            error
              ? 'border-2 border-danger focus:ring-2 focus:ring-danger/25'
              : 'border-border-strong focus:border-primary focus:ring-2 focus:ring-primary/45'
          }`}
          {...props}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "পাসওয়ার্ড লুকান" : "পাসওয়ার্ড দেখুন"}
            className="absolute right-2 w-9 h-9 rounded-lg text-muted hover:text-text flex items-center justify-center transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/45"
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4" aria-hidden="true" />
            ) : (
              <Eye className="w-4 h-4" aria-hidden="true" />
            )}
          </button>
        )}
      </div>

      {error && (
        <div id={`${inputId}-error`} className="flex items-center gap-1.5 text-xs text-danger font-medium mt-0.5" role="alert">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}

