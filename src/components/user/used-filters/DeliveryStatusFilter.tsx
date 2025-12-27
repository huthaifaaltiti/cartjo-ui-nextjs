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
import { OrderDeliveryStatus } from "@/enums/orderDeliveryStatus.enum";

interface Props {
  deliveryStatus: OrderDeliveryStatus | null;
  setDeliveryStatus: (v: OrderDeliveryStatus | null) => void;
}

const DeliveryStatusFilter = ({ deliveryStatus, setDeliveryStatus }: Props) => {
  const t = useTranslations();
  const isActive = !!deliveryStatus;

  const handleSelect = (status: OrderDeliveryStatus) => {
    setDeliveryStatus(status);
  };

  const handleClear = () => {
    setDeliveryStatus(null);
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
          {t("components.filters.DeliveryStatusFilter.title")}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-44 p-3 space-y-2">
        <Label className="text-xs text-gray-600">
          {t("components.filters.DeliveryStatusFilter.select")}
        </Label>

        <div className="flex flex-col gap-2">
          {Object.values(OrderDeliveryStatus).map((status) => {
            return (
              <Button
                size="sm"
                variant={
                  deliveryStatus === OrderDeliveryStatus[status]
                    ? "default"
                    : "outline"
                }
                className="h-8"
                onClick={() => handleSelect(OrderDeliveryStatus[status])}
              >
                {t(`general.status.${status?.toLocaleLowerCase()}`)}
              </Button>
            );
          })}

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

export default memo(DeliveryStatusFilter);
