import { useTranslations, useLocale } from "next-intl";
import { isArabicLocale } from "@/config/locales.config";

type FoundItemsCountProps = {
  isLoading: boolean;
  count: number;
};

export default function FoundItemsCount({
  isLoading,
  count,
}: FoundItemsCountProps) {
  const t = useTranslations();
  const locale = useLocale();
  const isArabic = isArabicLocale(locale);

  return (
    <p className="text-sm text-gray-600 px-2 md:px-0">
      {isLoading
        ? t("general.loadingStates.loading")
        : isArabic
        ? `${t("general.items.itemsFound")} (${count})`
        : `(${count}) ${t("general.items.itemsFound")}`}
    </p>
  );
}
