"use client";

import { memo, useCallback } from "react";
import PriceRange from "@/components/user/used-filters/PriceRange";
import { PaymentMethods } from "@/enums/paymentMethods.enum";
import PaymentMethodFilter from "@/components/user/used-filters/PaymentMethodFilter";
import DateRange from "@/components/user/used-filters/DateRange";

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
  const handleApplyPriceFilter = (from: number, to: number) => {
    setAmountMin(from);
    setAmountMax(to);
  };

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
    </div>
  );
};

export default memo(OrdersListFilters);
