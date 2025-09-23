"use client";

import { createContext, ReactNode, useContext } from "react";
import { useLocale } from "next-intl";
import { isArabicLocale } from "@/config/locales.config";
import { Locale } from "@/types/locale";

type GeneralContextProps = {
  isArabic: boolean;
  dir: "rtl" | "ltr";
  locale: Locale | string;
};

const GeneralContext = createContext<undefined | GeneralContextProps>(
  undefined
);

type GeneralContextProviderProps = {
  children: ReactNode;
};

export const GeneralContextProvider = ({
  children,
}: GeneralContextProviderProps) => {
  const locale = useLocale();
  const isArabic = isArabicLocale(locale);
  const dir = isArabic ? "rtl" : "ltr";

  return (
    <GeneralContext.Provider
      value={{
        isArabic,
        dir,
        locale,
      }}
    >
      {children}
    </GeneralContext.Provider>
  );
};

export const useGeneralContext = () => {
  const context = useContext(GeneralContext);

  if (!context)
    throw new Error(
      "General Context should be used within GeneralContext.Provider"
    );

  return context;
};
