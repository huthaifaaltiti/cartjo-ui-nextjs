"use client";

import { memo, useRef, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  showErrorToast,
  showSuccessToast,
} from "@/components/shared/CustomToast";
import ImageUploader, {
  ImageUploaderRef,
} from "@/components/shared/ImageUploader";

import { useBanners } from "@/contexts/Banners.context";
import LoadingButton from "@/components/shared/LoadingButton";

import { User } from "@/types/user";

import { invalidateQuery } from "@/utils/queryUtils";

import { validationConfig } from "@/config/validationConfig";
import { isArabicLocale } from "@/config/locales.config";

import { API_ENDPOINTS } from "@/lib/apiEndpoints";
import { useHandleApiError } from "@/hooks/useHandleApiError";
import { isArabicOnly } from "@/utils/text/containsArabic";
import { isEnglishOnly } from "@/utils/text/containsEnglish";
import ToggleSwitch from "@/components/shared/ToggleSwitch";
import { Calendar24 } from "@/components/shared/Calendar24";

const createFormSchema = (
  t: (key: string, options?: Record<string, string | number | Date>) => string
) => {
  const {
    titleMinChars,
    titleMaxChars,
    imageMinChars,
    bannerLinkMinChars,
    bannerLinkMaxChars,
  } = validationConfig.banner;

  return z
    .object({
      bannerImage_ar: z.string().min(imageMinChars, {
        message: t(
          "routes.dashboard.routes.banners.components.CreateBannerForm.validations.bannerImage_ar.required"
        ),
      }),
      bannerImage_en: z.string().min(imageMinChars, {
        message: t(
          "routes.dashboard.routes.banners.components.CreateBannerForm.validations.bannerImage_en.required"
        ),
      }),
      title_ar: z
        .string()
        .min(titleMinChars, {
          message: t(
            "routes.dashboard.routes.banners.components.CreateBannerForm.validations.title_ar.minChars",
            { min: titleMinChars }
          ),
        })
        .max(titleMaxChars, {
          message: t(
            "routes.dashboard.routes.banners.components.CreateBannerForm.validations.title_ar.maxChars",
            { max: titleMaxChars }
          ),
        })
        .refine((val) => isArabicOnly(val), {
          message: t(
            "routes.dashboard.routes.banners.components.CreateBannerForm.validations.title_ar.arabicCharsOnly"
          ),
        }),
      title_en: z
        .string()
        .min(titleMinChars, {
          message: t(
            "routes.dashboard.routes.banners.components.CreateBannerForm.validations.title_en.minChars",
            { min: titleMinChars }
          ),
        })
        .max(titleMaxChars, {
          message: t(
            "routes.dashboard.routes.banners.components.CreateBannerForm.validations.title_en.maxChars",
            { max: titleMaxChars }
          ),
        })
        .refine((val) => isEnglishOnly(val), {
          message: t(
            "routes.dashboard.routes.banners.components.CreateBannerForm.validations.title_en.englishCharsOnly"
          ),
        }),
      link: z.string().optional(),
      withAction: z.boolean(),
      startDate: z
        .date({
          invalid_type_error: t(
            "routes.dashboard.routes.banners.components.CreateBannerForm.validations.startDate.invalid"
          ),
        })
        .nullable()
        .optional(),
      endDate: z
        .date({
          invalid_type_error: t(
            "routes.dashboard.routes.banners.components.CreateBannerForm.validations.endDate.invalid"
          ),
        })
        .nullable()
        .optional(),
    })
    .superRefine((data, ctx) => {
      // Validate link length if withAction = true
      if (data.withAction) {
        if (!data.link || data.link.length < bannerLinkMinChars) {
          ctx.addIssue({
            path: ["link"],
            code: "custom",
            message: t(
              "routes.dashboard.routes.banners.components.CreateBannerForm.validations.link.minChars",
              { min: bannerLinkMinChars }
            ),
          });
        } else if (data.link.length > bannerLinkMaxChars) {
          ctx.addIssue({
            path: ["link"],
            code: "custom",
            message: t(
              "routes.dashboard.routes.banners.components.CreateBannerForm.validations.link.maxChars",
              { max: bannerLinkMaxChars }
            ),
          });
        }
      }

      // Validate date order
      if (data.startDate && data.endDate) {
        if (data.endDate <= data.startDate) {
          ctx.addIssue({
            path: ["endDate"],
            code: "custom",
            message: t(
              "routes.dashboard.routes.banners.components.CreateBannerForm.validations.endDate.mustBeAfterStart"
            ),
          });
        }
      }
    });
};

