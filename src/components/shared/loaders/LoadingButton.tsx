import React from "react";
import { Button } from "@/components/ui/button";
import LoadingDots from "../LoadingDots";

type LoadingButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  loading: boolean;
  withAnimate: boolean;
  label: string;
  loadingLabel: string;
};

const LoadingButton: React.FC<LoadingButtonProps> = ({
  loading,
  label,
  loadingLabel,
  withAnimate = false,
  disabled,
  className,
  ...props
}) => {
  return (
    <Button
      disabled={disabled || loading}
      className={`w-full min-h-10 bg-primary-500 text-white-50 hover:bg-primary-400 disabled:opacity-50 transition-all ${className}`}
      {...props}
    >
      {loading ? (
        withAnimate ? (
          <>
            {loadingLabel}
            <LoadingDots />
          </>
        ) : (
          loadingLabel
        )
      ) : (
        label
      )}
    </Button>
  );
};

export default LoadingButton;
