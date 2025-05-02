"use client";

import { createContext, useContext } from "react";

interface LocaleContextProps {
  locale: string;
}

const LocaleContext = createContext<LocaleContextProps | null>(null);

export const useLocale = (): LocaleContextProps => {
  const context = useContext(LocaleContext);

  if (!context) {
    throw new Error("useLocale must be used within a LocaleProvider");
  }
  return context;
};

export const LocaleProvider = ({
  children,
  locale,
}: {
  children: React.ReactNode;
  locale: string;
}) => {
  return (
    <LocaleContext.Provider value={{ locale }}>
      {children}
    </LocaleContext.Provider>
  );
};
