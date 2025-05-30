"use client";

import { memo, useState } from "react";
import { FileText } from "lucide-react";
// import { useQueryClient } from "@tanstack/react-query";

import { useBulkUploadLocations } from "@/hooks/react-query/useBulkUploadLocations";
import FileUpload from "../../../shared/FileUpload";
import StatusMessage from "@/components/shared/StatusMessage";
import { useRouter } from "next/navigation";

const DashboardUploadLocations = () => {
  const router = useRouter();
  // const queryClient = useQueryClient();
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

          // queryClient.invalidateQueries({
          //   queryKey: ["locations"],
          // });

          router.refresh();
        }
      },
      onError: (error) => {
        console.error(error);
        setStatusMessage("Failed to upload file. Please try again.");
        setStatusType("error");
      },
    });
  };

  return (
    <div className="w-full bg-white rounded-xl shadow-sm border p-6 mb-8">
      <div className="flex items-center space-x-3 mb-6">
        <FileText className="h-6 w-6 text-primary-600" />
        <h2 className="text-xl font-semibold text-gray-800">
          Upload New Locations
        </h2>
      </div>

      <div className="flex flex-col gap-3">
        <FileUpload onUpload={handleFileUpload} isLoading={isUploadLoading} />
        <StatusMessage message={statusMessage} type={statusType} />
      </div>
    </div>
  );
};

export default memo(DashboardUploadLocations);
