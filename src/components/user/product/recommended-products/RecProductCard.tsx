"use client";

import {
  showErrorToast,
  showSuccessToast,
  showWarningToast,
} from "@/components/shared/CustomToast";
import { useGeneralContext } from "@/contexts/General.context";
import { useLoggedUserWishlist } from "@/contexts/LoggedUserWishList.context";
import { useAuthContext } from "@/hooks/useAuthContext";
import { Product } from "@/types/product.type";
import { Heart, Loader2, ShoppingBag, Star } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { memo, useCallback, useState } from "react";

interface RecProductCardProps {
  product: Product;
}
const RecProductCard = ({ product }: RecProductCardProps) => {
  const t = useTranslations();
  const { isArabic, locale } = useGeneralContext();
  const { addItem, removeItem } = useLoggedUserWishlist();
  const { accessToken } = useAuthContext();

  const [isWishlisted, setIsWishlisted] = useState(
    product.isWishListed || false
  );
  const [isWishlisting, setIsWishListing] = useState<boolean>(false);

  const handleAddWishListItem = useCallback(async () => {
    setIsWishListing(true);

    try {
      const resp = await addItem(accessToken, locale, product?._id);

      if (resp.isSuccess) {
        showSuccessToast({
          title: t("general.toast.title.success"),
          description: resp.message,
          dismissText: t("general.toast.dismissText"),
        });

        setIsWishlisted(!isWishlisted);
      } else {
        showWarningToast({
          title: t("general.toast.title.warning"),
          description: resp.message,
          dismissText: t("general.toast.dismissText"),
        });
      }
    } catch (err) {
      showErrorToast({
        title: t("general.toast.title.error"),
        description: (err as Error)?.message,
        dismissText: t("general.toast.dismissText"),
      });
    } finally {
      setIsWishListing(false);
    }
  }, [locale, accessToken, product._id, t, addItem, isWishlisted]);

  const handleRemoveWishListItem = useCallback(async () => {
    setIsWishListing(true);

    try {
      const resp = await removeItem(accessToken, locale, product?._id);

      if (resp.isSuccess) {
        showSuccessToast({
          title: t("general.toast.title.success"),
          description: resp.message,
          dismissText: t("general.toast.dismissText"),
        });

        setIsWishlisted(!isWishlisted);
      } else {
        showWarningToast({
          title: t("general.toast.title.warning"),
          description: resp.message,
          dismissText: t("general.toast.dismissText"),
        });
      }
    } catch (err) {
      showErrorToast({
        title: t("general.toast.title.error"),
        description: (err as Error)?.message,
        dismissText: t("general.toast.dismissText"),
      });
    } finally {
      setIsWishListing(false);
    }
  }, [locale, accessToken, product._id, t, removeItem, isWishlisted]);

  const handleWishListedItemState = () =>
    isWishlisted ? handleRemoveWishListItem() : handleAddWishListItem();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    // onAddToCart?.(product._id);
  };

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    return (
      <div className="flex items-center space-x-0.5">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < fullStars
                ? "text-yellow-400 fill-current"
                : i === fullStars && hasHalfStar
                ? "text-yellow-400 fill-current opacity-50"
                : "text-gray-300"
            }`}
          />
        ))}
        <span className="text-sm text-gray-600 ml-1">({rating})</span>
      </div>
    );
  };

  const discountPercentage = product.discountRate || 0;
  const productName: string = isArabic ? product.name?.ar : product.name?.en;
  const isAvailable = product.isAvailable && product.availableCount > 0;

  return (
    <div className="group bg-white-50 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-gray-200 transition-all duration-300 overflow-hidden">
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <Image
          src={product.mainImage}
          alt={productName}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          fill
        />
        {discountPercentage > 0 && (
          <div className="absolute top-3 left-3 bg-red-500 text-white-50 px-2 py-1 rounded-full text-xs font-semibold">
            -{discountPercentage}%
          </div>
        )}
        {!isAvailable && (
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <span className="text-white-50 font-semibold text-lg">
              {t("general.items.states.outOfStock")}
            </span>
          </div>
        )}
        <button
          onClick={handleWishListedItemState}
          className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-200 ${
            isWishlisted
              ? "bg-primary-100 text-primary-500 scale-110"
              : "bg-white-50/80 text-primary-600 hover:bg-white-50 hover:scale-105"
          }`}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          {isWishlisting ? (
            <Loader2 className="w-4 h-4 animate-spin text-primary-500" />
          ) : (
            <Heart
              className={`w-4 h-4 ${isWishlisted ? "fill-current" : ""}`}
            />
          )}
        </button>
      </div>

      <div className="p-4 space-y-3">
        <h3 className="font-semibold text-gray-900 text-sm leading-tight line-clamp-2 group-hover:text-primary-600 transition-colors">
          {productName}
        </h3>

        {renderStars(product.ratings || 0)}

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-lg text-gray-900">
              {product.price} {product.currency}
            </span>
          </div>
        </div>

        {product.availableCount > 0 && product.availableCount <= 10 && (
          <p className="text-xs text-orange-600 font-medium">
            {t("general.items.states.stockItemsCount", {
              count: product.availableCount,
            })}
          </p>
        )}

        <button
          onClick={handleAddToCart}
          disabled={!isAvailable || isWishlisting}
          className={`w-full py-2.5 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2 ${
            isAvailable
              ? "bg-primary-600 text-white-50 hover:bg-primary-700"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>
            {isAvailable
              ? t("general.cart.addToCart")
              : t("general.items.states.outOfStock")}
          </span>
        </button>
      </div>
    </div>
  );
};

export default memo(RecProductCard);
