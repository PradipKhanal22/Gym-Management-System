import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, X } from 'lucide-react';

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error';
}

interface ToastNotificationProps {
  toast: Toast;
  onRemove: (id: number) => void;
}

const ToastNotification: React.FC<ToastNotificationProps> = ({ toast, onRemove }) => {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const duration = 3000; // 3 seconds
    const interval = 10;
    const decrement = (interval / duration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          onRemove(toast.id);
          return 0;
        }
        return prev - decrement;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [toast.id, onRemove]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 100, y: 0 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      exit={{ opacity: 0, x: 100 }}
      className={`relative w-80 rounded-xl shadow-2xl overflow-hidden ${
        toast.type === 'success' ? 'bg-white' : 'bg-white'
      }`}
    >
      <div className="p-4 flex items-start gap-3">
        {toast.type === 'success' ? (
          <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>
        ) : (
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
            <XCircle className="w-5 h-5 text-red-600" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className={`font-bold text-sm ${
            toast.type === 'success' ? 'text-slate-900' : 'text-slate-900'
          }`}>
            {toast.type === 'success' ? 'Success' : 'Error'}
          </p>
          <p className="text-slate-600 text-sm mt-1">{toast.message}</p>
        </div>
        <button
          onClick={() => onRemove(toast.id)}
          className="text-slate-400 hover:text-slate-600 transition-colors shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="h-1 bg-slate-100">
        <motion.div
          className={`h-full ${
            toast.type === 'success' 
              ? 'bg-gradient-to-r from-primary to-emerald-500' 
              : 'bg-gradient-to-r from-red-500 to-red-600'
          }`}
          initial={{ width: '100%' }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.01, ease: 'linear' }}
        />
      </div>
    </motion.div>
  );
};

export const ToastContainer: React.FC<{ toasts: Toast[] }> = ({ toasts }) => {
  return (
    <div className="fixed top-4 right-4 z-[9999] space-y-3">
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastNotification
            key={toast.id}
            toast={toast}
            onRemove={(id) => {
              // This will be handled by the parent
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

let toastCounter = 0;
const toastListeners: Array<(toast: Toast) => void> = [];

export const toast = {
  success: (message: string) => {
    const newToast: Toast = {
      id: ++toastCounter,
      message,
      type: 'success',
    };
    toastListeners.forEach((listener) => listener(newToast));
  },
  error: (message: string) => {
    const newToast: Toast = {
      id: ++toastCounter,
      message,
      type: 'error',
    };
    toastListeners.forEach((listener) => listener(newToast));
  },
  addListener: (listener: (toast: Toast) => void) => {
    toastListeners.push(listener);
  },
  removeListener: (listener: (toast: Toast) => void) => {
    const index = toastListeners.indexOf(listener);
    if (index > -1) {
      toastListeners.splice(index, 1);
    }
  },
};

export default ToastNotification;
