import { useSession } from "next-auth/react";
import { useLocale } from "next-intl";
import { CustomSession } from "@/lib/authOptions";

export const useAuthContext = () => {
  const { data: session } = useSession();
  const locale = useLocale();
  const accessToken = (session as CustomSession)?.accessToken;

  return {
    session: session as CustomSession | null,
    locale,
    accessToken,
  };
};
