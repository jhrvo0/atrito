import React from 'react';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
  examples?: string[];
}

export function EmptyState({ icon, title, description, action, examples }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="text-muted-foreground/50 mb-3">{icon}</div>
      <h3 className="text-base font-medium mb-1.5">{title}</h3>
      <p className="text-sm text-muted-foreground mb-4 max-w-sm leading-relaxed">{description}</p>
      {examples && examples.length > 0 && (
        <div className="mb-4 max-w-sm">
          <p className="text-xs text-muted-foreground/60 mb-2">Exemplos para inspirar:</p>
          <div className="flex flex-wrap justify-center gap-1.5">
            {examples.map((ex, i) => (
              <span key={i} className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded">
                {ex}
              </span>
            ))}
          </div>
        </div>
      )}
      {action && <div>{action}</div>}
    </div>
  );
}
