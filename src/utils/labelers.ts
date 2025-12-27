import { Currency as CurrencyConstant } from "@/constants/currency.constant";
import { Currency as CurrencyEnum } from "@/enums/currency.enum";

export function currencyLabeler(cur: CurrencyEnum, isArabic: boolean): string {
  return isArabic
    ? CurrencyConstant[cur].labelAr
    : CurrencyConstant[cur].labelEn;
}
