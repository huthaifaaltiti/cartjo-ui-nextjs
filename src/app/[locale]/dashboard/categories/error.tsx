"use client";

import { useTranslations } from "next-intl";
import ErrorPage from "@/components/shared/ErrorPage";

interface CategoriesErrorProps {
  error?: Error & { digest?: string };
  reset?: () => void;
}

export default function CategoriesError({
  error,
  reset,
}: CategoriesErrorProps) {
  const t = useTranslations();

  return (
    <ErrorPage
      error={error}
      reset={reset}
      title={
        error?.message ||
        t("routes.dashboard.routes.categories.errors.failedLoadData")
      }
      showReLogin={true}
    />
  );
}
