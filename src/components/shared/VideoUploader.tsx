"use client";

import { memo, useRef, useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { X, Film } from "lucide-react";
import { cn } from "@/lib/utils";

interface VideoUploaderProps {
  value?: string;
  onChange?: (data: { file: File | null; url: string | null }) => void;
  onError?: (error: string) => void;
  className?: string;
  containerClassName?: string;
  accept?: string;
  maxSizeInMB?: number;
  disabled?: boolean;
  label?: string;
  required?: boolean;
}

export interface VideoUploaderRef {
  clear: () => void;
  triggerUpload: () => void;
}

const VideoUploader = ({
  value,
  onChange,
  onError,
  className,
  containerClassName,
  accept = "video/mp4, video/quicktime, video/webm, video/ogg",
  maxSizeInMB = 50,
  disabled = false,
  label,
  required = false,
}: VideoUploaderProps) => {
  const t = useTranslations("components.VideoUploader");
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(value || null);

  useEffect(() => {
    if (value) {
      setPreviewUrl(value);
    }
  }, [value]);

  const validateFile = (file: File): string | null => {
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;

    if (file.size > maxSizeInBytes) {
      return t("errors.maxSize", { size: maxSizeInMB });
    }

    const acceptedTypes = accept.split(",").map((t) => t.trim().toLowerCase());
    const fileType = file.type.toLowerCase();
    const fileExtension = `.${file.name.split(".").pop()?.toLowerCase()}`;

    const isValid = acceptedTypes.some(
      (type) => type === fileType || type === fileExtension || type === "video/*"
    );

    if (!isValid) {
      return t("errors.invalidType");
    }

    return null;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const error = validateFile(file);
    if (error) {
      onError?.(error);
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    onChange?.({ file, url });
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (disabled) return;

    setPreviewUrl(null);
    if (inputRef.current) inputRef.current.value = "";
    onChange?.({ file: null, url: null });
  };

  const triggerUpload = () => {
    if (disabled) return;
    inputRef.current?.click();
  };

  return (
    <div className={cn("flex flex-col gap-2 w-full", containerClassName)}>
      {label && (
        <span className="text-sm font-semibold text-neutral-700">
          {label} {required && <span className="text-red-500">*</span>}
        </span>
      )}

      <div
        onClick={triggerUpload}
        className={cn(
          "relative flex flex-col items-center justify-center border-2 border-dashed rounded-xl cursor-pointer overflow-hidden transition-all h-[240px] bg-neutral-50/50 hover:bg-neutral-50 hover:border-primary-500 border-neutral-300",
          disabled && "opacity-60 cursor-not-allowed",
          className
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          disabled={disabled}
          onChange={handleFileChange}
          className="hidden"
        />

        {previewUrl ? (
          <div className="relative w-full h-full group">
            <video
              src={previewUrl}
              controls
              className="w-full h-full object-cover"
              onClick={(e) => e.stopPropagation()}
            />
            {!disabled && (
              <button
                type="button"
                onClick={handleRemove}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 hover:bg-black/85 text-white transition-colors z-30"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-4 text-center">
            <div className="p-3 bg-white rounded-full shadow-sm border border-neutral-200 text-neutral-400 group-hover:text-primary-500 mb-3">
              <Film className="h-6 w-6" />
            </div>
            <span className="text-sm font-medium text-neutral-600">
              {t("placeholder")}
            </span>
            <span className="text-xs text-neutral-400 mt-1">
              {t("help", { size: maxSizeInMB })}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

VideoUploader.displayName = "VideoUploader";
export default memo(VideoUploader);
