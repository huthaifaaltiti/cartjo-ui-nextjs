"use client";

import { useTranslations } from "next-intl";
import { ErrorPageProps } from "@/types/common";
import ErrorPage from "@/components/shared/ErrorPage";

export default function UserOrdersReturnsPageError({ error, reset }: ErrorPageProps) {
  const t = useTranslations();

  return (
    <ErrorPage
      error={error}
      reset={reset}
      title={
        error?.message ||
        t("routes.user.layout.routes.returns.errors.failedLoadData")
      }
      showReLogin={true}
    />
  );
}
