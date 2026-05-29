import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

export function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
  type = 'button'
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center gap-2 rounded-md font-medium transition-all duration-150 cursor-pointer';

  const variants = {
    primary: 'bg-primary text-primary-foreground hover:opacity-90',
    secondary: 'border border-border bg-transparent text-foreground hover:bg-muted',
    ghost: 'text-foreground hover:bg-muted',
    destructive: 'bg-destructive text-destructive-foreground hover:opacity-90'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5',
    lg: 'px-6 py-3 text-lg'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  );
}
