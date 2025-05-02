"use client";

import { memo } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLocale } from "@/contexts/LocaleContext";
import { usePathname, useRouter } from "next/navigation";

const LanguageSelector: React.FC = () => {
  const { locale } = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const handleLangChange = (value: string) => {
    const newLocale = value;
    const path = pathname.split("/").slice(2).join("/");
    router.push(`/${newLocale}/${path}`);
  };

  return (
    <Select onValueChange={handleLangChange}>
      <SelectTrigger className="w-[100px]">
        <SelectValue placeholder={locale === "ar" ? "العربية" : "English"} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="en">English</SelectItem>
        <SelectItem value="ar">العربية</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default memo(LanguageSelector);
