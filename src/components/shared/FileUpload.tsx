"use client";

import { memo, useRef, useState } from "react";
import { Loader, Upload } from "lucide-react";
import { useTranslations } from "next-intl";

import UploadingStatus from "./UploadingStatus";

interface FileUploadProps {
  onUpload: (file: File) => void;
  isLoading: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ onUpload, isLoading }) => {
  const t = useTranslations();

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [dragActive, setDragActive] = useState(false);

  const acceptedFormats = [".xlsx", ".xls"];

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onUpload(e.dataTransfer.files[0]);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onUpload(e.target.files[0]);

      e.target.value = "";
    }
  };

  return (
    <div className="w-full">
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive
            ? "border-blue-400 bg-blue-50"
            : "border-gray-300 hover:border-gray-400"
        } ${isLoading ? "opacity-50 pointer-events-none" : ""}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={isLoading}
          ref={fileInputRef}
        />

        <div className="space-y-4">
          {isLoading ? (
            <Loader className="mx-auto h-8 w-8 md:h-12 md:w-12 text-blue-600 animate-spin" />
          ) : (
            <Upload className="mx-auto h-8 w-8 md:h-12 md:w-12 text-gray-400" />
          )}

          <div>
            <p className="text-sm md:text-lg font-medium text-gray-700">
              {isLoading ? (
                <UploadingStatus
                  message={t("general.UploadingStates.uploadingData")}
                />
              ) : (
                t("components.FileUpload.uploadFile")
              )}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {t("components.FileUpload.browseFile")}
            </p>
            <p className="text-xs text-gray-400 mt-2">
              {t("components.FileUpload.supportedFormats", {
                formats: acceptedFormats.join(","),
              })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(FileUpload);
