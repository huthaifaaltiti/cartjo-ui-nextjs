"use client";

import { useTranslations } from "next-intl";
import { ErrorPageProps } from "@/types/common";
import ErrorPage from "@/components/shared/ErrorPage";

export default function Error({ error, reset }: ErrorPageProps) {
  const t = useTranslations();

  return (
    <ErrorPage
      error={error}
      reset={reset}
      title={
        error?.message ||
        t("routes.dashboard.routes.typeHintConfigs.errors.failedLoadData")
      }
      showReLogin={true}
    />
  );
}
