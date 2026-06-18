"use client";

import { memo, useCallback } from "react";
import { useTranslations } from "next-intl";
import {
  showErrorToast,
  showSuccessToast,
} from "@/components/shared/CustomToast";
import { useAuthContext } from "@/hooks/useAuthContext";
import { PaymentStatus } from "@/enums/paymentStatus.enum";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { changePaymentStatus } from "@/redux/slices/orders/actions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { useRequireAuth } from "@/hooks/useRequireAuth";

type OrderCardPaymentActionProps = {
  orderId: string;
  setIsLoading: (isLoading: boolean) => void;
};

const OrderCardPaymentAction = ({
  orderId,
  setIsLoading,
}: OrderCardPaymentActionProps) => {
  const t = useTranslations("");

  const { requireAuth } = useRequireAuth();
  const { locale } = useAuthContext();

  const dispatch = useDispatch<AppDispatch>();

  const statuses: string[] = Object.values(PaymentStatus).filter(
    (st) => st !== PaymentStatus.FAILED,
  );

  const setPaymentStatus = useCallback(
    async (status: PaymentStatus) => {
      if (!requireAuth()) return;

      try {
        setIsLoading(true);
        const response = await dispatch(
          changePaymentStatus({
            orderId: orderId,
            status: status,
            lang: locale,
          }),
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
    },
    [requireAuth, orderId, dispatch, locale, t, setIsLoading],
  );

  return (
    <Select onValueChange={setPaymentStatus}>
      <SelectTrigger className="w-full text-xs">
        {t(
          "routes.dashboard.routes.orders.components.OrderCardPaymentAction.title",
        )}
      </SelectTrigger>
      <SelectContent>
        {statuses.map((status) => {
          return (
            <SelectItem key={status} className={""} value={status}>
              {status}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
};

export default memo(OrderCardPaymentAction);
