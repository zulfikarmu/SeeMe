import { AnimatePresence, motion } from "motion/react";
import { CheckCircle, AlertTriangle, Info, X } from "lucide-react";
import { ToastMessage } from "../types";

interface ToastContainerProps {
  toasts: ToastMessage[];
  removeToast: (id: string) => void;
}

export default function ToastContainer({ toasts, removeToast }: ToastContainerProps) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full px-4 sm:px-0">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.15 } }}
            className={`flex items-start gap-3 p-4 rounded-sm border shadow-sm backdrop-blur-md transition-colors ${
              toast.type === "success"
                ? "bg-white/95 text-[#111111] border-[#D4D4D4] dark:bg-neutral-900/95 dark:text-neutral-100 dark:border-neutral-800"
                : toast.type === "error"
                ? "bg-white/95 text-[#111111] border-red-400 dark:bg-neutral-900/95 dark:text-neutral-100 dark:border-neutral-800"
                : "bg-[#F8F8F8]/95 text-[#111111] border-[#D4D4D4] dark:bg-neutral-900/95 dark:text-neutral-100 dark:border-neutral-800"
            }`}
          >
            <div className="mt-0.5 shrink-0">
              {toast.type === "success" && (
                <CheckCircle className="h-4 w-4 text-[#111111] dark:text-neutral-100" />
              )}
              {toast.type === "error" && (
                <AlertTriangle className="h-4 w-4 text-[#111111] dark:text-neutral-400" />
              )}
              {toast.type === "info" && (
                <Info className="h-4 w-4 text-[#111111] dark:text-neutral-400" />
              )}
            </div>

            <div className="flex-1 text-xs font-bold uppercase tracking-wider leading-5">
              {toast.text}
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="shrink-0 text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 p-0.5 rounded transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
