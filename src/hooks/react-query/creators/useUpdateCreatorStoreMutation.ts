"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useAuthContext } from "@/hooks/useAuthContext";
import {
  updateCreatorStore,
  updateCreatorStoreProfile,
  updateCreatorStorePayoutInfo,
  updateCreatorStorePickupAddress,
  UpdateCreatorStorePayload,
  UpdateCreatorStoreProfilePayload,
  UpdateCreatorStorePayoutInfoPayload,
  UpdateCreatorStorePickupAddressPayload,
} from "@/services/creators/creatorStore.service";
import { CREATOR_STORE_KEY } from "../query-options/creators/creatorStore";
import { showSuccessToast } from "@/components/shared/CustomToast";
import { DataResponse } from "@/types/service-response.type";
import { CreatorStore } from "@/types/creators/creatorStore";
import { useHandleApiError } from "@/hooks/useHandleApiError";
import { Locale } from "@/enums/locale.enum";

export const useUpdateCreatorStoreProfileMutation = () => {
  const queryClient = useQueryClient();
  const { locale } = useAuthContext();
  const t = useTranslations();
  const handleApiError = useHandleApiError();

  return useMutation({
    mutationFn: (payload: UpdateCreatorStoreProfilePayload) =>
      updateCreatorStoreProfile({ ...payload, lang: locale }),
    onSuccess: (res: DataResponse<CreatorStore>) => {
      if (res?.isSuccess) {
        showSuccessToast({
          title: t("general.toast.title.success"),
          description: res.message || "Store profile updated successfully!",
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

export const useUpdateCreatorStorePayoutInfoMutation = () => {
  const queryClient = useQueryClient();
  const { locale } = useAuthContext();
  const t = useTranslations();
  const handleApiError = useHandleApiError();

  return useMutation({
    mutationFn: (payload: UpdateCreatorStorePayoutInfoPayload) =>
      updateCreatorStorePayoutInfo({ ...payload, lang: locale }),
    onSuccess: (res: DataResponse<CreatorStore>) => {
      if (res?.isSuccess) {
        showSuccessToast({
          title: t("general.toast.title.success"),
          description: res.message || "Payout details updated successfully!",
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

export const useUpdateCreatorStorePickupAddressMutation = () => {
  const queryClient = useQueryClient();
  const { locale } = useAuthContext();
  const t = useTranslations();
  const handleApiError = useHandleApiError();

  return useMutation({
    mutationFn: (payload: UpdateCreatorStorePickupAddressPayload) =>
      updateCreatorStorePickupAddress({ ...payload, lang: locale }),
    onSuccess: (res: DataResponse<CreatorStore>) => {
      if (res?.isSuccess) {
        showSuccessToast({
          title: t("general.toast.title.success"),
          description: res.message || "Pickup address updated successfully!",
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

export const useUpdateCreatorStoreMutation = () => {
  const queryClient = useQueryClient();
  const { locale } = useAuthContext();
  const t = useTranslations();
  const handleApiError = useHandleApiError();
  const isAr = locale === Locale.AR;

  return useMutation({
    mutationFn: (payload: UpdateCreatorStorePayload) =>
      updateCreatorStore({ ...payload, lang: locale }),
    onSuccess: (res: DataResponse<CreatorStore>) => {
      if (res?.isSuccess) {
        showSuccessToast({
          title: t("general.toast.title.success"),
          description:
            res.message ||
            t(
              "routes.creators.routes.dashboard.routes.store.routes.edit.form.allUpdatedSuccess",
            ) ||
            (isAr
              ? "تم حفظ وتحديث جميع بيانات المتجر بنجاح!"
              : "Store data updated successfully!"),
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
