"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

export default function ReturnBackButton() {
  const router = useRouter();
  const t = useTranslations();

  return (
    <Button
      className="h-12 w-auto py-3 text-white-500 bg-primary-500 border font-semibold hover:bg-primary-700 transition-colors rounded-lg"
      type="button"
      onClick={() => router.back()}
    >
      {t("general.actions.returnBack")}
    </Button>
  );
}
