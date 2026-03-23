"use client";

import { memo, useCallback, useMemo, useState } from "react";
import { redirect, useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Product, VariantServer } from "@/types/product.type";
import { useAuthContext } from "@/hooks/useAuthContext";
import {
  showErrorToast,
  showSuccessToast,
  showWarningToast,
} from "@/components/shared/CustomToast";
import { isArabicLocale } from "@/config/locales.config";
import {
  removeWishlistItem,
  sendWishlistItemToCart,
} from "@/redux/slices/wishlist/actions";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import CardWrapper from "@/components/shared/card/CardWrapper";
import WishlistButton from "@/components/shared/card/WishlistButton";
import DiscountBadge from "@/components/shared/card/DiscountBadge";
import ProductImage from "@/components/shared/card/ProductImage";
import ProductTitle from "@/components/shared/card/ProductTitle";
import ProductPrice from "@/components/shared/card/ProductPrice";
import SendWishlistItemToCartBtn from "./SendWishlistItemToCartBtn";
import { incCartItemsCountByOne } from "@/redux/slices/cart";
import ProductVariantDescription from "@/components/shared/card/ProductVariantDescription";
import ItemRatingStats from "@/components/shared/card/ItemRatingStats";
import ProductVariantSelector from "@/components/shared/card/ProductVariantSelector";
import { setWishlistItemSelectedVariant } from "@/redux/slices/wishlist";

const WishlistProductCard = ({ item: product }: { item: Product }) => {
  const dispatch = useDispatch<AppDispatch>();
  const t = useTranslations();
  const locale = useLocale();
  const isArabic = isArabicLocale(locale);
  const { accessToken } = useAuthContext();

  const router = useRouter();

  const title = isArabic ? product?.name?.ar : product?.name?.en;

  const activeVariants: VariantServer[] =
    product.variants?.filter((v) => v.isActive && !v.isDeleted) ?? [];

  const [isWishListed] = useState(product?.isWishListed || false);
  const [isHovered, setIsHovered] = useState(false);
  const [isWishListing, setIsWishListing] = useState(false);
  const [isAddToCartLoading, setIsAddToCartLoading] = useState(false);
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    activeVariants[0]?.variantId ?? null,
  );

  const currentVariant = useMemo(
    () => activeVariants.find((v) => v.variantId === selectedVariantId) ?? null,
    [activeVariants, selectedVariantId],
  );

  const handleVariantSelect = (variantId: string) => {
    setSelectedVariantId(variantId);

    dispatch(
      setWishlistItemSelectedVariant({
        productId: product._id,
        variantId,
      }),
    );
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(price);
  };

  const handleRemoveWishListItem = useCallback(async () => {
    if (!accessToken) {
      showWarningToast({
        title: t("general.toast.title.warning"),
        description: t("general.toast.description.loginRequired"),
        dismissText: t("general.toast.dismissText"),
      });

      redirect("/auth");
    }

    try {
      setIsWishListing(true);

      const response = await dispatch(
        removeWishlistItem({
          productId: product?._id,
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
      }
    } catch (error) {
      showErrorToast({
        title: t("general.toast.title.error"),
        description: (error as Error)?.message || "Failed to remove item.",
        dismissText: t("general.toast.dismissText"),
      });
    } finally {
      setIsWishListing(false);
    }
  }, [locale, accessToken, product._id, t]);

  const handleWishListedItemState = () =>
    isWishListed ? handleRemoveWishListItem() : () => ({});

  const handleSendWishListItemToCart = useCallback(async () => {
    if (!accessToken) {
      showWarningToast({
        title: t("general.toast.title.warning"),
        description: t("general.toast.description.loginRequired"),
        dismissText: t("general.toast.dismissText"),
      });

      return;
    }

    if (!currentVariant?.variantId) {
      showWarningToast({
        title: t("general.toast.title.warning"),
        description: t("components.ProductVertCard.selectVariant"),
        dismissText: t("general.toast.dismissText"),
      });

      return;
    }

    try {
      setIsAddToCartLoading(true);

      const response = await dispatch(
        sendWishlistItemToCart({
          productId: product?._id,
          variantId: currentVariant?.variantId,
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

        dispatch(incCartItemsCountByOne());
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
  }, [locale, accessToken, product._id, t]);

  const handleGoToProductPage = useCallback(() => {
    let categorySlug, subCategorySlug;
    const productSlug = product.slug;

    if (typeof product.categoryId !== "string") {
      categorySlug = product?.categoryId?.slug;
    } else {
      categorySlug = product.categoryId;
    }

    if (typeof product.subCategoryId !== "string") {
      subCategorySlug = product?.subCategoryId?.slug;
    } else {
      subCategorySlug = product.subCategoryId;
    }

    router.push(
      `/${categorySlug}/${subCategorySlug}/${productSlug}?p_id=${product._id}`,
    );
  }, [product, isArabic]);

  return (
    <CardWrapper>
      <WishlistButton
        isWishListed={isWishListed}
        isLoading={isWishListing}
        onClick={handleWishListedItemState}
      />

      <DiscountBadge discount={currentVariant?.discountRate ?? 0} />

      <div
        className="w-full h-[23vh] sm:h-[22vh] max-[500px]:h-[18vh] max-[400px]:h-[16vh] max-[350px]:h-[14vh]"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <ProductImage
          src={currentVariant?.mainImage?.url || product?.mainImage?.url}
          alt={title}
          isHovered={isHovered}
          isLoading={isAddToCartLoading || isWishListing}
        />
      </div>

      <div className="flex-1 flex flex-col justify-between mt-2">
        <div
          className="w-full h-auto cursor-pointer"
          onClick={handleGoToProductPage}
        >
          <ProductTitle
            title={title}
            isHovered={isHovered}
            isLoading={isAddToCartLoading}
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
              isLoading={isAddToCartLoading || isWishListing}
            />
          )}
        </div>

        {/* Variant Selector */}
        <ProductVariantSelector
          variants={activeVariants}
          selectedVariantId={selectedVariantId}
          onSelect={handleVariantSelect}
        />

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
                currentVariant?.ratingsAverage ?? product.ratingsAverage ?? 0
              }
              ratingCount={
                currentVariant?.ratingsCount ?? product.ratingsCount ?? 0
              }
            />
          </div>

          <SendWishlistItemToCartBtn
            isDisabled={!currentVariant?.variantId || isAddToCartLoading}
            isLoading={isAddToCartLoading}
            handleOnClick={handleSendWishListItemToCart}
          />
        </div>
      </div>
    </CardWrapper>
  );
};

export default memo(WishlistProductCard);
