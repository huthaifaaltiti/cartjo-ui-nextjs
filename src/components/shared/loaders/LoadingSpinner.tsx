import React, { memo } from "react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  text?: string;
  variant?: "simple" | "with-text";
  color?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "md",
  className = "",
  text,
  variant = "with-text",
  color = "#9333ea",
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
        className={`animate-spin rounded-full border-b-2 ${sizeClasses[size]} ${className}`}
        style={{ borderColor: color }}
        role="status"
        aria-label="Loading"
      />
    );
  }

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div
        className={`${sizeClasses[size]} border-4 rounded-full animate-spin`}
        style={{
          borderColor: `${color}20`, // light version (~12.5% opacity) => (parseInt('hex', 16) / 255) * 100 = opacity percentage
          borderTopColor: color, // top segment for the spinner effect
        }}
        role="status"
        aria-label="Loading"
      />
      {text && (
        <p
          className={`mt-2 font-medium ${textSizeClasses[size]}`}
          style={{ color }}
        >
          {text}
        </p>
      )}
    </div>
  );
};

export default memo(LoadingSpinner);
