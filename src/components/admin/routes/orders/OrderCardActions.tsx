"use client";

import { memo, useCallback, useState } from "react";
import { Eye } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import Modal from "@/components/shared/Modal";
import { Order } from "@/types/order.type";
import OrderDetailedCard from "./OrderDetailedCard";
import OrderCardPaymentAction from "./OrderCardPaymentAction";
import OrderCardDeliveryAction from "./OrderCardDeliveryAction";
import { Permission } from "@/enums/permission.enum";
import { usePermission } from "@/hooks/usePermission";

type OrderCardActionsProps = {
  cardItem: Order;
};

const OrderCardActions = ({ cardItem }: OrderCardActionsProps) => {
  const t = useTranslations();

  const [isLoading, setIsLoading] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const {
    canReadOrder,
    canChangeOrderPaymentStatus,
    canChangeOrderDeliveryStatus,
  } = usePermission({
    canReadOrder: Permission.ORDERS_READ,
    canChangeOrderPaymentStatus: Permission.ORDERS_CHANGE_PAYMENT_STATUS,
    canChangeOrderDeliveryStatus: Permission.ORDERS_CHANGE_DELIVERY_STATUS,
  });

  const openDetailsModal = useCallback(() => {
    setIsDetailsModalOpen(true);
  }, []);

  const closeDetailsModal = useCallback(() => {
    setIsDetailsModalOpen(false);
  }, []);

  return (
    <>
      <div className="mt-4 flex items-center justify-end gap-2 border-t pt-3">
        {isLoading && (
          <div className="absolute inset-0 z-50 flex items-center justify-center rounded-lg bg-white-50/80">
            <LoadingSpinner />
          </div>
        )}

        {canReadOrder && (
          <Button
            onClick={openDetailsModal}
            size="sm"
            variant="outline"
            className="w-full mb-2"
          >
            <Eye className="mr-1 h-4 w-4" />
            {t(
              "routes.dashboard.routes.orders.components.OrderCardActions.viewDetails",
            )}
          </Button>
        )}
      </div>

      <div className="w-full flex flex-col items-center gap-2">
        {canChangeOrderPaymentStatus && (
          <OrderCardPaymentAction
            orderId={cardItem?._id}
            setIsLoading={setIsLoading}
          />
        )}
        {canChangeOrderDeliveryStatus && (
          <OrderCardDeliveryAction
            orderId={cardItem?._id}
            setIsLoading={setIsLoading}
          />
        )}
      </div>

      {/* Modal disabled for now */}
      {isDetailsModalOpen && canReadOrder && (
        <Modal isOpen={isDetailsModalOpen} onClose={closeDetailsModal}>
          <OrderDetailedCard orderId={cardItem?._id} />
        </Modal>
      )}
    </>
  );
};

export default memo(OrderCardActions);
