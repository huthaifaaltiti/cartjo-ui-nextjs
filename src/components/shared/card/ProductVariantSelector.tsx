"use client";

import { memo } from "react";
import { VariantServer } from "@/types/product.type";
import { extractVariantDetails } from "@/utils/productVariant.utils";

interface ProductVariantSelectorProps {
  variants: VariantServer[];
  selectedVariantId: string | null;
  onSelect: (variantId: string) => void;
  className?: string;
}

const ProductVariantSelector = ({
  variants,
  selectedVariantId,
  onSelect,
  className = "",
}: ProductVariantSelectorProps) => {
  if (!variants?.length) return null;

  return (
    <div className={`relative my-2 ${className}`}>
      <div className="flex gap-1.5 overflow-x-auto scrollbar-none scroll-smooth snap-x snap-mandatory px-0.5 pb-0.5">
        {variants.map((variant) => {
          const { sellingType, size, colors } = extractVariantDetails(variant);

          const isSelected = selectedVariantId === variant?.variantId;
          const isUnavailable = !variant.isAvailable;

          const handleClick = (e: React.MouseEvent) => {
            e.stopPropagation();
            if (isUnavailable) return;
            onSelect(variant.variantId);
          };

          // ✅ Color-only variant
          if (colors.length > 0 && !size && !sellingType) {
            return (
              <button
                key={variant.variantId}
                onClick={handleClick}
                disabled={isUnavailable}
                title={isUnavailable ? "Out of stock" : colors[0]}
                className={`relative flex-shrink-0 w-7 h-7 rounded-full border-2 transition-all snap-start ${
                  isSelected
                    ? "border-primary-50 scale-110 shadow-sm"
                    : "border-transparent hover:border-gray-400"
                } ${
                  isUnavailable
                    ? "opacity-40 cursor-not-allowed"
                    : "cursor-pointer"
                }`}
                style={{ backgroundColor: colors[0] }}
              >
                {isUnavailable && (
                  <span className="absolute inset-0 flex items-center justify-center rounded-full overflow-hidden">
                    <span className="block w-full h-px bg-white/80 rotate-45" />
                  </span>
                )}
              </button>
            );
          }

          // ✅ Text-based variant
          const label = [sellingType, size].filter(Boolean).join(" · ");

          return (
            <button
              key={variant.variantId}
              onClick={handleClick}
              disabled={isUnavailable}
              title={isUnavailable ? "Out of stock" : undefined}
              className={`relative flex-shrink-0 snap-start inline-flex items-center gap-1 px-2.5 py-1 rounded-md border text-[11px] font-medium transition-all whitespace-nowrap ${
                isSelected
                  ? "border-primary-50 bg-black text-white"
                  : "border-gray-200 bg-white text-gray-700 hover:border-gray-400"
              } ${
                isUnavailable
                  ? "opacity-40 cursor-not-allowed"
                  : "cursor-pointer"
              }`}
            >
              {label}

              {isUnavailable && (
                <span className="absolute inset-0 overflow-hidden rounded-md pointer-events-none">
                  <span className="absolute top-1/2 left-0 w-full h-px bg-gray-400 rotate-[-18deg] origin-center" />
                </span>
              )}

              {colors.length > 0 && (
                <span className="inline-flex gap-0.5 align-middle">
                  {colors.map((c) => (
                    <span
                      key={c}
                      style={{ backgroundColor: c }}
                      className="inline-block w-2.5 h-2.5 rounded-full border border-gray-300"
                    />
                  ))}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default memo(ProductVariantSelector);
