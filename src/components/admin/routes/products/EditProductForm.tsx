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
import ProductVariantForm, {
  ProductVariantFormRef,
} from "./ProductVariantForm";
import { validationConfig } from "@/config/validationConfig";
import { Product, Variant, VariantServer } from "@/types/product.type";
import { containsArabic } from "@/utils/text/containsArabic";

const currencyValues: string[] = [];
for (const key in Currency) {
  currencyValues.push(Currency[key as keyof typeof Currency]);
}

const editFormSchema = (
  t: (key: string, params?: Record<string, number>) => string,
  activeTypeHintConfigsList: string[],
) =>
  z.object({
    mainImage: z.string().min(2, {
      message: t(
        "routes.dashboard.routes.products.components.EditProductForm.validations.mainImage.required",
      ),
    }),
    name_ar: z
      .string()
      .min(validationConfig.product.name.ar.minCharacters, {
        message: t(
          "routes.dashboard.routes.products.components.EditProductForm.validations.name_ar.minChars",
          { count: validationConfig.product.name.ar.minCharacters },
        ),
      })
      .max(validationConfig.product.name.ar.maxCharacters, {
        message: t(
          "routes.dashboard.routes.products.components.EditProductForm.validations.name_ar.maxChars",
          { count: validationConfig.product.name.ar.maxCharacters },
        ),
      }),
    name_en: z
      .string()
      .min(validationConfig.product.name.en.minCharacters, {
        message: t(
          "routes.dashboard.routes.products.components.EditProductForm.validations.name_en.minChars",
          { count: validationConfig.product.name.en.minCharacters },
        ),
      })
      .max(validationConfig.product.name.en.maxCharacters, {
        message: t(
          "routes.dashboard.routes.products.components.EditProductForm.validations.name_en.maxChars",
          { count: validationConfig.product.name.en.maxCharacters },
        ),
      }),
    description_ar: z
      .string()
      .min(validationConfig.product.description.ar.minCharacters, {
        message: t(
          "routes.dashboard.routes.products.components.EditProductForm.validations.desc_ar.minChars",
          { count: validationConfig.product.description.ar.minCharacters },
        ),
      })
      .max(validationConfig.product.description.ar.maxCharacters, {
        message: t(
          "routes.dashboard.routes.products.components.EditProductForm.validations.desc_ar.maxChars",
          { count: validationConfig.product.description.ar.maxCharacters },
        ),
      }),
    description_en: z
      .string()
      .min(validationConfig.product.description.en.minCharacters, {
        message: t(
          "routes.dashboard.routes.products.components.EditProductForm.validations.desc_en.minChars",
          { count: validationConfig.product.description.en.minCharacters },
        ),
      })
      .max(validationConfig.product.description.en.maxCharacters, {
        message: t(
          "routes.dashboard.routes.products.components.EditProductForm.validations.desc_en.maxChars",
          { count: validationConfig.product.description.en.maxCharacters },
        ),
      }),
    typeHints: z
      .array(z.string())
      .min(validationConfig.product.typeHints.min, {
        message: t(
          "routes.dashboard.routes.products.components.EditProductForm.validations.type.min",
          { count: validationConfig.product.typeHints.min },
        ),
      })
      .refine(
        (values) => values.every((v) => activeTypeHintConfigsList.includes(v)),
        {
          message: t(
            "routes.dashboard.routes.products.components.EditProductForm.validations.type.invalid",
          ),
        },
      ),
    categoryId: z.string().min(1, {
      message: t(
        "routes.dashboard.routes.products.components.EditProductForm.validations.category.required",
      ),
    }),
    subCategoryId: z.string().min(1, {
      message: t(
        "routes.dashboard.routes.products.components.EditProductForm.validations.subCategory.required",
      ),
    }),
    tags: z.array(z.string()).min(validationConfig.product.tags.min, {
      message: t(
        "routes.dashboard.routes.products.components.EditProductForm.validations.tags.min",
        { count: validationConfig.product.tags.min },
      ),
    }),
  });

type FormData = z.infer<ReturnType<typeof editFormSchema>>;

type CreateSubCategoryFormProps = {
  product: Product;
  categories: Category[];
};

