"use client";

import { memo, useRef } from "react";
import { useTranslations } from "next-intl";
import { ImagePlus, X } from "lucide-react";

import { cn } from "@/lib/utils";

interface ImageUploaderProps {
  value?: string;
  onChange?: (file: File | null, url: string) => void;
  onError?: (error: string) => void;
  className?: string;
  containerClassName?: string;
  accept?: string;
  maxSizeInMB?: number;
  placeholder?: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "circle" | "square" | "rounded";
  disabled?: boolean;
  showRemoveButton?: boolean;
  label?: string;
  required?: boolean;
  ref?: React.Ref<ImageUploaderRef>;
}

export interface ImageUploaderRef {
  clear: () => void;
  triggerUpload: () => void;
}

const sizeClasses = {
  sm: "w-16 h-16",
  md: "w-24 h-24",
  lg: "w-32 h-32",
  xl: "w-40 h-40",
};

const variantClasses = {
  circle: "rounded-full",
  square: "rounded-none",
  rounded: "rounded-lg",
};

const ImageUploader = ({
  value,
  onChange,
  onError,
  className,
  containerClassName,
  accept = "image/png, image/jpeg, image/jpg, image/webp",
  maxSizeInMB = 5,
  placeholder,
  size = "md",
  variant = "circle",
  disabled = false,
  showRemoveButton = true,
  label,
  required = false,
  ref,
}: ImageUploaderProps) => {
  const t = useTranslations();
  const inputRef = useRef<HTMLInputElement>(null);

  if (ref && typeof ref === "object" && ref !== null) {
    ref.current = {
      clear: () => {
        if (inputRef.current) {
          inputRef.current.value = "";
        }
        onChange?.(null, "");
      },
      triggerUpload: () => {
        inputRef.current?.click();
      },
    };
  }

  const validateFile = (file: File): string | null => {
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
      return t("errors.sizeLimit", { maxSize: maxSizeInMB });
    }

    const acceptedTypes = accept.split(", ").map((type) => type.trim());
    const isValidType = acceptedTypes.some((type) => {
      if (type.startsWith("image/")) {
        return file.type === type;
      }
      return file.name.toLowerCase().endsWith(type.replace("image/", "."));
    });

    if (!isValidType) {
      return t("errors.invalidType", { types: accept });
    }

    return null;
  };

  const handleImageSelect = () => {
    if (disabled) return;
    inputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    const validationError = validateFile(file);
    if (validationError) {
      onError?.(validationError);
      return;
    }

    const url = URL.createObjectURL(file);
    onChange?.(file, url);
  };

  const handleRemoveImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    onChange?.(null, "");
  };

  const renderPlaceholder = () => {
    if (placeholder) return placeholder;
    return <ImagePlus className="text-primary-500 w-5 h-5" />;
  };

  return (
    <div className={cn("space-y-2", containerClassName)}>
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="bg-[#eeeef7] rounded p-5 flex items-center justify-center w-fit">
        <input
          ref={inputRef}
          type="file"
          className="sr-only"
          accept={accept}
          onChange={handleImageChange}
          disabled={disabled}
          aria-label={label || "Upload image"}
        />

        <div className="relative">
          <div
            style={{
              backgroundImage: value ? `url(${value})` : "none",
            }}
            className={cn(
              sizeClasses[size],
              variantClasses[variant],
              "bg-white-50 flex items-center justify-center shadow-md bg-cover bg-center overflow-hidden transition-all",
              disabled
                ? "cursor-not-allowed opacity-60"
                : "cursor-pointer hover:shadow-lg",
              className
            )}
            onClick={handleImageSelect}
            role="button"
            tabIndex={disabled ? -1 : 0}
            aria-label={value ? "Change image" : "Upload image"}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleImageSelect();
              }
            }}
          >
            {!value && renderPlaceholder()}
          </div>

          {value && showRemoveButton && !disabled && (
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute -top-1 -right-1 bg-primary-100 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-primary-200 transition-colors shadow-md"
              aria-label="Remove image"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

ImageUploader.displayName = "ImageUploader";

export default memo(ImageUploader);
