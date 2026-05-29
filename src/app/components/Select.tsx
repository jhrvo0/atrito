import React from 'react';

interface SelectProps {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  className?: string;
}

export function Select({ value, onChange, options, placeholder, className = '' }: SelectProps) {
  return (
    <select
      value={value}
      onChange={onChange}
      className={`w-full border border-border bg-input-background rounded-md px-3.5 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all cursor-pointer ${className}`}
    >
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
