"use client";

import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { Product, VariantServer } from "@/types/product.type";
import { useLocale, useTranslations } from "next-intl";
import {
  showErrorToast,
  showSuccessToast,
  showWarningToast,
} from "@/components/shared/CustomToast";
import { useAuthContext } from "@/hooks/useAuthContext";
import { DataResponse } from "@/types/service-response.type";
import { Cart } from "@/types/cart.type";
import { addItemToServer } from "@/redux/slices/cart/actions";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import {
  addWishlistItem,
  removeWishlistItem,
} from "@/redux/slices/wishlist/actions";
import { useRouter } from "next/navigation";
import RowCardWrapper from "../RowCardWrapper";
import WishlistButton from "../WishlistButton";
import DiscountBadge from "../DiscountBadge";
import ProductImage from "../ProductImage";
import ProductTitle from "../ProductTitle";
import ProductPrice from "../ProductPrice";
import AddToCartButton from "../AddToCartButton";
import ProductVariantDescription from "../ProductVariantDescription";
import { extractVariantDetails } from "@/utils/productVariant.utils";
import ItemRatingStats from "../ItemRatingStats";

const ProductRowCard = ({
  item,
  isArabic = false,
}: {
  item: Product;
  isArabic: boolean;
}) => {
  const title = isArabic ? item?.name?.ar : item?.name?.en;

  const router = useRouter();

  const dispatch = useDispatch<AppDispatch>();
  const { items } = useSelector((state: RootState) => state.wishlist);

  const locale = useLocale();
  const { accessToken } = useAuthContext();
  const t = useTranslations();

  const activeVariants: VariantServer[] =
    item.variants?.filter((v) => v.isActive && !v.isDeleted) ?? [];

  const [isWishListed, setIsWishListed] = useState<boolean>(
    item?.isWishListed || false,
  );
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isWishListLoading, setIsWishListLoading] = useState<boolean>(false);
  const [isAddToCartLoading, setIsAddToCartLoading] = useState<boolean>(false);
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    activeVariants[0]?.variantId ?? null,
  );

  const currentVariant = useMemo(
    () => activeVariants.find((v) => v.variantId === selectedVariantId) ?? null,
    [activeVariants, selectedVariantId],
  );

  useEffect(() => {
    const foundItem = items?.find((i) => i._id === item._id);
    setIsWishListed(Boolean(foundItem || item?.isWishListed));
  }, [items, item]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(price);
  };

  const handleAddWishListItem = useCallback(async () => {
    if (!accessToken) {
      showWarningToast({
        title: t("general.toast.title.warning"),
        description: t("general.toast.description.loginRequired"),
        dismissText: t("general.toast.dismissText"),
      });

      return;
    }

    try {
      setIsWishListLoading(true);

      const response = await dispatch(
        addWishlistItem({
          product: item,
          lang: locale,
          token: accessToken,
        }),
      ).unwrap();

      if (response.isSuccess) {
        showSuccessToast({
          title: t("general.toast.title.success"),
          description: response.message,
          dismissText: t("general.toast.dismissText"),
        });

        setIsWishListed(true);
      }
    } catch (error) {
      showErrorToast({
        title: t("general.toast.title.error"),
        description: (error as Error)?.message || "Failed to remove item.",
        dismissText: t("general.toast.dismissText"),
      });
    } finally {
      setIsWishListLoading(false);
    }
  }, [locale, accessToken, item, t]);

  const handleRemoveWishListItem = useCallback(async () => {
    if (!accessToken) {
      showWarningToast({
        title: t("general.toast.title.warning"),
        description: t("general.toast.description.loginRequired"),
        dismissText: t("general.toast.dismissText"),
      });

      return;
    }

    try {
      setIsWishListLoading(true);

      const response = await dispatch(
        removeWishlistItem({
          productId: item?._id,
          lang: locale,
          token: accessToken,
        }),
      ).unwrap();

      if (response.isSuccess) {
        showSuccessToast({
          title: t("general.toast.title.success"),
          description: response.message,
          dismissText: t("general.toast.dismissText"),
        });

        setIsWishListed(false);
      }
    } catch (error) {
      showErrorToast({
        title: t("general.toast.title.error"),
        description: (error as Error)?.message || "Failed to remove item.",
        dismissText: t("general.toast.dismissText"),
      });
    } finally {
      setIsWishListLoading(false);
    }
  }, [locale, accessToken, item, t]);

  const handleWishListedItemState = () =>
    isWishListed ? handleRemoveWishListItem() : handleAddWishListItem();

  const handleAddToCart = async (): Promise<DataResponse<Cart> | undefined> => {
    if (!accessToken) {
      showWarningToast({
        title: t("general.toast.title.warning"),
        description: t("general.toast.description.loginRequired"),
        dismissText: t("general.toast.dismissText"),
      });

      return;
    }

    try {
      setIsAddToCartLoading(true);

      const response = await dispatch(
        addItemToServer({
          productId: item?._id,
          quantity: 1,
          lang: locale,
          token: accessToken,
        }),
      ).unwrap();

      if (response.isSuccess) {
        showSuccessToast({
          title: t("general.toast.title.success"),
          description: response?.message,
          dismissText: t("general.toast.dismissText"),
        });
      }
    } catch (error) {
      showErrorToast({
        title: t("general.toast.title.error"),
        description: (error as Error)?.message || "Failed to remove item.",
        dismissText: t("general.toast.dismissText"),
      });
    } finally {
      setIsAddToCartLoading(false);
    }
  };

  const handleGoToProductPage = useCallback(() => {
    let categorySlug, subCategorySlug;
    const productSlug = item.slug;

    if (typeof item.categoryId !== "string") {
      categorySlug = item?.categoryId?.slug;
    } else {
      categorySlug = item.categoryId;
    }

    if (typeof item.subCategoryId !== "string") {
      subCategorySlug = item?.subCategoryId?.slug;
    } else {
      subCategorySlug = item.subCategoryId;
    }

    router.push(
      `/${categorySlug}/${subCategorySlug}/${productSlug}?p_id=${item._id}`,
    );
  }, [item, isArabic]);

  return (
    <RowCardWrapper
      isHovered={isHovered}
      // isLoading={isWishListLoading || isAddToCartLoading}
    >
      <WishlistButton
        isWishListed={isWishListed}
        isLoading={isWishListLoading}
        onClick={handleWishListedItemState}
      />

      <DiscountBadge discount={currentVariant?.discountRate ?? 0} isRow />

      {/* Left Image Section */}
      <div className="w-2/5 flex-shrink-0 p-3">
        <div
          className="w-full h-full rounded-lg overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <ProductImage
            src={currentVariant?.mainImage?.url || item?.mainImage?.url}
            alt={title}
            isHovered={isHovered}
            isLoading={isAddToCartLoading || isWishListLoading}
          />
        </div>
      </div>

      {/* Right Content Section */}
      <div className="flex-1 p-3 pr-4 flex flex-col justify-between min-w-0">
        <div
          className="w-full h-auto cursor-pointer"
          onClick={handleGoToProductPage}
        >
          <ProductTitle
            title={title}
            isHovered={isHovered}
            isLoading={isAddToCartLoading || isWishListLoading}
          />
        </div>

        {/* Variant description */}
        <div>
          {currentVariant && (
            <ProductVariantDescription
              desc={
                isArabic
                  ? currentVariant?.description?.ar
                  : currentVariant?.description?.en
              }
              isHovered={isHovered}
              isLoading={isAddToCartLoading || isWishListLoading}
            />
          )}
        </div>

        {/* Variant Selector */}
        {activeVariants.length > 0 && (
          <div className="relative my-2">
            <div className="flex gap-1.5 overflow-x-auto scrollbar-none scroll-smooth snap-x snap-mandatory px-0.5 pb-0.5">
              {activeVariants.map((variant) => {
                const { sellingType, size, colors } =
                  extractVariantDetails(variant);
                const isSelected = selectedVariantId === variant?.variantId;
                const isUnavailable = !variant.isAvailable;

                // Color-only variant → show swatch circles
                if (colors.length > 0 && !size && !sellingType) {
                  return (
                    <button
                      key={variant.variantId}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (isUnavailable) return;
                        setSelectedVariantId(variant.variantId);
                      }}
                      disabled={isUnavailable}
                      title={isUnavailable ? "Out of stock" : colors[0]}
                      className={`relative flex-shrink-0 w-7 h-7 rounded-full border-2 transition-all snap-start ${
                        isSelected
                          ? "border-primary-50 scale-110 shadow-sm"
                          : "border-transparent hover:border-gray-400"
                      } ${isUnavailable ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
                      style={{ backgroundColor: colors[0] }}
                    >
                      {isUnavailable && (
                        <span className="absolute inset-0 flex items-center justify-center rounded-full overflow-hidden">
                          <span className="block w-full h-px bg-white/80 rotate-45" />
                        </span>
                      )}
                    </button>
                  );
                }

                // Text-based variant (size, selling type, or both)
                const label = [sellingType, size].filter(Boolean).join(" · ");

                return (
                  <button
                    key={variant.variantId}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isUnavailable) return;
                      setSelectedVariantId(variant.variantId);
                    }}
                    disabled={isUnavailable}
                    title={isUnavailable ? "Out of stock" : undefined}
                    className={`relative flex-shrink-0 snap-start inline-flex items-center gap-1 px-2.5 py-1 rounded-md border text-[11px] font-medium transition-all whitespace-nowrap ${isSelected ? "border-primary-50 bg-black text-white" : "border-gray-200 bg-white text-gray-700 hover:border-gray-400"} ${isUnavailable ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
                  >
                    {label}
                    {isUnavailable && (
                      <span className="absolute inset-0 overflow-hidden rounded-md pointer-events-none">
                        <span className="absolute top-1/2 left-0 w-full h-px bg-gray-400 rotate-[-18deg] origin-center" />
                      </span>
                    )}
                    {colors.length > 0 && (
                      <span className="inline-flex gap-0.5 align-middle">
                        {colors.map((c) => (
                          <span
                            key={c}
                            style={{ backgroundColor: c }}
                            className="inline-block w-2.5 h-2.5 rounded-full border border-gray-300"
                          />
                        ))}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="space-y-3">
          <div className="w-full flex items-center justify-between gap-1">
            {currentVariant && (
              <ProductPrice
                item={currentVariant}
                formatPrice={formatPrice}
                isArabic={isArabic}
              />
            )}
            <ItemRatingStats
              ratingAverage={
                currentVariant?.ratingsAverage ?? item.ratingsAverage ?? 0
              }
              ratingCount={
                currentVariant?.ratingsCount ?? item.ratingsCount ?? 0
              }
            />
          </div>

          <AddToCartButton
            isLoading={isAddToCartLoading}
            onClick={handleAddToCart}
          />
        </div>
      </div>
    </RowCardWrapper>
  );
};

export default memo(ProductRowCard);
