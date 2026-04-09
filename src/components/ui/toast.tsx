"use client";

import { useState, useEffect, useCallback, createContext, useContext, type ReactNode } from "react";
import { X, CheckCircle, AlertTriangle, Info, XCircle } from "lucide-react";
import { clsx } from "clsx";

type ToastType = "success" | "error" | "warning" | "info";

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
}

interface ToastContextType {
  toast: (type: ToastType, title: string, message?: string) => void;
}

const ToastContext = createContext<ToastContextType>({ toast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

const icons: Record<ToastType, typeof CheckCircle> = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

const styles: Record<ToastType, string> = {
  success: "border-emerald-400/20 bg-emerald-400/5",
  error: "border-red-400/20 bg-red-400/5",
  warning: "border-yellow-400/20 bg-yellow-400/5",
  info: "border-blue-400/20 bg-blue-400/5",
};

const iconColors: Record<ToastType, string> = {
  success: "text-emerald-400",
  error: "text-red-400",
  warning: "text-yellow-400",
  info: "text-blue-400",
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((type: ToastType, title: string, message?: string) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, type, title, message }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast: addToast }}>
      {children}
      <div className="fixed top-4 right-4 z-[100] space-y-2 pointer-events-none">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onDismiss={() => removeToast(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: () => void }) {
  const Icon = icons[toast.type];

  useEffect(() => {
    const timer = setTimeout(onDismiss, 5000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div
      className={clsx(
        "pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-xl border backdrop-blur-xl shadow-lg max-w-sm animate-fade-in-up",
        styles[toast.type]
      )}
    >
      <Icon className={clsx("w-5 h-5 flex-shrink-0 mt-0.5", iconColors[toast.type])} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white">{toast.title}</p>
        {toast.message && <p className="text-xs text-white/50 mt-0.5">{toast.message}</p>}
      </div>
      <button onClick={onDismiss} className="text-white/30 hover:text-white transition flex-shrink-0">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
