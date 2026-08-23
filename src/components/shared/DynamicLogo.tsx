"use client";

import { useEffect } from "react";
import { useLocale } from "next-intl";
import { useActiveLogoQuery } from "@/hooks/react-query/useLogosQuery";
import { useHomeEffectsContext } from "@/contexts/HomeEffectsContext";
import { isArabicLocale } from "@/config/locales.config";
import StaticLogo from "./StaticLogo";
import CustomImage from "../admin/shared/CustomImage";

export default function DynamicLogo() {
  const { changeLogo, setChangeLogo } = useHomeEffectsContext();
  const { data, isError, refetch } = useActiveLogoQuery();

  useEffect(() => {
    if (!changeLogo) return;

    refetch().finally(() => {
      setChangeLogo(false);
    });
  }, [changeLogo, refetch, setChangeLogo]);

  const locale = useLocale();
  const isArabic = isArabicLocale(locale);

  const logoUrl = isArabic
    ? data?.data?.media?.ar?.url
    : data?.data?.media?.en?.url;
  const altText =
    (isArabic ? data?.data?.altText?.ar : data?.data?.altText?.en) ??
    "Web app logo";

  if (isError || !logoUrl) return <StaticLogo />;

  return (
    <CustomImage
      src={logoUrl}
      alt={altText}
      fill={false}
      height={50}
      width={150}
      loading="eager"
      priority
    />
  );
}
