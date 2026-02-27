"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Currency } from "@/enums/currency.enum";
import { ProductVariantAttributeKey } from "@/enums/productVariantAttributeKey.enum";
import { CirclePlus, Group, Loader2, Plus, Save } from "lucide-react";
import {
  memo,
  useState,
  useCallback,
  useEffect,
  useImperativeHandle,
  forwardRef,
  useRef,
} from "react";
import { useTranslations } from "use-intl";
import ProductVariantAttributesSection from "./ProductVariantAttributesSection";
import ImageUploader from "@/components/shared/ImageUploader";
import {
  showErrorToast,
  showSuccessToast,
} from "@/components/shared/CustomToast";
import { MEDIA_CONFIG } from "@/config/media.config";
import { validationConfig } from "@/config/validationConfig";
import FormErrorMessage from "@/components/shared/FormErrorMessage";
import { Variant, VariantAttribute } from "@/types/product.type";
import { API_ENDPOINTS } from "@/lib/apiEndpoints";
import { useAuthContext } from "@/hooks/useAuthContext";
import { invalidateQuery } from "@/utils/queryUtils";
import { useQueryClient } from "@tanstack/react-query";
import { useProducts } from "@/contexts/Products.context";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import VariantFormActions from "./VariantFormActions";
import StatusBadge from "@/components/shared/StatusBadge";
import { Statuses } from "@/enums/statuses.enum";

interface ValidationErrors {
  [variantIndex: number]: {
    sku?: string;
    description_ar?: string;
    description_en?: string;
    price?: string;
    discountRate?: string;
    totalAmountCount?: string;
    mainImage?: string;
    attributes?: {
      [attrIndex: number]: {
        key?: string;
        value?: string;
      };
    };
    attributesArray?: string;
  };
}

const createEmptyVariant = (): Variant => ({
  sku: "",
  description_ar: "",
  description_en: "",
  price: 0,
  currency: Currency.JOD,
  discountRate: 0,
  ratingsAverage: 1,
  ratingsCount: 0,
  isActive: true,
  isDeleted: false,
  totalAmountCount: 0,
  mainImage: {
    file: null,
    url: "",
  },
  images: {
    files: [],
    urls: [],
  },
  attributes: [
    {
      key: ProductVariantAttributeKey.SELLING_TYPE,
      value: "",
    },
  ],
});

interface ProductVariantFormProps {
  variants: Variant[];
  setVariants: (variants: Variant[]) => void;
  productId?: string;
  isEditMode?: boolean;
}
export interface ProductVariantFormRef {
  validateAll: () => boolean;
}

const ProductVariantForm = forwardRef<
  ProductVariantFormRef,
  ProductVariantFormProps
