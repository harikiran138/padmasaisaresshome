"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2, AlertCircle, Info } from "lucide-react";

type ToastType = "success" | "error" | "info";

interface Toast {
  id: string;
  title: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (type: ToastType, title: string, message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((type: ToastType, title: string, message: string) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, title, message, type }]);

    // Auto-remove after 5 seconds for luxury readability
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-8 right-8 z-[100] flex flex-col gap-3 w-full max-w-[360px]">
        <AnimatePresence mode="popLayout">
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.95, transition: { duration: 0.2 } }}
              className="group relative bg-white/95 backdrop-blur-2xl border border-gray-100 shadow-[0_10px_40px_rgb(0,0,0,0.06)] p-5 rounded-sm flex items-start gap-4 overflow-hidden"
            >
              {/* Luxury Progress Bar */}
              <motion.div 
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: 5, ease: "linear" }}
                className={`absolute bottom-0 left-0 h-[2px] ${
                  toast.type === "success" ? "bg-primary" : toast.type === "error" ? "bg-red-500" : "bg-gray-400"
                }`}
              />

              <div className="flex-shrink-0 mt-1">
                {toast.type === "success" && <CheckCircle2 size={18} className="text-primary" />}
                {toast.type === "error" && <AlertCircle size={18} className="text-red-500" />}
                {toast.type === "info" && <Info size={18} className="text-gray-400" />}
              </div>

              <div className="flex-1 pr-6">
                <h5 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-900 mb-1">
                  {toast.title}
                </h5>
                <p className="text-[11px] font-medium text-gray-500 leading-relaxed italic">
                  {toast.message}
                </p>
              </div>

              <button 
                onClick={() => removeToast(toast.id)}
                className="absolute top-4 right-4 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-50 rounded-full"
              >
                <X size={12} className="text-gray-400" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
