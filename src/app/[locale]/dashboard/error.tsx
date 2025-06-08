"use client";

import { useTranslations } from "next-intl";
import ErrorPage from "@/components/shared/ErrorPage";

interface DashboardErrorProps {
  error?: Error & { digest?: string };
  reset?: () => void;
}

export default function DashboardError({ error, reset }: DashboardErrorProps) {
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
