"use client";

import { memo, useMemo, useState } from "react";
import {
  Heart,
  ShoppingCart,
  Calendar,
  User,
  MoreVertical,
  BadgeDollarSign,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useCategoriesQuery } from "@/hooks/react-query/useCategoriesQuery";
import { formatDate } from "@/utils/formatDate";
import { isArabicLocale } from "@/config/locales.config";
import { BaseResponse } from "@/types/service-response.type";
import { Product, VariantServer } from "@/types/product.type";
import ProductCardActions from "./ProductCardActions";
import { Button } from "@/components/ui/button";
import ImageGallery from "../../shared/ImageGallery";
import EditProductForm from "./EditProductForm";
import { Currency } from "@/constants/currency.constant";
import { ProductVariantAttributeKey } from "@/enums/productVariantAttributeKey.enum";
import StatusBadge from "@/components/shared/StatusBadge";
import { Statuses } from "@/enums/statuses.enum";

type DashboardProductCardProps = {
  item: Product;
  deleteProduct: (
    token: string | null,
    locale: string,
    prodId: string,
  ) => Promise<BaseResponse>;
  unDeleteProduct: (
    token: string | null,
    locale: string,
    prodId: string,
  ) => Promise<BaseResponse>;
  switchProductActiveStatus: (
    token: string | null,
    lang: string,
    isActive: boolean,
    id: string,
  ) => Promise<BaseResponse>;
};

