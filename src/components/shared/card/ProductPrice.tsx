import { Currency } from "@/constants/currency.constant";
import { Product } from "@/types/product.type";
import { useTranslations } from "next-intl";

export default function ProductPrice({
  item,
  formatPrice,
  isArabic,
}: {
  item: Product;
  formatPrice: (v: number) => string;
  isArabic: boolean;
}) {
  const t = useTranslations("components.ProductPrice");

  const { price, discountRate, currency } = item;
  const discountedPrice =
    discountRate > 0 ? price - (discountRate / 100) * price : price;

  const productCurrency = isArabic
    ? Currency[currency].shortAr
    : Currency[currency].shortEn;

  return (
    <div>
      {discountRate > 0 ? (
        <div className="space-y-1">
          {/* Discounted Price */}
          <div className="font-bold text-green-600 text-lg sm:text-xl md:text-2xl flex flex-row-reverse items-end justify-end">
            <span className="text-sm sm:text-base">{productCurrency}</span>
            {formatPrice(discountedPrice)}
          </div>

          {/* Original Price + Savings */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs sm:text-sm md:text-base text-gray-400 line-through flex flex-row-reverse items-end justify-end">
              <span>{productCurrency}</span>
              <span>{formatPrice(price)}</span>
            </span>

            <span className="text-[10px] sm:text-xs md:text-sm font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
              {t("save")} {formatPrice(price - discountedPrice)}{" "}
              {productCurrency}{" "}
            </span>
          </div>
        </div>
      ) : (
        <div className="flex items-end rtl:flex-row-reverse ltr:flex-row-reverse font-bold text-gray-900 text-lg sm:text-xl md:text-2xl">
          <span className="text-xs sm:text-sm">{productCurrency}</span>
          {formatPrice(price)}
        </div>
      )}
    </div>
  );
}
