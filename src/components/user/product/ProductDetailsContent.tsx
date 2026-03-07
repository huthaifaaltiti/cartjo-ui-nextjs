"use client";

import { memo, useCallback, useState } from "react";
import { usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { useTranslations } from "next-intl";
import { Product } from "@/types/product.type";
import { Category } from "@/types/category.type";
import { DataResponse } from "@/types/service-response.type";
import { Cart } from "@/types/cart.type";
import { AppDispatch, RootState } from "@/redux/store";
import { addItemToServer } from "@/redux/slices/cart/actions";
import {
  addWishlistItem,
  removeWishlistItem,
} from "@/redux/slices/wishlist/actions";
import { useActiveCategoriesQuery } from "@/hooks/react-query/useCategoriesQuery";
import { useAuthContext } from "@/hooks/useAuthContext";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import {
  showErrorToast,
  showSuccessToast,
  showWarningToast,
} from "@/components/shared/CustomToast";
import ProductBreadcrumb from "./product-details/ProductBreadcrumb";
import ProductImageGallery from "./product-details/ProductImageGallery";
import ProductInfoSection from "./product-details/ProductInfoSection";

const ProductDetailsContent = ({ product }: { product: Product }) => {
  const t = useTranslations("");
  const dispatch = useDispatch<AppDispatch>();
  const { requireAuth } = useRequireAuth();
  const { accessToken: token } = useAuthContext();

  const pathname = usePathname();
  const pathnameSections = pathname.split("/").slice(2);

  const { data: categoriesResult } = useActiveCategoriesQuery();
  const { categories } = useSelector((s: RootState) => s.category);
  const { locale, isArabic } = useSelector((s: RootState) => s.general);

  const allCategories: Category[] =
    categories?.length > 0 ? categories : (categoriesResult?.data ?? []);

  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(product.isWishListed);
  const [isWishlisting, setIsWishlisting] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [isAddToCartLoading, setIsAddToCartLoading] = useState(false);

  const variant = product.variants[selectedVariantIdx];

  const handleAddToCart = useCallback(async (): Promise<
    DataResponse<Cart> | undefined
  > => {
    if (!requireAuth()) return;

    if (!variant?.variantId) {
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
        addItemToServer({
          productId: product._id,
          variantId: variant.variantId,
          quantity,
          lang: locale,
          token,
        }),
      ).unwrap();

      if (response.isSuccess) {
        showSuccessToast({
          title: t("general.toast.title.success"),
          description: response.message,
          dismissText: t("general.toast.dismissText"),
        });

        setAddedToCart(true);
      }

      return response;
    } catch (error) {
      showErrorToast({
        title: t("general.toast.title.error"),
        description: (error as Error)?.message || "Failed to add item to cart.",
        dismissText: t("general.toast.dismissText"),
      });
    } finally {
      setIsAddToCartLoading(false);
    }
  }, [requireAuth, variant, quantity, locale, token, dispatch, t, product]);

  const handleToggleWishlist = async () => {
    if (!requireAuth()) return;

    try {
      setIsWishlisting(true);

      let response;

      if (isWishlisted) {
        response = await dispatch(
          removeWishlistItem({
            productId: product._id,
            lang: locale,
            token,
          }),
        ).unwrap();
      } else {
        response = await dispatch(
          addWishlistItem({
            product,
            lang: locale,
            token,
          }),
        ).unwrap();
      }

      if (response.isSuccess) {
        setIsWishlisted(!isWishlisted);
        showSuccessToast({
          title: t("general.toast.title.success"),
          description: response.message,
          dismissText: t("general.toast.dismissText"),
        });
      }
    } finally {
      setIsWishlisting(false);
    }
  };

  return (
    <div className="w-full mx-auto px-4 py-8">
      {allCategories.length > 0 && product && (
        <ProductBreadcrumb
          product={product}
          pathnameSections={pathnameSections}
          locale={locale}
          categories={allCategories}
          isArabic={isArabic}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <ProductImageGallery
          product={product}
          variant={variant}
          isWishlisted={isWishlisted}
          isWishlisting={isWishlisting}
          onToggleWishlist={handleToggleWishlist}
        />

        <ProductInfoSection
          isArabic={isArabic}
          product={product}
          variant={variant}
          selectedVariantIdx={selectedVariantIdx}
          onVariantChange={setSelectedVariantIdx}
          quantity={quantity}
          setQuantity={setQuantity}
          onAddToCart={handleAddToCart}
          isAddToCartLoading={isAddToCartLoading}
          addedToCart={addedToCart}
        />
      </div>
    </div>
  );
};

export default memo(ProductDetailsContent);
