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
import { API_ENDPOINTS } from "@/lib/apiEndpoints";
import { User } from "@/types/user";
import { invalidateQuery } from "@/utils/queryUtils";
import { useProducts } from "@/contexts/Products.context";
import { Category } from "@/types/category";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";
import { Currency } from "@/enums/currency.enum";
import { TypeHint } from "@/enums/typeHint.enum";
import { Textarea } from "@/components/ui/textarea";
import { SubCategory } from "@/types/subCategory";
import { Product } from "@/types/product.type";
import { PRODUCTS_TAGS_SUGGESTIONS } from "@/constants/productTags";
import TagsInput from "@/components/shared/TagsInput";
import { tagStyledClassName } from "@/constants/tagsInputStyles";
import { useHandleApiError } from "@/hooks/handleApiError";

const currencyValues: string[] = [];
for (const key in Currency) {
  currencyValues.push(Currency[key as keyof typeof Currency]);
}

const typeHintValues: string[] = Object.values(TypeHint);
for (const key in TypeHint) {
  typeHintValues.push(key as keyof typeof TypeHint);
}

const editFormSchema = (t: (key: string) => string) =>
  z.object({
    mainImage: z.string().min(2, {
      message: t(
        "routes.dashboard.routes.products.components.EditProductForm.validations.mainImage.required"
      ),
    }),
    images: z.array(z.string()).min(2, {
      message: t(
        "routes.dashboard.routes.products.components.EditProductForm.validations.images.required"
      ),
    }),
    name_ar: z.string().min(2, {
      message: t(
        "routes.dashboard.routes.products.components.EditProductForm.validations.name_ar.minChars"
      ),
    }),
    name_en: z.string().min(2, {
      message: t(
        "routes.dashboard.routes.products.components.EditProductForm.validations.name_en.minChars"
      ),
    }),
    categoryId: z.string().min(1, {
      message: t(
        "routes.dashboard.routes.products.components.EditProductForm.validations.category.required"
      ),
    }),
    description_ar: z.string().min(20, {
      message: t(
        "routes.dashboard.routes.products.components.EditProductForm.validations.desc_ar.minChars"
      ),
    }),
    description_en: z.string().min(20, {
      message: t(
        "routes.dashboard.routes.products.components.EditProductForm.validations.desc_en.minChars"
      ),
    }),
    price: z.number().min(1, {
      message: t(
        "routes.dashboard.routes.products.components.EditProductForm.validations.price.min"
      ),
    }),
    currency: z.enum(currencyValues as [string, ...string[]], {
      message: t(
        "routes.dashboard.routes.products.components.EditProductForm.validations.currency.notSupported"
      ),
    }),
    totalAmountCount: z.number().min(1, {
      message: t(
        "routes.dashboard.routes.products.components.EditProductForm.validations.totalAmountCount.min"
      ),
    }),
    typeHint: z.enum(typeHintValues as [string, ...string[]], {
      message: t(
        "routes.dashboard.routes.products.components.EditProductForm.validations.typeHint.notSupported"
      ),
    }),
    subCategoryId: z.string().min(1, {
      message: t(
        "routes.dashboard.routes.products.components.EditProductForm.validations.subCategory.required"
      ),
    }),
    tags: z.array(z.string()).min(1, {
      message: t(
        "routes.dashboard.routes.products.components.EditProductForm.validations.tags.min"
      ),
    }),
    availableCount: z.number().optional(),
    discountRate: z.number().optional(),
  });

type FormData = z.infer<ReturnType<typeof editFormSchema>>;

type CreateSubCategoryFormProps = {
  categories: Category[];
  product: Product;
};

