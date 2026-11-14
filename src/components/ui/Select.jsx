import React from 'react';
import { AlertCircle, ChevronDown } from 'lucide-react';

export default function Select({
  label,
  name,
  value,
  onChange,
  options = [],
  error,
  helperText,
  required = false,
  disabled = false,
  className = '',
  id,
  surface = 'surface-2',
  placeholder = 'নির্বাচন করুন...',
  ...props
}) {
  const selectId = id || name || `select-${Math.random().toString(36).substr(2, 9)}`;
  const bgClass = surface === 'surface' ? 'bg-surface' : 'bg-surface-2';

  return (
    <div className={`w-full flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label 
          htmlFor={selectId} 
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
        <select
          id={selectId}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          aria-invalid={error ? 'true' : 'false'}
          className={`w-full h-12 rounded-[10px] ${bgClass} text-text border text-sm transition-all outline-none appearance-none px-4 pr-10 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
            error
              ? 'border-2 border-danger focus:ring-2 focus:ring-danger/25'
              : 'border-border-strong focus:border-primary focus:ring-2 focus:ring-primary/45'
          }`}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((opt, i) => {
            const optVal = typeof opt === 'object' ? opt.value : opt;
            const optLabel = typeof opt === 'object' ? opt.label : opt;
            return (
              <option key={i} value={optVal}>
                {optLabel}
              </option>
            );
          })}
        </select>

        <div className="absolute right-3.5 text-muted pointer-events-none flex items-center">
          <ChevronDown className="w-4 h-4" aria-hidden="true" />
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-1.5 text-xs text-danger font-medium mt-0.5" role="alert">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}

