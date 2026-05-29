import { useState, useEffect } from 'react';
import { Button } from './Button';
import { Modal } from './Modal';

export interface ConfirmOptions {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'destructive' | 'primary';
}

let confirmListener: ((options: ConfirmOptions | null, resolve: ((value: boolean) => void) | null) => void) | null = null;

export function showConfirm(options: ConfirmOptions): Promise<boolean> {
  return new Promise((resolve) => {
    confirmListener?.(options, resolve);
  });
}

export function ConfirmDialog() {
  const [options, setOptions] = useState<ConfirmOptions | null>(null);
  const [resolveRef, setResolveRef] = useState<((value: boolean) => void) | null>(null);

  useEffect(() => {
    confirmListener = (opts, resolve) => {
      setOptions(opts);
      setResolveRef(() => resolve);
    };
    return () => { confirmListener = null; };
  }, []);

  const handleConfirm = () => {
    resolveRef?.(true);
    setOptions(null);
    setResolveRef(null);
  };

  const handleCancel = () => {
    resolveRef?.(false);
    setOptions(null);
    setResolveRef(null);
  };

  const handleClose = () => {
    resolveRef?.(false);
    setOptions(null);
    setResolveRef(null);
  };

  return (
    <Modal isOpen={!!options} onClose={handleClose} title={options?.title || ''}>
      {options && (
        <div className="space-y-6">
          <p className="text-sm text-muted-foreground">{options.message}</p>
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={handleCancel}>
              {options.cancelLabel || 'Cancelar'}
            </Button>
            <Button
              variant={options.variant || 'destructive'}
              onClick={handleConfirm}
            >
              {options.confirmLabel || 'Confirmar'}
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
