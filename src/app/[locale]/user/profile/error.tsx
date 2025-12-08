"use client";

import { useTranslations } from "next-intl";
import { ErrorPageProps } from "@/types/common";
import ErrorPage from "@/components/shared/ErrorPage";

export default function UserProfileError({ error, reset }: ErrorPageProps) {
  const t = useTranslations();

  return (
    <ErrorPage
      error={error}
      reset={reset}
      title={
        error?.message ||
        t("routes.user.routes.profile.errors.failedLoadData")
      }
      showReLogin={true}
    />
  );
}
