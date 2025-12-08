import { useSession } from "next-auth/react";
import { useLocale } from "next-intl";
import { CustomSession } from "@/lib/authOptions";
import { Locale } from "@/types/locale";

export const useAuthContext = () => {
  const { data: session, status } = useSession();
  const locale: Locale | string = useLocale();
  const accessToken: string | null = (session as CustomSession)?.accessToken;
  const userId: string | undefined = (session as CustomSession)?.user?.id;
  const isAuthenticated: boolean = status === "unauthenticated" || !!accessToken;
  const isSessionLoading: boolean = status === "loading";

  return {
    session: session as CustomSession | null,
    locale,
    accessToken,
    userId,
    status,
    isAuthenticated,
    isSessionLoading
  };
};
