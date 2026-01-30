"use client";

import { memo, useCallback, useEffect, useState } from "react";
import { Product } from "@/types/product.type";
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
import ProductRating from "../ProductRating";
import AddToCartButton from "../AddToCartButton";

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

  const [isWishListed, setIsWishListed] = useState<boolean>(
    item?.isWishListed || false
  );
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isWishListLoading, setIsWishListLoading] = useState<boolean>(false);
  const [isAddToCartLoading, setIsAddToCartLoading] = useState<boolean>(false);

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
        })
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
        })
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
        })
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
      `/${categorySlug}/${subCategorySlug}/${productSlug}?p_id=${item._id}`
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

      <DiscountBadge discount={item.discountRate} />

      {/* Left Image Section */}
      <div className="w-2/5 flex-shrink-0 p-3">
        <div
          className="w-full h-full rounded-lg overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <ProductImage
            src={item.mainImage}
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

        <div className="space-y-3">
          <div className="w-full flex items-center justify-between gap-1">
            <ProductPrice item={item} formatPrice={formatPrice} isArabic={isArabic} />
            <ProductRating rating={item.ratings} />
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
