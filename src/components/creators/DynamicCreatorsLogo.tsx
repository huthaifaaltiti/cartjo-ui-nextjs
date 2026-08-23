"use client";

import { useActiveLogoQuery } from "@/hooks/react-query/useLogosQuery";
import { LogoType } from "@/enums/logoType.enum";
import StaticCreatorsLogo from "./StaticCreatorsLogo";
import CustomImage from "../admin/shared/CustomImage";

export default function DynamicCreatorsLogo({
  isArabic,
}: {
  isArabic: boolean;
}) {
  const { data, isError } = useActiveLogoQuery(LogoType.CREATORS);

  const logoUrl = isArabic
    ? data?.data?.media?.ar?.url
    : data?.data?.media?.en?.url;
  const altText =
    (isArabic ? data?.data?.altText?.ar : data?.data?.altText?.en) ??
    "CartJO Creators Logo";

  if (isError || !logoUrl) {
    return <StaticCreatorsLogo isArabic={isArabic} />;
  }

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
