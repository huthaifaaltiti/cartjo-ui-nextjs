"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Button } from "../ui/button";
import { UserRole } from "@/enums/user-role.enum";
import LanguageSelector from "@/components/LanguageSelector";

export default function CreatorsNavActions() {
  const t = useTranslations("routes.creators.header");
  const router = useRouter();

  return (
    <div className="flex items-center gap-4">
      <LanguageSelector />

      <Button
        variant="ghost"
        className="px-4 font-medium text-neutral-300 hover:text-primary-500"
        onClick={() => router.push(`/auth?tab=login`)}
      >
        {t("signIn")}
      </Button>

      <Button
        className="text-sm text-white-50 font-medium bg-primary-400 rounded-full px-4 py-2 hover:bg-primary-300 transition-colors"
        onClick={() =>
          router.push(`/auth?role=${UserRole.CREATOR}&tab=register`)
        }
      >
        {t("becomeCreator")}
      </Button>
    </div>
  );
}
