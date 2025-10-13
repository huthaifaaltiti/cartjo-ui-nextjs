import { Metadata } from "next";
import { Locale } from "@/types/locale";

interface Props {
  locale: Locale | string;
  titleAr: string;
  titleEn: string;
  descAr: string;
  descEn: string;
}

export function generateLocalizedMetadata({
  locale,
  titleAr,
  titleEn,
  descAr,
  descEn,
}: Props): Metadata {
  const isArabic = locale === "ar";

  return {
    title: isArabic ? titleAr : titleEn,
    description: isArabic ? descAr : descEn,
  };
}
