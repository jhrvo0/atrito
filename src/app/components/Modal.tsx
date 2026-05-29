import React from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

export function Modal({ isOpen, onClose, children, title }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-card rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-lg">
        <div className="sticky top-0 bg-card border-b border-border px-4 md:px-8 py-4 md:py-6 flex items-center justify-between">
          {title && <h2 className="text-lg md:text-xl">{title}</h2>}
          <button
            onClick={onClose}
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
