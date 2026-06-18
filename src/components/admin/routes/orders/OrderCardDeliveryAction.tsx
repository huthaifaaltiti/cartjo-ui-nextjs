"use client";

import { memo, useCallback } from "react";
import { useTranslations } from "next-intl";
import {
  showErrorToast,
  showSuccessToast,
} from "@/components/shared/CustomToast";
import { useAuthContext } from "@/hooks/useAuthContext";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { changeDeliveryStatus } from "@/redux/slices/orders/actions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { OrderDeliveryStatus } from "@/enums/orderDeliveryStatus.enum";
import { useRequireAuth } from "@/hooks/useRequireAuth";

type OrderCardDeliveryActionProps = {
  orderId: string;
  setIsLoading: (isLoading: boolean) => void;
};

const OrderCardDeliveryAction = ({
  orderId,
  setIsLoading,
}: OrderCardDeliveryActionProps) => {
  const t = useTranslations("");

  const { requireAuth } = useRequireAuth();
  const { locale } = useAuthContext();

  const dispatch = useDispatch<AppDispatch>();

  const statuses: string[] = Object.values(OrderDeliveryStatus).filter(
    (st) => st !== OrderDeliveryStatus.FAILED,
  );

  const setPaymentStatus = useCallback(
    async (status: OrderDeliveryStatus) => {
      if (!requireAuth()) return;

      try {
        setIsLoading(true);
        const response = await dispatch(
          changeDeliveryStatus({
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
          "routes.dashboard.routes.orders.components.OrderCardDeliveryAction.title",
        )}
      </SelectTrigger>
      <SelectContent>
        {statuses.map((status) => {
          return (
            <SelectItem key={status} className={""} value={status}>
              {status?.replaceAll("_", " ")}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
};

export default memo(OrderCardDeliveryAction);
