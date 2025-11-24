import { memo } from "react";
import { isArabicLocale } from "@/config/locales.config";
import { useAuthContext } from "@/hooks/useAuthContext";
import { OrderItem } from "@/types/orderItem.type";
import { Order } from "@/types/order.type";

const OrderDetailedCardItem = ({
  product,
  selectedOrder,
}: {
  product: OrderItem;
  selectedOrder: Order;
}) => {
  const { locale } = useAuthContext();
  const isArabic = isArabicLocale(locale);

  return (
    <div className="flex items-center gap-4 rounded-lg border border-gray-200 bg-white-50 p-3 transition-shadow hover:shadow-md">
      {product.productId?.mainImage && (
        <img
          src={product.productId.mainImage}
          alt={isArabic ? product?.name?.ar : product?.name?.en}
          className="h-16 w-16 rounded-md object-cover"
        />
      )}
      <div className="flex-1">
        <p className="font-semibold text-gray-900">
          {isArabic ? product?.name?.ar : product?.name?.en}
        </p>
        <p className="text-sm text-gray-600">
          {product.quantity} × {product.price} {selectedOrder.currency}
        </p>
      </div>
      <p className="text-lg font-bold text-gray-900">
        {product.quantity * product.price} {selectedOrder.currency}
      </p>
    </div>
  );
};

export default memo(OrderDetailedCardItem);
