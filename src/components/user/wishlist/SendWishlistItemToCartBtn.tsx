"use client";

import { memo } from "react";
import { useTranslations } from "next-intl";
import { ShoppingCart } from "lucide-react";
import LoadingProductButton from "@/components/shared/loaders/LoadingProduct";

const SendWishlistItemToCartBtn = ({
  handleOnClick,
  isLoading,
}: {
  handleOnClick: () => void;
  isLoading: boolean;
}) => {
  const t = useTranslations();

  return (
    <button
      onClick={handleOnClick}
      disabled={isLoading}
      className={`w-full h-auto group/btn relative overflow-hidden font-semibold py-2 px-1 rounded-xl transition-all duration-300 transform shadow-lg flex items-center justify-center gap-3 disabled:cursor-not-allowed ${
        isLoading
          ? "bg-primary-400 text-white-50 scale-105 shadow-2xl"
          : "bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white-50 hover:scale-105 active:scale-95 hover:shadow-xl"
      }`}
    >
      {isLoading ? (
        <LoadingProductButton color="#fff" />
      ) : (
        <ShoppingCart className="w-5 h-5" />
      )}

      <span className="text-md font-bold tracking-wide capitalize">
        {isLoading ? t("general.cart.adding") : t("general.cart.addToCart")}
      </span>
    </button>
  );
};

export default memo(SendWishlistItemToCartBtn);
