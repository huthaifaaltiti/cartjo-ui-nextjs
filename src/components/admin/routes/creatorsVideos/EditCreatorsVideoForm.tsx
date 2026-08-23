"use client";

import { memo, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { showSuccessToast } from "@/components/shared/CustomToast";
import LoadingButton from "@/components/shared/LoadingButton";
import { invalidateQuery } from "@/utils/queryUtils";
import { isArabicLocale } from "@/config/locales.config";
import { API_ENDPOINTS } from "@/lib/apiEndpoints";
import { useHandleApiError } from "@/hooks/useHandleApiError";
import { authFetcher } from "@/utils/authFetcher";
import { DataResponse } from "@/types/service-response.type";
import { CreatorsVideo } from "@/types/creatorsVideo";
import { Permission } from "@/enums/permission.enum";
import { usePermission } from "@/hooks/usePermission";
import { showNoPermissionToast } from "@/utils/permissionToast";
import VideoUploader from "@/components/shared/VideoUploader";
import { CreatorsVideoType } from "@/enums/creatorsVideoType.enum";

const editFormSchema = (tVal: any) => {
  return z.object({
    title_ar: z
      .string()
      .min(3, { message: tVal("validations.title_ar.minChars", { min: 3 }) })
      .max(100, {
        message: tVal("validations.title_ar.maxChars", { max: 100 }),
      }),
    title_en: z
      .string()
      .min(3, { message: tVal("validations.title_en.minChars", { min: 3 }) })
      .max(100, {
        message: tVal("validations.title_en.maxChars", { max: 100 }),
      }),
    type: z.string().min(1, { message: tVal("validations.type.required") }),
  });
};

type FormData = z.infer<ReturnType<typeof editFormSchema>>;

type EditCreatorsVideoFormProps = {
  video: CreatorsVideo;
  onSuccess?: () => void;
  queryKey: string;
};

const EditCreatorsVideoForm = ({
  video,
  onSuccess,
  queryKey,
}: EditCreatorsVideoFormProps) => {
  const t = useTranslations(
    "routes.dashboard.routes.creators.routes.videos.components.CreatorsVideosPageContainer.components.EditVideoForm",
  );
  const tVal = useTranslations(
    "routes.dashboard.routes.creators.routes.videos.components.CreatorsVideosPageContainer.CreateVideoForm",
  );
  const tg = useTranslations("general");
  const locale = useLocale();
  const isArabic = isArabicLocale(locale);
  const queryClient = useQueryClient();
  const handleApiError = useHandleApiError();

  const { canUpdate } = usePermission({
    canUpdate: Permission.CREATORS_VIDEOS_UPDATE,
  });

  const [newVideo, setNewVideo] = useState<{
    file: File | null;
    url: string | null;
  }>({
    file: null,
    url: video.media.url || null,
  });
  const [videoError, setVideoError] = useState<string | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(editFormSchema(tVal)),
    defaultValues: {
      title_ar: video.title?.ar || "",
      title_en: video.title?.en || "",
      type: video.type || "HERO",
    },
  });

  const handleVideoChange = (data: {
    file: File | null;
    url: string | null;
  }) => {
    setNewVideo(data);
    setVideoError(null);
  };

  const handleVideoError = (error: string) => {
    setVideoError(error);
  };

  const updateMutation = useMutation({
    mutationFn: async (values: FormData) => {
      const formData = new FormData();
      formData.append("title_ar", values.title_ar);
      formData.append("title_en", values.title_en);
      formData.append("type", values.type);
      if (newVideo.file) {
        formData.append("video", newVideo.file);
      }

      const response = await authFetcher<DataResponse<CreatorsVideo>>(
        `${API_ENDPOINTS.DASHBOARD.CREATORS_VIDEOS.EDIT}/${video._id}?lang=${locale}`,
        {
          method: "PUT",
          body: formData,
        },
      );

      if (!response.isSuccess) {
        throw new Error(response?.message || "Failed to update creators video");
      }

      return response;
    },
    onSuccess: async (data) => {
      if (data?.isSuccess) {
        showSuccessToast({
          title: tg("toast.title.success"),
          description: data.message,
          dismissText: tg("toast.dismissText"),
        });

        await invalidateQuery(queryClient, queryKey);
        onSuccess?.();
      }
    },
    onError: (error) => {
      handleApiError(error);
    },
  });

  const onSubmit = (values: FormData) => {
    if (!canUpdate) {
      showNoPermissionToast(tg);
      return;
    }
    updateMutation.mutate(values);
  };

  const getInputClassName = () =>
    `placeholder:text-xs text-xs ${
      isArabic
        ? "placeholder:text-right text-right"
        : "placeholder:text-left text-left"
    }`;

  const getFormItemClassName = () => (isArabic ? "text-right" : "text-left");

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Arabic Title */}
            <FormField
              control={form.control}
              name="title_ar"
              render={({ field }) => (
                <FormItem className={getFormItemClassName()}>
                  <FormLabel className="text-sm font-semibold">
                    {t("fields.title_ar.label")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={updateMutation.isPending}
                      placeholder={t("fields.title_ar.placeholder")}
                      className={getInputClassName()}
                    />
                  </FormControl>
                  <FormMessage className="text-xs text-red-500 mt-1" />
                </FormItem>
              )}
            />

            {/* English Title */}
            <FormField
              control={form.control}
              name="title_en"
              render={({ field }) => (
                <FormItem className={getFormItemClassName()}>
                  <FormLabel className="text-sm font-semibold">
                    {t("fields.title_en.label")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={updateMutation.isPending}
                      placeholder={t("fields.title_en.placeholder")}
                      className={getInputClassName()}
                    />
                  </FormControl>
                  <FormMessage className="text-xs text-red-500 mt-1" />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 gap-5">
            {/* Type */}
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className={getFormItemClassName()}>
                  <FormLabel className="text-sm font-semibold">
                    {t("fields.type.label")}
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={updateMutation.isPending}
                  >
                    <FormControl>
                      <SelectTrigger className="text-xs">
                        <SelectValue
                          placeholder={t("fields.type.placeholder")}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem
                        value={CreatorsVideoType.HERO}
                        className="text-xs"
                      >
                        {t("fields.type.options.hero")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-xs text-red-500 mt-1" />
                </FormItem>
              )}
            />

            {/* Video File Uploader */}
            <div className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-neutral-700">
                {t("fields.video.label")}
              </span>
              <VideoUploader
                value={newVideo.url || ""}
                onChange={handleVideoChange}
                onError={handleVideoError}
                disabled={updateMutation.isPending}
              />
              {videoError && (
                <p className="text-xs text-red-500 font-semibold mt-1">
                  {videoError}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 border-t pt-4">
            <LoadingButton
              label={tg("actions.proceed")}
              disabled={updateMutation.isPending}
              loading={updateMutation.isPending}
              withAnimate={true}
              loadingLabel={tg("UploadingStates.uploadingData")}
            />
          </div>
        </form>
      </Form>
    </div>
  );
};

export default memo(EditCreatorsVideoForm);
