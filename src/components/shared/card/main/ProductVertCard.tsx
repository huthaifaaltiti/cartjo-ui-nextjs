"use client";

import { memo, useCallback, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { Product } from "@/types/product.type";
import { useAuthContext } from "@/hooks/useAuthContext";
import { DataResponse } from "@/types/service-response.type";
import { Cart } from "@/types/cart.type";
import {
  showErrorToast,
  showSuccessToast,
  showWarningToast,
} from "@/components/shared/CustomToast";
import { addItemToServer } from "@/redux/slices/cart/actions";
import {
  addWishlistItem,
  removeWishlistItem,
} from "@/redux/slices/wishlist/actions";
import { useRouter } from "next/navigation";
import CardWrapper from "../CardWrapper";
import WishlistButton from "../WishlistButton";
import DiscountBadge from "../DiscountBadge";
import ProductImage from "../ProductImage";
import ProductTitle from "../ProductTitle";
import ProductPrice from "../ProductPrice";
import ProductRating from "../ProductRating";
import AddToCartButton from "../AddToCartButton";

const ProductVertCard = ({
  item,
  isArabic,
}: {
  item: Product;
  isArabic: boolean;
}) => {
  const title = isArabic ? item?.name?.ar : item?.name?.en;

  const router = useRouter();

  const locale = useLocale();
  const t = useTranslations();
  const dispatch = useDispatch<AppDispatch>();

  const [isWishListed, setIsWishListed] = useState<boolean>(
    item?.isWishListed || false
  );
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isWishListing, setIsWishListing] = useState<boolean>(false);
  const [isAddToCartLoading, setIsAddToCartLoading] = useState<boolean>(false);

  const { accessToken } = useAuthContext();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(price);
  };

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
          productId: item?._id!,
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
      setIsWishListing(true);

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
      setIsWishListing(false);
    }
  }, [locale, accessToken, item, t]);

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
      setIsWishListing(true);

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
      setIsWishListing(false);
    }
  }, [locale, accessToken, item._id, t]);

  const handleWishListedItemState = () =>
    isWishListed ? handleRemoveWishListItem() : handleAddWishListItem();

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
    <CardWrapper
      isHovered={isHovered}
      // isLoading={isAddToCartLoading || isWishListing}
    >
      <WishlistButton
        isWishListed={isWishListed}
        isLoading={isWishListing}
        onClick={handleWishListedItemState}
      />
      <DiscountBadge discount={item.discountRate} />

      <div
        className="w-full h-[23vh] sm:h-[22vh] max-[500px]:h-[18vh] max-[400px]:h-[16vh] max-[350px]:h-[14vh]"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <ProductImage
          src={item.mainImage}
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
            isLoading={isAddToCartLoading || isWishListing}
          />
        </div>

        <div className="space-y-3">
          <div className="w-full flex items-center justify-between gap-1">
            <ProductPrice item={item} formatPrice={formatPrice} />
            <ProductRating rating={item.ratings} />
          </div>

          <AddToCartButton
            isLoading={isAddToCartLoading}
            onClick={handleAddToCart}
          />
        </div>
      </div>
    </CardWrapper>
  );
};

export default memo(ProductVertCard);
