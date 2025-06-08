"use client";

import { useTranslations } from "next-intl";
import ErrorPage from "@/components/shared/ErrorPage";

interface TotalUsersErrorProps {
  error?: Error & { digest?: string };
  reset?: () => void;
}

export default function TotalUsersError({
  error,
  reset,
}: TotalUsersErrorProps) {
  const t = useTranslations();

  return (
    <ErrorPage
      error={error}
      reset={reset}
      title={
        error?.message ||
        t(
          "routes.dashboard.routes.users.routes.totalUsers.errors.dataLoadFailure"
        )
      }
      showReLogin={true}
    />
  );
}
