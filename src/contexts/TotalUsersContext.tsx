"use client";

import { createContext, ReactNode, useContext, useState } from "react";

type TotalUsersContextProps = {
  searchQuery: string;
  setSearchQuery: (searchQuery: string) => void;
  accessToken: string;
};

type TotalUsersProviderProps = {
  children: ReactNode;
  accessToken: string;
};

const TotalUsersContext = createContext<undefined | TotalUsersContextProps>(
  undefined
);

export const TotalUsersProvider = ({
  children,
  accessToken,
}: TotalUsersProviderProps) => {
  const [searchQuery, setSearchQuery] = useState<string>("");

  return (
    <TotalUsersContext.Provider
      value={{ searchQuery, setSearchQuery, accessToken }}
    >
      {children}
    </TotalUsersContext.Provider>
  );
};

export const useTotalUsers = () => {
  const context = useContext(TotalUsersContext);

  if (context === undefined)
    throw new Error("useTotalUsers must be used with TotalUsersProvider");

  return context;
};
