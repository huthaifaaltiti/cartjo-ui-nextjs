"use client";

import { createContext, ReactNode, useContext, useState } from "react";
import { useLocale } from "next-intl";
import { useSession } from "next-auth/react";

import { CustomSession } from "@/lib/authOptions";
import { Locale } from "@/types/locale";

type LogoContextProps = {
  changeLogo: boolean;
  setChangeLogo: (changeLogo: boolean) => void;
  accessToken: string;
  locale: Locale | string;
};

const LogoContext = createContext<undefined | LogoContextProps>(undefined);

type LogoContextProviderProps = {
  children: ReactNode;
};

export const LogoContextProvider = ({ children }: LogoContextProviderProps) => {
  const [changeLogo, setChangeLogo] = useState<boolean>(false);

  const { data: session } = useSession();
  const accessToken = (session as CustomSession)?.accessToken;

  const locale = useLocale();

  return (
    <LogoContext.Provider
      value={{
        changeLogo,
        setChangeLogo,
        accessToken,
        locale,
      }}
    >
      {children}
    </LogoContext.Provider>
  );
};

export const useLogoContext = () => {
  const context = useContext(LogoContext);

  if (!context) {
    throw new Error("Logo context must be used within a Logo context provider");
  }

  return context;
};
