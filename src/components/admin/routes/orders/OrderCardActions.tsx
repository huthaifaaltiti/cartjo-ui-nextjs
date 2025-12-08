"use client";

import { memo, useCallback, useState } from "react";
import { Eye } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  showErrorToast,
  showSuccessToast,
  showWarningToast,
} from "@/components/shared/CustomToast";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import Modal from "@/components/shared/Modal";
import { Order } from "@/types/order.type";
import { useAuthContext } from "@/hooks/useAuthContext";
import ToggleSwitch from "@/components/shared/ToggleSwitch";
import { PaymentStatus } from "@/enums/paymentStatus.enum";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { changePaymentStatus } from "@/redux/slices/orders/actions";
import OrderDetailedCard from "./OrderDetailedCard";

type OrderCardActionsProps = {
  cardItem: Order;
};

const OrderCardActions = ({ cardItem }: OrderCardActionsProps) => {
  const t = useTranslations();
  const { accessToken, locale } = useAuthContext();
  const dispatch = useDispatch<AppDispatch>();

  const [isLoading, setIsLoading] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const changePaymentStatusText = useCallback(() => {
    return cardItem.paymentStatus === PaymentStatus.PENDING
      ? `${PaymentStatus.PAID}?`
      : `${PaymentStatus.PENDING}?`;
  }, [cardItem.paymentStatus]);

  const setPaymentPaid = useCallback(async () => {
    if (!accessToken) {
      showWarningToast({
        title: t("general.toast.title.warning"),
        description: t("general.toast.description.loginRequired"),
        dismissText: t("general.toast.dismissText"),
      });
      return;
    }

    try {
      setIsLoading(true);
      const response = await dispatch(
        changePaymentStatus({
          orderId: cardItem._id!,
          status: PaymentStatus.PAID,
          lang: locale,
          token: accessToken,
        })
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
        description: (error as Error)?.message || "Failed to update payment.",
        dismissText: t("general.toast.dismissText"),
      });
    } finally {
      setIsLoading(false);
    }
  }, [accessToken, cardItem._id, dispatch, locale, t]);

  const setPaymentPending = useCallback(async () => {
    if (!accessToken) {
      showWarningToast({
        title: t("general.toast.title.warning"),
        description: t("general.toast.description.loginRequired"),
        dismissText: t("general.toast.dismissText"),
      });
      return;
    }

    try {
      setIsLoading(true);
      const response = await dispatch(
        changePaymentStatus({
          orderId: cardItem._id!,
          status: PaymentStatus.PENDING,
          lang: locale,
          token: accessToken,
        })
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
        description: (error as Error)?.message || "Failed to update payment.",
        dismissText: t("general.toast.dismissText"),
      });
    } finally {
      setIsLoading(false);
    }
  }, [accessToken, cardItem._id, dispatch, locale, t]);

  const handleChangePaymentStatus = useCallback(() => {
    const isPendingPayment = cardItem.paymentStatus === PaymentStatus.PENDING;

    if (isPendingPayment) {
      setPaymentPaid();
    } else {
      setPaymentPending();
    }
  }, [cardItem.paymentStatus, setPaymentPaid, setPaymentPending]);

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

        <Button onClick={openDetailsModal} size="sm" variant="outline">
          <Eye className="mr-1 h-4 w-4" />
          {t(
            "routes.dashboard.routes.orders.components.OrderCardActions.viewDetails"
          )}
        </Button>
      </div>

      <div className="w-full flex items-center">
        <div className="w-full flex items-center gap-2">
          <ToggleSwitch
            value={cardItem.paymentStatus === PaymentStatus.PAID}
            onChange={handleChangePaymentStatus}
            width={40}
            height={20}
            trackColorInactive="#E55050"
            trackColorActive="#16610E"
            isDisabled={false}
          />

          <span className="text-sm capitalize font-bold text-orange-500">
            {changePaymentStatusText()}
          </span>
        </div>
      </div>

      {/* Modal disabled for now */}
      {isDetailsModalOpen && (
        <Modal isOpen={isDetailsModalOpen} onClose={closeDetailsModal}>
          <OrderDetailedCard orderId={cardItem?._id} />
        </Modal>
      )}
    </>
  );
};

export default memo(OrderCardActions);
