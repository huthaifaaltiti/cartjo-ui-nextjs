"use client";

import React, { useState } from "react";
import {
  Upload,
  MapPin,
  FileText,
  CheckCircle,
  AlertCircle,
  Loader,
} from "lucide-react";

import DashboardLocationCard from "@/components/admin/routes/locations/DashboardLocationCard";
import DashboardLocationStatCard from "@/components/admin/routes/locations/DashboardLocationStatCard";

import { useLocations } from "@/hooks/react-query/useLocations";
import { useBulkUploadLocations } from "@/hooks/react-query/useBulkUploadLocations";

interface FileUploadProps {
  onUpload: (file: File) => void;
  isLoading: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ onUpload, isLoading }) => {
  const [dragActive, setDragActive] = useState(false);

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
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onUpload(e.target.files[0]);
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
        />

        <div className="space-y-4">
          {isLoading ? (
            <Loader className="mx-auto h-12 w-12 text-blue-600 animate-spin" />
          ) : (
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
          )}

          <div>
            <p className="text-lg font-medium text-gray-700">
              {isLoading ? "Uploading..." : "Upload Excel File"}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Drag and drop your Excel file here, or click to browse
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Supported formats: .xlsx, .xls
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

interface StatusMessageProps {
  message: string;
  type: "success" | "error" | "";
}

const StatusMessage: React.FC<StatusMessageProps> = ({ message, type }) => {
  if (!message) return null;

  const isSuccess = type === "success";
  const Icon = isSuccess ? CheckCircle : AlertCircle;
  const bgColor = isSuccess
    ? "bg-green-50 border-green-200"
    : "bg-red-50 border-red-200";
  const textColor = isSuccess ? "text-green-800" : "text-red-800";
  const iconColor = isSuccess ? "text-green-600" : "text-red-600";

  return (
    <div className={`border rounded-lg p-4 mb-6 ${bgColor}`}>
      <div className="flex items-center space-x-3">
        <Icon className={`h-5 w-5 ${iconColor}`} />
        <p className={`font-medium ${textColor}`}>{message}</p>
      </div>
    </div>
  );
};

export default function Locations() {
  // { data, isLoading: isFetching, error, refetch }
  const { data, isLoading: isFetching } = useLocations();
  const { mutate: uploadFile, isPending: isUploadLoading } =
    useBulkUploadLocations();

  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState<"success" | "error" | "">("");

  const handleFileUpload = (file: File) => {
    if (!file) return;

    setStatusMessage("");

    uploadFile(file, {
      onSuccess: (data) => {
        if (data.isSuccess) {
          setStatusMessage(data.message);
          setStatusType("success");
        }
      },
      onError: (error) => {
        console.error(error);
        setStatusMessage("Failed to upload file. Please try again.");
        setStatusType("error");
      },
    });
  };

  const totalLocations = Array.isArray(data?.locations)
    ? data?.locations?.reduce(
        (total, location) => total + 1 + location.subLocations.length,
        0
      )
    : 0;

  return (
    <div className="min-h-screen p-2">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Locations Management
          </h1>
          <p className="text-gray-600">
            Manage and upload location data with pricing information
          </p>
        </div>

        {/* Upload Section */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <FileText className="h-6 w-6 text-primary-600" />
            <h2 className="text-xl font-semibold text-gray-800">
              Upload New Locations
            </h2>
          </div>

          <FileUpload onUpload={handleFileUpload} isLoading={isUploadLoading} />

          <StatusMessage message={statusMessage} type={statusType} />
        </div>

        {/* Stats Section */}
        {!data || isFetching ? (
          <div className="text-center text-gray-500">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <DashboardLocationStatCard
              label="Total Locations"
              value={totalLocations}
              color="blue"
            />
            <DashboardLocationStatCard
              label="Main Locations"
              value={data?.locations?.length}
              color="green"
            />
            <DashboardLocationStatCard
              label="Sub Locations"
              value={totalLocations - data?.locations?.length}
              color="purple"
            />
          </div>
        )}

        {/* Locations Display */}
        {data && (
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center space-x-3 mb-6">
              <MapPin className="h-6 w-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-800">
                Current Locations
              </h2>
            </div>

            <div className="space-y-4">
              {data?.locations?.map((location, index) => (
                <DashboardLocationCard key={index} location={location} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
