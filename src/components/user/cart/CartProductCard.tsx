"use client";

import { memo, useCallback, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { useAuthContext } from "@/hooks/useAuthContext";
import {
  showErrorToast,
  showSuccessToast,
  showWarningToast,
} from "@/components/shared/CustomToast";
import {
  addItemToServer,
  removeItemFromServer,
} from "@/redux/slices/cart/actions";
import { useRouter } from "next/navigation";
import CardWrapper from "@/components/shared/card/CardWrapper";
import ProductImage from "@/components/shared/card/ProductImage";
import ProductTitle from "@/components/shared/card/ProductTitle";
import ProductPrice from "@/components/shared/card/ProductPrice";
import QuantityChanger from "@/components/shared/card/QuantityChanger";
import { CartItem } from "@/types/cartItem.type";
import LoadingOverlay from "@/components/shared/card/LoadingOverlay";
import RemoveItemFromCartBtn from "./RemoveItemFromCartBtn";
import ItemRatingStats from "@/components/shared/card/ItemRatingStats";
import { extractVariantDetails } from "@/utils/productVariant.utils";

const CartProductCard = ({
  item,
  isArabic,
}: {
  item: CartItem;
  isArabic: boolean;
}) => {
  const title = isArabic ? item?.name?.ar : item?.name?.en;
  const variantDetails = item?.variant
    ? extractVariantDetails(item.variant)
    : null;

  const t = useTranslations();
  const locale = useLocale();
  const { accessToken } = useAuthContext();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isAddToCartLoading, setIsAddToCartLoading] = useState<boolean>(false);
  const [quantity, setQuantity] = useState<number>(item?.quantity ?? 1);
  const [showCounter, setShowCounter] = useState<boolean>(false);

  const formatPrice = useCallback(
    (price: number) => {
      return new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }).format(price);
    },
    [item, isArabic],
  );

  const handleGoToProductPage = useCallback(() => {
    let categorySlug, subCategorySlug;
    const productSlug = item.slug;

    if (item?.category?._id) {
      categorySlug = item?.category?.slug;
    }

    if (item.subCategory?._id) {
      subCategorySlug = item?.subCategory?.slug;
    }

    router.push(
      `/${categorySlug}/${subCategorySlug}/${productSlug}?p_id=${item.productId}`,
    );
  }, [item, isArabic]);

  const handleRemoveFromCart = useCallback(
    async (quantityMount?: number) => {
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
          removeItemFromServer({
            productId: item?.productId,
            variantId: item?.variant?.variantId,
            quantity: quantityMount ?? quantity,
            lang: locale,
            token: accessToken,
          }),
        ).unwrap();

        if (response.isSuccess) {
          showSuccessToast({
            title: t("general.toast.title.success"),
            description:
              response?.message ??
              t("routes.cart.components.CartProductCard.removedFromCartLabel"),
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
        setIsAddToCartLoading(false);
      }
    },
    [item, isArabic],
  );

  const handleAddToCart = useCallback(
    async (quantityMount?: number) => {
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
            productId: item?.productId,
            variantId: item?.variant?.variantId,
            quantity: quantityMount || quantity,
            lang: locale,
            token: accessToken,
          }),
        ).unwrap();

        if (response.isSuccess) {
          showSuccessToast({
            title: t("general.toast.title.success"),
            description:
              response?.message ??
              t("routes.cart.components.CartProductCard.removedFromCartLabel"),
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
        setIsAddToCartLoading(false);
      }
    },
    [item, isArabic],
  );

  const handleQuantityChange = useCallback(
    async (type: "increment" | "decrement") => {
      if (type === "decrement") {
        await handleRemoveFromCart(1);
      } else if (type === "increment") {
        await handleAddToCart(1);
      }
    },
    [isArabic, item],
  );

  return (
    <CardWrapper isHovered={isHovered}>
      {isAddToCartLoading && <LoadingOverlay />}

      <div
        className="w-full h-[23vh] sm:h-[22vh] max-[500px]:h-[18vh] max-[400px]:h-[16vh] max-[350px]:h-[14vh]"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {item.variant && (
          <ProductImage
            src={item.variant?.mainImage?.url || item.mainImage?.url}
            alt={title}
            isHovered={isHovered}
            isLoading={isAddToCartLoading}
          />
        )}
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

        {/* Variant Specifications */}
        {variantDetails && (
          <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px] text-gray-600 mb-2 border-b border-gray-100 py-2">
            {variantDetails.sellingType && (
              <span className="px-2 py-0.5 rounded-md bg-gray-100 border">
                {variantDetails.sellingType}
              </span>
            )}

            {variantDetails.size && (
              <span className="px-2 py-0.5 rounded-md bg-gray-100 border">
                {variantDetails.size}
              </span>
            )}

            {variantDetails.colors.length > 0 && (
              <div className="flex items-center gap-1">
                {variantDetails.colors.map((color) => (
                  <span
                    key={color}
                    className="w-3 h-3 rounded-full border border-gray-300"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        <div className="space-y-3">
          <div className="w-full flex items-center justify-between gap-1">
            {item?.variant && (
              <ProductPrice
                item={item?.variant}
                formatPrice={formatPrice}
                isArabic={isArabic}
              />
            )}

            <ItemRatingStats
              ratingAverage={item?.variant?.ratingsAverage ?? 0}
              ratingCount={item?.variant?.ratingsCount ?? 0}
            />
          </div>

          <QuantityChanger
            quantity={quantity}
            isLoading={isAddToCartLoading}
            handleChange={handleQuantityChange}
          />

          <RemoveItemFromCartBtn
            showCounter={showCounter}
            isLoading={isAddToCartLoading}
            handleRemoveFromCart={handleRemoveFromCart}
          />
        </div>
      </div>
    </CardWrapper>
  );
};

export default memo(CartProductCard);
