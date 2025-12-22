"use client";

import { useTranslations } from "next-intl";
import { ErrorPageProps } from "@/types/common";
import ErrorPage from "@/components/shared/ErrorPage";

export default function UserOrdersError({ error, reset }: ErrorPageProps) {
  const t = useTranslations();

  return (
    <ErrorPage
      error={error}
      reset={reset}
      title={
        error?.message ||
        t("routes.user.orders.failedLoadData")
      }
      showReLogin={true}
    />
  );
}
