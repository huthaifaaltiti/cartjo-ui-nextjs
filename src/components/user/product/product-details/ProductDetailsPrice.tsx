import CurrencyLabel from "@/components/shared/CurrencyLabel";
import { Currency as CurrencyEnum } from "@/enums/currency.enum";

interface Props {
  price: number;
  priceAfterDiscount: number;
  currency: CurrencyEnum;
  discountRate: number;
  isArabic: boolean;
}

const ProductDetailsPrice = ({
  price,
  priceAfterDiscount,
  currency,
  discountRate,
  isArabic,
}: Props) => {
  const hasDiscount = discountRate > 0;

  return (
    <div className="flex items-baseline gap-3">
      <span className="text-4xl font-extrabold text-gray-900">
        {priceAfterDiscount.toFixed(2)}{" "}
        <CurrencyLabel
          currency={currency}
          isArabic={isArabic}
          className="text-base font-normal text-gray-500 ml-1"
        />
      </span>

      {hasDiscount && (
        <span className="text-md text-gray-400 line-through">
          {price.toFixed(2)}{" "}
          <CurrencyLabel
            currency={currency}
            isArabic={isArabic}
            className="text-base font-normal text-gray-500 ml-1"
          />
        </span>
      )}
    </div>
  );
};

export default ProductDetailsPrice;