const mapServerVariantToFormVariant = (
  serverVariant: VariantServer,
): Variant => ({
  variantId: serverVariant?.variantId || undefined,
  sku: serverVariant.sku || "",
  description_ar: serverVariant.description?.ar || "",
  description_en: serverVariant.description?.en || "",
  price: serverVariant.price,
  currency: serverVariant.currency,
  discountRate: serverVariant.discountRate,
  totalAmountCount: serverVariant.totalAmountCount,
  ratingsAverage: serverVariant.ratingsAverage || 1,
  ratingsCount: serverVariant.ratingsCount || 0,
  availableCount: serverVariant.availableCount,
  isActive: serverVariant?.isActive ?? false,
  isDeleted: serverVariant?.isDeleted ?? false,
  mainImage: {
    file: null,
    url: serverVariant.mainImage?.url || "",
  },
  images: {
    files: [],
    urls: serverVariant.images?.map((img) => img.url) || [],
  },
  attributes: serverVariant.attributes || [],
});

const EditProductForm = ({
  categories,
  product,
}: CreateSubCategoryFormProps) => {
  const t = useTranslations("");
  const locale = useLocale();
  const { token, queryKey } = useProducts();
  const queryClient = useQueryClient();
  const handleApiError = useHandleApiError();

  const { data: activeTypeHintConfigsList = [] } =
    useActiveTypeHintConfigsQuery();

  const isArabic = isArabicLocale(locale);

  const mainImageUploaderRef = useRef<ImageUploaderRef>(null);
  const imagesUploaderRef = useRef<ImageUploaderRef>(null);
  const variantFormRef = useRef<ProductVariantFormRef>(null);

  const [variants, setVariants] = useState<Variant[]>(
    product?.variants
      ? product.variants.map(mapServerVariantToFormVariant)
      : [],
  );

  const [prodImages, setProdImages] = useState<{
    mainImage: { file: File | null; url: string };
    images: { files: File[]; urls: string[] };
  }>({
    mainImage: {
      file: null,
      url: product?.mainImage?.url ?? product?.mainImage ?? "",
    },
    images: {
      files: [],
      urls: [],
    },
  });

  const [tags, setTags] = useState<Tag[]>(
    product?.tags?.map((tag) => ({
      id: tag,
      text: tag,
      className: "",
    })) || [],
  );

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

  const formSchema = editFormSchema(t, activeTypeHintConfigsList);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      mainImage: product?.mainImage?.url ?? product?.mainImage ?? "",
      name_ar: product?.name?.ar || "",
      name_en: product?.name?.en || "",
      categoryId: product?.categoryId?._id || "",
      subCategoryId: product?.subCategoryId?._id || "",
      description_ar: product?.description?.ar || "",
      description_en: product?.description?.en || "",
      typeHints: product?.typeHints ?? [],
      tags: product?.tags ?? [],
    },
  });

  const selectedCategoryId = form.watch("categoryId");
  const selectedCategory: Category | undefined = categories.find(
    (cat) => cat._id === selectedCategoryId,
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

      if (data.name_ar !== product.name.ar)
        formData.append("name_ar", data.name_ar);
      if (data.name_en !== product.name.en)
        formData.append("name_en", data.name_en);
      if (data.description_ar !== product.description.ar)
        formData.append("description_ar", data.description_ar);
      if (data.description_en !== product.description.en)
        formData.append("description_en", data.description_en);

      if (data.categoryId !== product.categoryId?._id)
        formData.append("categoryId", data.categoryId);
      if (data.subCategoryId !== product.subCategoryId?._id)
        formData.append("subCategoryId", data.subCategoryId);

      const areTypeHintsEqual =
        product.typeHints.length === data.typeHints.length &&
        product.typeHints.every((th) => data.typeHints.includes(th));

      if (!areTypeHintsEqual) {
        data.typeHints.forEach((th) => {
          formData.append("typeHints[]", th);
        });
      }

      // tags
      const changedTags = data.tags.filter(
        (tag) => !product.tags.includes(tag),
      );
      changedTags.forEach((tag) => formData.append("tags[]", tag));

      // Product Main Image
      if (prodImages.mainImage?.file) {
        formData.append("mainImage", prodImages.mainImage.file);
      }

      formData.append("lang", locale);

      const response = await fetch(
        `${API_ENDPOINTS.DASHBOARD.PRODUCTS.EDIT}/${product?._id}`,
        {
          method: "PUT",
          body: formData,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.message || "Product updating failed");
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
    form.setValue(
      "tags",
      tags.map((tag) => tag.text),
    );
  }, [form, tags]);

  return (
    <div className="relative max-h-[80vh] overflow-y-auto">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 pb-20"
        >
          {/* mainImage */}
          <div className="w-full flex items-center gap-5">
            <FormField
              control={form.control}
              name="mainImage"
              render={() => (
                <FormItem className={getFormItemClassName()}>
                  <FormLabel className="text-sm font-normal">
                    {t(
                      "routes.dashboard.routes.products.components.EditProductForm.fields.mainImage.label",
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
                        "routes.dashboard.routes.products.components.EditProductForm.fields.name_ar.label",
                      )}
                    </FormLabel>
                    <FormControl>
                      <Input
                        dir={containsArabic(field.value) ? "rtl" : "ltr"}
                        className={`${getInputClassName()} ${
                          containsArabic(field.value)
                            ? "text-right placeholder:text-right"
                            : "text-left placeholder:text-left"
                        }`}
                        placeholder={t(
                          "routes.dashboard.routes.products.components.EditProductForm.fields.name_ar.placeholder",
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
                        "routes.dashboard.routes.products.components.EditProductForm.fields.name_en.label",
                      )}
                    </FormLabel>
                    <FormControl>
                      <Input
                        dir={containsArabic(field.value) ? "rtl" : "ltr"}
                        className={`${getInputClassName()} ${
                          containsArabic(field.value)
                            ? "text-right placeholder:text-right"
                            : "text-left placeholder:text-left"
                        }`}
                        placeholder={t(
                          "routes.dashboard.routes.products.components.EditProductForm.fields.name_en.placeholder",
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
                        "routes.dashboard.routes.products.components.EditProductForm.fields.desc_ar.label",
                      )}
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        dir={containsArabic(field.value) ? "rtl" : "ltr"}
                        className={`min-h-11 ${getInputClassName()} ${
                          containsArabic(field.value)
                            ? "text-right placeholder:text-right"
                            : "text-left placeholder:text-left"
                        }`}
                        placeholder={t(
                          "routes.dashboard.routes.products.components.EditProductForm.fields.desc_ar.placeholder",
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
                        "routes.dashboard.routes.products.components.EditProductForm.fields.desc_en.label",
                      )}
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        dir={containsArabic(field.value) ? "rtl" : "ltr"}
                        className={`min-h-11 ${getInputClassName()} ${
                          containsArabic(field.value)
                            ? "text-right placeholder:text-right"
                            : "text-left placeholder:text-left"
                        }`}
                        placeholder={t(
                          "routes.dashboard.routes.products.components.EditProductForm.fields.desc_en.placeholder",
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
                        "routes.dashboard.routes.products.components.EditProductForm.fields.category.label",
                      )}
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full text-text-primary-100 text-sm shadow-none">
                          <SelectValue
                            placeholder={t(
                              "routes.dashboard.routes.products.components.EditProductForm.fields.category.placeholder",
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
                    <FormItem className="text-left">
                      <FormLabel className="text-sm font-normal">
                        {t(
                          "routes.dashboard.routes.products.components.EditProductForm.fields.subCategory.label",
                        )}
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={subCategories.length === 0}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full text-text-primary-100 text-sm shadow-none">
                            <SelectValue
                              placeholder={t(
                                "routes.dashboard.routes.products.components.EditProductForm.fields.subCategory.placeholder",
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

          {/* total amount & type hint */}
          {/* typeHints */}
          <div className="flex-1">
            <FormField
              control={form.control}
              name="typeHints"
              render={({ field }) => (
                <FormItem className={getFormItemClassName()}>
                  <FormLabel className="text-sm font-normal">
                    {t(
                      "routes.dashboard.routes.products.components.EditProductForm.fields.typeHint.label",
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
                            "routes.dashboard.routes.products.components.EditProductForm.fields.typeHint.placeholder",
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

          {/* tags */}
          <div>
            {/* tags */}
            <FormField
              control={form.control}
              name="tags"
              render={() => (
                <FormItem className={getFormItemClassName()}>
                  <FormLabel className="text-sm font-normal">
                    {t(
                      "routes.dashboard.routes.products.components.EditProductForm.fields.tags.label",
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
                        "routes.dashboard.routes.products.components.EditProductForm.fields.tags.placeholder",
                      )}
                      maxTags={5}
                      onTagsChange={handleTagsChange}
                      onTagClick={() => {}}
                    />
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Product Variants */}
          <div className="w-full">
            <ProductVariantForm
              variants={variants}
              setVariants={setVariants}
              ref={variantFormRef}
              productId={product?._id}
              isEditMode
            />
          </div>

          {/* Submit action */}
          <div className="sticky bottom-0 left-0 w-full bg-white-50 border-t p-4 flex justify-start">
            <Button
              type="submit"
              disabled={registerMutation.isPending}
              className="min-h-10 bg-primary-500 text-white-50 hover:bg-primary-400 disabled:opacity-50 transition-all"
            >
              {registerMutation.isPending
                ? t("general.loadingStates.loadingApi")
                : t(
                    "routes.dashboard.routes.products.components.EditProductForm.actions.update",
                  )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default memo(EditProductForm);
