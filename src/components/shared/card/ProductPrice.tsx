import { Currency } from "@/constants/currency.constant";
import { VariantServer } from "@/types/product.type";
import { useTranslations } from "next-intl";

export default function ProductPrice({
  item,
  formatPrice,
  isArabic,
}: {
  item: VariantServer;
  formatPrice: (v: number) => string;
  isArabic: boolean;
}) {
  const t = useTranslations("components.ProductPrice");

  const {
    price = 0,
    priceAfterDiscount = 0,
    discountRate = 0,
    currency,
  } = item;

  const hasDiscount =
    discountRate > 0 && priceAfterDiscount > 0 && priceAfterDiscount < price;
  const finalPrice = hasDiscount ? priceAfterDiscount : price;
  const currencyLabel = Currency[currency]?.[isArabic ? "shortAr" : "shortEn"];
  const withCurrency = (amount: number) =>
    `${formatPrice(amount)} ${currencyLabel}`;

  return (
    <div className="flex flex-col gap-1 w-full">
      {hasDiscount && (
        <div className="flex items-center gap-2">
          <span className="text-xs sm:text-sm text-slate-400 line-through">
            {withCurrency(price)}
          </span>
          <span className="text-xs font-semibold text-white-50 bg-emerald-500 py-0.5 px-1 rounded-full animate-bounce">
            -{discountRate}%
          </span>
        </div>
      )}

      <div className="flex items-baseline gap-1.5">
        <span className="text-lg sm:text-xl md:text-2xl font-black text-slate-900 tracking-tight">
          {formatPrice(finalPrice)}
        </span>
        <span className="text-xs sm:text-sm font-medium text-slate-500 uppercase">
          {currencyLabel}
        </span>
      </div>

      {hasDiscount && (
        <span className="text-xs text-emerald-600 font-medium">
          {t("save")} {withCurrency(price - priceAfterDiscount)}
        </span>
      )}
    </div>
  );
}
