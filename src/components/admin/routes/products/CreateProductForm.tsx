"use client";

import { memo, useEffect, useRef, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Tag } from "react-tag-input";
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
import { useProducts } from "@/contexts/Products.context";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";
import TagsInput from "@/components/shared/TagsInput";
import { User } from "@/types/user";
import { Category } from "@/types/category.type";
import { Currency } from "@/enums/currency.enum";
import { Textarea } from "@/components/ui/textarea";
import { SubCategory } from "@/types/subCategory";
import { isArabicLocale } from "@/config/locales.config";
import { API_ENDPOINTS } from "@/lib/apiEndpoints";
import { invalidateQuery } from "@/utils/queryUtils";
import { PRODUCTS_TAGS_SUGGESTIONS } from "@/constants/productTags";
import { tagStyledClassName } from "@/constants/tagsInputStyles";
import { useHandleApiError } from "@/hooks/useHandleApiError";
import { useActiveTypeHintConfigsQuery } from "@/hooks/react-query/useTypeHintConfigsQuery";
import {
  SYSTEM_GENERATED_HINTS,
  SystemGeneratedHint,
} from "@/config/typeHint.config";
import { MEDIA_CONFIG } from "@/config/media.config";

const currencyValues: string[] = [];
for (const key in Currency) {
  currencyValues.push(Currency[key as keyof typeof Currency]);
}

const createFormSchema = (
  t: (key: string) => string,
  activeTypeHintConfigsList: string[]
) =>
  z.object({
    mainImage: z.string().min(2, {
      message: t(
        "routes.dashboard.routes.products.components.CreateProductForm.validations.mainImage.required"
      ),
    }),
    images: z.array(z.string()).optional(),
    name_ar: z.string().min(2, {
      message: t(
        "routes.dashboard.routes.products.components.CreateProductForm.validations.name_ar.minChars"
      ),
    }),
    name_en: z.string().min(2, {
      message: t(
        "routes.dashboard.routes.products.components.CreateProductForm.validations.name_en.minChars"
      ),
    }),
    categoryId: z.string().min(1, {
      message: t(
        "routes.dashboard.routes.products.components.CreateProductForm.validations.category.required"
      ),
    }),
    description_ar: z.string().min(20, {
      message: t(
        "routes.dashboard.routes.products.components.CreateProductForm.validations.desc_ar.minChars"
      ),
    }),
    description_en: z.string().min(20, {
      message: t(
        "routes.dashboard.routes.products.components.CreateProductForm.validations.desc_en.minChars"
      ),
    }),
    price: z.number(),
    currency: z.enum(currencyValues as [string, ...string[]], {
      message: t(
        "routes.dashboard.routes.products.components.CreateProductForm.validations.currency.notSupported"
      ),
    }),
    totalAmountCount: z.number().min(1, {
      message: t(
        "routes.dashboard.routes.products.components.CreateProductForm.validations.totalAmountCount.min"
      ),
    }),
    typeHint: z
      .array(z.string())
      .min(1, {
        message: t(
          "routes.dashboard.routes.products.components.CreateProductForm.validations.type.required"
        ),
      })
      .refine(
        (values) => values.every((v) => activeTypeHintConfigsList.includes(v)),
        {
          message: t(
            "routes.dashboard.routes.showcases.components.CreateShowcaseForm.validations.type.invalid"
          ),
        }
      ),
    subCategoryId: z.string().min(1, {
      message: t(
        "routes.dashboard.routes.products.components.CreateProductForm.validations.subCategory.required"
      ),
    }),
    tags: z.array(z.string()).min(1, {
      message: t(
        "routes.dashboard.routes.products.components.CreateProductForm.validations.tags.min"
      ),
    }),
    availableCount: z.number().optional(),
    discountRate: z.number().optional(),
  });

type FormData = z.infer<ReturnType<typeof createFormSchema>>;

type CreateSubCategoryFormProps = {
  categories: Category[];
};

