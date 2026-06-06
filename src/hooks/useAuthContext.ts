"use client";

import { useLocale } from "next-intl";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Locale } from "@/types/locale";

export const useAuthContext = () => {
  const locale: Locale | string = useLocale();

  const { session, loading } = useSelector(
    (state: RootState) => state.authentication,
  );

  const isAuthenticated = !!session;

  return {
    session,
    locale,
    userId: session?._id,
    user: session,
    isAuthenticated,
    isSessionLoading: loading,
  };
};
