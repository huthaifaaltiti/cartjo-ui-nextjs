"use client";

import { memo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import { isArabicLocale } from "@/config/locales.config";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLocale } from "@/contexts/LocaleContext";

const LanguageSelector: React.FC = () => {
  const { locale } = useLocale();
  const isAr = isArabicLocale(locale);
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("components.LanguageSelector");

  const handleLangChange = (value: string) => {
    const newLocale = value;
    const path = pathname?.split("/")?.slice(2)?.join("/");

    router.push(`/${newLocale}/${path}`);
  };

  return (
    <Select onValueChange={handleLangChange}>
      <SelectTrigger className="w-[100px] text-text-primary-100 text-sm shadow-none">
        <SelectValue placeholder={isAr ? t("arabic") : t("english")} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="en">{t("english")}</SelectItem>
        <SelectItem value="ar">{t("arabic")}</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default memo(LanguageSelector);
