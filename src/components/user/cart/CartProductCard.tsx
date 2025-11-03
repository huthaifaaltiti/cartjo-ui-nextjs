"use client";

import { memo, useState } from "react";
import { useTranslations } from "next-intl";
import { Star, Plus, Minus, Trash } from "lucide-react";
import { useAuthContext } from "@/hooks/useAuthContext";
import ImageWithFallback from "@/components/shared/ImageWithFallback";
import {
  showErrorToast,
  showSuccessToast,
  showWarningToast,
} from "@/components/shared/CustomToast";
import { CartItem } from "@/types/cartItem.type";
import LoadingProductButton from "@/components/shared/loaders/LoadingProduct";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import {
  addItemToServer,
  removeItemFromServer,
} from "@/redux/slices/cart/actions";
import CounterDown from "@/components/shared/CounterDown";
import { DEFAULT_FALLBACK_IMAGE } from "@/config/media.config";

const CartProductCard = ({ item: product }: { item: CartItem }) => {
  const t = useTranslations();
  const dispatch = useDispatch<AppDispatch>();
  const { isArabic, locale } = useSelector((state: RootState) => state.general);

  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [quantity, setQuantity] = useState(product?.quantity ?? 1);
  const [showCounter, setShowCounter] = useState(false);

  const { accessToken } = useAuthContext();

  const discountedPrice = product?.discountRate
    ? product.price! - (product.discountRate / 100) * product.price!
    : product.price;

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(price);

  const handleRemoveFromCart = async (quantityMount?: number) => {
    if (!accessToken) {
      showWarningToast({
        title: t("general.toast.title.warning"),
        description: t("general.toast.description.loginRequired"),
        dismissText: t("general.toast.dismissText"),
      });

      setShowCounter(true)

      return;
    }

    try {
      setIsLoading(true);
      const response = await dispatch(
        removeItemFromServer({
          productId: product?._id!,
          quantity: quantityMount || quantity,
          lang: locale,
          token: accessToken,
        })
      ).unwrap();

      if (response.isSuccess) {
        showSuccessToast({
          title: t("general.toast.title.success"),
          description: t(
            "routes.cart.components.CartProductCard.removedFromCartLabel"
          ),
          dismissText: t("general.toast.dismissText"),
        });

        setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
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
  };

  const handleAddToCart = async (quantityMount?: number) => {
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
        addItemToServer({
          productId: product?._id!,
          quantity: quantityMount || quantity,
          lang: locale,
          token: accessToken,
        })
      ).unwrap();

      if (response.isSuccess) {
        showSuccessToast({
          title: t("general.toast.title.success"),
          description: t(
            "routes.cart.components.CartProductCard.removedFromCartLabel"
          ),
          dismissText: t("general.toast.dismissText"),
        });

        setQuantity((prev) => prev + 1);
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
  };

  const handleQuantityChange = async (type: "increment" | "decrement") => {
    if (type === "decrement") {
      if (quantity <= 1) return;

      await handleRemoveFromCart(1);
    } else if (type === "increment") {
      await handleAddToCart(1);
    }
  };

  return (
    <div
      className={`w-full group relative overflow-hidden bg-white-50 rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-500 ease-out transform hover:-translate-y-2 ${
        isHovered ? "scale-[1.02]" : "scale-100"
      } border border-gray-100 hover:border-gray-200 ${
        isLoading ? "pointer-events-none" : ""
      }`}
      style={{
        background: "linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Discount Badge */}
      {product?.discountRate! > 0 && (
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
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white-50/30 to-transparent -translate-x-full animate-[shimmer_3s_infinite] z-10"></div>

          <ImageWithFallback
            src={product?.mainImage || DEFAULT_FALLBACK_IMAGE}
            alt={isArabic ? product?.name?.ar : product?.name?.en}
            className={`object-contain transition-all duration-700 ${
              isHovered ? "scale-110 filter brightness-105" : "scale-100"
            } ${isLoading ? "scale-110 blur-[1px]" : ""}`}
            style={{
              filter:
                isHovered && !isLoading
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
            isHovered && !isLoading ? "text-primary-600" : "text-gray-900"
          } ${isLoading ? "opacity-70" : ""}`}
        >
          {isArabic ? product?.name?.ar : product?.name?.en}
        </h3>

        {/* Rating Section */}
        <div
          className={`flex items-center gap-2 transition-all duration-300 ${
            isLoading ? "opacity-70" : ""
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
                  !isLoading
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
            isLoading ? "opacity-70" : ""
          }`}
        >
          {product?.discountRate! > 0 ? (
            <div className="flex items-center gap-3">
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-green-600 drop-shadow-sm">
                  {product?.currency}
                  {formatPrice(discountedPrice!)}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-lg text-gray-400 line-through font-medium">
                  {product?.currency}
                  {formatPrice(product?.price!)}
                </span>
                <span className="text-sm font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full animate-pulse">
                  Save {product?.currency}
                  {formatPrice(product?.price! - discountedPrice!)}
                </span>
              </div>
            </div>
          ) : (
            <div className="text-2xl font-bold text-gray-900">
              {product?.currency}
              {formatPrice(product?.price!)}
            </div>
          )}
        </div>

        {/* Quantity Changer */}
        <div className="flex items-center justify-start gap-3 mt-2">
          <button
            onClick={() => handleQuantityChange("decrement")}
            className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full hover:bg-gray-200"
          >
            <Minus className="w-4 h-4 text-gray-700" />
          </button>
          <span className="text-lg font-medium">{quantity}</span>
          <button
            onClick={() => handleQuantityChange("increment")}
            className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full hover:bg-gray-200"
          >
            <Plus className="w-4 h-4 text-gray-700" />
          </button>
        </div>

        {showCounter && (
          <CounterDown
            startCounting={showCounter}
            countDownAmount={5}
            withRelocation={false}
            withDirMessage={false}
            dirMessage={""}
            relocationPath="/auth?redirectTo=/cart&resend=false"
            size="md"
            color="purple"
            align="center"
          />
        )}

        {!showCounter && (
          <div>
            <button
              onClick={() => handleRemoveFromCart()}
              disabled={isLoading}
              className={`w-full h-14 group/btn relative overflow-hidden font-semibold py-3.5 px-3 rounded-xl transition-all duration-300 transform shadow-lg flex items-center justify-center gap-3 disabled:cursor-not-allowed ${
                isLoading
                  ? "bg-primary-400 text-white-50 scale-105 shadow-2xl"
                  : "bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white-50 hover:scale-105 active:scale-95 hover:shadow-xl"
              }`}
            >
              <div
                className={`p-1.5 rounded-lg transition-all duration-300 ${
                  isLoading
                    ? "bg-white-50/30"
                    : "bg-white-50/20 group-hover/btn:bg-white-50/30 group-hover/btn:scale-110"
                }`}
              >
                {isLoading ? (
                  <LoadingProductButton color="#fff" />
                ) : (
                  <Trash className="w-5 h-5" />
                )}
              </div>

              <span className="text-sm font-bold tracking-wide">
                {isLoading
                  ? t(
                      "routes.cart.components.CartProductCard.removingFromCartLabel"
                    )
                  : t(
                      "routes.cart.components.CartProductCard.removeFromCartLabel"
                    )}
              </span>
            </button>
          </div>
        )}
      </div>

      {isLoading && (
        <div className="absolute inset-0 z-10 rounded-2xl bg-gradient-to-br from-primary-50/20 to-blue-50/20 animate-pulse pointer-events-none"></div>
      )}
    </div>
  );
};

export default memo(CartProductCard);
