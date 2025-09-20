"use client";

import { memo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useLocale } from "@/contexts/LocaleContext";
import { isArabicLocale } from "@/config/locales.config";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const LanguageSelector: React.FC = () => {
  const { locale } = useLocale();
  const isAr = isArabicLocale(locale);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const t = useTranslations("components.LanguageSelector");

  const handleLangChange = (value: string) => {
    const newLocale = value;
    const pathSegments = pathname.split("/").filter(Boolean);
    const newPath = pathSegments.slice(1).join("/"); // removes the existing locale from the path

    const currentSearchParams = searchParams.toString();

    const newUrl = `/${newLocale}/${newPath}${
      currentSearchParams ? `?${currentSearchParams}` : ""
    }`;

    router.push(newUrl);
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
