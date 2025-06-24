"use client";

import { memo, useRef, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
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
import { API_ENDPOINTS } from "@/lib/apiEndpoints";
import { User } from "@/types/user";
import { useCategories } from "@/contexts/CategoriesContext";
import { invalidateQuery } from "@/utils/queryUtils";
import { Category } from "@/types/category";

const createFormSchema = (t: (key: string) => string) =>
  z.object({
    name_ar: z.string().min(2, {
      message: t(
        "routes.dashboard.routes.categories.components.EditCategoryForm.validations.name_ar.minChars"
      ),
    }),
    name_en: z.string().min(2, {
      message: t(
        "routes.dashboard.routes.categories.components.EditCategoryForm.validations.name_en.minChars"
      ),
    }),
  });

type FormData = z.infer<ReturnType<typeof createFormSchema>>;

type Props = {
  category: Category;
};

const EditCategoryForm = ({ category }: Props) => {
  const t = useTranslations();
  const locale = useLocale();
  const isArabic = locale === "ar";
  const { accessToken, queryKey } = useCategories();
  const queryClient = useQueryClient();

  const imageUploaderRef = useRef<ImageUploaderRef>(null);
  const [categoryImage, setCategoryImage] = useState<{
    file: File | null;
    url: string;
  }>({
    file: null,
    url: category?.image || "",
  });

  const formSchema = createFormSchema(t);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name_ar: category?.name?.ar || "",
      name_en: category?.name?.en || "",
    },
  });

  const handleImageChange = (file: File | null, url: string) => {
    setCategoryImage({ file, url });
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

      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, String(value));
      });

      formData.append("lang", locale);

      if (categoryImage.file) {
        formData.append("image", categoryImage.file);
      }

      const response = await fetch(
        `${API_ENDPOINTS.DASHBOARD.CATEGORIES.EDIT}/${category?._id}`,
        {
          method: "PUT",
          body: formData,
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.message || "Category update failed");
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
      showErrorToast({
        title: t("general.toast.title.error"),
        description: error.message,
        dismissText: t("general.toast.dismissText"),
      });
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
      <ImageUploader
        ref={imageUploaderRef}
        value={categoryImage.url}
        onChange={handleImageChange}
        onError={handleImageError}
        label={t(
          "routes.dashboard.routes.categories.createCategory.uploadImage"
        )}
        maxSizeInMB={2}
        size="sm"
        variant="rounded"
        accept="image/png, image/jpeg, image/jpg"
      />

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
                name="name_ar"
                render={({ field }) => (
                  <FormItem className={getFormItemClassName()}>
                    <FormLabel className="text-sm font-normal">
                      {t(
                        "routes.dashboard.routes.categories.components.EditCategoryForm.fields.name_ar.label"
                      )}
                    </FormLabel>
                    <FormControl>
                      <Input
                        className={getInputClassName()}
                        placeholder={t(
                          "routes.dashboard.routes.categories.components.EditCategoryForm.fields.name_ar.placeholder"
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
                        "routes.dashboard.routes.categories.components.EditCategoryForm.fields.name_en.label"
                      )}
                    </FormLabel>
                    <FormControl>
                      <Input
                        className={getInputClassName()}
                        placeholder={t(
                          "routes.dashboard.routes.categories.components.EditCategoryForm.fields.name_en.placeholder"
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

          <Button
            type="submit"
            disabled={registerMutation.isPending}
            className="w-full min-h-10 bg-primary-500 text-white-50 hover:bg-primary-400 disabled:opacity-50 transition-all"
          >
            {registerMutation.isPending
              ? t("general.loadingStates.loadingApi")
              : t(
                  "routes.auth.components.AuthTabs.components.register.actions.proceed"
                )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default memo(EditCategoryForm);
