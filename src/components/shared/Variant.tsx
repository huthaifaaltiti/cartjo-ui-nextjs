"use client";

import { memo } from "react";
import { VariantServer } from "@/types/product.type";
import { extractVariantDetails } from "@/utils/productVariant.utils";
import { useTranslations } from "next-intl";
import { OrderItemVariant } from "@/types/orderItem.type";

interface VariantProps {
  variant: OrderItemVariant | VariantServer;
  className?: string;
}

const Variant = ({ variant, className = "" }: VariantProps) => {
  const tg = useTranslations("general");

  if (!variant) return null;

  const { sellingType, size, colors } = extractVariantDetails(variant);

  // Color-only variant
  if (colors.length > 0 && !size && !sellingType) {
    return (
      <div className={`relative my-2 ${className}`}>
        <div className="flex gap-1.5 flex-wrap px-0.5 pb-0.5">
          {colors.map((color) => (
            <span
              key={color}
              title={color}
              style={{ backgroundColor: color }}
              className="w-7 h-7 rounded-full border-2 border-gray-200 inline-block shadow-sm"
            />
          ))}
        </div>
      </div>
    );
  }

  const translatedSellingType = sellingType
    ? tg(`attributes.sellingType.${sellingType.toLowerCase()}`)
    : null;

  const parts = [
    translatedSellingType
      ? `${tg("attributes.labels.type")}: ${translatedSellingType}`
      : null,
    size ? `${tg("attributes.labels.size")}: ${size}` : null,
  ].filter(Boolean);

  const label = parts.join(" · ");

  return (
    <div className={`relative my-2 ${className}`}>
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-gray-200 bg-gray-50 text-[11px] font-medium text-gray-700 whitespace-nowrap">
        {label}

        {colors.length > 0 && (
          <span className="inline-flex items-center gap-0.5 align-middle">
            <span>· {tg("attributes.labels.colors")}: </span>
            {colors.map((c) => (
              <span
                key={c}
                style={{ backgroundColor: c }}
                className="inline-block w-2.5 h-2.5 rounded-full border border-gray-300"
              />
            ))}
          </span>
        )}
      </span>
    </div>
  );
};

export default memo(Variant);
