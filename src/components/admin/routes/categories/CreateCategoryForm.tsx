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
import { useCategories } from "@/contexts/CategoriesContext";
import LoadingButton from "@/components/shared/LoadingButton";

import { User } from "@/types/user";

import { isArabicOnly } from "@/utils/text/containsArabic";
import { invalidateQuery } from "@/utils/queryUtils";
import { isEnglishOnly } from "@/utils/text/containsEnglish";

import { validationConfig } from "@/config/validationConfig";
import { isArabicLocale } from "@/config/locales.config";

import { API_ENDPOINTS } from "@/lib/apiEndpoints";
import { useHandleApiError } from "@/hooks/useHandleApiError";

const createFormSchema = (
  t: (key: string, options?: Record<string, string | number | Date>) => string
) => {
  const { nameMinChars, nameMaxChars, imageMinChars } =
    validationConfig.category;

  return z.object({
    categoryImage_ar: z.string().min(imageMinChars, {
      message: t(
        "routes.dashboard.routes.categories.components.CreateCategoryForm.validations.categoryImage_ar.required"
      ),
    }),
    categoryImage_en: z.string().min(imageMinChars, {
      message: t(
        "routes.dashboard.routes.categories.components.CreateCategoryForm.validations.categoryImage_en.required"
      ),
    }),
    name_ar: z
      .string()
      .min(nameMinChars, {
        message: t(
          "routes.dashboard.routes.categories.components.CreateCategoryForm.validations.name_ar.minChars",
          { min: nameMinChars }
        ),
      })
      .max(nameMaxChars, {
        message: t(
          "routes.dashboard.routes.categories.components.CreateCategoryForm.validations.name_ar.maxChars",
          { max: nameMaxChars }
        ),
      })
      .refine((val) => isArabicOnly(val), {
        message: t(
          "routes.dashboard.routes.categories.components.CreateCategoryForm.validations.name_ar.arabicCharsOnly"
        ),
      }),
    name_en: z
      .string()
      .min(nameMinChars, {
        message: t(
          "routes.dashboard.routes.categories.components.CreateCategoryForm.validations.name_en.minChars",
          { min: nameMinChars }
        ),
      })
      .max(nameMaxChars, {
        message: t(
          "routes.dashboard.routes.categories.components.CreateCategoryForm.validations.name_en.maxChars",
          { max: nameMaxChars }
        ),
      })
      .refine((val) => isEnglishOnly(val), {
        message: t(
          "routes.dashboard.routes.categories.components.CreateCategoryForm.validations.name_en.englishCharsOnly"
        ),
      }),
  });
};

type FormData = z.infer<ReturnType<typeof createFormSchema>>;

const CreateCategoryForm = () => {
  const t = useTranslations();
  const locale = useLocale();
  const isArabic = isArabicLocale(locale);
  const { accessToken, queryKey } = useCategories();
  const queryClient = useQueryClient();
  const handleApiError = useHandleApiError();

  const imageUploaderRef = useRef<ImageUploaderRef>(null);
  const [categoryImage_ar, setCategoryImage_ar] = useState<{
    file: File | null;
    url: string;
  }>({
    file: null,
    url: "",
  });
  const [categoryImage_en, setCategoryImage_en] = useState<{
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
      categoryImage_ar: "",
      categoryImage_en: "",
      name_ar: "",
      name_en: "",
    },
  });

  const handleImageChange_ar = (data: { file?: File | null; url?: string }) => {
    const url = data.url || "";

    setCategoryImage_ar({ file: data.file ?? null, url });

    form.setValue("categoryImage_ar", url);
  };

  const handleImageChange_en = (data: { file?: File | null; url?: string }) => {
    const url = data.url || "";

    setCategoryImage_en({ file: data.file ?? null, url });

    form.setValue("categoryImage_en", url);
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

      const excludedFields = ["categoryImage_ar", "categoryImage_en"];

      Object.entries(data).forEach(([key, value]) => {
        if (excludedFields.includes(key)) return;

        formData.append(key, String(value));
      });

      formData.append("lang", locale);

      if (categoryImage_ar?.file) {
        formData.append("image_ar", categoryImage_ar.file);
      }

      if (categoryImage_en?.file) {
        formData.append("image_en", categoryImage_en.file);
      }

      const response = await fetch(API_ENDPOINTS.DASHBOARD.CATEGORIES.CREATE, {
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
            t(
              "routes.dashboard.routes.categories.createCategory.creationFailed"
            )
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
          <div
            className={`flex gap-5 ${
              isArabic ? "flex-row-reverse" : "flex-row"
            }`}
          >
            <div className="flex-1">
              <FormField
                control={form.control}
                name="categoryImage_ar"
                render={() => (
                  <FormItem className={getFormItemClassName()}>
                    <FormLabel className="text-sm font-normal">
                      {t(
                        "routes.dashboard.routes.categories.createCategory.uploadArImage"
                      )}
                    </FormLabel>
                    <ImageUploader
                      ref={imageUploaderRef}
                      value={categoryImage_ar.url}
                      onChange={handleImageChange_ar}
                      onError={handleImageError}
                      label={""}
                      maxSizeInMB={2}
                      size="sm"
                      variant="rounded"
                      accept="image/png, image/jpeg, image/jpg, image/avif, image/webp"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex-1">
              <FormField
                control={form.control}
                name="categoryImage_en"
                render={() => (
                  <FormItem className={getFormItemClassName()}>
                    <FormLabel className="text-sm font-normal">
                      {t(
                        "routes.dashboard.routes.categories.createCategory.uploadEnImage"
                      )}
                    </FormLabel>
                    <ImageUploader
                      ref={imageUploaderRef}
                      value={categoryImage_en.url}
                      onChange={handleImageChange_en}
                      onError={handleImageError}
                      label={""}
                      maxSizeInMB={2}
                      size="sm"
                      variant="rounded"
                      accept="image/png, image/jpeg, image/jpg, image/avif, image/webp"
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
                name="name_ar"
                render={({ field }) => (
                  <FormItem className={getFormItemClassName()}>
                    <FormLabel className="text-sm font-normal">
                      {t(
                        "routes.dashboard.routes.categories.components.CreateCategoryForm.fields.name_ar.label"
                      )}
                    </FormLabel>
                    <FormControl>
                      <Input
                        className={getInputClassName()}
                        placeholder={t(
                          "routes.dashboard.routes.categories.components.CreateCategoryForm.fields.name_ar.placeholder"
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
                name="name_en"
                render={({ field }) => (
                  <FormItem className={getFormItemClassName()}>
                    <FormLabel className="text-sm font-normal">
                      {t(
                        "routes.dashboard.routes.categories.components.CreateCategoryForm.fields.name_en.label"
                      )}
                    </FormLabel>
                    <FormControl>
                      <Input
                        className={getInputClassName()}
                        placeholder={t(
                          "routes.dashboard.routes.categories.components.CreateCategoryForm.fields.name_en.placeholder"
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
            label={t(
              "routes.auth.components.AuthTabs.components.register.actions.proceed"
            )}
            loadingLabel={t("general.loadingStates.loadingApi")}
          />
        </form>
      </Form>
    </div>
  );
};

export default memo(CreateCategoryForm);
