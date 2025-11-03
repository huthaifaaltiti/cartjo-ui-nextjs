"use client";

import { memo, useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { Product } from "@/types/product.type";
import { useAuthContext } from "@/hooks/useAuthContext";
import ImageWithFallback from "@/components/shared/ImageWithFallback";
import {
  showErrorToast,
  showSuccessToast,
  showWarningToast,
} from "@/components/shared/CustomToast";
import { isArabicLocale } from "@/config/locales.config";
import LoadingProductButton from "@/components/shared/loaders/LoadingProduct";
import {
  removeWishlistItem,
  sendWishlistItemToCart,
} from "@/redux/slices/wishlist/actions";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";

const WishlistProductCard = ({ item: product }: { item: Product }) => {
  const dispatch = useDispatch<AppDispatch>();
  const t = useTranslations();
  const locale = useLocale();
  const isArabic = isArabicLocale(locale);
  const { accessToken } = useAuthContext();

  const [isWishListed, setIsWishListed] = useState(
    product?.isWishListed || false
  );
  const [isHovered, setIsHovered] = useState(false);
  const [isWishListing, setIsWishListing] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAddToCartLoading, setIsAddToCartLoading] = useState(false);

  const discountedPrice = product?.discountRate
    ? product.price - (product.discountRate / 100) * product.price
    : product.price;

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

      return;
    }

    try {
      setIsLoading(true);
      const response = await dispatch(
        removeWishlistItem({
          productId: product?._id,
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
      }
    } catch (error) {
      showErrorToast({
        title: t("general.toast.title.error"),
        description: (error as Error)?.message || "Failed to remove item.",
        dismissText: t("general.toast.dismissText"),
      });
    } finally {
      setIsLoading(false);
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

    try {
      setIsAddToCartLoading(true);

      const response = await dispatch(
        sendWishlistItemToCart({
          productId: product?._id,
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

  return (
    <div
      className={`w-full group relative overflow-hidden bg-white-50 rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-500 ease-out transform hover:-translate-y-2 ${
        isHovered ? "scale-[1.02]" : "scale-100"
      } border border-gray-100 hover:border-gray-200 ${
        isAddToCartLoading || isWishListing ? "pointer-events-none" : ""
      }`}
      style={{
        background: "linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* WishList Button */}
      <button
        onClick={handleWishListedItemState}
        disabled={isWishListing}
        className={`absolute top-2 right-2 z-20 p-2 rounded-full backdrop-blur-sm transition-all duration-300 ${
          isWishListed
            ? "bg-primary-50 shadow-md transform scale-105"
            : "bg-white-50/80 hover:bg-white-50 shadow-sm hover:shadow-md"
        } hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 group/wishList`}
      >
        {isWishListing ? (
          <LoadingProductButton />
        ) : (
          <Heart
            className={`w-5 h-5 transition-all duration-300 ${
              isWishListed
                ? "text-primary-500 fill-primary-500 drop-shadow-sm"
                : "text-gray-600 hover:text-primary-500 group-hover/wishList:scale-110"
            }`}
          />
        )}
      </button>

      {/* Discount Badge */}
      {product?.discountRate > 0 && (
        <div className="absolute top-4 left-4 z-10">
          <div className="bg-gradient-to-r from-red-500 to-red-600 text-white-50 px-3 py-1.5 rounded-full text-sm font-bold shadow-lg">
            <div className="flex items-center gap-1">
              <span>-{product.discountRate}%</span>
              <div className="w-2 h-2 bg-white-50/60 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      )}

      {/* Product Image Container */}
      <div className="relative p-6 pb-4">
        <div className="aspect-square w-full rounded-xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 group-hover:shadow-inner transition-all duration-500 relative">
          {/* Image Loading Shimmer */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white-50/30 to-transparent -translate-x-full animate-[shimmer_3s_infinite] z-10"></div>

          <ImageWithFallback
            src={product?.mainImage}
            alt={isArabic ? product?.name?.ar : product?.name?.en}
            className={`object-contain transition-all duration-700 ${
              isHovered ? "scale-110 filter brightness-105" : "scale-100"
            } ${isAddToCartLoading ? "scale-110 blur-[1px]" : ""}`}
            style={{
              filter:
                isHovered && !isAddToCartLoading
                  ? "drop-shadow(0 10px 20px rgba(0,0,0,0.1))"
                  : "none",
            }}
          />
        </div>
      </div>

      {/* Content Section */}
      <div className="px-6 pb-6 space-y-4">
        {/* Product Title */}
        <h3
          className={`font-semibold text-gray-900 text-lg leading-tight line-clamp-2 transition-all duration-300 ${
            isHovered && !isAddToCartLoading
              ? "text-primary-600"
              : "text-gray-900"
          } ${isAddToCartLoading ? "opacity-70" : ""}`}
        >
          {isArabic ? product?.name?.ar : product?.name?.en}
        </h3>

        {/* Rating Section */}
        <div
          className={`flex items-center gap-2 transition-all duration-300 ${
            isAddToCartLoading ? "opacity-70" : ""
          }`}
        >
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }, (_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 transition-all duration-300 ${
                  i < Math.floor(product?.ratings || 0)
                    ? "text-yellow-400 fill-yellow-400 drop-shadow-sm"
                    : i < (product?.ratings || 0)
                    ? "text-yellow-400 fill-yellow-400 opacity-50"
                    : "text-gray-200 fill-gray-200"
                } ${
                  isHovered &&
                  i < Math.floor(product?.ratings || 0) &&
                  !isAddToCartLoading
                    ? "scale-110"
                    : ""
                }`}
              />
            ))}
          </div>
          <span className="text-sm font-medium text-gray-700">
            {product?.ratings || 0}
          </span>
        </div>

        {/* Price Section */}
        <div
          className={`space-y-1 transition-all duration-300 ${
            isAddToCartLoading ? "opacity-70" : ""
          }`}
        >
          {product?.discountRate > 0 ? (
            <div className="flex items-center gap-3">
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-green-600 drop-shadow-sm">
                  {product?.currency}
                  {formatPrice(discountedPrice)}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-lg text-gray-400 line-through font-medium">
                  {product?.currency}
                  {formatPrice(product?.price)}
                </span>
                <span className="text-sm font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full animate-pulse">
                  Save {product?.currency}
                  {formatPrice(product?.price - discountedPrice)}
                </span>
              </div>
            </div>
          ) : (
            <div className="text-2xl font-bold text-gray-900">
              {product?.currency}
              {formatPrice(product?.price)}
            </div>
          )}
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleSendWishListItemToCart}
          disabled={isAddToCartLoading}
          className={`w-full h-14 group/btn relative overflow-hidden font-semibold py-3.5 px-3 rounded-xl transition-all duration-300 transform shadow-lg flex items-center justify-center gap-3 disabled:cursor-not-allowed ${
            isAddToCartLoading
              ? "bg-primary-400 text-white-50 scale-105 shadow-2xl"
              : "bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white-50 hover:scale-105 active:scale-95 hover:shadow-xl"
          }`}
        >
          {/* Button Loading Shimmer Effect */}
          {!isAddToCartLoading && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white-50/25 to-transparent -translate-x-full group-hover/btn:animate-[shimmer_2s_ease-in-out] group-hover/btn:translate-x-full"></div>
          )}

          <div
            className={`p-1.5 rounded-lg transition-all duration-300 ${
              isAddToCartLoading
                ? "bg-white-50/30"
                : "bg-white-50/20 group-hover/btn:bg-white-50/30 group-hover/btn:scale-110"
            }`}
          >
            {isAddToCartLoading ? (
              <LoadingProductButton color="#fff" />
            ) : (
              <ShoppingCart className="w-5 h-5" />
            )}
          </div>

          <span className="text-sm font-bold tracking-wide">
            {isAddToCartLoading ? "ADDING TO CART..." : "ADD TO CART"}
          </span>
        </button>
      </div>

      {/* Hover Glow Effect */}
      {/* <div
        className={`absolute inset-0 rounded-2xl transition-all duration-500 pointer-events-none ${
          isHovered && !( isAddToCartLoading)
            ? "bg-gradient-to-br from-primary-50/20 via-transparent to-purple-50/10"
            : ""
        }`}
      /> */}

      {/* Loading Pulse Effect */}
      {isAddToCartLoading && (
        <div className="absolute inset-0 z-10 rounded-2xl bg-gradient-to-br from-primary-50/20 to-blue-50/20 animate-pulse pointer-events-none"></div>
      )}

      {/* Custom CSS for shimmer animation */}
      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
};

export default memo(WishlistProductCard);
