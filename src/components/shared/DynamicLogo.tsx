"use client";

import { useEffect, useState } from "react";

import { fetchActiveLogo } from "@/hooks/react-query/useLogosQuery";

import { useHomeEffectsContext } from "@/contexts/HomeEffectsContext";
import StaticLogo from "./StaticLogo";
import CustomImage from "../admin/shared/CustomImage";

export default function DynamicLogo() {
  const { changeLogo, setChangeLogo, accessToken, locale } =
    useHomeEffectsContext();

  const [logo, setLogo] = useState<{ url: string | null; altText: string }>({
    url: "",
    altText: "",
  });

  useEffect(() => {
    const getActiveLogo = async () => {
      if (!accessToken) return;

      try {
        const res = await fetchActiveLogo({ token: accessToken, lang: locale });

        if (res?.isSuccess) {
          setLogo(() => ({
            url: res?.data?.media?.url ?? null,
            altText: res?.data?.altText ?? "Web app logo",
          }));

          setChangeLogo(false);
        }
      } catch (error) {
        console.error("Failed to fetch active logo:", error);
      }
    };

    getActiveLogo();
  }, [accessToken, locale, changeLogo]);

  if (!logo?.url) return <StaticLogo />;

  return (
    <CustomImage
      src={logo.url}
      alt={logo.altText}
      fill={false}
      height={40}
      width={120}
      loading="lazy"
    />
  );
}
