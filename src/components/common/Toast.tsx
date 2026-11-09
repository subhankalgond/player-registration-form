import React, { createContext, useContext, useState, useCallback } from 'react';
import { IconCheck, IconClose } from './Icons';

type ToastType = 'success' | 'error' | 'info';

interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 pointer-events-none max-w-sm w-full">
        {toasts.map((toast) => {
          let bgClass = 'bg-cream text-nearblack border-nearblack';
          if (toast.type === 'success') bgClass = 'bg-yellow-accent text-nearblack border-nearblack';
          if (toast.type === 'error') bgClass = 'bg-red-brick text-cream border-nearblack';

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto p-4 border-2 border-nearblack shadow-brutal flex items-start justify-between gap-3 font-mono text-sm font-bold ${bgClass} animate-in fade-in slide-in-from-bottom-2`}
            >
              <div className="flex items-center gap-2">
                {toast.type === 'success' && <IconCheck className="w-5 h-5 flex-shrink-0" />}
                {toast.type === 'error' && <IconClose className="w-5 h-5 flex-shrink-0" />}
                <span>{toast.message}</span>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="hover:opacity-70 p-0.5 cursor-pointer"
                aria-label="Close notification"
              >
                <IconClose className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
