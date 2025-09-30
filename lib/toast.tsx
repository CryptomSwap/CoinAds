"use client";

import { createContext, useContext } from "react";
import { toast as sonnerToast } from "sonner";

interface ToastContextType {
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
  warning: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const success = (message: string) => sonnerToast.success(message);
  const error = (message: string) => sonnerToast.error(message);
  const info = (message: string) => sonnerToast.info(message);
  const warning = (message: string) => sonnerToast.warning(message);

  return (
    <ToastContext.Provider value={{ success, error, info, warning }}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

// Export toast object for direct usage
export const toast = {
  success: (message: string) => sonnerToast.success(message),
  error: (message: string) => sonnerToast.error(message),
  info: (message: string) => sonnerToast.info(message),
  warning: (message: string) => sonnerToast.warning(message),
};
