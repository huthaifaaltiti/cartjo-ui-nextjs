"use client";

import { useTranslations } from "next-intl";
import ErrorPage from "@/components/shared/ErrorPage";

interface ActiveUsersErrorPageProps {
  error?: Error & { digest?: string };
  reset?: () => void;
}

export default function ActiveUsersErrorPage({
  error,
  reset,
}: ActiveUsersErrorPageProps) {
  const t = useTranslations();

  return (
    <ErrorPage
      error={error}
      reset={reset}
      title={
        error?.message ||
        t(
          "routes.dashboard.routes.users.routes.activeUsers.errors.dataLoadFailure"
        )
      }
      showReLogin={true}
    />
  );
}
