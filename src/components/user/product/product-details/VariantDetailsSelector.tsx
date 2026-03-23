import { Check } from "lucide-react";
import { Product, VariantAttribute } from "@/types/product.type";
import { ProductVariantAttributeKey } from "@/enums/productVariantAttributeKey.enum";
import { useTranslations } from "next-intl";
import { Currency } from "@/constants/currency.constant";
import DiscountSmallPercentBadge from "@/components/shared/card/DiscountSmallPercentBadge";

interface Props {
  variants: Product["variants"];
  selectedVariantIdx: number;
  onVariantChange: (idx: number) => void;
  isArabic: boolean;
}

const getAttr = (
  attrs: VariantAttribute[] = [],
  key: ProductVariantAttributeKey,
): string | undefined => attrs.find((a) => a.key === key)?.value;

const VariantDetailsSelector = ({
  variants,
  selectedVariantIdx,
  onVariantChange,
  isArabic,
}: Props) => {
  const t = useTranslations("");

  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
        {t("routes.product.components.VariantDetailsSelector.select")}
      </p>

      <div className="flex flex-col gap-2">
        {variants.map((variant, i) => {
          const sellingType = getAttr(
            variant.attributes,
            ProductVariantAttributeKey.SELLING_TYPE,
          );
          const size = getAttr(
            variant.attributes,
            ProductVariantAttributeKey.SIZE,
          );
          const active = selectedVariantIdx === i;

          return (
            <button
              key={variant.variantId}
              type="button"
              onClick={() => onVariantChange(i)}
              className={`relative flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-all ${
                active
                  ? "border-indigo-500 bg-indigo-50"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <div
                className={`${isArabic ? "text-right" : "text-left"} flex items-center gap-5`}
              >
                <div>
                  {/* Always show selling type */}
                  <p className="text-sm font-semibold text-gray-700">
                    {t(
                      `general.attributes.sellingType.${sellingType?.toLocaleLowerCase()}`,
                    ) ?? "-"}
                    {size
                      ? ` · ${t(
                          `general.attributes.size.${size?.toLocaleLowerCase()}`,
                        )}`
                      : ""}
                  </p>

                  <p className="text-sm font-bold text-gray-900 mt-1">
                    {variant.priceAfterDiscount.toFixed(2)}{" "}
                    <span className="text-xs">
                      {isArabic
                        ? Currency[variant.currency].labelAr
                        : Currency[variant.currency].labelEn}
                    </span>
                  </p>
                </div>

                {variant?.discountRate > 0 && (
                  <DiscountSmallPercentBadge
                    discountRate={variant?.discountRate}
                  />
                )}
              </div>

              {active && (
                <Check size={18} className="text-indigo-600" strokeWidth={3} />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default VariantDetailsSelector;
