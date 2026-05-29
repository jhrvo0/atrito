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
      className={`bg-card border border-border rounded-lg p-5 transition-all duration-150 ${
        onClick ? 'cursor-pointer hover:border-border/60' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}
