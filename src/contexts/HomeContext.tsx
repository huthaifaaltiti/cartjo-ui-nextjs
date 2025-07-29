"use client";

import { createContext, ReactNode, useContext, useState } from "react";

type HomeContextProps = {
  mainSearchQuery: string;
  setMainSearchQuery: (mainSearchQuery: string) => void;
};

const HomeContext = createContext<undefined | HomeContextProps>(undefined);

type HomeContextProviderProps = {
  children: ReactNode;
};

export const HomeContextProvider = ({ children }: HomeContextProviderProps) => {
  const [mainSearchQuery, setMainSearchQuery] = useState<string>("");

  return (
    <HomeContext.Provider value={{ mainSearchQuery, setMainSearchQuery }}>
      {children}
    </HomeContext.Provider>
  );
};

export const useHome = () => {
  const context = useContext(HomeContext);

  if (!context) {
    throw new Error("Home context should be used within home context provider");
  }

  return context;
};
