"use client";

import { memo } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { PaymentMethods } from "@/enums/paymentMethods.enum";
import { useTranslations } from "next-intl";

interface PaymentMethodFilterProps {
  paymentMethod: PaymentMethods | null;
  setPaymentMethod: (v: PaymentMethods | null) => void;
}

const PaymentMethodFilter = ({
  paymentMethod,
  setPaymentMethod,
}: PaymentMethodFilterProps) => {
  const t = useTranslations();
  const isActive = !!paymentMethod;

  const handleSelect = (method: PaymentMethods) => {
    setPaymentMethod(method);
  };

  const handleClear = () => {
    setPaymentMethod(null);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={`h-8 px-3 ${
            isActive ? "border-[2px] border-primary-500" : ""
          }`}
        >
          {t("components.filters.PaymentMethodFilter.title")}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-40 p-3 space-y-2">
        <Label className="text-xs text-gray-600">
          {t("components.filters.PaymentMethodFilter.select")}
        </Label>

        <div className="flex flex-col gap-2">
          <Button
            size="sm"
            variant={
              paymentMethod === PaymentMethods.Cash ? "default" : "outline"
            }
            className="h-8"
            onClick={() => handleSelect(PaymentMethods.Cash)}
          >
            {t("components.filters.PaymentMethodFilter.type.cash")}
          </Button>

          <Button
            size="sm"
            variant={
              paymentMethod === PaymentMethods.Card ? "default" : "outline"
            }
            className="h-8"
            onClick={() => handleSelect(PaymentMethods.Card)}
          >
            {t("components.filters.PaymentMethodFilter.type.card")}
          </Button>

          <Button
            size="sm"
            variant="outline"
            className="h-8"
            onClick={handleClear}
          >
            {t("components.filters.actions.clear")}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default memo(PaymentMethodFilter);
