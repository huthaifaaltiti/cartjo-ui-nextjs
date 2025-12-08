import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

import { API_ENDPOINTS } from "@/lib/apiEndpoints";
import { CustomSession } from "@/lib/authOptions";

export const useBulkUploadLocations = () => {
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  return useMutation({
    mutationFn: async (file: File) => {
      console.log(session);
      const token = (session as CustomSession)?.accessToken;

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(
        API_ENDPOINTS.DASHBOARD.LOCATIONS.BULK_UPLOAD_LOCATIONS,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    },
    onSuccess: (data) => {
      if (data.isSuccess) {
        queryClient.invalidateQueries({ queryKey: ["dashboardLocations"] });
      }
    },
  });
};
