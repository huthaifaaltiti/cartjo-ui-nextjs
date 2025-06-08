"use client";

import ErrorPage from "@/components/shared/ErrorPage";

interface UsersErrorProps {
  error?: Error & { digest?: string };
  reset?: () => void;
}

export default function UsersError({ error, reset }: UsersErrorProps) {
  return (
    <ErrorPage
      error={error}
      reset={reset}
      title={error?.message || "Failed to Load Users"}
      showReLogin={true}
    />
  );
}