type FormData = z.infer<ReturnType<typeof createFormSchema>>;

const CreateBannerForm = () => {
  const t = useTranslations();
  const locale = useLocale();
  const isArabic = isArabicLocale(locale);
  const { token: accessToken, queryKey } = useBanners();
  const queryClient = useQueryClient();
  const handleApiError = useHandleApiError();

  const [withAction, setWithAction] = useState<boolean>(false);

  const imageUploaderRef = useRef<ImageUploaderRef>(null);
  const [bannerImage_ar, setBannerImage_ar] = useState<{
    file: File | null;
    url: string;
  }>({
    file: null,
    url: "",
  });
  const [bannerImage_en, setBannerImage_en] = useState<{
    file: File | null;
    url: string;
  }>({
    file: null,
    url: "",
  });

  const formSchema = createFormSchema(t);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bannerImage_ar: "",
      bannerImage_en: "",
      title_ar: "",
      title_en: "",
      link: "",
      withAction: false,
      startDate: null,
      endDate: null,
    },
  });

  const handleImageChange_ar = (data: { file?: File | null; url?: string }) => {
    const url = data.url || "";

    setBannerImage_ar({ file: data.file ?? null, url });

    form.setValue("bannerImage_ar", url);
  };

  const handleImageChange_en = (data: { file?: File | null; url?: string }) => {
    const url = data.url || "";

    setBannerImage_en({ file: data.file ?? null, url });

    form.setValue("bannerImage_en", url);
  };

  const handleImageError = (error: string) => {
    showErrorToast({
      title: t("general.toast.title.error"),
      description: error,
      dismissText: t("general.toast.dismissText"),
    });
  };

  const registerMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const formData = new FormData();

      const excludedFields = ["bannerImage_ar", "bannerImage_en"];

      Object.entries(data).forEach(([key, value]) => {
        if (excludedFields.includes(key)) return;

        if (value instanceof Date) {
          formData.append(key, value.toISOString());
        } else if (value !== null && value !== undefined) {
          formData.append(key, String(value));
        }
      });

      formData.append("lang", locale);

      if (bannerImage_ar?.file) {
        formData.append("image_ar", bannerImage_ar.file);
      }

      if (bannerImage_en?.file) {
        formData.append("image_en", bannerImage_en.file);
      }

      const response = await fetch(API_ENDPOINTS.DASHBOARD.BANNERS.CREATE, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();

        throw new Error(
          errorData?.message ||
            t("routes.dashboard.routes.banners.errors.failedCreation")
        );
      }

      return response.json();
    },
    onSuccess: async (data: {
      isSuccess: boolean;
      message: string;
      user: User;
    }) => {
      if (data?.isSuccess) {
        showSuccessToast({
          title: t("general.toast.title.success"),
          description: data.message,
          dismissText: t("general.toast.dismissText"),
        });

        form.reset();
        imageUploaderRef.current?.clear();

        await invalidateQuery(queryClient, queryKey);
      }
    },
    onError: (error: Error) => {
      handleApiError(error);
    },
  });

  const onSubmit = (values: FormData) => {
    registerMutation.mutate(values);
  };

  const getInputClassName = (baseClasses = "") =>
    `placeholder:text-xs text-xs ${baseClasses} ${
      isArabic
        ? "placeholder:text-right text-right"
        : "placeholder:text-left text-left"
    }`;

  const getFormItemClassName = () => (isArabic ? "text-right" : "text-left");

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className={`flex gap-5 rtl:flex-row-reverse ltr:flex-row`}>
            <div className="flex-1">
              <FormField
                control={form.control}
                name="bannerImage_ar"
                render={() => (
                  <FormItem className={getFormItemClassName()}>
                    <FormLabel className="text-sm font-normal">
                      {t(
                        "routes.dashboard.routes.banners.createBanner.uploadImage_ar"
                      )}
                    </FormLabel>

                    <ImageUploader
                      ref={imageUploaderRef}
                      value={bannerImage_ar.url}
                      onChange={handleImageChange_ar}
                      onError={handleImageError}
                      label={""}
                      maxSizeInMB={2}
                      size="sm"
                      variant="rounded"
                      accept="image/png, image/jpeg, image/jpg, image/gif, image/webp"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex-1">
              <FormField
                control={form.control}
                name="bannerImage_en"
                render={() => (
                  <FormItem className={getFormItemClassName()}>
                    <FormLabel className="text-sm font-normal">
                      {t(
                        "routes.dashboard.routes.banners.createBanner.uploadImage_en"
                      )}
                    </FormLabel>
                    <ImageUploader
                      ref={imageUploaderRef}
                      value={bannerImage_en.url}
                      onChange={handleImageChange_en}
                      onError={handleImageError}
                      label={""}
                      maxSizeInMB={2}
                      size="sm"
                      variant="rounded"
                      accept="image/png, image/jpeg, image/jpg, image/gif"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div
            className={`flex gap-5 ${
              isArabic ? "flex-row-reverse" : "flex-row"
            }`}
          >
            <div className="flex-1">
              <FormField
                control={form.control}
                name="title_ar"
                render={({ field }) => (
                  <FormItem className={getFormItemClassName()}>
                    <FormLabel className="text-sm font-normal">
                      {t(
                        "routes.dashboard.routes.banners.components.CreateBannerForm.fields.title_ar.label"
                      )}
                    </FormLabel>
                    <FormControl>
                      <Input
                        className={getInputClassName()}
                        placeholder={t(
                          "routes.dashboard.routes.banners.components.CreateBannerForm.fields.title_ar.placeholder"
                        )}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex-1">
              <FormField
                control={form.control}
                name="title_en"
                render={({ field }) => (
                  <FormItem className={getFormItemClassName()}>
                    <FormLabel className="text-sm font-normal">
                      {t(
                        "routes.dashboard.routes.banners.components.CreateBannerForm.fields.title_en.label"
                      )}
                    </FormLabel>
                    <FormControl>
                      <Input
                        className={getInputClassName()}
                        placeholder={t(
                          "routes.dashboard.routes.banners.components.CreateBannerForm.fields.title_en.placeholder"
                        )}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div
            className={`flex gap-5 ${
              isArabic ? "flex-row-reverse" : "flex-row"
            }`}
          >
            {withAction && (
              <div className="flex-1">
                <FormField
                  control={form.control}
                  name="link"
                  render={({ field }) => (
                    <FormItem className={getFormItemClassName()}>
                      <FormLabel className="text-sm font-normal">
                        {t(
                          "routes.dashboard.routes.banners.components.CreateBannerForm.fields.link.label"
                        )}
                      </FormLabel>
                      <FormControl>
                        <Input
                          className={getInputClassName()}
                          placeholder={t(
                            "routes.dashboard.routes.banners.components.CreateBannerForm.fields.link.placeholder"
                          )}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            <div className={`${!withAction ? "" : "flex-1"}`}>
              <FormField
                control={form.control}
                name="withAction"
                render={({ field }) => (
                  <FormItem
                    className={`${getFormItemClassName()} flex items-center justify-center gap-2`}
                  >
                    <FormLabel className="text-sm font-normal">
                      {t(
                        "routes.dashboard.routes.banners.components.CreateBannerForm.fields.withAction.label"
                      )}
                    </FormLabel>
                    <FormControl>
                      <ToggleSwitch
                        value={withAction}
                        onChange={() => {
                          const newValue = !withAction;
                          setWithAction(newValue);
                          field.onChange(newValue);
                        }}
                        width={50}
                        height={22}
                        trackColorInactive="#E55050"
                        trackColorActive="#16610E"
                        isDisabled={false}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className={`flex flex-col gap-5`}>
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem className={getFormItemClassName()}>
                  <FormLabel className="text-sm font-normal">
                    {t(
                      "routes.dashboard.routes.banners.components.CreateBannerForm.fields.startDate.label"
                    )}
                  </FormLabel>
                  <FormControl>
                    <Calendar24 value={field.value} onChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem className={getFormItemClassName()}>
                  <FormLabel className="text-sm font-normal">
                    {t(
                      "routes.dashboard.routes.banners.components.CreateBannerForm.fields.endDate.label"
                    )}
                  </FormLabel>
                  <FormControl>
                    <Calendar24 value={field.value} onChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <LoadingButton
            type="submit"
            loading={registerMutation.isPending}
            withAnimate={true}
            label={t("general.actions.proceed")}
            loadingLabel={t("general.UploadingStates.uploadingData")}
          />
        </form>
      </Form>
    </div>
  );
};

export default memo(CreateBannerForm);
