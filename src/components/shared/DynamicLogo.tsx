"use client";

import { useEffect } from "react";
import { useActiveLogoQuery } from "@/hooks/react-query/useLogosQuery";
import { useHomeEffectsContext } from "@/contexts/HomeEffectsContext";
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

  const logoUrl = data?.data?.media?.url;
  const altText = data?.data?.altText ?? "Web app logo";

  if (isError || !logoUrl) return <StaticLogo />;

  return (
    <CustomImage
      src={logoUrl}
      alt={altText}
      fill={false}
      height={40}
      width={120}
      loading="eager"
      priority
    />
  );
}