>(({ variants, setVariants, isEditMode, productId }, ref) => {
  const t = useTranslations(
    "routes.dashboard.routes.products.components.ProductVariantForm",
  );
  const tg = useTranslations("general");

  const { locale } = useSelector((state: RootState) => state.general);

  const {
    queryKey,
    deleteProductVariant,
    unDeleteProductVariant,
    switchProductVariantActiveStatus,
  } = useProducts();
  const queryClient = useQueryClient();

  const { accessToken } = useAuthContext();

  const [loadingIndex, setLoadingIndex] = useState<number | null>(null);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [deletedImages, setDeletedImages] = useState<string[]>([]);

  const initialVariantsRef = useRef<Variant[]>([]);

  useEffect(() => {
    if (isEditMode && variants?.[0]) {
      initialVariantsRef.current = JSON.parse(JSON.stringify(variants));
    }
  }, [isEditMode]);

  useEffect(() => {
    if (!variants || variants.length === 0) {
      setVariants([createEmptyVariant()]);
    }
  }, [variants, setVariants]);

  const validateVariant = useCallback(
    (variant: Variant, index: number) => {
      if (!variant) console.log(index);

      const variantErrors: ValidationErrors[number] = {};

      const v = validationConfig.product.variant;

      /*  SKU (Optional)  */
      const sku = variant.sku?.trim();
      if (sku) {
        if (sku.length < v.sku.minCharacters) {
          variantErrors.sku = t("validations.sku.min", {
            count: v.sku.minCharacters,
          });
        } else if (sku.length > v.sku.maxCharacters) {
          variantErrors.sku = t("validations.sku.max", {
            count: v.sku.maxCharacters,
          });
        }
      }

      /*  MAIN IMAGE  */
      if (!variant.mainImage?.file && !variant.mainImage?.url) {
        variantErrors.mainImage = t("validations.mainImage.required");
      }

      /*  DESCRIPTION AR  */
      const ar = variant.description_ar?.trim() || "";
      if (!ar) {
        variantErrors.description_ar = t("validations.description.required");
      } else if (ar.length < v.description.ar.minCharacters) {
        variantErrors.description_ar = t("validations.description.min", {
          count: v.description.ar.minCharacters,
        });
      } else if (ar.length > v.description.ar.maxCharacters) {
        variantErrors.description_ar = t("validations.description.max", {
          count: v.description.ar.maxCharacters,
        });
      }

      /*  DESCRIPTION EN  */
      const en = variant.description_en?.trim() || "";
      if (!en) {
        variantErrors.description_en = t("validations.description.required");
      } else if (en.length < v.description.en.minCharacters) {
        variantErrors.description_en = t("validations.description.min", {
          count: v.description.en.minCharacters,
        });
      } else if (en.length > v.description.en.maxCharacters) {
        variantErrors.description_en = t("validations.description.max", {
          count: v.description.en.maxCharacters,
        });
      }

      /*  PRICE  */
      if (!variant.price || variant.price === 0) {
        variantErrors.price = t("validations.price.required");
      } else if (variant.price < v.price.min) {
        variantErrors.price = t("validations.price.min", {
          value: v.price.min,
        });
      } else if (variant.price > v.price.max) {
        variantErrors.price = t("validations.price.max", {
          value: v.price.max,
        });
      }

      /*  DISCOUNT  */
      if (variant.discountRate < v.discountRate.min) {
        variantErrors.discountRate = t("validations.discountRate.min", {
          value: v.discountRate.min,
        });
      } else if (variant.discountRate > v.discountRate.max) {
        variantErrors.discountRate = t("validations.discountRate.max", {
          value: v.discountRate.max,
        });
      }

      /*  STOCK  */
      if (!variant.totalAmountCount || variant.totalAmountCount === 0) {
        variantErrors.totalAmountCount = t(
          "validations.totalAmountCount.required",
        );
      } else if (variant.totalAmountCount < v.totalAmountCount.min) {
        variantErrors.totalAmountCount = t("validations.totalAmountCount.min", {
          value: v.totalAmountCount.min,
        });
      }

      /*  ATTRIBUTES  */
      if (!variant.attributes || variant.attributes.length === 0) {
        variantErrors.attributesArray = t("validations.attributes.min");
      } else {
        const attributeErrors: ValidationErrors[number]["attributes"] = {};

        variant.attributes.forEach((attr, attrIndex) => {
          if (!attr.value?.trim()) {
            if (!attributeErrors[attrIndex]) {
              attributeErrors[attrIndex] = {};
            }

            attributeErrors[attrIndex]!.value = t(
              "validations.attributes.value.required",
            );
          }
        });

        const sellingTypes = variant.attributes.filter(
          (a) => a.key === ProductVariantAttributeKey.SELLING_TYPE,
        );
        const sizes = variant.attributes.filter(
          (a) => a.key === ProductVariantAttributeKey.SIZE,
        );

        if (sellingTypes.length === 0) {
          if (!attributeErrors[0]) attributeErrors[0] = {};
          attributeErrors[0]!.value = t(
            "validations.attributes.sellingTypeRequired",
          );
        }

        if (sellingTypes.length > 1) {
          variant.attributes.forEach((attr, attrIndex) => {
            if (
              attr.key === ProductVariantAttributeKey.SELLING_TYPE &&
              attrIndex > 0
            ) {
              if (!attributeErrors[attrIndex]) {
                attributeErrors[attrIndex] = {};
              }

              attributeErrors[attrIndex]!.key = t(
                "validations.attributes.singleSellingType",
              );
            }
          });
        }

        if (sizes.length > 1) {
          variant.attributes.forEach((attr, attrIndex) => {
            if (attr.key === ProductVariantAttributeKey.SIZE && attrIndex > 0) {
              if (!attributeErrors[attrIndex]) {
                attributeErrors[attrIndex] = {};
              }

              attributeErrors[attrIndex]!.key = t(
                "validations.attributes.singleSize",
              );
            }
          });
        }

        if (Object.keys(attributeErrors).length > 0) {
          variantErrors.attributes = attributeErrors;
        }
      }

      return variantErrors;
    },
    [t],
  );

  const validateAll = useCallback(() => {
    const newErrors: ValidationErrors = {};
    let isValid = true;

    variants.forEach((variant, index) => {
      const variantErrors = validateVariant(variant, index);
      if (Object.keys(variantErrors).length > 0) {
        newErrors[index] = variantErrors;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [variants, validateVariant]);

  useImperativeHandle(ref, () => ({
    validateAll,
  }));

  const updateVariantField = useCallback(
    (variantIndex: number, field: keyof Variant, value: string | number) => {
      const newVariants = [...variants];
      newVariants[variantIndex] = {
        ...newVariants[variantIndex],
        [field]: value,
      };
      setVariants(newVariants);

      // Mark field as touched
      // const fieldKey = `${variantIndex}.${field}`;
      // setTouchedFields((prev) => new Set(prev).add(fieldKey));

      // Validate this variant
      const variantErrors = validateVariant(
        newVariants[variantIndex],
        variantIndex,
      );
      setErrors((prev) => ({
        ...prev,
        [variantIndex]: variantErrors,
      }));
    },
    [variants, validateVariant],
  );

  const updateAttribute = useCallback(
    (
      variantIndex: number,
      attrIndex: number,
      field: keyof VariantAttribute,
      value: string | number,
    ) => {
      const newVariants = [...variants];
      const newAttributes = [...newVariants[variantIndex].attributes];
      newAttributes[attrIndex] = {
        ...newAttributes[attrIndex],
        [field]: value,
      };
      newVariants[variantIndex] = {
        ...newVariants[variantIndex],
        attributes: newAttributes,
      };
      setVariants(newVariants);

      // Mark field as touched
      // const fieldKey = `${variantIndex}.attributes.${attrIndex}.${field}`;
      // setTouchedFields((prev) => new Set(prev).add(fieldKey));

      // Validate this variant
      const variantErrors = validateVariant(
        newVariants[variantIndex],
        variantIndex,
      );
      setErrors((prev) => ({
        ...prev,
        [variantIndex]: variantErrors,
      }));
    },
    [variants, validateVariant],
  );

  const addVariant = useCallback(() => {
    const isValid = validateAll();

    if (!isValid) return;

    setVariants([...variants, createEmptyVariant()]);
  }, [variants, validateAll]);

  const addAttribute = useCallback(
    (variantIndex: number) => {
      const newVariants = [...variants];
      newVariants[variantIndex].attributes.push({
        key: ProductVariantAttributeKey.COLOR,
        value: "",
      });
      setVariants(newVariants);
    },
    [variants],
  );

  const removeAttribute = useCallback(
    (variantIndex: number, attrIndex: number) => {
      const newVariants = [...variants];
      newVariants[variantIndex].attributes = newVariants[
        variantIndex
      ].attributes.filter((_, i) => i !== attrIndex);
      setVariants(newVariants);

      // Revalidate
      const variantErrors = validateVariant(
        newVariants[variantIndex],
        variantIndex,
      );
      setErrors((prev) => ({
        ...prev,
        [variantIndex]: variantErrors,
      }));
    },
    [variants, validateVariant],
  );

  const getFieldError = (variantIndex: number, field: string) => {
    return errors[variantIndex]?.[field as keyof ValidationErrors[number]];
  };

  const getAttributeError = (
    variantIndex: number,
    attrIndex: number,
    field: "key" | "value",
  ) => {
    return errors[variantIndex]?.attributes?.[attrIndex]?.[field];
  };

  const handleMainImageChange = (
    variantIndex: number,
    data: { file?: File | null; url?: string },
  ) => {
    const newVariants = [...variants];

    newVariants[variantIndex].mainImage = {
      file: data.file ?? null,
      url: data.url || "",
    };

    setVariants(newVariants);
  };

  const handleImagesChange = (
    variantIndex: number,
    data: { files?: File[] | null; urls?: string[] | null },
  ) => {
    const newVariants = [...variants];

    const newFiles = data.files ?? [];
    const newUrls = data.urls ?? [];

    const prevFiles = newVariants[variantIndex]?.images?.files ?? [];
    const prevUrls = newVariants[variantIndex]?.images?.urls ?? [];

    const removedImagesURLs: string[] = prevUrls.filter(
      (url) => !newUrls.includes(url),
    );

    // Merge new files (avoid duplicates)
    const mergedFiles = [
      ...prevFiles,
      ...newFiles.filter(
        (f) =>
          !prevFiles.some(
            (pf) =>
              pf.name === f.name &&
              pf.size === f.size &&
              pf.lastModified === f.lastModified,
          ),
      ),
    ];

    newVariants[variantIndex].images = {
      files: mergedFiles,
      urls: newUrls,
    };

    setVariants(newVariants);
    setDeletedImages((prev) => [...prev, ...removedImagesURLs]);
  };

  const handleImageError = (error: string) => {
    showErrorToast({
      title: t("general.toast.title.error"),
      description: error,
      dismissText: t("general.toast.dismissText"),
    });
  };

  const handleSaveVariant = async (variantIndex: number) => {
    const isValid = validateVariant(variants[variantIndex], variantIndex);

    if (Object.keys(isValid).length > 0) {
      setErrors((prev) => ({
        ...prev,
        [variantIndex]: isValid,
      }));
      return;
    }

    try {
      setLoadingIndex(variantIndex);

      const variant = variants[variantIndex];

      const hasId: boolean = !!variant?.variantId || false;

      const formData = getChangedPayload(variant, variantIndex);
      if (!formData) return;
      formData.append("lang", locale);

      if (!hasId) {
        formData.append("currency", variant.currency);
      }

      const url = hasId
        ? `${API_ENDPOINTS.DASHBOARD.PRODUCTS.EDIT}/${productId}/variant/${variant?.variantId}`
        : `${API_ENDPOINTS.DASHBOARD.PRODUCTS.CREATE}/${productId}/variant`;

      const method = hasId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        body: formData,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseObj = await response.json();

      if (responseObj?.isSuccess) {
        showSuccessToast({
          title: tg("toast.title.success"),
          description: responseObj.message,
          dismissText: tg("toast.dismissText"),
        });

        await invalidateQuery(queryClient, queryKey);
      } else {
        showErrorToast({
          title: tg("toast.title.error"),
          description: responseObj?.message,
          dismissText: tg("toast.dismissText"),
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingIndex(null);
    }
  };

  const getChangedPayload = (variant: Variant, variantIndex: number) => {
    const initial = initialVariantsRef.current[variantIndex];
    if (!initial) return null;

    const formData = new FormData();

    // Description
    if (variant.description_ar !== initial.description_ar) {
      formData.append("description_ar", variant.description_ar);
    }

    if (variant.description_en !== initial.description_en) {
      formData.append("description_en", variant.description_en);
    }

    // Price
    if (variant.price !== initial.price) {
      formData.append("price", String(variant.price));
    }

    // Currency
    if (variant.currency !== initial.currency) {
      formData.append("currency", String(variant.currency));
    }

    // Discount
    if (variant.discountRate !== initial.discountRate) {
      formData.append("discountRate", String(variant.discountRate));
    }

    // Stock
    if (variant.totalAmountCount !== initial.totalAmountCount) {
      formData.append("totalAmountCount", String(variant.totalAmountCount));
    }

    // Main Image
    if (
      variant.mainImage?.file ||
      variant.mainImage?.url !== initial.mainImage?.url
    ) {
      if (variant.mainImage.file) {
        formData.append("mainImage", variant.mainImage.file);
      }
    }

    deletedImages.forEach((url, i) => {
      formData.append(`deletedImages[${i}]`, url);
    });

    variant.images?.files?.forEach((file) => {
      formData.append("images", file);
    });

    // Attributes (send only if changed)
    const attrsChanged =
      JSON.stringify(variant.attributes) !== JSON.stringify(initial.attributes);

    if (attrsChanged) {
      variant.attributes.forEach((attr, index) => {
        formData.append(`attributes[${index}][key]`, attr.key);
        formData.append(`attributes[${index}][value]`, attr.value);
      });
    }

    // variant.attributes.forEach((attr, index) => {
    //   formData.append(`attributes[${index}][key]`, attr.key);
    //   formData.append(`attributes[${index}][value]`, attr.value);
    // });

    return formData;
  };

  const updateVariantLocally = useCallback(
    (
      variantId: string,
      updates: Partial<Pick<Variant, "isDeleted" | "isActive">>,
    ) => {
      const newVariants = variants.map((v) =>
        v.variantId === variantId ? { ...v, ...updates } : v,
      );

      setVariants(newVariants);
    },
    [variants, setVariants],
  );

  return (
    <div className="w-full bg-white rounded-md border shadow-sm">
      <div className="w-full border-b px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Group className="text-primary-600 h-5 w-5" />
          <h3 className="font-semibold text-lg">{t("title")}</h3>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
          onClick={addVariant}
        >
          <Plus className="h-4 w-4" />
          <span>{t("addVariant")}</span>
        </Button>
      </div>

      <div className="p-4 space-y-6">
        {variants.map((variant, variantIndex) => {
          return (
            <div
              key={variantIndex}
              className="relative border rounded-lg overflow-hidden bg-white shadow-sm"
            >
              {loadingIndex === variantIndex && (
                <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center z-20">
                  <Loader2 className="h-6 w-6 animate-spin text-primary-600" />
                </div>
              )}

              {/* Variant Header */}
              <div className="bg-slate-50 px-4 py-2 border-b flex flex-col">
                <div className="w-full flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-600">
                    {t("variant")} #{variantIndex + 1}
                  </span>

                  <div className="w-auto flex items-center">
                    {variant?.variantId && productId && (
                      <VariantFormActions
                        productId={productId}
                        variantId={variant?.variantId}
                        isDeleted={variant?.isDeleted!}
                        isActive={variant?.isActive!}
                        deleteFn={async (token, locale, prodId, varId) => {
                          const resp = await deleteProductVariant(
                            token,
                            locale,
                            prodId,
                            varId,
                          );

                          if (resp?.isSuccess) {
                            updateVariantLocally(varId, {
                              isDeleted: true,
                              isActive: false,
                            });
                          }

                          return resp;
                        }}
                        unDeleteFn={async (token, locale, prodId, varId) => {
                          const resp = await unDeleteProductVariant(
                            token,
                            locale,
                            prodId,
                            varId,
                          );

                          if (resp?.isSuccess) {
                            updateVariantLocally(varId, { isDeleted: false });
                          }

                          return resp;
                        }}
                        switchActiveStatusFn={async (
                          token,
                          locale,
                          newStatus,
                          prodId,
                          varId,
                        ) => {
                          const resp = await switchProductVariantActiveStatus(
                            token,
                            locale,
                            newStatus,
                            prodId,
                            varId,
                          );

                          if (resp?.isSuccess) {
                            updateVariantLocally(varId, {
                              isActive: newStatus,
                            });
                          }

                          return resp;
                        }}
                      />
                    )}

                    {isEditMode && variant?.variantId && productId && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSaveVariant(variantIndex)}
                        disabled={loadingIndex === variantIndex}
                      >
                        <Save className="h-4 w-4" />
                      </Button>
                    )}

                    {!variant?.variantId && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSaveVariant(variantIndex)}
                        disabled={loadingIndex === variantIndex}
                      >
                        <CirclePlus className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
                {variant?.variantId && productId && isEditMode && (
                  <div className="w-auto flex items-center gap-2">
                    <StatusBadge
                      status={
                        variant.isDeleted
                          ? Statuses.DELETED
                          : Statuses.UNDELETED
                      }
                    />
                    <StatusBadge
                      status={
                        variant.isActive ? Statuses.ACTIVE : Statuses.UN_ACTIVE
                      }
                    />
                  </div>
                )}
              </div>

              <div className="p-4 space-y-4">
                {/* Images */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Main Image */}
                  <div>
                    <label
                      className={`text-sm font-medium ${
                        getFieldError(variantIndex, "mainImage")
                          ? "text-destructive"
                          : ""
                      }`}
                    >
                      {t("fields.mainImage.label")}
                    </label>
                    <ImageUploader
                      disabled={isEditMode && !variant?.isActive}
                      value={
                        variant.mainImage.url ? [variant.mainImage.url] : []
                      }
                      onChange={(data) =>
                        handleMainImageChange(variantIndex, data)
                      }
                      onError={handleImageError}
                      label=""
                      maxSizeInMB={MEDIA_CONFIG.PRODUCT.IMAGE.MAX_SIZE}
                      size="sm"
                      variant="rounded"
                      accept={MEDIA_CONFIG.PRODUCT.IMAGE.ALLOWED_TYPES}
                      multiple={false}
                    />

                    <FormErrorMessage
                      message={
                        getFieldError(variantIndex, "mainImage") as string
                      }
                    />
                  </div>

                  {/* Additional Images */}
                  <div>
                    <ImageUploader
                      disabled={isEditMode && !variant?.isActive}
                      value={variant?.images?.urls}
                      onChange={(data) =>
                        handleImagesChange(variantIndex, data)
                      }
                      onError={handleImageError}
                      label={t("fields.additionalImages.label")}
                      maxSizeInMB={MEDIA_CONFIG.PRODUCT.IMAGE.MAX_SIZE}
                      size="sm"
                      variant="rounded"
                      accept={MEDIA_CONFIG.PRODUCT.IMAGE.ALLOWED_TYPES}
                      multiple={true}
                      maxImages={4}
                    />
                    {/* Spacer to align with sibling error slot */}
                    <p className="min-h-[20px]" />
                  </div>
                </div>

                {/* SKU & Price & Currency & Discount & Stock */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  {/* SKU */}
                  <div className="space-y-1">
                    <label
                      className={`text-sm font-medium ${
                        getFieldError(variantIndex, "sku")
                          ? "text-destructive"
                          : ""
                      }`}
                    >
                      {t("fields.sku.label")}
                    </label>
                    <Input
                      disabled={isEditMode && !variant?.isActive}
                      value={variant.sku}
                      onChange={(e) =>
                        updateVariantField(variantIndex, "sku", e.target.value)
                      }
                      placeholder="SKU-123"
                    />

                    <FormErrorMessage
                      message={getFieldError(variantIndex, "sku") as string}
                    />
                  </div>

                  {/* Price */}
                  <div className="space-y-1">
                    <label
                      className={`text-sm font-medium ${
                        getFieldError(variantIndex, "price")
                          ? "text-destructive"
                          : ""
                      }`}
                    >
                      {t("fields.price.label")}
                    </label>
                    <Input
                      disabled={isEditMode && !variant?.isActive}
                      type="number"
                      step="0.01"
                      min={0}
                      value={variant.price}
                      onChange={(e) =>
                        updateVariantField(
                          variantIndex,
                          "price",
                          parseFloat(e.target.value) || 0,
                        )
                      }
                    />

                    <FormErrorMessage
                      message={getFieldError(variantIndex, "price") as string}
                    />
                  </div>

                  {/* Currency */}
                  <div className="space-y-1">
                    <label className="text-sm font-medium">
                      {" "}
                      {t("fields.currency.label")}
                    </label>
                    <Select disabled value={Currency.JOD}>
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="Select Key" />
                      </SelectTrigger>
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
                    {/* Spacer keeps this column same height as siblings */}
                    <p className="min-h-[20px]" />
                  </div>

                  {/* Discount % */}
                  <div className="space-y-1">
                    <label
                      className={`text-sm font-medium ${
                        getFieldError(variantIndex, "discountRate")
                          ? "text-destructive"
                          : ""
                      }`}
                    >
                      {t("fields.discount.label")}
                    </label>
                    <Input
                      disabled={isEditMode && !variant?.isActive}
                      type="number"
                      step="0.01"
                      value={variant.discountRate}
                      onChange={(e) =>
                        updateVariantField(
                          variantIndex,
                          "discountRate",
                          parseFloat(e.target.value) || 0,
                        )
                      }
                      placeholder="0–100"
                    />

                    <FormErrorMessage
                      message={
                        getFieldError(variantIndex, "discountRate") as string
                      }
                    />
                  </div>

                  {/* Stock Available */}
                  <div className="space-y-1">
                    <label
                      className={`text-sm font-medium ${
                        getFieldError(variantIndex, "totalAmountCount")
                          ? "text-destructive"
                          : ""
                      }`}
                    >
                      {t("fields.stock.label")}
                    </label>
                    <Input
                      disabled={isEditMode && !variant?.isActive}
                      type="number"
                      step="1"
                      min={0}
                      value={variant.totalAmountCount}
                      onChange={(e) =>
                        updateVariantField(
                          variantIndex,
                          "totalAmountCount",
                          parseInt(e.target.value) || 0,
                        )
                      }
                    />

                    <FormErrorMessage
                      message={
                        getFieldError(
                          variantIndex,
                          "totalAmountCount",
                        ) as string
                      }
                    />
                  </div>
                </div>

                {/* ─── Row 3: Descriptions ───────────────────────────────────── */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Description AR */}
                  <div className="space-y-1">
                    <label
                      className={`text-sm font-medium ${
                        getFieldError(variantIndex, "description_ar")
                          ? "text-destructive"
                          : ""
                      }`}
                    >
                      {t("fields.desc_ar.label")}
                    </label>
                    <Textarea
                      disabled={isEditMode && !variant?.isActive}
                      value={variant.description_ar}
                      onChange={(e) =>
                        updateVariantField(
                          variantIndex,
                          "description_ar",
                          e.target.value,
                        )
                      }
                      dir="rtl"
                    />

                    <FormErrorMessage
                      message={
                        getFieldError(variantIndex, "description_ar") as string
                      }
                    />
                  </div>

                  {/* Description EN */}
                  <div className="space-y-1">
                    <label
                      className={`text-sm font-medium ${
                        getFieldError(variantIndex, "description_en")
                          ? "text-destructive"
                          : ""
                      }`}
                    >
                      {t("fields.desc_en.label")}
                    </label>
                    <Textarea
                      disabled={isEditMode && !variant?.isActive}
                      value={variant.description_en}
                      onChange={(e) =>
                        updateVariantField(
                          variantIndex,
                          "description_en",
                          e.target.value,
                        )
                      }
                    />

                    <FormErrorMessage
                      message={
                        getFieldError(variantIndex, "description_en") as string
                      }
                    />
                  </div>
                </div>

                <hr className="my-4" />

                {/* Attributes */}
                <ProductVariantAttributesSection
                  isDisabled={isEditMode && !variant?.isActive}
                  variant={variant}
                  variantIndex={variantIndex}
                  updateAttribute={updateAttribute}
                  addAttribute={addAttribute}
                  removeAttribute={removeAttribute}
                  getAttributeError={getAttributeError}
                  errors={errors}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});

export default memo(ProductVariantForm);
