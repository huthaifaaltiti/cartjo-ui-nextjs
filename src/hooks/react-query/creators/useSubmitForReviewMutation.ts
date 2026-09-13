"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useAuthContext } from "@/hooks/useAuthContext";
import { submitCreatorStoreForReview } from "@/services/creators/creatorStore.service";
import { CREATOR_STORE_KEY } from "../query-options/creators/creatorStore";
import { showSuccessToast } from "@/components/shared/CustomToast";
import { DataResponse } from "@/types/service-response.type";
import { CreatorStore } from "@/types/creators/creatorStore";
import { useHandleApiError } from "@/hooks/useHandleApiError";

export const useSubmitForReviewMutation = () => {
  const queryClient = useQueryClient();
  const { locale } = useAuthContext();
  const t = useTranslations();

  const handleApiError = useHandleApiError();

  return useMutation({
    mutationFn: () => submitCreatorStoreForReview({ lang: locale }),
    onSuccess: (res: DataResponse<CreatorStore>) => {
      if (res?.isSuccess) {
        showSuccessToast({
          title: t("general.toast.title.success"),
          description:
            res.message || "Store submitted for review successfully!",
          dismissText: t("general.toast.dismissText"),
        });
        queryClient.invalidateQueries({ queryKey: [CREATOR_STORE_KEY] });
      }
    },
    onError: (error: Error) => {
      handleApiError(error);
    },
  });
};
