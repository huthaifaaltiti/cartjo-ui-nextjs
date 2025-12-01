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
    <div className="">
      {discountRate > 0 ? (
        <div className="space-y-1">
          <div className="text-2xl font-bold text-green-600">
            {currency}
            {formatPrice(discountedPrice)}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-base text-gray-400 line-through">
              {currency}
              {formatPrice(price)}
            </span>

            <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
              Save {currency}
              {formatPrice(price - discountedPrice)}
            </span>
          </div>
        </div>
      ) : (
        <div className="text-xl font-bold text-gray-900">
          <span className="text-sm">{currency}</span>
          <span>{formatPrice(price)}</span>
        </div>
      )}
    </div>
  );
}
