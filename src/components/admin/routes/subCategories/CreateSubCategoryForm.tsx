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
import { useSubCategories } from "@/contexts/SubCategoriesContext";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";
import LoadingButton from "@/components/shared/LoadingButton";

import { User } from "@/types/user";
import { Category } from "@/types/category";

import { useHandleApiError } from "@/hooks/handleApiError";
import { validationConfig } from "@/config/validationConfig";
import { API_ENDPOINTS } from "@/lib/apiEndpoints";

import { invalidateQuery } from "@/utils/queryUtils";
import { isArabicOnly } from "@/utils/text/containsArabic";
import { isEnglishOnly } from "@/utils/text/containsEnglish";

const createFormSchema = (
  t: (key: string, options?: Record<string, string | number | Date>) => string
) => {
  const { nameMinChars, nameMaxChars, imageMinChars } =
    validationConfig.subCategory;

  return z.object({
    subCategoryImage: z.string().min(imageMinChars, {
      message: t(
        "routes.dashboard.routes.subCategories.components.CreateSubCategoryForm.validations.subCategoryImage.required"
      ),
    }),
    name_ar: z
      .string()
      .min(nameMinChars, {
        message: t(
          "routes.dashboard.routes.subCategories.components.CreateSubCategoryForm.validations.name_ar.minChars",
          { min: nameMinChars }
        ),
      })
      .max(nameMaxChars, {
        message: t(
          "routes.dashboard.routes.subCategories.components.CreateSubCategoryForm.validations.name_ar.maxChars",
          { max: nameMaxChars }
        ),
      })
      .refine((val) => isArabicOnly(val), {
        message: t(
          "routes.dashboard.routes.subCategories.components.CreateSubCategoryForm.validations.name_ar.arabicCharsOnly"
        ),
      }),
    name_en: z
      .string()
      .min(nameMinChars, {
        message: t(
          "routes.dashboard.routes.subCategories.components.CreateSubCategoryForm.validations.name_en.minChars",
          { min: nameMinChars }
        ),
      })
      .max(nameMaxChars, {
        message: t(
          "routes.dashboard.routes.subCategories.components.CreateSubCategoryForm.validations.name_en.maxChars",
          { max: nameMaxChars }
        ),
      })
      .refine((val) => isEnglishOnly(val), {
        message: t(
          "routes.dashboard.routes.subCategories.components.CreateSubCategoryForm.validations.name_en.englishCharsOnly"
        ),
      }),
    categoryId: z.string().min(1, {
      message: t(
        "routes.dashboard.routes.subCategories.components.CreateSubCategoryForm.validations.category.required"
      ),
    }),
  });
};

type FormData = z.infer<ReturnType<typeof createFormSchema>>;

type CreateSubCategoryFormProps = {
  categories: Category[];
};

const CreateSubCategoryForm = ({ categories }: CreateSubCategoryFormProps) => {
  const t = useTranslations();
  const locale = useLocale();
  const isArabic = locale === "ar";
  const { accessToken, queryKey } = useSubCategories();
  const queryClient = useQueryClient();
  const handleApiError = useHandleApiError();

  const imageUploaderRef = useRef<ImageUploaderRef>(null);
  const [subCategoryImage, setSubCategoryImage] = useState<{
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
      subCategoryImage: "",
      name_ar: "",
      name_en: "",
      categoryId: "",
    },
  });

  const handleImageChange = (data: { file?: File | null; url?: string }) => {
    const url = data.url || "";

    setSubCategoryImage({ file: data.file ?? null, url });

    form.setValue("subCategoryImage", url);
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

      const excludedFields = ["subCategoryImage"];

      Object.entries(data).forEach(([key, value]) => {
        if (excludedFields.includes(key)) return;

        formData.append(key, String(value));
      });

      formData.append("lang", locale);

      if (subCategoryImage.file) {
        formData.append("image", subCategoryImage.file);
      }

      const response = await fetch(
        API_ENDPOINTS.DASHBOARD.SUB_CATEGORIES.CREATE,
        {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData?.message ||
            t(
              "routes.dashboard.routes.subCategories.components.CreateSubCategoryForm.errors.failedCreation"
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
          <FormField
            control={form.control}
            name="subCategoryImage"
            render={({}) => (
              <FormItem className={getFormItemClassName()}>
                <FormLabel className="text-sm font-normal">
                  {t(
                    "routes.dashboard.routes.subCategories.components.CreateSubCategoryForm.fields.subCategoryImage.label"
                  )}
                </FormLabel>
                <ImageUploader
                  ref={imageUploaderRef}
                  value={subCategoryImage.url}
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
                name="name_ar"
                render={({ field }) => (
                  <FormItem className={getFormItemClassName()}>
                    <FormLabel className="text-sm font-normal">
                      {t(
                        "routes.dashboard.routes.subCategories.components.CreateSubCategoryForm.fields.name_ar.label"
                      )}
                    </FormLabel>
                    <FormControl>
                      <Input
                        className={getInputClassName()}
                        placeholder={t(
                          "routes.dashboard.routes.subCategories.components.CreateSubCategoryForm.fields.name_ar.placeholder"
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
                        "routes.dashboard.routes.subCategories.components.CreateSubCategoryForm.fields.name_en.label"
                      )}
                    </FormLabel>
                    <FormControl>
                      <Input
                        className={getInputClassName()}
                        placeholder={t(
                          "routes.dashboard.routes.subCategories.components.CreateSubCategoryForm.fields.name_en.placeholder"
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

          <div className="flex-1">
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem className="text-left">
                  <FormLabel className="text-sm font-normal">
                    {t(
                      "routes.dashboard.routes.subCategories.components.CreateSubCategoryForm.fields.category.label"
                    )}
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full text-text-primary-100 text-sm shadow-none">
                        <SelectValue
                          placeholder={t(
                            "routes.dashboard.routes.subCategories.components.CreateSubCategoryForm.fields.category.placeholder"
                          )}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories?.map((cat) => (
                        <SelectItem
                          key={cat._id}
                          value={cat._id}
                          className="cursor-pointer capitalize"
                        >
                          {isArabic ? cat.name.ar : cat.name.en}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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

export default memo(CreateSubCategoryForm);
