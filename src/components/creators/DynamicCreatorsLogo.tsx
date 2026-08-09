"use client";

import Image from "next/image";
import { useActiveLogoQuery } from "@/hooks/react-query/useLogosQuery";
import { LogoType } from "@/enums/logoType.enum";
import StaticCreatorsLogo from "./StaticCreatorsLogo";

export default function DynamicCreatorsLogo({isArabic}:{isArabic:boolean}) {
  const { data, isError } = useActiveLogoQuery(LogoType.CREATORS);

  const logoUrl = data?.data?.media?.url;
  const altText = data?.data?.altText ?? "CartJO Creators Logo";

  if (isError || !logoUrl) {
    return <StaticCreatorsLogo isArabic={isArabic} />;
  }

  return (
    <Image
      src={logoUrl}
      alt={altText}
      width={120}
      height={40}
      priority
      className="w-auto !h-[40px]"
    />
  );
}
