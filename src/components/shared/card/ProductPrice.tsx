import { Product } from "@/types/product.type";

export default function ProductPrice({
  item,
  formatPrice,
}: {
  item: Product;
  formatPrice: (v: number) => string;
}) {
  const { price, discountRate, currency } = item;
  const discountedPrice =
    discountRate > 0 ? price - (discountRate / 100) * price : price;

  return (
    <div>
      {discountRate > 0 ? (
        <div className="space-y-1">
          {/* Discounted Price */}
          <div className="font-bold text-green-600 text-lg sm:text-xl md:text-2xl">
            <span className="text-sm sm:text-base">{currency}</span>
            {formatPrice(discountedPrice)}
          </div>

          {/* Original Price + Savings */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs sm:text-sm md:text-base text-gray-400 line-through">
              {currency}
              {formatPrice(price)}
            </span>

            <span className="text-[10px] sm:text-xs md:text-sm font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
              Save {currency}
              {formatPrice(price - discountedPrice)}
            </span>
          </div>
        </div>
      ) : (
        <div className="font-bold text-gray-900 text-lg sm:text-xl md:text-2xl">
          <span className="text-xs sm:text-sm">{currency}</span>
          {formatPrice(price)}
        </div>
      )}
    </div>
  );
}
