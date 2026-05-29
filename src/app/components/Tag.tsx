import React from 'react';

interface TagProps {
  children: React.ReactNode;
  variant?: 'context' | 'intensity' | 'frequency' | 'status' | 'investigated' | 'default';
  className?: string;
}

export function Tag({ children, variant = 'default', className = '' }: TagProps) {
  const variants = {
    context: 'bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-300',
    intensity: 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
    frequency: 'bg-violet-50 text-violet-700 dark:bg-violet-950 dark:text-violet-300',
    status: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
    investigated: 'bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-300',
    default: 'bg-muted text-muted-foreground'
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium tracking-wide ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
