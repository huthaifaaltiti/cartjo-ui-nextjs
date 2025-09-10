import { memo, useState, useEffect } from "react";
import { AlertTriangle, X, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { useTranslations } from "next-intl";
import LoadingDots from "./loaders/LoadingDots";

interface ConfirmationModalProps {
  txt: string;
  onSubmit: () => void;
  onCancel: () => void;
  errMsg?: string;
  isOpen?: boolean;
  title?: string;
  submitText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info";
  isLoading?: boolean;
  showIcon?: boolean;
  autoFocus?: boolean;
}

interface VariantStyles {
  icon: string;
  submitBtn: string;
  iconBg: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  txt,
  onSubmit,
  onCancel,
  errMsg,
  isOpen = true,
  title = "Confirm Action",
  submitText = "Confirm",
  cancelText = "Cancel",
  variant = "danger",
  isLoading = false,
  showIcon = true,
  autoFocus = true,
}) => {
  const t = useTranslations();

  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent): void => {
      if (e.key === "Escape" && !isLoading) {
        onCancel();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [isOpen, onCancel, isLoading]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>): void => {
    if (e.target === e.currentTarget && !isLoading) {
      onCancel();
    }
  };

  const handleSubmit = (): void => {
    if (!isLoading) {
      onSubmit();
    }
  };

  const handleCancel = (): void => {
    if (!isLoading) {
      onCancel();
    }
  };

  const getVariantStyles = (): VariantStyles => {
    switch (variant) {
      case "danger":
        return {
          icon: "text-red-500",
          submitBtn: "bg-red-600 hover:bg-red-700 focus:ring-red-500",
          iconBg: "bg-red-100",
        };
      case "warning":
        return {
          icon: "text-yellow-500",
          submitBtn: "bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500",
          iconBg: "bg-yellow-100",
        };
      case "info":
        return {
          icon: "text-blue-500",
          submitBtn: "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500",
          iconBg: "bg-blue-100",
        };
      default:
        return {
          icon: "text-red-500",
          submitBtn: "bg-red-600 hover:bg-red-700 focus:ring-red-500",
          iconBg: "bg-red-100",
        };
    }
  };

  if (!isOpen) return null;

  const styles = getVariantStyles();

  return (
    <div
      className={`fixed inset-0 z-50 bg-white-50/30 backdrop-blur-md shadow-inner flex items-center justify-center p-4 bg-black bg-opacity-50 transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <div
        className={`relative w-full max-w-md bg-white-50 rounded-lg shadow-xl transform transition-all duration-300 ${
          isVisible ? "scale-100 translate-y-0" : "scale-95 translate-y-4"
        }`}
        onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
      >
        {/* Close button */}
        <Button
          variant="ghost"
          onClick={handleCancel}
          disabled={isLoading}
          className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Close modal"
          type="button"
        >
          <X size={20} />
        </Button>

        <div className="p-6">
          {/* Header with icon */}
          <div className="flex items-start space-x-4 mb-4">
            {showIcon && (
              <div
                className={`flex-shrink-0 w-12 h-12 rounded-full ${styles.iconBg} flex items-center justify-center`}
              >
                <AlertTriangle className={`w-6 h-6 ${styles.icon}`} />
              </div>
            )}
            <div className="flex-1">
              <h3
                id="modal-title"
                className="text-lg font-semibold text-gray-900 mb-2"
              >
                {title}
              </h3>
              <p
                id="modal-description"
                className="text-sm text-gray-600 leading-relaxed"
              >
                {txt}
              </p>
            </div>
          </div>

          {/* Error message */}
          {errMsg && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-700">{errMsg}</p>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end space-y-2 space-y-reverse sm:space-y-0 sm:space-x-3">
            <Button
              onClick={handleCancel}
              disabled={isLoading}
              type="button"
              className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 bg-white-50 border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {cancelText}
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isLoading}
              autoFocus={autoFocus}
              type="button"
              className={`w-full sm:w-auto px-4 py-2 text-sm font-medium text-white-50 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2 ${styles.submitBtn}`}
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>
                {isLoading ? (
                  <span className="flex items-center gap-1">
                    {t("general.processing")}
                    <LoadingDots />
                  </span>
                ) : (
                  submitText
                )}
              </span>
            </Button>
          </div>
        </div>

        {/* Loading overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-white-50 bg-opacity-75 rounded-lg flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-gray-600" />
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(ConfirmationModal);
