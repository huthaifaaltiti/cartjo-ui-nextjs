"use client";

import { memo, useCallback } from "react";
import PriceRange from "@/components/user/used-filters/PriceRange";
import { PaymentMethods } from "@/enums/paymentMethods.enum";
import PaymentMethodFilter from "@/components/user/used-filters/PaymentMethodFilter";
import DateRange from "@/components/user/used-filters/DateRange";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import ExportOrders from "./ExportOrders";
import { PaymentStatus } from "@/enums/paymentStatus.enum";
import PaymentStatusFilter from "@/components/user/used-filters/PaymentStatusFilter";
import { OrderDeliveryStatus } from "@/enums/orderDeliveryStatus.enum";
import DeliveryStatusFilter from "@/components/user/used-filters/DeliveryStatusFilter";
import { Permission } from "@/enums/permission.enum";
import { usePermission } from "@/hooks/usePermission";
import { showNoPermissionToast } from "@/utils/permissionToast";

interface Props {
  setAmountMin: (value: number) => void;
  setAmountMax: (value: number) => void;
  onApplyFilter?: (from: number, to: number) => void;
  amountMax?: number;
  amountMin?: number;

  paymentMethod: PaymentMethods | null;
  setPaymentMethod: (v: PaymentMethods | null) => void;

  paymentStatus: PaymentStatus | null;
  setPaymentStatus: (v: PaymentStatus | null) => void;

  deliveryStatus: OrderDeliveryStatus | null;
  setDeliveryStatus: (v: OrderDeliveryStatus | null) => void;

  createdBefore: string;
  setCreatedAfter: (val: string) => void;
  createdAfter: string;
  setCreatedBefore: (val: string) => void;
  onApplyDateFilter: (
    createdBeforeValue?: string,
    createdAfterValue?: string,
  ) => void;
}

const OrdersListFilters = ({
  amountMin,
  amountMax,
  setAmountMin,
  setAmountMax,

  paymentMethod,
  setPaymentMethod,

  paymentStatus,
  setPaymentStatus,

  deliveryStatus,
  setDeliveryStatus,

  createdAfter,
  createdBefore,
  setCreatedAfter,
  setCreatedBefore,
  onApplyDateFilter,
}: Props) => {
  const t = useTranslations();

  const { canReadOrder, canExportOrder } = usePermission({
    canReadOrder: Permission.ORDERS_READ,
    canExportOrder: Permission.ORDERS_EXPORT,
  });

  const handleApplyPriceFilter = (from: number, to: number) => {
    if (!canReadOrder) {
      showNoPermissionToast(t);

      return;
    }
    setAmountMin(from);
    setAmountMax(to);
  };

  const handleClearAll = useCallback(() => {
    if (!canReadOrder) {
      showNoPermissionToast(t);

      return;
    }

    setAmountMin(0);
    setAmountMax(0);

    setPaymentMethod(null);

    setPaymentStatus(null);

    setDeliveryStatus(null);

    setCreatedBefore("");
    setCreatedAfter("");

    // Trigger date filter reset
    onApplyDateFilter("", "");
  }, [
    setAmountMin,
    setAmountMax,
    setPaymentMethod,
    setPaymentStatus,
    setDeliveryStatus,
    setCreatedBefore,
    setCreatedAfter,
    onApplyDateFilter,
    canReadOrder,
    t,
  ]);

  return (
    <div className="w-full flex items-center gap-2">
      {canReadOrder && (
        <>
          <PriceRange
            setPriceFrom={setAmountMin}
            setPriceTo={setAmountMax}
            onApplyFilter={handleApplyPriceFilter}
            initialFrom={amountMin}
            initialTo={amountMax}
          />

          <PaymentMethodFilter
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
          />

          <PaymentStatusFilter
            paymentStatus={paymentStatus}
            setPaymentStatus={setPaymentStatus}
          />

          <DeliveryStatusFilter
            deliveryStatus={deliveryStatus}
            setDeliveryStatus={setDeliveryStatus}
          />

          <DateRange
            setCreatedFrom={setCreatedBefore}
            setCreatedTo={setCreatedAfter}
            onApplyFilter={onApplyDateFilter}
            initialCreatedFrom={createdBefore}
            initialCreatedTo={createdAfter}
          />

          <Button
            variant="destructive"
            size="sm"
            className="h-8 px-3"
            onClick={handleClearAll}
          >
            {t("components.filters.actions.clear")}
          </Button>
        </>
      )}

      {canReadOrder && canExportOrder && <ExportOrders />}
    </div>
  );
};

export default memo(OrdersListFilters);
