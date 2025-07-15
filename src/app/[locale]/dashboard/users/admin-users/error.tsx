"use client";

import { useTranslations } from "next-intl";

import { ErrorPageProps } from "@/types/common";
import ErrorPage from "@/components/shared/ErrorPage";

export default function AdminUsersErrorPage({ error, reset }: ErrorPageProps) {
  const t = useTranslations();

  return (
    <ErrorPage
      error={error}
      reset={reset}
      title={
        error?.message ||
        t(
          "routes.dashboard.routes.users.routes.adminUsers.errors.dataLoadFailure"
        )
      }
      showReLogin={true}
    />
  );
}
