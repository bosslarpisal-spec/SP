"use client";

import { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";

type ToastType = "success" | "error" | "warning";

type Toast = {
  id: number;
  message: string;
  type: ToastType;
  visible: boolean;
};

type ToastAPI = {
  success: (msg: string) => void;
  error: (msg: string) => void;
  warning: (msg: string) => void;
};

const ToastContext = createContext<ToastAPI>({
  success: () => {},
  error: () => {},
  warning: () => {},
});

export function useToast() {
  return useContext(ToastContext);
}

let nextId = 0;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timers = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());

  const dismiss = useCallback((id: number) => {
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, visible: false } : t))
    );
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 300);
  }, []);

  const add = useCallback(
    (message: string, type: ToastType) => {
      const id = ++nextId;
      setToasts((prev) => [...prev, { id, message, type, visible: true }]);
      const timer = setTimeout(() => dismiss(id), 3000);
      timers.current.set(id, timer);
    },
    [dismiss]
  );

  useEffect(() => {
    const t = timers.current;
    return () => { t.forEach((timer) => clearTimeout(timer)); };
  }, []);

  const api: ToastAPI = {
    success: (msg) => add(msg, "success"),
    error: (msg) => add(msg, "error"),
    warning: (msg) => add(msg, "warning"),
  };

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <ToastCard key={t.id} toast={t} onDismiss={() => dismiss(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastCard({
  toast,
  onDismiss,
}: {
  toast: Toast;
  onDismiss: () => void;
}) {
  const styles: Record<ToastType, { bg: string; text: string; icon: string }> = {
    success: { bg: "#059669", text: "#fff", icon: "ti-circle-check" },
    error:   { bg: "#DC2626", text: "#fff", icon: "ti-circle-x" },
    warning: { bg: "#D97706", text: "#fff", icon: "ti-alert-triangle" },
  };
  const s = styles[toast.type];

  return (
    <div
      className="pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg transition-all duration-300"
      style={{
        background: s.bg,
        color: s.text,
        minWidth: 260,
        maxWidth: 360,
        opacity: toast.visible ? 1 : 0,
        transform: toast.visible ? "translateY(0)" : "translateY(8px)",
      }}
    >
      <i className={`ti ${s.icon}`} style={{ fontSize: 18, flexShrink: 0 }} />
      <span className="text-sm font-medium flex-1">{toast.message}</span>
      <button
        onClick={onDismiss}
        className="ml-1 opacity-70 hover:opacity-100 transition-opacity"
        style={{ color: s.text }}
      >
        <i className="ti ti-x" style={{ fontSize: 14 }} />
      </button>
    </div>
  );
}
