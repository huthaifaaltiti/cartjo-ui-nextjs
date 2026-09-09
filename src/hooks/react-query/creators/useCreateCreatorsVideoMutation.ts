"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useAuthContext } from "@/hooks/useAuthContext";
import {
  createCreatorsVideo,
  CreateCreatorsVideoPayload,
} from "@/services/creators/creatorsVideo.service";
import {
  CREATORS_VIDEOS_KEY,
  ACTIVE_CREATORS_VIDEOS_KEY,
} from "../query-options/creators/dashboard/creatorsVideo";
import { showSuccessToast } from "@/components/shared/CustomToast";
import { DataResponse } from "@/types/service-response.type";
import { CreatorsVideo } from "@/types/creators/creatorsVideo";
import { useHandleApiError } from "@/hooks/useHandleApiError";

export const useCreateCreatorsVideoMutation = () => {
  const tg = useTranslations("general");
  const queryClient = useQueryClient();
  const { locale } = useAuthContext();
  const handleApiError = useHandleApiError();

  return useMutation<
    DataResponse<CreatorsVideo>,
    Error,
    CreateCreatorsVideoPayload
  >({
    mutationFn: (payload: CreateCreatorsVideoPayload) =>
      createCreatorsVideo({ ...payload, lang: locale }),
    onSuccess: (res: DataResponse<CreatorsVideo>) => {
      if (res?.isSuccess) {
        showSuccessToast({
          title: tg("toast.title.success"),
          description: res.message,
          dismissText: tg("toast.dismissText"),
        });
        queryClient.invalidateQueries({ queryKey: [CREATORS_VIDEOS_KEY] });
        queryClient.invalidateQueries({
          queryKey: [ACTIVE_CREATORS_VIDEOS_KEY],
        });
      }
    },
    onError: (error: Error) => {
      handleApiError(error);
    },
  });
};
