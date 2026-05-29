import { useState, useEffect, useCallback } from 'react';
import { X } from 'lucide-react';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

let toastListener: ((toasts: Toast[]) => void) | null = null;
let toastsState: Toast[] = [];

export function showToast(message: string, type: Toast['type'] = 'success') {
  const id = crypto.randomUUID();
  const toast: Toast = { id, message, type };
  toastsState = [...toastsState, toast];
  toastListener?.(toastsState);

  setTimeout(() => {
    toastsState = toastsState.filter((t) => t.id !== id);
    toastListener?.(toastsState);
  }, 3000);
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    toastListener = setToasts;
    return () => { toastListener = null; };
  }, []);

  const dismiss = useCallback((id: string) => {
    toastsState = toastsState.filter((t) => t.id !== id);
    toastListener?.(toastsState);
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
      {toasts.map((toast) => {
        const colors = {
          success: 'bg-foreground text-background',
          error: 'bg-destructive text-destructive-foreground',
          info: 'bg-primary text-primary-foreground',
        }[toast.type];

        return (
          <div
            key={toast.id}
            className={`${colors} px-4 py-3 rounded-lg shadow-lg text-sm flex items-center gap-3 min-w-[200px] max-w-[360px] animate-in slide-in-from-bottom-2 fade-in duration-200`}
          >
            <span className="flex-1">{toast.message}</span>
            <button onClick={() => dismiss(toast.id)} className="opacity-70 hover:opacity-100 transition-opacity">
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
