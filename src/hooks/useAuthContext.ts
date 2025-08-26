import { useSession } from "next-auth/react";
import { useLocale } from "next-intl";
import { CustomSession } from "@/lib/authOptions";
import { Locale } from "@/types/locale";

export const useAuthContext = () => {
  const { data: session } = useSession();
  const locale: Locale | string = useLocale();
  const accessToken: string | null = (session as CustomSession)?.accessToken;

  return {
    session: session as CustomSession | null,
    locale,
    accessToken,
  };
};
