"use client";

import { useTranslations } from "next-intl";
import ErrorPage from "@/components/shared/ErrorPage";

interface SubCategoriesErrorProps {
  error?: Error & { digest?: string };
  reset?: () => void;
}

export default function SubCategoriesError({
  error,
  reset,
}: SubCategoriesErrorProps) {
  const t = useTranslations();

  return (
    <ErrorPage
      error={error}
      reset={reset}
      title={error?.message || t("errors.data.fetchingFailure")}
      showReLogin={true}
    />
  );
}
