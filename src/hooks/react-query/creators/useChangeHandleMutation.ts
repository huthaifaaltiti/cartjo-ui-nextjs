"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useAuthContext } from "@/hooks/useAuthContext";
import { changeCreatorStoreHandle } from "@/services/creators/creatorStore.service";
import { CREATOR_STORE_KEY } from "../query-options/creators/creatorStore";
import {
  showErrorToast,
  showSuccessToast,
} from "@/components/shared/CustomToast";
import { DataResponse } from "@/types/service-response.type";
import {
  ChangeHandleData,
  ChangeHandlePayload,
  CreatorStore,
} from "@/types/creators/creatorStore";
import { FetchError } from "@/types/common";
import { formatDate } from "@/utils/formatDate";

export interface ChangeHandleErrorDetails {
  nextChangeAllowedAt?: string;
  cooldownDays?: number;
}

export const useChangeHandleMutation = () => {
  const queryClient = useQueryClient();
  const { locale } = useAuthContext();
  const t = useTranslations(
    "routes.creators.routes.dashboard.routes.store.components.StoreHandleCard",
  );
  const tg = useTranslations("general");

  return useMutation<
    DataResponse<ChangeHandleData>,
    FetchError,
    ChangeHandlePayload
  >({
    mutationFn: (payload: ChangeHandlePayload) =>
      changeCreatorStoreHandle({
        ...payload,
        lang: locale,
      }),
    onSuccess: (res: DataResponse<ChangeHandleData>) => {
      if (res?.isSuccess && res.data) {
        showSuccessToast({
          title: tg("toast.title.success") || "Success",
          description:
            res.message ||
            t("messages.success") ||
            "Store handle updated successfully!",
          dismissText: tg("toast.dismissText"),
        });

        queryClient.setQueryData<DataResponse<CreatorStore>>(
          [CREATOR_STORE_KEY],
          (old) => {
            if (!old?.data) return old;
            return {
              ...old,
              data: {
                ...old.data,
                handle: res?.data.handle,
                handleChangedAt: res.data.handleChangedAt,
                nextChangeAllowedAt: res.data.nextChangeAllowedAt,
                handleChangeCount: res.data.changeCount,
                previousHandles: res.data.previousHandle
                  ? [
                      ...(old.data.previousHandles || []),
                      res.data.previousHandle,
                    ]
                  : old.data.previousHandles,
              },
            };
          },
        );

        queryClient.invalidateQueries({ queryKey: [CREATOR_STORE_KEY] });
      }
    },
    onError: (error: FetchError) => {
      const details = error?.details as
        | { details?: ChangeHandleErrorDetails; message?: string }
        | undefined;
      const cooldownDetails = details?.details;

      if (cooldownDetails?.nextChangeAllowedAt) {
        const formattedDate = formatDate(
          cooldownDetails.nextChangeAllowedAt,
          locale,
        );
        showErrorToast({
          title: t("errors.cooldownTitle") || "Cooldown Active",
          description:
            t("errors.cooldownRaceMessage", { date: formattedDate }) ||
            `You can change your handle again on ${formattedDate}.`,
          dismissText: tg("toast.dismissText"),
        });
        queryClient.invalidateQueries({ queryKey: [CREATOR_STORE_KEY] });
        return;
      }

      showErrorToast({
        title: tg("toast.title.error") || "Error",
        description:
          error?.message ||
          details?.message ||
          t("errors.generic") ||
          "Failed to change handle.",
        dismissText: tg("toast.dismissText"),
      });
    },
  });
};
