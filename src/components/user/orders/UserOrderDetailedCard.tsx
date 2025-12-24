"use client";

import { memo, useEffect } from "react";
import {
  Package,
  MapPin,
  CreditCard,
  Calendar,
  Clock,
  Mail,
  Phone,
  User,
  Building2,
  CheckCircle2,
  AlertCircle,
  Star,
  CircleDollarSign,
  Truck,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { getMyOrder } from "@/redux/slices/orders/actions";
import { useAuthContext } from "@/hooks/useAuthContext";
import ImageWithFallback from "@/components/shared/ImageWithFallback";
import { useTranslations } from "next-intl";
import LoadingSpinner from "@/components/shared/loaders/LoadingSpinner";
import StatusBadge from "@/components/shared/StatusBadge";
import { currencyLabeler } from "@/utils/labelers";
import { Statuses } from "@/enums/statuses.enum";

const UserOrderDetailedCard = ({ itemId }: { itemId: string }) => {
  const t = useTranslations(
    "routes.user.layout.routes.orders.components.UserOrderDetailedCard"
  );

  const dispatch = useDispatch<AppDispatch>();
  const { isArabic, locale } = useSelector((state: RootState) => state.general);
  const { selectedOrder, loading, error } = useSelector(
    (state: RootState) => state.orders
  );
  const { accessToken, userId } = useAuthContext();

  useEffect(() => {
    if (!itemId) return;
    const getOrderDetails = async () => {
      await dispatch(
        getMyOrder({ id: itemId, lang: locale, token: accessToken, userId })
      );
    };
    getOrderDetails();
  }, [itemId, dispatch, locale, accessToken]);

  if (loading) {
    return (
      <div className={"flex items-center justify-center min-h-[700px]"}>
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !selectedOrder) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <p className="text-gray-600">{t("loadingError")}</p>
        </div>
      </div>
    );
  }

  const order = selectedOrder;
  const statusColor =
    order.paymentStatus === "pending"
      ? "bg-yellow-100 text-yellow-800"
      : "bg-green-100 text-green-800";
  const StatusIcon = order.paymentStatus === "pending" ? Clock : CheckCircle2;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-primary-700 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2 text-white-50">
              {t("title")}
            </h1>
            <p className="text-blue-100 text-sm ">
              <span className="font-semibold">{t("transactionId")}: </span>
              {order.transactionId}
            </p>
            <p className="text-blue-100 text-sm ">
              <span className="font-semibold">{t("merchantRef")}f: </span>
              {order.merchantReference}
            </p>
          </div>

          {/* Statuses */}
          <div className="flex items-center gap-1">
            {/* Payment */}
            <div
              className={`flex items-center gap-1 px-4 py-2 rounded-full ${statusColor} font-semibold`}
            >
              <CircleDollarSign className="h-5 w-5" />
              <StatusBadge
                status={order.paymentStatus ?? Statuses.PENDING}
                className={"border-none p-0"}
              />
            </div>

            {/* Delivery */}
            <div
              className={`flex items-center gap-1 px-4 py-2 rounded-full ${statusColor} font-semibold`}
            >
              <Truck className="h-5 w-5" />
              <StatusBadge
                status={order.deliveryStatus ?? Statuses.PENDING}
                className={"border-none p-0"}
              />
            </div>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-blue-500">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-white-50" />
              <span className="text-white-50">
                {new Date(order.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
            <div className="text-right">
              <p className="text-sm text-blue-100">{t("totalAmount")}</p>
              <p className="text-3xl font-bold text-blue-200">
                {order.amount}
                <span className="text-sm">
                  {" "}
                  {currencyLabeler(order.currency, isArabic)}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <div className="flex items-center gap-2 mb-6">
          <Package className="h-6 w-6 text-primary-500" />
          <h2 className="text-xl font-bold text-gray-800">{t("orderItems")}</h2>
        </div>
        <div className="space-y-4">
          {order.items.map((item, index) => (
            <div
              key={index}
              className="flex gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <div className="w-24 h-24">
                <ImageWithFallback
                  width={100}
                  height={100}
                  src={item.productId.mainImage}
                  alt={item.name[locale]}
                  useFill={false}
                  className="w-24 h-24 object-cover rounded-lg shadow-sm"
                />
              </div>
              <div className="flex-1 w-full">
                <h3 className="font-semibold text-gray-800 mb-1">
                  {item.name[locale]}
                </h3>
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                  {item.productId.description[locale]}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-500">
                      {t("qty")}:{" "}
                      <span className="font-semibold text-gray-700">
                        {item.quantity}
                      </span>
                    </span>
                    <span className="text-sm text-gray-500 flex items-center gap-1">
                      <Star className="w-3 h-3" /> {item.productId.ratings}
                    </span>
                  </div>
                  <p className="text-lg font-bold text-blue-500">
                    {item.price}{" "}
                    <span className="text-xs">
                      {currencyLabeler(order.currency, isArabic)}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Shipping Address */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="flex items-center gap-2 mb-6">
            <MapPin className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-800">
              {t("shippingAddress")}
            </h2>
          </div>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <User className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">{t("fullName")}</p>
                <p className="font-semibold text-gray-800">
                  {order.shippingAddress.fullName}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">{t("phone")}</p>
                <p className="font-semibold text-gray-800">
                  {order.shippingAddress.phone}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Building2 className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">{t("address")}</p>
                <p className="font-semibold text-gray-800">
                  {order.shippingAddress.street}, {order.shippingAddress.town}
                </p>
                <p className="text-gray-600">
                  {order.shippingAddress.city}, {order.shippingAddress.country}
                </p>
                {order.shippingAddress.additionalInfo && (
                  <p className="text-sm text-gray-500 mt-1">
                    {order.shippingAddress.additionalInfo}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Payment & Customer Info */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="flex items-center gap-2 mb-6">
            <CreditCard className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-800">
              {t("paymentCustomer")}
            </h2>
          </div>
          <div className="space-y-4 overflow-hidden">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">{t("paymentMethod")}</p>
              <p className="text-lg font-bold text-gray-800 capitalize">
                {order.paymentMethod}
              </p>
            </div>
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">{t("email")}</p>
                <p className="font-semibold text-gray-800 break-all">
                  {order.email}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <User className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">{t("customer")}</p>
                <p className="font-semibold text-gray-800">
                  {order?.createdBy?.firstName} {order?.createdBy?.lastName}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Order Summary */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          {t("orderSummary")}
        </h2>
        <div className="space-y-3">
          <div className="flex justify-between text-gray-700">
            <span>
              {t("subtotal")} ({t("itemsCount", { count: order.items.length })})
            </span>
            <span className="font-semibold">
              {order.amount} {order.currency}
            </span>
          </div>
          <div className="flex justify-between text-gray-700">
            <span>{t("shipping")}</span>
            <span className="font-semibold text-grey-600 text-xs">
              {t("shippingCost")}
            </span>
          </div>
          <div className="border-t-2 border-gray-300 pt-3 flex justify-between text-lg font-bold text-gray-900">
            <span>{t("total")}</span>
            <span className="text-blue-500">
              {order.amount} {order.currency}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(UserOrderDetailedCard);
