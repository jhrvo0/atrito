import React from 'react';

interface TagProps {
  children: React.ReactNode;
  variant?: 'context' | 'intensity' | 'frequency' | 'status' | 'default';
  className?: string;
}

export function Tag({ children, variant = 'default', className = '' }: TagProps) {
  const variants = {
    context: 'bg-blue-50 text-blue-700',
    intensity: 'bg-orange-50 text-orange-700',
    frequency: 'bg-purple-50 text-purple-700',
    status: 'bg-green-50 text-green-700',
    default: 'bg-muted text-muted-foreground'
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded text-xs ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
