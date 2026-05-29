import React, { useEffect, useRef, useId } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

export function Modal({ isOpen, onClose, children, title }: ModalProps) {
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      if (e.key === 'Tab') {
        const container = containerRef.current;
        if (!container) return;

        const focusable = container.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    closeRef.current?.focus();

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div
        ref={containerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        className="relative bg-card rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-lg"
      >
        <div className="sticky top-0 bg-card border-b border-border px-4 md:px-8 py-4 md:py-6 flex items-center justify-between">
          {title && <h2 id={titleId} className="text-lg md:text-xl">{title}</h2>}
          <button
            ref={closeRef}
            onClick={onClose}
            aria-label="Fechar modal"
            className="ml-auto text-muted-foreground hover:text-foreground transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <div className="px-4 md:px-8 py-4 md:py-6">{children}</div>
      </div>
    </div>
  );
}