const EditProductForm = ({
  categories,
  product,
}: CreateSubCategoryFormProps) => {
  const t = useTranslations();
  const locale = useLocale();
  const isArabic = locale === "ar";
  const { token, queryKey } = useProducts();
  const queryClient = useQueryClient();
  const handleApiError = useHandleApiError();

  const mainImageUploaderRef = useRef<ImageUploaderRef>(null);
  const imagesUploaderRef = useRef<ImageUploaderRef>(null);

  const [prodImages, setProdImages] = useState<{
    mainImage: { file: File | null; url: string };
    images: { files: File[]; urls: string[] };
  }>({
    mainImage: {
      file: null,
      url: product?.mainImage || "",
    },
    images: {
      files: [],
      urls: product?.images || [],
    },
  });

  const [tags, setTags] = useState<Tag[]>(
    product?.tags?.map((tag) => ({
      id: tag,
      text: tag,
      className: "",
    })) || []
  );

  const prodTagsSuggestions = PRODUCTS_TAGS_SUGGESTIONS.map((sug) => {
    return {
      id: sug,
      text: sug,
      className: "",
    };
  });

  const prodCat = categories?.filter(
    (cat) => cat?._id === product?.categoryId?._id
  )[0];
  const prodSubCat = prodCat?.subCategories?.filter(
    (subCat) => subCat?._id === product?.subCategoryId?._id
  )[0];

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
    const files = data.files ?? [];
    const urls = data.urls ?? [];

    setProdImages((prev) => ({
      ...prev,
      images: {
        files,
        urls,
      },
    }));

    form.setValue("images", urls);
  };

  const formSchema = editFormSchema(t);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      mainImage: product?.mainImage || "",
      images: product?.images || [],
      name_ar: product?.name.ar || "",
      name_en: product?.name.en || "",
      categoryId: prodCat?._id || "",
      subCategoryId: prodSubCat?._id || "",
      description_ar: product?.description.ar || "",
      description_en: product?.description.en || "",
      price: product?.price || 0,
      currency: product?.currency || "",
      totalAmountCount: product?.totalAmountCount || 0,
      typeHint: product?.typeHint || "",
      tags: product?.tags || [],
      availableCount: product?.availableCount || 0,
      discountRate: product?.discountRate || 0,
    },
  });

  const selectedCategoryId = form.watch("categoryId");
  const selectedCategory: Category | undefined = categories.find(
    (cat) => cat._id === (selectedCategoryId || prodCat?._id)
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

      const response = await fetch(
        `${API_ENDPOINTS.DASHBOARD.PRODUCTS.EDIT}/${product?._id}`,
        {
          method: "PUT",
          body: formData,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

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

  useEffect(() => {
    if (product && prodCat && prodSubCat) {
      form.setValue("categoryId", prodCat._id);
      form.setValue("subCategoryId", prodSubCat._id);
    }
  }, [form, product, prodCat, prodSubCat]);

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
                      "routes.dashboard.routes.products.components.EditProductForm.fields.mainImage.label"
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
                    maxSizeInMB={2}
                    size="sm"
                    variant="rounded"
                    accept="image/png, image/jpeg, image/jpg"
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
                      "routes.dashboard.routes.products.components.EditProductForm.fields.images.label"
                    )}
                  </FormLabel>
                  <ImageUploader
                    ref={imagesUploaderRef}
                    value={prodImages.images.urls}
                    onChange={handleImagesChange}
                    onError={handleImageError}
                    label={""}
                    maxSizeInMB={2}
                    size="sm"
                    variant="rounded"
                    accept="image/png, image/jpeg, image/jpg"
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
                        "routes.dashboard.routes.products.components.EditProductForm.fields.name_ar.label"
                      )}
                    </FormLabel>
                    <FormControl>
                      <Input
                        className={getInputClassName()}
                        placeholder={t(
                          "routes.dashboard.routes.products.components.EditProductForm.fields.name_ar.placeholder"
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
                        "routes.dashboard.routes.products.components.EditProductForm.fields.name_en.label"
                      )}
                    </FormLabel>
                    <FormControl>
                      <Input
                        className={getInputClassName()}
                        placeholder={t(
                          "routes.dashboard.routes.products.components.EditProductForm.fields.name_en.placeholder"
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
                        "routes.dashboard.routes.products.components.EditProductForm.fields.desc_ar.label"
                      )}
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        className={`${getInputClassName()} min-h-11`}
                        placeholder={t(
                          "routes.dashboard.routes.products.components.EditProductForm.fields.desc_ar.placeholder"
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
                        "routes.dashboard.routes.products.components.EditProductForm.fields.desc_en.label"
                      )}
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        className={`${getInputClassName()} min-h-11`}
                        placeholder={t(
                          "routes.dashboard.routes.products.components.EditProductForm.fields.desc_en.placeholder"
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
                        "routes.dashboard.routes.products.components.EditProductForm.fields.category.label"
                      )}
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full text-text-primary-100 text-sm shadow-none">
                          <SelectValue
                            placeholder={t(
                              "routes.dashboard.routes.products.components.EditProductForm.fields.category.placeholder"
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
                          "routes.dashboard.routes.products.components.EditProductForm.fields.subCategory.label"
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
                                "routes.dashboard.routes.products.components.EditProductForm.fields.subCategory.placeholder"
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
                        "routes.dashboard.routes.products.components.EditProductForm.fields.price.label"
                      )}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        className={getInputClassName()}
                        placeholder={t(
                          "routes.dashboard.routes.products.components.EditProductForm.fields.price.placeholder"
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
                        "routes.dashboard.routes.products.components.EditProductForm.fields.currency.label"
                      )}
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full text-text-primary-100 text-sm shadow-none">
                          <SelectValue
                            placeholder={t(
                              "routes.dashboard.routes.products.components.EditProductForm.fields.currency.placeholder"
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
                        "routes.dashboard.routes.products.components.EditProductForm.fields.totalAmountCount.label"
                      )}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        className={getInputClassName()}
                        placeholder={t(
                          "routes.dashboard.routes.products.components.EditProductForm.fields.totalAmountCount.placeholder"
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
                        "routes.dashboard.routes.products.components.EditProductForm.fields.typeHint.label"
                      )}
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full text-text-primary-100 text-sm shadow-none">
                          <SelectValue
                            placeholder={t(
                              "routes.dashboard.routes.products.components.EditProductForm.fields.typeHint.placeholder"
                            )}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(TypeHint)?.map((th, i) => (
                          <SelectItem
                            key={`TypeHintItem_${i}`}
                            value={th}
                            className="cursor-pointer capitalize"
                          >
                            {th}
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
                      "routes.dashboard.routes.products.components.EditProductForm.fields.tags.label"
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
                        "routes.dashboard.routes.products.components.EditProductForm.fields.tags.placeholder"
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
                control={form.control}
                name="availableCount"
                render={({ field }) => (
                  <FormItem className={getFormItemClassName()}>
                    <FormLabel className="text-sm font-normal">
                      {t(
                        "routes.dashboard.routes.products.components.EditProductForm.fields.availableCount.label"
                      )}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        className={getInputClassName()}
                        placeholder={t(
                          "routes.dashboard.routes.products.components.EditProductForm.fields.availableCount.placeholder"
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
                        "routes.dashboard.routes.products.components.EditProductForm.fields.discountRate.label"
                      )}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        className={getInputClassName()}
                        placeholder={t(
                          "routes.dashboard.routes.products.components.EditProductForm.fields.discountRate.placeholder"
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
              : t(
                  "routes.auth.components.AuthTabs.components.register.actions.proceed"
                )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default memo(EditProductForm);
