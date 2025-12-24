"use client";

import { memo, useState } from "react";
import { Package, Calendar } from "lucide-react";
import { Order } from "@/types/order.type";
import { useTranslations } from "next-intl";
import { formatDateWithHourAndMin } from "@/utils/formatDate";
import Modal from "@/components/shared/Modal";
import UserOrderDetailedCard from "./UserOrderDetailedCard";
import StatusBadge from "@/components/shared/StatusBadge";
import { currencyLabeler } from "@/utils/labelers";
import { Statuses } from "@/enums/statuses.enum";

const UserOrderCard = ({
  item,
  isArabic,
}: {
  item: Order;
  isArabic: boolean;
}) => {
  const t = useTranslations(
    "routes.user.layout.routes.orders.components.UserOrderCard"
  );

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  return (
    <>
      <div
        className="rounded-lg shadow border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300 max-h-[50vh] overflow-y-auto"
        dir={isArabic ? "rtl" : "ltr"}
      >
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-grey-600" />
              <div>
                <p className="text-xs text-gray-600">{t("orderRef")}</p>
                <p className="font-semibold text-gray-900 text-xs">
                  {item.merchantReference}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2">
              {/* Date */}
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Calendar className="w-3.5 h-3.5" />
                <span>
                  {formatDateWithHourAndMin(
                    item.createdAt.toString(),
                    isArabic
                  )}
                </span>
              </div>

              <span className="h-4 w-px bg-gray-300 @[max-width:943px]:hidden" />

              {/* Statuses */}
              <div className="flex items-center gap-2 rounded-md border-gray-200 bg-gray-50">
                <div className="flex items-center gap-1">
                  <span className="text-[11px] text-gray-500 whitespace-nowrap">
                    {t("payment")}
                  </span>
                  <StatusBadge
                    status={item?.paymentStatus ?? Statuses.PENDING}
                    className="text-[10px] px-2 py-0.5"
                  />
                </div>

                <span className="h-4 w-px bg-gray-300" />

                <div className="flex items-center gap-1">
                  <span className="text-[11px] text-gray-500 whitespace-nowrap">
                    {t("delivery")}
                  </span>
                  <StatusBadge
                    status={item?.deliveryStatus ?? Statuses.PENDING}
                    className="text-[10px] px-2 py-0.5"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="w-full flex items-center justify-between mt-2">
            {/* Total + Toggle */}
            <div className="flex items-center gap-5">
              <span className="text-sm text-gray-600"> {t("total")}</span>
              <div className="flex items-center gap-3">
                <span className="font-bold text-grey-600">
                  {item.amount.toFixed(2)}
                  <span className="text-xs">
                    {" "}
                    {currencyLabeler(item.currency, isArabic)}
                  </span>
                </span>
                <span className="font-normal text-sm text-grey-600">
                  {item.items.length}{" "}
                  <span className="text-xs">
                    {item.items.length > 1 ? t("items") : t("item")}
                  </span>
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="text-sm font-medium capitalize text-primary-500 hover:underline"
            >
              {t("show")}
            </button>
          </div>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <UserOrderDetailedCard itemId={item?._id} />
      </Modal>
    </>
  );
};

export default memo(UserOrderCard);
