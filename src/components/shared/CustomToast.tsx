import React from "react";
import { toast } from "sonner";
import { CheckCircle, AlertTriangle, XCircle } from "lucide-react";

import { cn } from "@/lib/utils";

interface CustomToastProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  content?: React.ReactNode;
  dismissText?: string;
  className?: string;
  duration?: number;
}

const baseClass =
  "w-[95vw] md:w-[30rem] text-white rounded-2xl shadow-lg p-4 flex justify-between items-start gap-4 animate-in fade-in slide-in-from-top duration-300";

export const showCustomToast = ({
  title,
  description,
  icon,
  content,
  dismissText = "Dismiss",
  className = "",
  duration = 5000,
}: CustomToastProps) => {
  toast.custom(
    (t) => (
      <div className={cn(baseClass, className)}>
        <div className="flex-1">
          {icon && <div className="text-2xl mb-2">{icon}</div>}
          {title && <h1 className="text-lg font-semibold mb-1">{title}</h1>}
          {description && <p className="text-sm">{description}</p>}
          {content}
        </div>

        <button
          onClick={() => toast.dismiss(t)}
          className="text-sm text-white/70 hover:text-white underline transition-colors"
        >
          {dismissText}
        </button>
      </div>
    ),
    { duration }
  );
};

// Success Toast
export const showSuccessToast = (
  props: Omit<CustomToastProps, "icon" | "className">
) =>
  showCustomToast({
    ...props,
    icon: <CheckCircle className="text-green-500" />,
    className: "bg-white-50 border-[3px] border-green-500",
  });

// Warning Toast
export const showWarningToast = (
  props: Omit<CustomToastProps, "icon" | "className">
) =>
  showCustomToast({
    ...props,
    icon: <AlertTriangle className="text-yellow-600" />,
    className: "bg-white-50 border-[3px] border-yellow-600",
  });

// Error Toast
export const showErrorToast = (
  props: Omit<CustomToastProps, "icon" | "className">
) =>
  showCustomToast({
    ...props,
    icon: <XCircle className="text-red-600" />,
    className: "bg-white-50 border-[3px] border-red-600",
  });
