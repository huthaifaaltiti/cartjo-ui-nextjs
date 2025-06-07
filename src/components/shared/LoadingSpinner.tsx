import React, { memo } from "react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  text?: string;
  variant?: "simple" | "with-text";
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "md",
  className = "",
  text,
  variant = "with-text",
}) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
  };

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
    xl: "text-xl",
  };

  if (variant === "simple") {
    return (
      <div
        className={`animate-spin rounded-full border-b-2 border-purple-500 ${sizeClasses[size]} ${className}`}
        role="status"
        aria-label="Loading"
      />
    );
  }

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div
        className={`${sizeClasses[size]} border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin`}
        role="status"
        aria-label="Loading"
      />
      {text && (
        <p
          className={`mt-2 text-purple-600 font-medium ${textSizeClasses[size]}`}
        >
          {text}
        </p>
      )}
    </div>
  );
};

export default memo(LoadingSpinner);
