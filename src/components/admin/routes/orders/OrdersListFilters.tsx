"use client";

import { memo } from "react";
import PriceRange from "@/components/user/used-filters/PriceRange";
import { PaymentMethods } from "@/enums/paymentMethods.enum";
import PaymentMethodFilter from "@/components/user/used-filters/PaymentMethodFilter";


interface Props {
  setAmountMin: (value: number) => void;
  setAmountMax: (value: number) => void;
  onApplyFilter?: (from: number, to: number) => void;
  amountMax?: number;
  amountMin?: number;

  paymentMethod: PaymentMethods | null;
  setPaymentMethod: (v: PaymentMethods | null) => void;
}

const OrdersListFilters = ({
  amountMin,
  amountMax,
  setAmountMin,
  setAmountMax,
  paymentMethod,
  setPaymentMethod,
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
    </div>
  );
};

export default memo(OrdersListFilters);
