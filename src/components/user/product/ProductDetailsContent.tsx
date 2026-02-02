"use client";

import { memo, useCallback, useState } from "react";
import { Minus, Plus, ShoppingCart, Star } from "lucide-react";
import { Product } from "@/types/product.type";
import { useLocale } from "next-intl";
import { isArabicLocale } from "@/config/locales.config";
import WishlistButton from "@/components/shared/card/WishlistButton";
import {
  showErrorToast,
  showSuccessToast,
  showWarningToast,
} from "@/components/shared/CustomToast";
import { useTranslations } from "use-intl";
import { useAuthContext } from "@/hooks/useAuthContext";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import {
  addWishlistItem,
  removeWishlistItem,
} from "@/redux/slices/wishlist/actions";
import { addItemToServer } from "@/redux/slices/cart/actions";
import { DataResponse } from "@/types/service-response.type";
import { Cart } from "@/types/cart.type";
import Image from "next/image";
import { Currency } from "@/constants/currency.constant";

interface Props {
  product: Product;
}

const ProductDetailsContent = ({ product }: Props) => {
  const t = useTranslations();
  const locale = useLocale();
  const isArabic = isArabicLocale(locale);

  const dispatch = useDispatch<AppDispatch>();
  const { accessToken } = useAuthContext();

  const title = isArabic ? product.name.ar : product.name.en;
  const description = isArabic
    ? product.description.ar
    : product.description.en;
  const productCurrency = isArabic
    ? Currency[product.currency].labelAr
    : Currency[product.currency].labelEn;

  // STATES
  const [isWishListing, setIsWishListing] = useState(false);
  const [isWishListed, setIsWishListed] = useState(product.isWishListed);
  const [isAddToCartLoading, setIsAddToCartLoading] = useState(false);

  const [selectedImage, setSelectedImage] = useState(product.mainImage);
  const [quantity, setQuantity] = useState(1);

  // ⭐ Rating Stars
  const renderStars = (rating: number) =>
    [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 sm:w-5 sm:h-5 ${
          i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));

  // 📌 Quantity Change
  const handleQuantityChange = (action: string) => {
    if (action === "increase" && quantity < product.availableCount) {
      setQuantity(quantity + 1);
    } else if (action === "decrease" && quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  // 💰 Discounted Price
  const discountedPrice =
    product.discountRate > 0
      ? product.price * (1 - product.discountRate / 100)
      : product.price;

  // ❤️ Remove from wishlist
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
          productId: product._id,
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
      setIsWishListing(false);
    }
  }, [locale, accessToken, product._id, t]);

  // ❤️ Add to wishlist
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
          product,
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
        description: (error as Error)?.message || "Failed to add item.",
        dismissText: t("general.toast.dismissText"),
      });
    } finally {
      setIsWishListing(false);
    }
  }, [locale, accessToken, product._id, t, dispatch]);

  const handleWishListedItemState = () =>
    isWishListed ? handleRemoveWishListItem() : handleAddWishListItem();

  // 🛒 ADD TO CART FUNCTION
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
          productId: product._id!,
          quantity: quantity, // 👍 use selected quantity
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
        description: (error as Error)?.message || "Failed to add item.",
        dismissText: t("general.toast.dismissText"),
      });
    } finally {
      setIsAddToCartLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-6 sm:py-8 px-3">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12">
        {/* IMAGES */}
        <div className="space-y-4">
          <div className="h-[500px] w-full bg-gray-100 overflow-hidden rounded-xl relative group">
            <Image
              src={selectedImage}
              alt={product.name.en}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              width={800}
              height={800}
            />

            {product.discountRate > 0 && (
              <div className="absolute top-3 left-3 bg-red-500 text-white-50 px-3 py-1 rounded-full text-sm font-semibold">
                -{product.discountRate}%
              </div>
            )}

            <WishlistButton
              isWishListed={isWishListed}
              isLoading={isWishListing}
              onClick={handleWishListedItemState}
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2">
            {[product.mainImage, ...product.images].map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(image)}
                className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 bg-gray-100 ${
                  selectedImage === image
                    ? "border-blue-500"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <Image
                  src={image}
                  alt={title}
                  className="w-full h-full object-cover"
                  width={80}
                  height={80}
                />
              </button>
            ))}
          </div>
        </div>

        {/* PRODUCT INFO */}
        <div className="space-y-6">
          <h1 className="text-4xl font-bold">{title}</h1>

          <div className="flex items-center gap-2">
            <div className="flex">{renderStars(product.ratings)}</div>
            <span className="text-gray-600 text-sm">
              ({product.ratings}{" "}
              {t(
                `routes.product.components.ProductDetailsContent.${product.ratings > 1 ? "reviews" : "review"}`,
              )}
              )
            </span>
          </div>

          <div>
            <div className="flex items-center gap-3">
              <span className="text-4xl font-bold">
                {discountedPrice.toFixed(2)}
                <span className="text-sm"> {productCurrency}</span>
              </span>

              {product.discountRate > 0 && (
                <span className="text-2xl text-gray-500 line-through">
                  {product.price.toFixed(2)} {productCurrency}
                </span>
              )}
            </div>
            <p className="text-green-600 text-sm">
              ✓ {t("routes.product.components.ProductDetailsContent.inStock")} (
              {product.availableCount}{" "}
              {t("routes.product.components.ProductDetailsContent.available")})
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold">
              {t("routes.product.components.ProductDetailsContent.desc")}
            </h3>
            <p className="text-gray-700">{description}</p>
          </div>

          {/* QUANTITY + ADD TO CART */}
          <div className="flex items-center gap-4">
            {/* Quantity */}
            <div className="flex items-center border border-gray-300 rounded-lg">
              <button
                onClick={() => handleQuantityChange("decrease")}
                disabled={quantity <= 1}
                className="p-2 disabled:opacity-50"
              >
                <Minus />
              </button>
              <span className="px-4 py-2 font-medium">{quantity}</span>
              <button
                onClick={() => handleQuantityChange("increase")}
                disabled={quantity >= product.availableCount}
                className="p-2 disabled:opacity-50"
              >
                <Plus />
              </button>
            </div>

            {/* ADD TO CART BUTTON */}
            <button
              onClick={handleAddToCart}
              disabled={isAddToCartLoading}
              className="flex-1 bg-blue-600 text-white-50 px-6 py-3 rounded-lg flex items-center justify-center gap-2 font-semibold hover:bg-blue-700 disabled:opacity-50"
            >
              {isAddToCartLoading ? "..." : <ShoppingCart />}
              {t("general.cart.addToCart")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(ProductDetailsContent);
