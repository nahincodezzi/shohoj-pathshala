import React from 'react';

export default function Checkbox({
  label,
  id,
  name,
  checked,
  onChange,
  disabled = false,
  className = '',
  description,
  ...props
}) {
  const checkboxId = id || name || `checkbox-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={`flex items-start gap-3 select-none ${className}`}>
      <div className="flex items-center h-5 mt-0.5">
        <input
          id={checkboxId}
          name={name}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className="w-4 h-4 rounded border-border-strong text-primary accent-primary focus:ring-2 focus:ring-primary/45 cursor-pointer disabled:cursor-not-allowed"
          {...props}
        />
      </div>
      <div className="flex flex-col text-sm">
        {label && (
          <label 
            htmlFor={checkboxId} 
            className="font-medium text-text cursor-pointer leading-tight"
          >
            {label}
          </label>
        )}
        {description && (
          <span className="text-xs text-muted mt-0.5">{description}</span>
        )}
      </div>
    </div>
  );
}