const DashboardProductCard = ({
  item: product,
  deleteProduct,
  switchProductActiveStatus,
  unDeleteProduct,
}: DashboardProductCardProps) => {
  const t = useTranslations(
    "routes.dashboard.routes.products.components.DashboardProductCard",
  );
  const tg = useTranslations("general");
  const locale = useLocale();
  const isArabic = isArabicLocale(locale);

  const { data } = useCategoriesQuery();
  const categories = useMemo(
    () => data?.pages.flatMap((page) => page.data) ?? [],
    [data],
  );

  const [showActions, setShowActions] = useState<boolean>(false);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState<number>(0);

  const variants: VariantServer[] = product.variants ?? [];
  const selectedVariant: VariantServer | undefined =
    variants[selectedVariantIndex];

  const allImages: string[] = useMemo(() => {
    if (variants.length > 0) {
      return variants.flatMap((v: VariantServer) => {
        const main = v.mainImage?.url ? [v.mainImage.url] : [];
        const others = v.images?.map((i) => i.url) ?? [];

        return [...main, ...others];
      });
    }

    return product.mainImage?.url ? [product.mainImage.url] : [];
  }, [variants, product.mainImage]);

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300">
      {/* HEADER */}
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex gap-2">
          <StatusBadge
            status={product.isDeleted ? Statuses.DELETED : Statuses.UNDELETED}
          />
          <StatusBadge
            status={product.isActive ? Statuses.ACTIVE : Statuses.UN_ACTIVE}
          />
        </div>

        <div className="relative">
          <Button
            onClick={() => setShowActions(!showActions)}
            className="bg-transparent shadow-none p-2 hover:bg-gray-100"
          >
            <MoreVertical size={18} />
          </Button>

          {showActions && (
            <div className="absolute right-0">
              <ProductCardActions
                deleteFn={deleteProduct}
                unDeleteFn={unDeleteProduct}
                switchActiveStatusFn={switchProductActiveStatus}
                product={product}
                setShowActions={setShowActions}
                renderEditForm={() => (
                  <EditProductForm product={product} categories={categories} />
                )}
              />
            </div>
          )}
        </div>
      </div>

      {/* GALLERY */}
      <ImageGallery
        images={allImages}
        alt={product.name.en}
        heightClass="h-24"
        useAutoSlide
      />

      {/* CONTENT */}
      <div className="p-4 space-y-4">
        {/* TITLE */}
        <div>
          <h3 className="text-sm font-semibold line-clamp-2">
            {isArabic ? product.name.ar : product.name.en}
          </h3>

          <p className="text-xs text-gray-500">
            {isArabic
              ? product.categoryId?.name?.ar
              : product.categoryId?.name?.en}
            {" — "}
            {isArabic
              ? product.subCategoryId?.name?.ar
              : product.subCategoryId?.name?.en}
          </p>
        </div>

        {/* VARIANT SELECTOR */}
        {variants.length > 1 && (
          <div className="flex flex-wrap gap-2">
            {variants.map((_, index) => (
              <Button
                key={index}
                size="sm"
                variant={
                  selectedVariantIndex === index ? "outline" : "secondary"
                }
                onClick={() => setSelectedVariantIndex(index)}
              >
                {`${t("variant")} (${index + 1})`}
              </Button>
            ))}
          </div>
        )}

        {/* PRICE */}
        {selectedVariant && (
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1">
              <BadgeDollarSign size={14} />
              <span className="font-bold text-sm">
                {selectedVariant.price}{" "}
                {isArabic
                  ? Currency[selectedVariant.currency]?.labelAr
                  : Currency[selectedVariant.currency]?.labelEn}
              </span>
            </div>

            <div className="text-xs">
              ({selectedVariant.availableCount}/
              {selectedVariant.totalAmountCount})
            </div>
          </div>
        )}

        {/* VARIANT DETAILS */}
        {selectedVariant && (
          <div className="space-y-3 border-t pt-3 text-xs">
            <div>
              <span className="font-medium">{t("sku")}:</span>{" "}
              {selectedVariant.sku || "—"}
            </div>

            <div>
              <span className="font-medium">{t("variantId")}:</span>{" "}
              {selectedVariant.variantId || "—"}
            </div>

            {/* ATTRIBUTES */}
            {selectedVariant?.attributes?.length > 0 && (
              <div className="flex items-center flex-wrap gap-2">
                {selectedVariant?.attributes?.map((attr, index) => {
                  return (
                    <span>
                      {attr.key === ProductVariantAttributeKey.SELLING_TYPE && (
                        <span
                          key={index}
                          className="px-2 py-1 rounded-full bg-gray-100 border"
                        >
                          {attr.value}
                        </span>
                      )}

                      {attr.key === ProductVariantAttributeKey.COLOR && (
                        <span
                          key={index}
                          className="inline-block rounded-full border shadow-sm flex-shrink-0"
                          style={{
                            width: "20px",
                            height: "20px",
                            backgroundColor: attr.value || "#000",
                          }}
                        />
                      )}

                      {attr.key === ProductVariantAttributeKey.SIZE && (
                        <span
                          key={index}
                          className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium rounded-md border bg-slate-50"
                        >
                          {attr.value}
                        </span>
                      )}
                    </span>
                  );
                })}
              </div>
            )}

            <div className="flex gap-2">
              <StatusBadge
                status={
                  selectedVariant.isDeleted
                    ? Statuses.DELETED
                    : Statuses.UNDELETED
                }
              />
              <StatusBadge
                status={
                  selectedVariant.isActive
                    ? Statuses.ACTIVE
                    : Statuses.UN_ACTIVE
                }
              />
            </div>
          </div>
        )}

        {/* STATS */}
        <div className="grid grid-cols-3 text-center text-xs border-t pt-3">
          <div>
            <ShoppingCart size={14} />
            <p>{product.totalSellCount}</p>
          </div>
          <div>
            <Heart size={14} />
            <p>{product.favoriteCount}</p>
          </div>
          <div>
            <Calendar size={14} />
            <p>{formatDate(product.createdAt, locale)}</p>
          </div>
        </div>

        {/* CREATOR */}
        <div className="flex items-center gap-1 text-xs border-t pt-2">
          <User size={14} />
          {product.createdBy
            ? `${product.createdBy.firstName} ${product.createdBy.lastName}`
            : tg("others.unknown")}
        </div>
      </div>
    </div>
  );
};

export default memo(DashboardProductCard);
