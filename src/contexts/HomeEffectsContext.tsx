"use client";

import { createContext, ReactNode, useContext, useState } from "react";
import { useLocale } from "next-intl";
import { useSession } from "next-auth/react";
import { CustomSession } from "@/lib/authOptions";
import { Locale } from "@/types/locale";

type HomeEffectsContextProps = {
  changeLogo: boolean;
  setChangeLogo: (changeLogo: boolean) => void;
  accessToken: string;
  locale: Locale | string;
  changeBanners: boolean;
  setChangeBanners: (changeCategories: boolean) => void;
  changeCategories: boolean;
  setChangeCategories: (changeCategories: boolean) => void;
};

const HomeEffectsContext = createContext<undefined | HomeEffectsContextProps>(
  undefined
);

type HomeEffectsContextProviderProps = {
  children: ReactNode;
};

export const HomeEffectsContextProvider = ({
  children,
}: HomeEffectsContextProviderProps) => {
  const [changeLogo, setChangeLogo] = useState<boolean>(false);
  const [changeBanners, setChangeBanners] = useState<boolean>(false);
  const [changeCategories, setChangeCategories] = useState<boolean>(false);

  const { data: session } = useSession();
  const accessToken = (session as CustomSession)?.accessToken;

  const locale = useLocale();

  return (
    <HomeEffectsContext.Provider
      value={{
        changeLogo,
        setChangeLogo,
        accessToken,
        locale,
        changeBanners,
        setChangeBanners,
        changeCategories,
        setChangeCategories,
      }}
    >
      {children}
    </HomeEffectsContext.Provider>
  );
};

export const useHomeEffectsContext = () => {
  const context = useContext(HomeEffectsContext);

  if (!context) {
    throw new Error(
      "Home Effects Context must be used within a Logo context provider"
    );
  }

  return context;
};
