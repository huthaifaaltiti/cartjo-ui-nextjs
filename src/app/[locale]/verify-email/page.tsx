import React from "react";
import VerifyEmailContent from "@/components/user/verify-email/VerifyEmailContent";
import { Locale } from "@/types/locale";

interface PageProps {
  params: Promise<{ locale: Locale | string }>;
}

export default async function VerifyEmailPage({ params }: PageProps) {
  const { locale } = await params;

  return <VerifyEmailContent locale={locale} />;
}
