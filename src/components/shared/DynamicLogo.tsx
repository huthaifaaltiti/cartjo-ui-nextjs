"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useLocale } from "next-intl";

import { CustomSession } from "@/lib/authOptions";
import { fetchActiveLogo } from "@/hooks/react-query/useLogosQuery";

export function DynamicLogo() {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const { data: session } = useSession();
  const locale = useLocale();
  const accessToken = (session as CustomSession)?.accessToken;

  useEffect(() => {
    const getActiveLogo = async () => {
      if (!accessToken) return;

      try {
        const res = await fetchActiveLogo({ token: accessToken, lang: locale });
        setLogoUrl(res?.data?.media?.url ?? null);
      } catch (error) {
        console.error("Failed to fetch active logo:", error);
      }
    };

    getActiveLogo();
  }, [accessToken, locale]);

  if (!logoUrl) return null;

  return <img src={logoUrl} alt="Site Logo" className="h-10" />;
}
