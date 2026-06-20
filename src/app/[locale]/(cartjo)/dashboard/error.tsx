"use client";

import { useTranslations } from "next-intl";

import { ErrorPageProps } from "@/types/common";
import ErrorPage from "@/components/shared/ErrorPage";

export default function DashboardError({ error, reset }: ErrorPageProps) {
  const t = useTranslations();

  return (
    <ErrorPage
      error={error}
      reset={reset}
      title={error?.message || t("routes.dashboard.errors.dashboardFailure")}
      showReLogin={true}
    />
  );
}
