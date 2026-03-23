"use client";

import { memo } from "react";
import ImageWithFallback from "@/components/shared/ImageWithFallback";
import Variant from "@/components/shared/Variant";
import { currencyLabeler } from "@/utils/labelers";
import { useTranslations } from "next-intl";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Order } from "@/types/order.type";
import { OrderItem } from "@/types/orderItem.type";

interface OrderItemCardProps {
  item: OrderItem;
  order: Order;
  showVariant?: boolean;
}

const OrderItemCard = ({
  item,
  order,
  showVariant = true,
}: OrderItemCardProps) => {
  const t = useTranslations(
    "routes.user.layout.routes.orders.components.UserOrderDetailedCard",
  );
  const { isArabic, locale } = useSelector((state: RootState) => state.general);

  const imageSrc = item?.variant?.mainImage?.url ?? item?.mainImage?.url;

  return (
    <div className="flex gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
      <div className="w-24 h-24">
        {imageSrc && (
          <ImageWithFallback
            width={100}
            height={100}
            src={imageSrc}
            alt={item?.name?.[locale]}
            useFill={false}
            className="w-24 h-24 object-cover rounded-lg shadow-sm"
          />
        )}
      </div>
      <div className="flex-1 w-full">
        <h3 className="font-semibold text-gray-800 mb-1 first-letter-capital">
          {item.name[locale]}
        </h3>
        <p className="text-sm text-gray-600 mb-2 line-clamp-2 first-letter-capital">
          {item?.variant?.description?.[locale] || item?.description?.[locale]}
        </p>

        {showVariant && item.variant && <Variant variant={item.variant} />}

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">
            {t("qty")}:{" "}
            <span className="font-semibold text-gray-700">{item.quantity}</span>
          </span>
          <p className="text-lg font-bold text-blue-500">
            {item.price}{" "}
            <span className="text-xs">
              {currencyLabeler(order.currency, isArabic)}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default memo(OrderItemCard);
