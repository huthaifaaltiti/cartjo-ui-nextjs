"use client";

import { useTranslations } from "next-intl";
import ErrorPage from "@/components/shared/ErrorPage";

interface LocationsErrorProps {
  error?: Error & { digest?: string };
  reset?: () => void;
}

export default function LocationsError({ error, reset }: LocationsErrorProps) {
  const t = useTranslations();

  return (
    <ErrorPage
      error={error}
      reset={reset}
      title={
        error?.message ||
        t("routes.dashboard.routes.locations.errors.failedLoadLocations")
      }
      showReLogin={true}
    />
  );
}
