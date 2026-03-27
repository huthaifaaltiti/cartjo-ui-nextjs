"use client";

import { memo, useEffect } from "react";
import { useTranslations } from "next-intl";
import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { getOrder } from "@/redux/slices/orders/actions";
import { useAuthContext } from "@/hooks/useAuthContext";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import {
  AlertCircle,
  Package,
  MapPin,
  CreditCard,
  User,
  Calendar,
  ShoppingBag,
  CircleDollarSign,
  Truck,
} from "lucide-react";
import NoOrderDetailedCardData from "./NoOrderDetailedCardData";
import { OrderItem } from "@/types/orderItem.type";
import StatusBadge from "@/components/shared/StatusBadge";
import { Statuses } from "@/enums/statuses.enum";
import OrderItemCard from "@/components/shared/OrderItemCard";
import OrderReceiptButton from "./OrderReceiptButton";

type Props = { orderId: string };

const OrderDetailedCard = ({ orderId }: Props) => {
  const t = useTranslations();
  const dispatch = useDispatch<AppDispatch>();
  const { selectedOrder, loading, error } = useSelector(
    (state: RootState) => state.orders,
  );
  const { accessToken, locale } = useAuthContext();

  useEffect(() => {
    if (!orderId) return;
    const getOrderDetails = async () => {
      await dispatch(
        getOrder({ id: orderId, lang: locale, token: accessToken }),
      );
    };
    getOrderDetails();
  }, [orderId, dispatch, locale, accessToken]);

  useEffect(() => {
    if (orderId) {
      document.body.style.overflow = "hidden";
      document.body.style.height = "100vh";
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.height = "";
    };
  }, [orderId]);

  const showLoader = loading;
  const showError = !!error;
  const showNoData = !selectedOrder;
  const showData = !!selectedOrder;

  const baseClassName =
    "flex min-h-[400px] w-full items-center justify-center rounded-lg bg-white-50 p-8";

  if (showLoader) {
    return (
      <div className={baseClassName}>
        <LoadingSpinner />
      </div>
    );
  }

  if (showError) {
    return (
      <div className={baseClassName}>
        <div className="text-center">
          <AlertCircle className="mx-auto h-16 w-16 text-red-500" />
          <h3 className="mt-4 text-lg font-semibold text-gray-900">
            {t("general.toast.title.error") || "Error"}
          </h3>
          <p className="mt-2 text-sm text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (showNoData) {
    return (
      <div className={baseClassName}>
        <NoOrderDetailedCardData />
      </div>
    );
  }

  if (showData) {
    const totalItems: number = selectedOrder.items.reduce(
      (sum: number, product: OrderItem) => sum + (product.quantity || 0),
      0,
    );

    return (
      <div className="w-full max-h-[80vh] overflow-y-auto rounded-lg bg-white-50">
        {/* Header */}
        <div className="sticky top-0 z-10 border-b bg-white-50 px-6 py-4 flex items-center justify-between gap-4">
          <h2 className="text-2xl font-bold text-gray-900">
            {t(
              "routes.dashboard.routes.orders.components.OrderDetailedCard.orderDetails",
            ) || "Order Details"}
          </h2>

          <OrderReceiptButton selectedOrder={selectedOrder} locale={locale} />
        </div>

        <div className="space-y-6 p-6">
          {/* Status & Transaction Info */}
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap gap-2">
                {/* Statuses */}
                <div className="flex items-center gap-1">
                  {/* Payment */}
                  <div
                    className={`flex items-center gap-1 px-4 py-2 rounded-full font-semibold`}
                  >
                    <CircleDollarSign className="h-5 w-5" />
                    <StatusBadge
                      status={selectedOrder.paymentStatus ?? Statuses.PENDING}
                      className={"border-none p-0"}
                    />
                  </div>

                  {/* Delivery */}
                  <div
                    className={`flex items-center gap-1 px-4 py-2 rounded-full font-semibold`}
                  >
                    <Truck className="h-5 w-5" />
                    <StatusBadge
                      status={selectedOrder.deliveryStatus ?? Statuses.PENDING}
                      className={"border-none p-0"}
                    />
                  </div>
                </div>

                {selectedOrder.isDeleted && (
                  <span className="rounded-full border border-red-300 bg-red-100 px-4 py-1.5 text-sm font-semibold text-red-800">
                    {t("general.items.states.deleted")}
                  </span>
                )}
              </div>

              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900">
                  {selectedOrder.amount} {selectedOrder.currency}
                </p>
                <p className="text-sm text-gray-600">
                  {totalItems}{" "}
                  {t(
                    "routes.dashboard.routes.orders.components.OrderDetailedCard.items",
                  )}
                </p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="flex items-start gap-2">
                <CreditCard className="mt-0.5 h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-xs font-medium text-gray-500">
                    {t(
                      "routes.dashboard.routes.orders.components.OrderDetailedCard.transactionId",
                    )}
                  </p>
                  <p className="text-sm font-semibold text-gray-900">
                    {selectedOrder.transactionId}
                  </p>
                </div>
              </div>

              {selectedOrder.merchantReference && (
                <div className="flex items-start gap-2">
                  <Package className="mt-0.5 h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-xs font-medium text-gray-500">
                      {t(
                        "routes.dashboard.routes.orders.components.OrderDetailedCard.reference",
                      )}
                    </p>
                    <p className="text-sm font-semibold text-gray-900">
                      {selectedOrder.merchantReference}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-2">
                <CreditCard className="mt-0.5 h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-xs font-medium text-gray-500">
                    {t(
                      "routes.dashboard.routes.orders.components.OrderDetailedCard.paymentMethod",
                    )}
                  </p>
                  <p className="text-sm font-semibold capitalize text-gray-900">
                    {selectedOrder.paymentMethod}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <div className="rounded-lg border border-gray-200 p-4">
            <div className="mb-3 flex items-center gap-2">
              <User className="h-5 w-5 text-gray-700" />
              <h3 className="text-lg font-semibold text-gray-900">
                {t(
                  "routes.dashboard.routes.orders.components.OrderDetailedCard.customerInfo",
                )}
              </h3>
            </div>
            <div className="space-y-2">
              <p className="text-sm">
                <span className="font-medium text-gray-700">
                  {t("general.info.name")}:
                </span>{" "}
                <span className="text-gray-900">
                  {selectedOrder.shippingAddress.fullName}
                </span>
              </p>
              <p className="text-sm">
                <span className="font-medium text-gray-700">
                  {t("general.info.email")}:
                </span>{" "}
                <span className="text-gray-900">{selectedOrder.email}</span>
              </p>
              <p className="text-sm">
                <span className="font-medium text-gray-700">
                  {t("general.info.phone")}:
                </span>{" "}
                <span className="text-gray-900">
                  {selectedOrder.shippingAddress.phone}
                </span>
              </p>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="rounded-lg border border-gray-200 p-4">
            <div className="mb-3 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-gray-700" />
              <h3 className="text-lg font-semibold text-gray-900">
                {t(
                  "routes.dashboard.routes.orders.components.OrderDetailedCard.shippingAddress",
                ) || "Shipping Address"}
              </h3>
            </div>
            <div className="space-y-1 text-sm text-gray-900">
              <p>
                {selectedOrder.shippingAddress.street},{" "}
                {selectedOrder.shippingAddress.building}
              </p>
              <p>
                {selectedOrder.shippingAddress.town},{" "}
                {selectedOrder.shippingAddress.city}
              </p>
              <p>{selectedOrder.shippingAddress.country}</p>
              {selectedOrder.shippingAddress.additionalInfo && (
                <p className="mt-2 italic text-gray-600">
                  Note: {selectedOrder.shippingAddress.additionalInfo}
                </p>
              )}
            </div>
          </div>

          {/* Order Items */}
          <div className="rounded-lg border border-gray-200 p-4">
            <div className="mb-3 flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-gray-700" />
              <h3 className="text-lg font-semibold text-gray-900">
                {t(
                  "routes.dashboard.routes.orders.components.OrderDetailedCard.orderItems",
                )}
              </h3>
            </div>
            <div className="space-y-3">
              {selectedOrder.items.map((product: OrderItem, index: number) => (
                <OrderItemCard
                  key={index}
                  item={product}
                  order={selectedOrder}
                  showVariant={!!selectedOrder}
                />
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div className="rounded-lg border border-gray-200 p-4">
            <div className="mb-3 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-gray-700" />
              <h3 className="text-lg font-semibold text-gray-900">
                {t("general.others.timeline") || "Timeline"}
              </h3>
            </div>
            <div className="space-y-2 text-sm">
              <p className="flex items-center justify-between">
                <span className="font-medium text-gray-700">
                  {t("general.others.created") || "Created"}:
                </span>
                <span className="text-gray-900">
                  {new Date(selectedOrder.createdAt).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    },
                  )}
                </span>
              </p>

              {selectedOrder.updatedAt && selectedOrder.isUpdated && (
                <p className="flex items-center justify-between">
                  <span className="font-medium text-gray-700">
                    {t("general.others.updated") || "Updated"}:
                  </span>
                  <span className="text-gray-900">
                    {new Date(selectedOrder.updatedAt).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      },
                    )}
                  </span>
                </p>
              )}

              {selectedOrder.updatedBy && (
                <p className="flex items-center justify-between">
                  <span className="font-medium text-gray-700">
                    {t("general.others.updatedBy") || "Updated By"}:
                  </span>
                  <span className="text-gray-900">
                    {selectedOrder.updatedBy.firstName}{" "}
                    {selectedOrder.updatedBy.lastName}
                  </span>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default memo(OrderDetailedCard);
