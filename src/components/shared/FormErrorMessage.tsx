import React from "react";

interface FormErrorMessageProps {
  message?: string;
  className?: string;
}

const FormErrorMessage: React.FC<FormErrorMessageProps> = ({
  message,
  className = "",
}) => {
  return (
    <p
      className={`text-sm font-medium text-destructive min-h-[20px] ${className}`}
    >
      {message || ""}
    </p>
  );
};

export default React.memo(FormErrorMessage);
