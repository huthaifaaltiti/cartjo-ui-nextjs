import React from "react";
import VerifyEmailContent from "@/components/user/verify-email/VerifyEmailContent";
import { Locale } from "@/types/locale";
import { UserRole } from "@/enums/user-role.enum";

interface PageProps {
  params: Promise<{ locale: Locale | string }>;
}

export default async function CreatorsVerifyEmailPage({ params }: PageProps) {
  const { locale } = await params;

  return (
    <VerifyEmailContent
      locale={locale}
      relocationPath={`/auth?role=${UserRole.CREATOR}&tab=login`}
    />
  );
}
