import { useMutation, useQueryClient } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/lib/apiEndpoints";
import { authFetcher } from "@/utils/authFetcher";
import { DataResponse } from "@/types/service-response.type";

export const useBulkUploadLocations = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);

      const response = await authFetcher<DataResponse<Location>>(
        API_ENDPOINTS.DASHBOARD.LOCATIONS.BULK_UPLOAD_LOCATIONS,
        {
          method: "POST",
          body: formData,
        },
      );

      if (!response.isSuccess) {
        throw new Error(`Could not upload locations. Response: ${response}`);
      }

      return response;
    },
    onSuccess: (data) => {
      if (data.isSuccess) {
        queryClient.invalidateQueries({ queryKey: ["dashboardLocations"] });
      }
    },
  });
};
