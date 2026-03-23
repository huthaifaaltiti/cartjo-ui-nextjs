import CurrencyLabel from "@/components/shared/CurrencyLabel";
import { Currency } from "@/enums/currency.enum";
import { useTranslations } from "next-intl";

interface Props {
  quantity: number;
  price: number;
  currency: Currency;
  isArabic: boolean;
}

const ProductDetailsSubtotal = ({
  quantity,
  price,
  currency,
  isArabic,
}: Props) => {
  const t = useTranslations("routes.product.components.ProductDetailsSubtotal");

  return (
    <div className="flex justify-between bg-gray-100 rounded-xl px-4 py-3">
      <span className="text-sm text-gray-500">
        {t("subtotal")} ({quantity})
      </span>

      <span className="font-bold text-gray-900">
        {(price * quantity).toFixed(2)}{" "}
        <CurrencyLabel
          currency={currency}
          isArabic={isArabic}
          className="text-xs font-normal text-gray-500 ml-1"
        />
      </span>
    </div>
  );
};

export default ProductDetailsSubtotal;
