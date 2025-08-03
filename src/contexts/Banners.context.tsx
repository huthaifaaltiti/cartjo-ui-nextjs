"use client";

import { createContext, ReactNode, useContext, useState } from "react";

type BannerContextProps = {
  searchQuery: string;
  setSearchQuery: (searchQuery: string) => void;
  queryKey: string;
  token: string;
};

const BannersContext = createContext<BannerContextProps | undefined>(undefined);

type BannersContextProviderProps = {
  children: ReactNode;
  token: string;
};

export const BannersContextProvider = ({
  children,
  token,
}: BannersContextProviderProps) => {
  const queryKey = "banners";
  const [searchQuery, setSearchQuery] = useState<string>("");

  return (
    <BannersContext.Provider
      value={{ searchQuery, setSearchQuery, queryKey, token }}
    >
      {children}
    </BannersContext.Provider>
  );
};

export const useBanners = () => {
  const context = useContext(BannersContext);

  if (!context)
    throw new Error("useBanners must be used within a BannersContextProvider");

  return context;
};
