import { memo } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { Locale } from "@/types/locale";

const ForgotPasswordLink = ({ locale }: { locale: string | Locale }) => {
  const t = useTranslations(
    "routes.auth.components.AuthTabs.components.ForgotPasswordLink"
  );

  return (
    <div className="w-auto">
      <Link href={`/${locale}/auth/forgot-password`}>
        <span className="text-xs text-primary-500 hover:underline hover:text-primary-600 translation-all cursor-pointer">
          {t("label")}
        </span>
      </Link>
    </div>
  );
};

export default memo(ForgotPasswordLink);
