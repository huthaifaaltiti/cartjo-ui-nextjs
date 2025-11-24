"use client";

import { memo, useCallback } from "react";
import PriceRange from "@/components/user/used-filters/PriceRange";
import { PaymentMethods } from "@/enums/paymentMethods.enum";
import PaymentMethodFilter from "@/components/user/used-filters/PaymentMethodFilter";
import DateRange from "@/components/user/used-filters/DateRange";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

interface Props {
  setAmountMin: (value: number) => void;
  setAmountMax: (value: number) => void;
  onApplyFilter?: (from: number, to: number) => void;
  amountMax?: number;
  amountMin?: number;

  paymentMethod: PaymentMethods | null;
  setPaymentMethod: (v: PaymentMethods | null) => void;

  createdBefore: string;
  setCreatedAfter: (val: string) => void;
  createdAfter: string;
  setCreatedBefore: (val: string) => void;
  onApplyDateFilter: (
    createdBeforeValue?: string,
    createdAfterValue?: string
  ) => void;
}

const OrdersListFilters = ({
  amountMin,
  amountMax,
  setAmountMin,
  setAmountMax,

  paymentMethod,
  setPaymentMethod,

  createdAfter,
  createdBefore,
  setCreatedAfter,
  setCreatedBefore,
  onApplyDateFilter,
}: Props) => {
  const t = useTranslations();

  const handleApplyPriceFilter = (from: number, to: number) => {
    setAmountMin(from);
    setAmountMax(to);
  };

  const handleClearAll = useCallback(() => {
    setAmountMin(0);
    setAmountMax(0);

    setPaymentMethod(null);

    setCreatedBefore("");
    setCreatedAfter("");

    // Trigger date filter reset
    onApplyDateFilter("", "");
  }, [
    setAmountMin,
    setAmountMax,
    setPaymentMethod,
    setCreatedBefore,
    setCreatedAfter,
    onApplyDateFilter,
  ]);

  return (
    <div className="w-full flex items-center gap-2">
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
    </div>
  );
};

export default memo(OrdersListFilters);
