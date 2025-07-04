"use client";

import { useTranslations } from "next-intl";
import ErrorPage from "@/components/shared/ErrorPage";

interface ProductsErrorProps {
  error?: Error & { digest?: string };
  reset?: () => void;
}

export default function ProductsError({ error, reset }: ProductsErrorProps) {
  const t = useTranslations();

  return (
    <ErrorPage
      error={error}
      reset={reset}
      title={error?.message || t("errors.data.fetchingFailure")}
      showReLogin={true}
    />
  );
}
