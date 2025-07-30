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

import { useLogos } from "@/contexts/LogosContext";
import LoadingButton from "@/components/shared/LoadingButton";

import { User } from "@/types/user";

import { invalidateQuery } from "@/utils/queryUtils";

import { validationConfig } from "@/config/validationConfig";
import { isArabicLocale } from "@/config/locales.config";

import { API_ENDPOINTS } from "@/lib/apiEndpoints";
import { useHandleApiError } from "@/hooks/useHandleApiError";

const createFormSchema = (
  t: (key: string, options?: Record<string, string | number | Date>) => string
) => {
  const {
    nameMinChars,
    nameMaxChars,
    imageMinChars,
    altTextMinChars,
    altTextMaxChars,
  } = validationConfig.logo;

  return z.object({
    logoImage: z.string().min(imageMinChars, {
      message: t(
        "routes.dashboard.routes.logos.components.CreateLogoForm.validations.logoImage.required"
      ),
    }),
    name: z
      .string()
      .min(nameMinChars, {
        message: t(
          "routes.dashboard.routes.logos.components.CreateLogoForm.validations.name.minChars",
          { min: nameMinChars }
        ),
      })
      .max(nameMaxChars, {
        message: t(
          "routes.dashboard.routes.logos.components.CreateLogoForm.validations.name_ar.maxChars",
          { max: nameMaxChars }
        ),
      }),
    altText: z
      .string()
      .min(altTextMinChars, {
        message: t(
          "routes.dashboard.routes.logos.components.CreateLogoForm.validations.altText.minChars",
          { min: altTextMinChars }
        ),
      })
      .max(altTextMaxChars, {
        message: t(
          "routes.dashboard.routes.logos.components.CreateLogoForm.validations.altText.maxChars",
          { max: altTextMaxChars }
        ),
      }),
  });
};

type FormData = z.infer<ReturnType<typeof createFormSchema>>;

const CreateLogoForm = () => {
  const t = useTranslations();
  const locale = useLocale();
  const isArabic = isArabicLocale(locale);
  const { accessToken, queryKey } = useLogos();
  const queryClient = useQueryClient();
  const handleApiError = useHandleApiError();

  const imageUploaderRef = useRef<ImageUploaderRef>(null);
  const [logoImage, setLogoImage] = useState<{
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
      logoImage: "",
      name: "",
      altText: "",
    },
  });

  const handleImageChange = (data: { file?: File | null; url?: string }) => {
    const url = data.url || "";

    setLogoImage({ file: data.file ?? null, url });

    form.setValue("logoImage", url);
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

      const excludedFields = ["logoImage"];

      Object.entries(data).forEach(([key, value]) => {
        if (excludedFields.includes(key)) return;

        formData.append(key, String(value));
      });

      formData.append("lang", locale);

      if (logoImage?.file) {
        formData.append("image", logoImage.file);
      }

      const response = await fetch(API_ENDPOINTS.DASHBOARD.LOGOS.CREATE, {
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
            t("routes.dashboard.routes.logos.createLogo.actionFailed")
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
          <FormField
            control={form.control}
            name="logoImage"
            render={() => (
              <FormItem className={getFormItemClassName()}>
                <FormLabel className="text-sm font-normal">
                  {t("routes.dashboard.routes.logos.createLogo.uploadImage")}
                </FormLabel>
                <ImageUploader
                  ref={imageUploaderRef}
                  value={logoImage.url}
                  onChange={handleImageChange}
                  onError={handleImageError}
                  label={""}
                  maxSizeInMB={2}
                  size="sm"
                  variant="rounded"
                  accept="image/png, image/jpeg, image/jpg"
                />
                <FormMessage />
              </FormItem>
            )}
          />

          <div
            className={`flex gap-5 ${
              isArabic ? "flex-row-reverse" : "flex-row"
            }`}
          >
            <div className="flex-1">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className={getFormItemClassName()}>
                    <FormLabel className="text-sm font-normal">
                      {t(
                        "routes.dashboard.routes.logos.components.CreateLogoForm.fields.name.label"
                      )}
                    </FormLabel>
                    <FormControl>
                      <Input
                        className={getInputClassName()}
                        placeholder={t(
                          "routes.dashboard.routes.logos.components.CreateLogoForm.fields.name.placeholder"
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
                name="altText"
                render={({ field }) => (
                  <FormItem className={getFormItemClassName()}>
                    <FormLabel className="text-sm font-normal">
                      {t(
                        "routes.dashboard.routes.logos.components.CreateLogoForm.fields.altText.label"
                      )}
                    </FormLabel>
                    <FormControl>
                      <Input
                        className={getInputClassName()}
                        placeholder={t(
                          "routes.dashboard.routes.logos.components.CreateLogoForm.fields.altText.placeholder"
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

export default memo(CreateLogoForm);
