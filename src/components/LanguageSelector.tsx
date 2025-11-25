"use client";

import { memo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { setLocale } from "@/redux/slices/general";
import { Locale } from "@/types/locale";
import { Locale as LocaleEnum } from "@/enums/locale.enum";
import { Languages } from "lucide-react";

const LanguageSelector: React.FC = () => {
  const { isArabic } = useSelector((state: RootState) => state.general);
  const dispatch = useDispatch<AppDispatch>();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const t = useTranslations("components.LanguageSelector");

  const handleLangChange = (value: string) => {
    const newLocale = value;
    const pathSegments = pathname.split("/").filter(Boolean);
    const newPath = pathSegments.slice(1).join("/"); // removes the existing locale from the path

    dispatch(setLocale(newLocale as Locale));

    const currentSearchParams = searchParams.toString();

    const newUrl = `/${newLocale}/${newPath}${
      currentSearchParams ? `?${currentSearchParams}` : ""
    }`;

    router.push(newUrl);
  };

  const selectClass: string =
    "w-full cursor-pointer py-1 px-2 flex items-center justify-center";

  return (
    <Select onValueChange={handleLangChange}>
      <SelectTrigger className="min-w-24 w-auto max-w-32 text-text-primary-100 text-sm shadow-none flex items-center gap-2">
        <Languages className="w-4 h-4" />
        <SelectValue placeholder={isArabic ? t("arabic") : t("english")} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem className={selectClass} value={LocaleEnum.EN}>
          {t("english")}
        </SelectItem>
        <SelectItem className={selectClass} value={LocaleEnum.AR}>
          {t("arabic")}
        </SelectItem>
      </SelectContent>
    </Select>
  );
};

export default memo(LanguageSelector);
