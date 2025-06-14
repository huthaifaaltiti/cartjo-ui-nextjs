"use client";

import { useTranslations } from "next-intl";
import ErrorPage from "@/components/shared/ErrorPage";

interface ErrorPageProps {
  error?: Error & { digest?: string };
  reset?: () => void;
}

export default function DeletedUsersErrorPage({
  error,
  reset,
}: ErrorPageProps) {
  const t = useTranslations();

  return (
    <ErrorPage
      error={error}
      reset={reset}
      title={
        error?.message ||
        t(
          "routes.dashboard.routes.users.routes.deletedUsers.errors.dataLoadFailure"
        )
      }
      showReLogin={true}
    />
  );
}
