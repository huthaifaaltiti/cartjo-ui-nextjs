import { Currency } from "@/constants/currency.constant";
import { Currency as CurrencyEnum } from "@/enums/currency.enum";

interface Props {
  currency: CurrencyEnum;
  isArabic?: boolean;
  className?: string;
}

const CurrencyLabel = ({ currency, isArabic, className }: Props) => {
  const label = isArabic
    ? Currency[currency].labelAr
    : Currency[currency].labelEn;

  return <span className={className}>{label}</span>;
};

export default CurrencyLabel;
