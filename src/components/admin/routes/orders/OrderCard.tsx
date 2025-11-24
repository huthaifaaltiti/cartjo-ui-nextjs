import { memo } from "react";
import { useLocale, useTranslations } from "next-intl";
import { isArabicLocale } from "@/config/locales.config";
import { Order } from "@/types/order.type";
import OrderCardActions from "./OrderCardActions";

type OrderCardProps = {
  item: Order;
  queryKey: string;
};

const OrderCard = ({ item, queryKey }: OrderCardProps) => {
  const t = useTranslations();
  const locale = useLocale();
  const isArabic = isArabicLocale(locale);

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const totalItems = item.items.reduce(
    (sum, product) => sum + product.quantity,
    0
  );

  return (
    <div className="relative rounded-lg border bg-card p-4 shadow-sm transition-shadow hover:shadow-md">
      {/* Status Badges */}
      <div className="mb-3 flex flex-wrap gap-2">
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${getPaymentStatusColor(
            item.paymentStatus
          )}`}
        >
          {t(
            `routes.dashboard.routes.orders.components.OrderCard.status.${item.paymentStatus}`
          )}
        </span>
        {item.isDeleted && (
          <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-800">
            {t("general.items.states.deleted")}
          </span>
        )}
      </div>

      {/* Order Info */}
      <div className="space-y-3">
        {/* Transaction ID */}
        <div>
          <p className="text-sm font-semibold text-gray-900">
            {t(
              "routes.dashboard.routes.orders.components.OrderCard.transactionId"
            )}
            : {item.transactionId}
          </p>
          {item.merchantReference && (
            <p className="text-xs text-gray-600">
              {t(
                "routes.dashboard.routes.orders.components.OrderCard.reference"
              )}
              : {item.merchantReference}
            </p>
          )}
        </div>

        {/* Amount & Payment Method */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-lg font-bold text-gray-900">
              {item.amount} {item.currency}
            </p>
            <p className="text-xs text-gray-600">
              {t(
                "routes.dashboard.routes.orders.components.OrderCard.paymentMethod"
              )}
              : {item.paymentMethod}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">
              {totalItems}{" "}
              {t("routes.dashboard.routes.orders.components.OrderCard.items")}
            </p>
          </div>
        </div>

        {/* Customer Info */}
        <div className="border-t pt-3">
          <p className="text-sm font-medium text-gray-900">
            {item.shippingAddress.fullName}
          </p>
          <p className="text-xs text-gray-600">{item.shippingAddress.phone}</p>
          <p className="text-xs text-gray-600">{item.email}</p>
        </div>

        {/* Shipping Address */}
        <div className="rounded-md bg-gray-50 p-3">
          <p className="mb-1 text-xs font-semibold text-gray-700">
            {t(
              "routes.dashboard.routes.orders.components.OrderCard.shippingAddress"
            )}
            :
          </p>
          <p className="text-xs text-gray-600">
            {item.shippingAddress.street}, {item.shippingAddress.building}
          </p>
          <p className="text-xs text-gray-600">
            {item.shippingAddress.town}, {item.shippingAddress.city}
          </p>
          <p className="text-xs text-gray-600">
            {item.shippingAddress.country}
          </p>
          {item.shippingAddress.additionalInfo && (
            <p className="mt-1 text-xs italic text-gray-500">
              {item.shippingAddress.additionalInfo}
            </p>
          )}
        </div>

        {/* Order Items */}
        <div className="border-t pt-3">
          <p className="mb-2 text-xs font-semibold text-gray-700">
            {t(
              "routes.dashboard.routes.orders.components.OrderCard.orderItems"
            )}
            :
          </p>
          <div className="space-y-2 h-48 overflow-y-scroll">
            {item.items.map((product, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded bg-gray-50 p-2"
              >
                <div className="flex-1">
                  <p className="text-xs font-medium text-gray-900">
                    {isArabic ? product?.name?.ar : product?.name?.en}
                  </p>
                  <p className="text-xs text-gray-600">
                    {product?.quantity} × {product?.price} {item?.currency}
                  </p>
                </div>
                <p className="text-xs font-semibold text-gray-900">
                  {product?.quantity * product?.price} {item?.currency}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Dates */}
        <div className="border-t pt-3 text-xs text-gray-600">
          <p>
            {t("general.others.created")}:{" "}
            {new Date(item.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
          {item.updatedAt && item.isUpdated && (
            <p className="mt-1">
              {t("general.others.updated")}:{" "}
              {new Date(item.updatedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          )}
        </div>
      </div>

      <OrderCardActions cardItem={item} />
    </div>
  );
};

export default memo(OrderCard);
