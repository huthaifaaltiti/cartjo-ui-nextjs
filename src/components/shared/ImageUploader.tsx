"use client";

import { memo, useRef } from "react";
import { useTranslations } from "next-intl";
import { ImagePlus, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploaderProps {
  value?: string | string[];
  onChange?: (data: {
    files: File[] | null;
    urls: string[] | null;
    file?: File | null;
    url?: string;
  }) => void;
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
  multiple?: boolean;
  maxImages?: number;
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
  multiple = false,
  maxImages = 10,
  ref,
}: ImageUploaderProps) => {
  const t = useTranslations();
  const inputRef = useRef<HTMLInputElement>(null);

  // Handle both single and multiple values
  const images = Array.isArray(value) ? value : value ? [value] : [];
  const isMultipleMode = multiple;

  if (ref && typeof ref === "object" && ref !== null) {
    ref.current = {
      clear: () => {
        if (inputRef.current) {
          inputRef.current.value = "";
        }
        onChange?.({ files: null, urls: null });
      },
      triggerUpload: () => {
        inputRef.current?.click();
      },
    };
  }

  const validateFile = (file: File): string | null => {
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
      return t("components.ImageUploader.errors.sizeLimit", {
        maxSize: maxSizeInMB,
      });
    }

    const acceptedTypes = accept.split(", ").map((type) => type.trim());

    const isValidType = acceptedTypes.some((type: string) => {
      if (type.startsWith("image/")) {
        return file?.type?.toString() === type?.toString();
      }

      return file.name.toLowerCase().endsWith(type.replace("image/", "."));
    });

    if (!isValidType) {
      return t("components.ImageUploader.errors.invalidType", {
        types: accept,
      });
    }

    return null;
  };

  const handleImageSelect = () => {
    if (disabled) return;
    if (isMultipleMode && images.length >= maxImages) {
      onError?.(
        t("components.ImageUploader.errors.maxImagesReached", { maxImages })
      );
      return;
    }
    inputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (files.length === 0) {
      return;
    }

    if (isMultipleMode) {
      // Check if adding these files would exceed the limit
      if (images.length + files.length > maxImages) {
        onError?.(
          t("components.ImageUploader.errors.maxImagesReached", { maxImages })
        );
        return;
      }

      // Validate all files
      const validationErrors: string[] = [];
      files.forEach((file, index) => {
        const error = validateFile(file);
        if (error) {
          validationErrors.push(`File ${index + 1}: ${error}`);
        }
      });

      if (validationErrors.length > 0) {
        onError?.(validationErrors.join(", "));
        return;
      }

      // Create URLs for all files
      const newUrls = files.map((file) => URL.createObjectURL(file));
      const allUrls = [...images, ...newUrls];

      onChange?.({ files, urls: allUrls });
    } else {
      // Single image mode
      const file = files[0];
      const validationError = validateFile(file);
      if (validationError) {
        onError?.(validationError);
        return;
      }

      const url = URL.createObjectURL(file);

      onChange?.({ files: [file], urls: [url], file, url });
    }
  };
  
  const handleRemoveImage = (e: React.MouseEvent, indexToRemove: number) => {
    e.stopPropagation();

    if (isMultipleMode) {
      const newImages = images.filter((_, index) => index !== indexToRemove);
      onChange?.({
        files: null,
        urls: newImages,
      });
    } else {
      if (inputRef.current) {
        inputRef.current.value = "";
      }
      onChange?.({ files: null, urls: null, file: null, url: "" });
    }
  };

  const renderPlaceholder = () => {
    if (placeholder) return placeholder;
    return <ImagePlus className="text-primary-500 w-5 h-5" />;
  };

  const renderImagePreview = (imageUrl: string, index: number) => (
    <div className="relative" key={index}>
      <div
        style={{
          backgroundImage: `url(${encodeURI(imageUrl)})`,
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
        onClick={!isMultipleMode ? handleImageSelect : undefined}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-label={`Image ${index + 1}`}
      />

      {showRemoveButton && !disabled && (
        <button
          type="button"
          onClick={(e) => handleRemoveImage(e, index)}
          className="absolute -top-1 -right-1 bg-primary-100 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-primary-200 transition-colors shadow-md"
          aria-label={`Remove image ${index + 1}`}
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </div>
  );

  const renderUploadButton = () => (
    <div className="relative">
      <div
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
        aria-label={images.length > 0 ? "Add another image" : "Upload image"}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleImageSelect();
          }
        }}
      >
        {renderPlaceholder()}
      </div>
    </div>
  );

  return (
    <div className={cn("space-y-2", containerClassName)}>
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
          {isMultipleMode && (
            <span className="text-gray-500 ml-1 text-xs">
              ({images.length}/{maxImages})
            </span>
          )}
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
          multiple={isMultipleMode}
        />

        <div
          className={cn(
            "flex gap-3",
            isMultipleMode ? "flex-wrap" : "flex-row"
          )}
        >
          {/* Render existing images */}
          {images.map((imageUrl, index) => renderImagePreview(imageUrl, index))}

          {/* Render upload button */}
          {(!isMultipleMode && images.length === 0) ||
          (isMultipleMode && images.length < maxImages)
            ? renderUploadButton()
            : null}
        </div>
      </div>

      <label className="text-xs font-medium text-gray-700">
        {t("components.ImageUploader.labels.maxFileSize")} ({maxSizeInMB} MB)
      </label>
    </div>
  );
};

ImageUploader.displayName = "ImageUploader";

export default memo(ImageUploader);
