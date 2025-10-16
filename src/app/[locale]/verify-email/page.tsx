import React from "react";
import VerifyEmailContent from "@/components/user/verify-email/VerifyEmailContent";
import { Locale } from "@/types/locale";
import { VerifyEmailContextProvider } from "@/contexts/VerifyEmailContext";

interface PageProps {
  params: Promise<{ locale: Locale | string }>;
}

export default async function VerifyEmailPage({ params }: PageProps) {
  const { locale } = await params;

  return (
    <VerifyEmailContextProvider>
      <VerifyEmailContent locale={locale} />;
    </VerifyEmailContextProvider>
  );
}
