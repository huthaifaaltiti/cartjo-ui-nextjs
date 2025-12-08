"use client";

import { memo } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useTranslations } from "next-intl";
import { PaymentStatus } from "@/enums/paymentStatus.enum";

interface Props {
  paymentStatus: PaymentStatus | null;
  setPaymentStatus: (v: PaymentStatus | null) => void;
}

const PaymentStatusFilter = ({ paymentStatus, setPaymentStatus }: Props) => {
  const t = useTranslations();
  const isActive = !!paymentStatus;

  const handleSelect = (status: PaymentStatus) => {
    setPaymentStatus(status);
  };

  const handleClear = () => {
    setPaymentStatus(null);
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
          {t("components.filters.PaymentStatusFilter.title")}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-44 p-3 space-y-2">
        <Label className="text-xs text-gray-600">
          {t("components.filters.PaymentStatusFilter.select")}
        </Label>

        <div className="flex flex-col gap-2">
          <Button
            size="sm"
            variant={paymentStatus === PaymentStatus.PAID ? "default" : "outline"}
            className="h-8"
            onClick={() => handleSelect(PaymentStatus.PAID)}
          >
            {t("components.filters.PaymentStatusFilter.type.paid")}
          </Button>

          <Button
            size="sm"
            variant={paymentStatus === PaymentStatus.PENDING ? "default" : "outline"}
            className="h-8"
            onClick={() => handleSelect(PaymentStatus.PENDING)}
          >
            {t("components.filters.PaymentStatusFilter.type.pending")}
          </Button>

          <Button
            size="sm"
            variant={paymentStatus === PaymentStatus.FAILED ? "default" : "outline"}
            className="h-8"
            onClick={() => handleSelect(PaymentStatus.FAILED)}
          >
            {t("components.filters.PaymentStatusFilter.type.failed")}
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

export default memo(PaymentStatusFilter);