const CreateProductForm = ({ categories }: CreateSubCategoryFormProps) => {
  const t = useTranslations();
  const locale = useLocale();
  const isArabic = isArabicLocale(locale);
  const { token, queryKey } = useProducts();
  const queryClient = useQueryClient();
  const handleApiError = useHandleApiError();
  const { data: activeTypeHintConfigsList = [] } =
    useActiveTypeHintConfigsQuery();

  const mainImageUploaderRef = useRef<ImageUploaderRef>(null);
  const imagesUploaderRef = useRef<ImageUploaderRef>(null);

  const [prodImages, setProdImages] = useState<{
    mainImage: { file: File | null; url: string };
    images: { files: File[]; urls: string[] };
  }>({
    mainImage: {
      file: null,
      url: "",
    },
    images: {
      files: [],
      urls: [],
    },
  });

  const [tags, setTags] = useState<Tag[]>([]);

  const prodTagsSuggestions = PRODUCTS_TAGS_SUGGESTIONS.map((sug) => {
    return {
      id: sug,
      text: sug,
      className: "",
    };
  });

  const handleTagsChange = (newTags: string[]) => {
    const updatedTags = newTags.map((text, index) => ({
      id: `tag-${index}`,
      text,
      className: tagStyledClassName,
    }));

    setTags(updatedTags);
  };

  const handleTagClick = (index: number) => {
    console.log("The tag at index " + index + " was clicked");
  };

  const handleMainImageChange = (data: {
    file?: File | null;
    url?: string;
  }) => {
    const url = data.url || "";
    setProdImages((prev) => ({
      ...prev,
      mainImage: {
        file: data.file ?? null,
        url,
      },
    }));

    form.setValue("mainImage", url);
  };

  const handleImagesChange = (data: {
    files?: File[] | null;
    urls?: string[] | null;
  }) => {
    const newFiles = data.files ?? [];
    const urls = data.urls ?? [];

    setProdImages((prev) => {
      // merge files by reference-safe comparison
      const mergedFiles = [
        ...prev.images.files,
        ...newFiles.filter(
          (f) =>
            !prev.images.files.some(
              (pf) =>
                pf.name === f.name &&
                pf.size === f.size &&
                pf.lastModified === f.lastModified
            )
        ),
      ];

      return {
        ...prev,
        images: {
          files: mergedFiles,
          urls,
        },
      };
    });
  };

  const formSchema = createFormSchema(t, activeTypeHintConfigsList);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      mainImage: "",
      images: [],
      name_ar: "",
      name_en: "",
      categoryId: "",
      subCategoryId: "",
      description_ar: "",
      description_en: "",
      price: 0,
      currency: Currency.JOD ?? "",
      totalAmountCount: 0,
      typeHint: [],
      tags: [],
      availableCount: 0,
      discountRate: 0,
    },
  });

  const selectedCategoryId = form.watch("categoryId");
  const selectedCategory: Category | undefined = categories.find(
    (cat) => cat._id === selectedCategoryId
  );

  const subCategories = selectedCategory?.subCategories || [];

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

      // Exclude fields that need special handling
      const excludedFields = [
        "images",
        "mainImage",
        "availableCount",
        "discountRate",
      ];

      Object.entries(data).forEach(([key, value]) => {
        if (excludedFields.includes(key)) return;

        if (Array.isArray(value)) {
          value.forEach((item) => {
            formData.append(`${key}[]`, String(item));
          });
        } else {
          formData.append(key, String(value));
        }
      });

      formData.append("lang", locale);

      if (prodImages.mainImage?.file) {
        formData.append("mainImage", prodImages.mainImage.file);
      }

      if (prodImages.images?.files?.length) {
        prodImages.images.files.forEach((file) => {
          formData.append("images", file);
        });
      }

      // Handle numeric fields explicitly (only once)
      if (data.availableCount !== undefined) {
        formData.append("availableCount", String(data.availableCount));
      }

      if (data.discountRate !== undefined) {
        formData.append("discountRate", String(data.discountRate));
      }

      const response = await fetch(API_ENDPOINTS.DASHBOARD.PRODUCTS.CREATE, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.message || "Product's creation failed");
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
        mainImageUploaderRef.current?.clear();
        imagesUploaderRef.current?.clear();

        await invalidateQuery(queryClient, queryKey);
      }
    },

    onError: (error: Error) => {
      handleApiError(error);
    },
  });

  const onSubmit = (values: FormData) => {
    console.log({ values });
    registerMutation.mutate(values);
  };

  const getInputClassName = (baseClasses = "") =>
    `placeholder:text-xs text-xs ${baseClasses} ${
      isArabic
        ? "placeholder:text-right text-right"
        : "placeholder:text-left text-left"
    }`;

  const getFormItemClassName = () => (isArabic ? "text-right" : "text-left");

  useEffect(() => {
    // form.setValue() or form.resetField()
    form.setValue("subCategoryId", "");
  }, [form, selectedCategoryId]);

  useEffect(() => {
    form.setValue(
      "tags",
      tags.map((tag) => tag.text)
    );
  }, [form, tags]);

  useEffect(() => {
    const subscription = form.watch((value, { name, type }) => {
      console.log(
        `📝 Form value changed (field: ${name}, type: ${type}):`,
        value
      );
    });

    return () => subscription.unsubscribe();
  }, [form]);

  return (
    <div className="space-y-6 max-h-[80vh] overflow-y-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* mainImage */}
          <div className="w-full flex items-center gap-5">
            <FormField
              control={form.control}
              name="mainImage"
              render={() => (
                <FormItem className={getFormItemClassName()}>
                  <FormLabel className="text-sm font-normal">
                    {t(
                      "routes.dashboard.routes.products.components.CreateProductForm.fields.mainImage.label",
                    )}
                  </FormLabel>
                  <ImageUploader
                    ref={mainImageUploaderRef}
                    value={
                      prodImages.mainImage.url ? [prodImages.mainImage.url] : []
                    }
                    onChange={handleMainImageChange}
                    onError={handleImageError}
                    label={""}
                    maxSizeInMB={MEDIA_CONFIG.PRODUCT.IMAGE.MAX_SIZE}
                    size="sm"
                    variant="rounded"
                    accept={MEDIA_CONFIG.PRODUCT.IMAGE.ALLOWED_TYPES}
                    multiple={false}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* images */}
          <div className="w-full flex items-center gap-5">
            <FormField
              control={form.control}
              name="images"
              render={() => (
                <FormItem className={getFormItemClassName()}>
                  <FormLabel className="text-sm font-normal">
                    {t(
                      "routes.dashboard.routes.products.components.CreateProductForm.fields.images.label",
                    )}
                  </FormLabel>
                  <ImageUploader
                    ref={imagesUploaderRef}
                    value={prodImages.images.urls}
                    onChange={handleImagesChange}
                    onError={handleImageError}
                    label={" "}
                    maxSizeInMB={MEDIA_CONFIG.PRODUCT.IMAGE.MAX_SIZE}
                    size="sm"
                    variant="rounded"
                    accept={MEDIA_CONFIG.PRODUCT.IMAGE.ALLOWED_TYPES}
                    multiple={true}
                    maxImages={3}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* names */}
          <div
            className={`flex gap-5 ${
              isArabic ? "flex-row-reverse" : "flex-row"
            }`}
          >
            {/* name ar */}
            <div className="flex-1">
              <FormField
                control={form.control}
                name="name_ar"
                render={({ field }) => (
                  <FormItem className={getFormItemClassName()}>
                    <FormLabel className="text-sm font-normal">
                      {t(
                        "routes.dashboard.routes.products.components.CreateProductForm.fields.name_ar.label",
                      )}
                    </FormLabel>
                    <FormControl>
                      <Input
                        className={getInputClassName()}
                        placeholder={t(
                          "routes.dashboard.routes.products.components.CreateProductForm.fields.name_ar.placeholder",
                        )}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* name-en */}
            <div className="flex-1">
              <FormField
                control={form.control}
                name="name_en"
                render={({ field }) => (
                  <FormItem className={getFormItemClassName()}>
                    <FormLabel className="text-sm font-normal">
                      {t(
                        "routes.dashboard.routes.products.components.CreateProductForm.fields.name_en.label",
                      )}
                    </FormLabel>
                    <FormControl>
                      <Input
                        className={getInputClassName()}
                        placeholder={t(
                          "routes.dashboard.routes.products.components.CreateProductForm.fields.name_en.placeholder",
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

          {/* descriptions */}
          <div
            className={`flex gap-5 ${
              isArabic ? "flex-row-reverse" : "flex-row"
            }`}
          >
            {/* desc-ar */}
            <div className="flex-1">
              <FormField
                control={form.control}
                name="description_ar"
                render={({ field }) => (
                  <FormItem className={getFormItemClassName()}>
                    <FormLabel className="text-sm font-normal">
                      {t(
                        "routes.dashboard.routes.products.components.CreateProductForm.fields.desc_ar.label",
                      )}
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        className={`${getInputClassName()} min-h-11`}
                        placeholder={t(
                          "routes.dashboard.routes.products.components.CreateProductForm.fields.desc_ar.placeholder",
                        )}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* desc-en */}
            <div className="flex-1">
              <FormField
                control={form.control}
                name="description_en"
                render={({ field }) => (
                  <FormItem className={getFormItemClassName()}>
                    <FormLabel className="text-sm font-normal">
                      {t(
                        "routes.dashboard.routes.products.components.CreateProductForm.fields.desc_en.label",
                      )}
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        className={`${getInputClassName()} min-h-11`}
                        placeholder={t(
                          "routes.dashboard.routes.products.components.CreateProductForm.fields.desc_en.placeholder",
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

          {/* category & sub-category */}
          <div
            className={`flex gap-5 items-start justify-start ${
              isArabic ? "flex-row-reverse" : "flex-row"
            }`}
          >
            {/* category */}
            <div className="flex-1">
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem className="text-left">
                    <FormLabel className="text-sm font-normal">
                      {t(
                        "routes.dashboard.routes.products.components.CreateProductForm.fields.category.label",
                      )}
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full text-text-primary-100 text-sm shadow-none">
                          <SelectValue
                            placeholder={t(
                              "routes.dashboard.routes.products.components.CreateProductForm.fields.category.placeholder",
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

            {/* subCategory */}
            {subCategories.length > 0 && (
              <div className="flex-1">
                {" "}
                <FormField
                  control={form.control}
                  name="subCategoryId"
                  render={({ field }) => (
                    <FormItem className="text-left mt-4">
                      <FormLabel className="text-sm font-normal">
                        {t(
                          "routes.dashboard.routes.products.components.CreateProductForm.fields.subCategory.label",
                        )}
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full text-text-primary-100 text-sm shadow-none">
                            <SelectValue
                              placeholder={t(
                                "routes.dashboard.routes.products.components.CreateProductForm.fields.subCategory.placeholder",
                              )}
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {subCategories.map((sub: SubCategory) => (
                            <SelectItem
                              key={sub._id}
                              value={sub._id}
                              className="cursor-pointer capitalize"
                            >
                              {isArabic ? sub.name.ar : sub.name.en}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
          </div>

          {/* price & currency */}
          <div
            className={`flex gap-5 ${
              isArabic ? "flex-row-reverse" : "flex-row"
            }`}
          >
            {/* price */}
            <div className="flex-1">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem className={getFormItemClassName()}>
                    <FormLabel className="text-sm font-normal">
                      {t(
                        "routes.dashboard.routes.products.components.CreateProductForm.fields.price.label",
                      )}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="any"
                        className={getInputClassName()}
                        placeholder={t(
                          "routes.dashboard.routes.products.components.CreateProductForm.fields.price.placeholder",
                        )}
                        min={0}
                        {...field}
                        onChange={(e) => {
                          const value =
                            e.target.value === ""
                              ? 0
                              : parseFloat(e.target.value);
                          field.onChange(value);
                        }}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* currency */}
            <div className="flex-1">
              <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <FormItem className={getFormItemClassName()}>
                    <FormLabel className="text-sm font-normal">
                      {t(
                        "routes.dashboard.routes.products.components.CreateProductForm.fields.currency.label",
                      )}
                    </FormLabel>
                    <Select
                      disabled
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full text-text-primary-100 text-sm shadow-none">
                          <SelectValue
                            placeholder={t(
                              "routes.dashboard.routes.products.components.CreateProductForm.fields.currency.placeholder",
                            )}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(Currency)?.map((curr, i) => (
                          <SelectItem
                            key={`Currency_${i}`}
                            value={curr}
                            className="cursor-pointer capitalize"
                          >
                            {curr}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* total amount & type hint */}
          <div
            className={`flex gap-5 ${
              isArabic ? "flex-row-reverse" : "flex-row"
            }`}
          >
            {/* total amount */}
            <div className="flex-1">
              <FormField
                control={form.control}
                name="totalAmountCount"
                render={({ field }) => (
                  <FormItem className={getFormItemClassName()}>
                    <FormLabel className="text-sm font-normal">
                      {t(
                        "routes.dashboard.routes.products.components.CreateProductForm.fields.totalAmountCount.label",
                      )}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        className={getInputClassName()}
                        placeholder={t(
                          "routes.dashboard.routes.products.components.CreateProductForm.fields.totalAmountCount.placeholder",
                        )}
                        min={0}
                        {...field}
                        onChange={(e) => {
                          const value =
                            e.target.value === ""
                              ? 0
                              : parseInt(e.target.value, 10);
                          field.onChange(value);
                        }}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* typeHint */}
            <div className="flex-1">
              <FormField
                control={form.control}
                name="typeHint"
                render={({ field }) => (
                  <FormItem className={getFormItemClassName()}>
                    <FormLabel className="text-sm font-normal">
                      {t(
                        "routes.dashboard.routes.products.components.CreateProductForm.fields.typeHint.label",
                      )}
                    </FormLabel>

                    <Select
                      value={field.value?.[0] ?? ""}
                      onValueChange={(value) => {
                        const exists = field.value.includes(value);
                        field.onChange(
                          exists
                            ? field.value.filter((v) => v !== value)
                            : [...field.value, value],
                        );
                      }}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full text-text-primary-100 text-sm shadow-none">
                          <SelectValue
                            placeholder={t(
                              "routes.dashboard.routes.products.components.CreateProductForm.fields.typeHint.placeholder",
                            )}
                          />
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent>
                        {activeTypeHintConfigsList
                          ?.filter(
                            (th) =>
                              !SYSTEM_GENERATED_HINTS.includes(
                                th as SystemGeneratedHint,
                              ),
                          )
                          ?.map((th) => (
                            <SelectItem
                              key={th}
                              value={th}
                              className={`cursor-pointer capitalize ${
                                field.value.includes(th) ? "font-semibold" : ""
                              }`}
                            >
                              {th}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>

                    {/* selected hints preview */}
                    {field.value.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {field.value.map((th) => (
                          <span
                            key={th}
                            className="text-xs px-2 py-1 rounded bg-primary-100 text-primary-700"
                          >
                            {th}
                          </span>
                        ))}
                      </div>
                    )}

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* tags */}
          <div
            className={`flex gap-5 ${
              isArabic ? "flex-row-reverse" : "flex-row"
            }`}
          >
            {/* tags */}
            <FormField
              control={form.control}
              name="tags"
              render={() => (
                <FormItem className={getFormItemClassName()}>
                  <FormLabel className="text-sm font-normal">
                    {t(
                      "routes.dashboard.routes.products.components.CreateProductForm.fields.tags.label",
                    )}
                  </FormLabel>
                  <div
                    className={`flex gap-5 ${
                      isArabic ? "flex-row-reverse" : "flex-row"
                    }`}
                  >
                    <TagsInput
                      tags={tags}
                      suggestions={prodTagsSuggestions}
                      placeholder={t(
                        "routes.dashboard.routes.products.components.CreateProductForm.fields.tags.placeholder",
                      )}
                      maxTags={3}
                      onTagsChange={handleTagsChange}
                      onTagClick={handleTagClick}
                    />
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* available amount & discount rate */}
          <div
            className={`flex gap-5 ${
              isArabic ? "flex-row-reverse" : "flex-row"
            }`}
          >
            {/* availableCount */}
            <div className="flex-1">
              <FormField
                disabled
                control={form.control}
                name="availableCount"
                render={({ field }) => (
                  <FormItem className={getFormItemClassName()}>
                    <FormLabel className="text-sm font-normal">
                      {t(
                        "routes.dashboard.routes.products.components.CreateProductForm.fields.availableCount.label",
                      )}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        className={getInputClassName()}
                        placeholder={t(
                          "routes.dashboard.routes.products.components.CreateProductForm.fields.availableCount.placeholder",
                        )}
                        min={0}
                        {...field}
                        onChange={(e) => {
                          const value =
                            e.target.value === ""
                              ? undefined
                              : parseInt(e.target.value, 10);
                          field.onChange(value);
                        }}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* discount rate */}
            <div className="flex-1">
              <FormField
                control={form.control}
                name="discountRate"
                render={({ field }) => (
                  <FormItem className={getFormItemClassName()}>
                    <FormLabel className="text-sm font-normal">
                      {t(
                        "routes.dashboard.routes.products.components.CreateProductForm.fields.discountRate.label",
                      )}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        className={getInputClassName()}
                        placeholder={t(
                          "routes.dashboard.routes.products.components.CreateProductForm.fields.discountRate.placeholder",
                        )}
                        min={0}
                        {...field}
                        onChange={(e) => {
                          const value =
                            e.target.value === ""
                              ? undefined
                              : parseFloat(e.target.value);
                          field.onChange(value);
                        }}
                        value={field.value || ""}
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
              : t("general.actions.createItem")}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default memo(CreateProductForm);
