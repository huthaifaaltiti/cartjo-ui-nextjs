"use client";

import { memo, useCallback, useState } from "react";
import { Heart, ShoppingCart, Star, Loader2 } from "lucide-react";
import ImageWithFallback from "@/components/shared/ImageWithFallback";
import { Product } from "@/types/product.type";
import { useLocale, useTranslations } from "next-intl";
import {
  showErrorToast,
  showSuccessToast,
  showWarningToast,
} from "@/components/shared/CustomToast";
import { useAuthContext } from "@/hooks/useAuthContext";
import { useLoggedUserWishlist } from "@/contexts/LoggedUserWishList.context";
import { DataResponse } from "@/types/service-response.type";
import { Cart } from "@/types/cart.type";
import { addItemToServer } from "@/redux/slices/cart/actions";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";

const ShowcaseProductRowCard = ({
  item,
  isArabic = false,
}: {
  item: Product;
  isArabic: boolean;
}) => {
    const dispatch = useDispatch<AppDispatch>();

  const locale = useLocale();
  const t = useTranslations();

  const [isWishListed, setIsWishListed] = useState(item?.isWishListed || false);
  const [isHovered, setIsHovered] = useState(false);
  const [isWishListLoading, setIsWishListLoading] = useState(false);
  const [isAddToCartLoading, setIsAddToCartLoading] = useState(false);
    const [showCounter, setShowCounter] = useState(false);

  const { accessToken } = useAuthContext();

  const { addItem, removeItem } = useLoggedUserWishlist();

  const discountedPrice = item?.discountRate
    ? item.price - (item.discountRate / 100) * item.price
    : item.price;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(price);
  };

  const handleAddWishListItem = useCallback(async () => {
    setIsWishListLoading(true);
     console.log('ShowcaseProductRowCard item', item)

    try {
      const resp = await addItem(accessToken, locale, item?._id);

      if (resp.isSuccess) {
        showSuccessToast({
          title: t("general.toast.title.success"),
          description: resp.message,
          dismissText: t("general.toast.dismissText"),
        });

        setIsWishListed(true);
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
      setIsWishListLoading(false);
    }
  }, [locale, accessToken, item._id, t, addItem]);

  const handleRemoveWishListItem = useCallback(async () => {
    setIsWishListLoading(true);

    try {
      const resp = await removeItem(accessToken, locale, item?._id);

      if (resp.isSuccess) {
        showSuccessToast({
          title: t("general.toast.title.success"),
          description: resp.message,
          dismissText: t("general.toast.dismissText"),
        });

        setIsWishListed(false);
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
      setIsWishListLoading(false);
    }
  }, [locale, accessToken, item._id, t, removeItem]);

  const handleWishListedItemState = () =>
    isWishListed ? handleRemoveWishListItem() : handleAddWishListItem();

  const handleAddToCart = async (): Promise<DataResponse<Cart> | undefined> => {
    if (!accessToken) {
      showWarningToast({
        title: t("general.toast.title.warning"),
        description: t("general.toast.description.loginRequired"),
        dismissText: t("general.toast.dismissText"),
      });

      setShowCounter(true);

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

  return (
    <div
      className={`w-full h-full group relative overflow-hidden bg-white-50 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 ease-out transform hover:-translate-y-1 ${
        isHovered ? "scale-[1.01]" : "scale-100"
      } border border-gray-100 hover:border-gray-200 flex items-stretch min-h-[180px] ${
        isWishListLoading || isAddToCartLoading ? "pointer-events-none" : ""
      }`}
      style={{
        background: "linear-gradient(145deg, #ffffff 0%, #f9fafb 100%)",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Loading Overlay */}
      {(isWishListLoading || isAddToCartLoading) && (
        <div className="absolute inset-0 bg-white-50/60 backdrop-blur-[1px] z-50 flex items-center justify-center">
          <div className="bg-white-50 rounded-full p-3 shadow-lg">
            <Loader2 className="w-6 h-6 text-primary-500 animate-spin" />
          </div>
        </div>
      )}

      {/* WishList Button */}
      <button
        onClick={handleWishListedItemState}
        disabled={isWishListLoading || isAddToCartLoading}
        className={`absolute top-2 right-2 z-10 p-2 rounded-full backdrop-blur-sm transition-all duration-300 ${
          isWishListed
            ? "bg-primary-50 shadow-md transform scale-105"
            : "bg-white-50/80 hover:bg-white-50 shadow-sm hover:shadow-md"
        } hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 group/wishList`}
      >
        {isWishListLoading ? (
          <Loader2 className="w-5 h-5 text-primary-500 animate-spin" />
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
      {item?.discountRate > 0 && (
        <div className="absolute top-2 left-2 z-10">
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white-50 px-2.5 py-1 rounded-full text-xs font-bold shadow-lg animate-pulse">
            -{item.discountRate}%
          </div>
        </div>
      )}

      {/* Left Image Section */}
      <div className="w-2/5 flex-shrink-0 p-3">
        <div className="w-full h-full rounded-lg overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 relative">
          {/* Image Loading Shimmer Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white-50/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite] z-10"></div>

          <ImageWithFallback
            src={item?.mainImage}
            alt={isArabic ? item?.name?.ar : item?.name?.en}
            className={`w-full h-full object-contain transition-all duration-500 ${
              isHovered ? "scale-105" : "scale-100"
            } ${
              isWishListLoading || isAddToCartLoading
                ? "scale-105 blur-[1px]"
                : ""
            }`}
            style={{
              filter:
                isHovered && !(isWishListLoading || isAddToCartLoading)
                  ? "drop-shadow(0 10px 20px rgba(0,0,0,0.1))"
                  : "none",
            }}
          />
        </div>
      </div>

      {/* Right Content Section */}
      <div className="flex-1 p-3 pr-4 flex flex-col justify-between min-w-0">
        {/* Product Title */}
        <div className="space-y-2">
          <h3
            className={`font-semibold text-gray-900 text-md leading-tight line-clamp-2 transition-all duration-300 ${
              isHovered ? "text-primary-600" : "text-gray-900"
            } ${isWishListLoading || isAddToCartLoading ? "opacity-70" : ""}`}
          >
            {isArabic ? item?.name?.ar : item?.name?.en}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }, (_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 transition-all duration-300 ${
                    i < Math.floor(item?.ratings || 0)
                      ? "text-yellow-400 fill-yellow-400 drop-shadow-sm"
                      : "text-gray-200 fill-gray-200"
                  } ${
                    isHovered && i < Math.floor(item?.ratings || 0)
                      ? "scale-110"
                      : ""
                  }`}
                />
              ))}
            </div>
            <span className="text-xs font-medium text-gray-600">
              ({item?.ratings || 0})
            </span>
          </div>
        </div>

        {/* Price and Action */}
        <div className="space-y-3">
          {/* Price */}
          <div
            className={`transition-all duration-300 ${
              isWishListLoading || isAddToCartLoading ? "opacity-70" : ""
            }`}
          >
            {item?.discountRate > 0 ? (
              <div className="flex flex-col gap-1">
                <span className="text-lg font-bold text-green-600 drop-shadow-sm">
                  {item?.currency}
                  {formatPrice(discountedPrice)}
                </span>
                <span className="text-sm text-gray-400 line-through">
                  {item?.currency}
                  {formatPrice(item?.price)}
                </span>
              </div>
            ) : (
              <div className="text-xl font-bold text-gray-900">
                {item?.currency}
                {formatPrice(item?.price)}
              </div>
            )}
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={isWishListLoading || isAddToCartLoading}
            className={`w-full h-10 group/btn relative overflow-hidden font-medium py-2 px-4 rounded-lg transition-all duration-300 transform shadow-sm flex items-center justify-center gap-2 text-sm disabled:cursor-not-allowed ${
              isAddToCartLoading
                ? "bg-primary-400 text-white-50 scale-105 shadow-md"
                : "bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white-50 hover:scale-105 active:scale-95 hover:shadow-md"
            }`}
          >
            {/* Button Loading Shimmer Effect */}
            {!isAddToCartLoading && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white-50/20 to-transparent -translate-x-full group-hover/btn:animate-[shimmer_1.5s_ease-in-out] group-hover/btn:translate-x-full"></div>
            )}

            {isAddToCartLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="font-semibold text-sm">ADDING...</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4 transition-transform group-hover/btn:scale-110" />
                <span className="font-semibold text-sm">ADD TO CART</span>
              </>
            )}
          </button>
        </div>
      </div>

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

export default memo(ShowcaseProductRowCard);
