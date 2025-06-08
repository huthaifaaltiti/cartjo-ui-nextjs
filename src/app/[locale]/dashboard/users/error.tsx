"use client";

import ErrorPage from "@/components/shared/ErrorPage";
import { useTranslations } from "next-intl";

interface UsersErrorProps {
  error?: Error & { digest?: string };
  reset?: () => void;
}

export default function UsersError({ error, reset }: UsersErrorProps) {
  const t = useTranslations();

  return (
    <ErrorPage
      error={error}
      reset={reset}
      title={
        error?.message ||
        t("routes.dashboard.routes.users.errors.failedLoadUsers")
      }
      showReLogin={true}
    />
  );
}
