import { useTranslations, useLocale } from "next-intl";

type FoundItemsCountProps = {
  isLoading: boolean;
  count: number;
};

export default function FoundItemsCount({
  isLoading,
  count,
}: FoundItemsCountProps) {
  const t = useTranslations();
  const isArabic = useLocale() === "ar";

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
