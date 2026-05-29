import React from 'react';

interface InputProps {
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  icon?: React.ReactNode;
}

export function Input({ type = 'text', placeholder, value, onChange, className = '', icon }: InputProps) {
  return (
    <div className="relative w-full">
      {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">{icon}</div>}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`w-full border border-border bg-input-background rounded-md px-3.5 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all ${
          icon ? 'pl-10' : ''
        } ${className}`}
      />
    </div>
  );
}
