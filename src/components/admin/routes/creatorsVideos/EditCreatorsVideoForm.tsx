"use client";

import { memo, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
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
import LoadingButton from "@/components/shared/LoadingButton";
import { invalidateQuery } from "@/utils/queryUtils";
import { isArabicLocale } from "@/config/locales.config";
import { CreatorsVideo } from "@/types/creators/creatorsVideo";
import { Permission } from "@/enums/permission.enum";
import { usePermission } from "@/hooks/usePermission";
import { showNoPermissionToast } from "@/utils/permissionToast";
import VideoUploader from "@/components/shared/VideoUploader";
import { CreatorsVideoType } from "@/enums/creatorsVideoType.enum";
import { MEDIA_CONFIG } from "@/config/media.config";
import { validationConfig } from "@/config/validationConfig";
import { useUpdateCreatorsVideoMutation } from "@/hooks/react-query/creators/useUpdateCreatorsVideoMutation";

const editFormSchema = (
  tVal: (
    key: string,
    options?: Record<string, string | number | Date>,
  ) => string,
) => {
  const { titleMinChars, titleMaxChars, videoMaxSizeMB } =
    validationConfig.creatorsVideo;
  const maxSizeBytes = videoMaxSizeMB * 1024 * 1024;

  return z.object({
    title_ar: z
      .string()
      .min(titleMinChars, {
        message: tVal("validations.title_ar.minChars", { min: titleMinChars }),
      })
      .max(titleMaxChars, {
        message: tVal("validations.title_ar.maxChars", { max: titleMaxChars }),
      }),
    title_en: z
      .string()
      .min(titleMinChars, {
        message: tVal("validations.title_en.minChars", { min: titleMinChars }),
      })
      .max(titleMaxChars, {
        message: tVal("validations.title_en.maxChars", { max: titleMaxChars }),
      }),
    type: z.nativeEnum(CreatorsVideoType, {
      errorMap: () => ({
        message: tVal("validations.type.required"),
      }),
    }),
    video: z
      .custom<File | string | null>((val) => Boolean(val), {
        message: tVal("validations.video.required"),
      })
      .refine(
        (val) => {
          if (!val) return false;
          if (val instanceof File) {
            return val.size <= maxSizeBytes;
          }
          return true;
        },
        {
          message: tVal("validations.video.maxSize", { size: videoMaxSizeMB }),
        },
      ),
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
    "routes.dashboard.routes.creators.routes.videos.components.CreatorsVideosPageContainer.components.CreateVideoForm",
  );
  const tg = useTranslations("general");
  const locale = useLocale();
  const isArabic = isArabicLocale(locale);
  const queryClient = useQueryClient();

  const updateCreatorsVideoMutation = useUpdateCreatorsVideoMutation();

  const { canUpdate } = usePermission({
    canUpdate: Permission.CREATORS_VIDEOS_UPDATE,
  });

  const [newVideo, setNewVideo] = useState<{
    file: File | null;
    url: string | null;
  }>({
    file: null,
    url: video.media?.url || null,
  });
  const [videoError, setVideoError] = useState<string | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(editFormSchema(tVal)),
    defaultValues: {
      title_ar: video.title?.ar || "",
      title_en: video.title?.en || "",
      type: (video.type as CreatorsVideoType) || CreatorsVideoType.HERO,
      video: video.media?.url || null,
    },
  });

  const handleVideoChange = (data: {
    file: File | null;
    url: string | null;
  }) => {
    setNewVideo(data);
    const videoValue = data.file || data.url || null;
    form.setValue("video", videoValue, { shouldValidate: true });
    if (videoValue) {
      form.clearErrors("video");
      setVideoError(null);
    } else {
      setVideoError(tVal("validations.video.required"));
      form.setError("video", {
        message: tVal("validations.video.required"),
      });
    }
  };

  const handleVideoError = (error: string) => {
    setVideoError(error);
    form.setError("video", { message: error });
  };

  const onSubmit = (values: FormData) => {
    if (!canUpdate) {
      showNoPermissionToast(tg);
      return;
    }

    if (!values.video || (!newVideo.url && !newVideo.file)) {
      setVideoError(tVal("validations.video.required"));
      form.setError("video", { message: tVal("validations.video.required") });
      return;
    }

    updateCreatorsVideoMutation.mutate(
      {
        id: video._id,
        title_ar: values.title_ar,
        title_en: values.title_en,
        type: values.type,
        video: values.video instanceof File ? values.video : newVideo.file,
      },
      {
        onSuccess: async (data) => {
          if (data?.isSuccess) {
            await invalidateQuery(queryClient, queryKey);
            onSuccess?.();
          }
        },
      },
    );
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
                      disabled={updateCreatorsVideoMutation.isPending}
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
                      disabled={updateCreatorsVideoMutation.isPending}
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
                    disabled={updateCreatorsVideoMutation.isPending}
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
            <FormField
              control={form.control}
              name="video"
              render={({ field, fieldState }) => (
                <FormItem className={getFormItemClassName()}>
                  <FormLabel className="text-sm font-semibold text-neutral-700">
                    {t("fields.video.label")}{" "}
                    <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <VideoUploader
                      value={newVideo.url || ""}
                      onChange={(data) => {
                        handleVideoChange(data);
                        field.onChange(data.file || data.url || null);
                      }}
                      onError={handleVideoError}
                      maxSizeInMB={
                        validationConfig.creatorsVideo.videoMaxSizeMB
                      }
                      accept={MEDIA_CONFIG.CREATORS_VIDEO.VIDEO.ALLOWED_TYPES}
                      disabled={updateCreatorsVideoMutation.isPending}
                    />
                  </FormControl>
                  {(fieldState.error?.message || videoError) && (
                    <FormMessage className="text-xs text-red-500 mt-1">
                      {fieldState.error?.message || videoError}
                    </FormMessage>
                  )}
                </FormItem>
              )}
            />
          </div>

          <div className="flex items-center justify-end gap-2 border-t pt-4">
            <LoadingButton
              label={tg("actions.proceed")}
              disabled={
                updateCreatorsVideoMutation.isPending ||
                (!newVideo.url && !newVideo.file)
              }
              loading={updateCreatorsVideoMutation.isPending}
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
