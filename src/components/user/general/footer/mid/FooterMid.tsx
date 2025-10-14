"use client";

import { memo, useMemo } from "react";
import { useActiveCategoriesQuery } from "@/hooks/react-query/useCategoriesQuery";
import { getQueryUIState } from "@/utils/uiStateHelpers";
import { Category } from "@/types/category.type";
import { useGeneralContext } from "@/contexts/General.context";
import NoData from "@/components/shared/NoData";
import { useTranslations } from "next-intl";
import ErrorMessage from "@/components/shared/ErrorMessage";
import FooterMidLoading from "./FooterMidLoading";
import FooterMidContent from "./FooterMidContent";

const FooterMid = () => {
  const { data, isLoading, isFetching, isFetched, isError, error } =
    useActiveCategoriesQuery();
  const { isArabic, locale } = useGeneralContext();
  const t = useTranslations();

  const activeCategories: Category[] = useMemo(() => data?.data ?? [], [data]);

  const categoriesWithSubs = useMemo(
    () => activeCategories.filter((cat) => cat.subCategories?.length > 0),
    [activeCategories]
  );

  const { showLoader, showError, showNoData, showData } = getQueryUIState({
    data: categoriesWithSubs.length > 0 ? categoriesWithSubs : null,
    isLoading,
    isFetching,
    isFetched,
    isError,
    error,
    isSuccess: data?.isSuccess ?? false,
  });

  const containerClass = "w-full h-full py-5";

  if (showLoader) {
    return (
      <div className={containerClass}>
        <FooterMidLoading />
      </div>
    );
  }

  if (showError) {
    return (
      <div className={containerClass}>
        <ErrorMessage
          message={
            error?.message ||
            t("components.Footer.components.FooterMid.failed")
          }
        />
      </div>
    );
  }

  if (showNoData) {
    return (
      <div className={containerClass}>
        <NoData
          title={t("components.Footer.components.FooterMid.noData")}
          description={t("components.Footer.components.FooterMid.checkLater")}
        />
      </div>
    );
  }

  if (showData) {
    return (
      <div className={containerClass}>
        <FooterMidContent
          isArabic={isArabic}
          data={categoriesWithSubs}
          locale={locale}
        />
      </div>
    );
  }

  return null;
};

export default memo(FooterMid);
