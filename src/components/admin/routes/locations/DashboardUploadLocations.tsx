"use client";

import { useRouter } from "next/navigation";
import { memo, useState } from "react";
import { FileText } from "lucide-react";
import { useTranslations } from "next-intl";

import { useBulkUploadLocations } from "@/hooks/react-query/useBulkUploadLocations";
import { useHandleApiError } from "@/hooks/handleApiError";

import FileUpload from "../../../shared/FileUpload";
import StatusMessage from "@/components/shared/StatusMessage";

const DashboardUploadLocations = () => {
  const router = useRouter();
  const t = useTranslations();
  // const queryClient = useQueryClient();
  const { mutate: uploadFile, isPending: isUploadLoading } =
    useBulkUploadLocations();
  const handleApiError = useHandleApiError();

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
        handleApiError(error);
      },
    });
  };

  return (
    <div className="w-full bg-white rounded-xl shadow-sm border p-6 mb-8">
      <div className="flex items-center gap-2 mb-6">
        <FileText className="w-5 h-5 md:h-6 md:w-6 text-primary-600" />
        <h2 className="text-sm md:text-xl font-semibold text-gray-800">
          {t(
            "routes.dashboard.routes.locations.components.DashboardUploadLocations.uploadNewLocations"
          )}
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
