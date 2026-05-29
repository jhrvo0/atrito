import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function Card({ children, className = '', onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`bg-card border border-border/60 rounded-lg p-3 md:p-4 transition-all duration-150 ${
        onClick ? 'cursor-pointer hover:border-border hover:shadow-sm active:scale-[0.99]' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}
