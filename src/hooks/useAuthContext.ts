import { useSession } from "next-auth/react";
import { useLocale } from "next-intl";
import { CustomSession, CustomUser } from "@/lib/authOptions";
import { Locale } from "@/types/locale";

export const useAuthContext = () => {
  const { data: session, status } = useSession();
  const locale: Locale | string = useLocale();
  const accessToken: string | null = (session as CustomSession)?.accessToken;
  const user: CustomUser | undefined = (session as CustomSession)?.user;
  const userId: string | undefined = (session as CustomSession)?.user?.id;
  const isAuthenticated: boolean = status === "unauthenticated" || !!accessToken;
  const isSessionLoading: boolean = status === "loading";

  return {
    session: session as CustomSession | null,
    locale,
    accessToken,
    userId,
    user,
    status,
    isAuthenticated,
    isSessionLoading
  };
};
