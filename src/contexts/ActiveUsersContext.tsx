"use client";

import { API_ENDPOINTS } from "@/lib/apiEndpoints";
import { Locale } from "@/types/locale";
import {
  DeleteUserResponse,
  SwitchUserActiveStatusResponse,
  UnDeleteUserResponse,
} from "@/types/totalUser";
import { authFetcher } from "@/utils/authFetcher";
import { createContext, ReactNode, useContext, useState } from "react";

type ActiveUsersContextProps = {
  searchQuery: string;
  setSearchQuery: (searchQuery: string) => void;
  deleteUser: (userId: string) => Promise<DeleteUserResponse>;
  unDeleteUser: (userId: string) => Promise<UnDeleteUserResponse>;
  switchUserActiveStatus: (
    lang: Locale | string,
    isActive: boolean,
    userId: string,
  ) => Promise<SwitchUserActiveStatusResponse>;
};

type ActiveUsersContextProviderProps = {
  children: ReactNode;
};

const ActiveUsersContext = createContext<undefined | ActiveUsersContextProps>(
  undefined,
);

export const ActiveUsersContextProvider = ({
  children,
}: ActiveUsersContextProviderProps) => {
  const [searchQuery, setSearchQuery] = useState<string>("");

  const deleteUser = async (userId: string): Promise<UnDeleteUserResponse> => {
    return await authFetcher(
      `${API_ENDPOINTS.DASHBOARD.USERS.DELETE_USER}/${userId}`,
      {
        method: "DELETE",
      },
    );
  };

  const unDeleteUser = async (userId: string): Promise<DeleteUserResponse> => {
    return await authFetcher(
      `${API_ENDPOINTS.DASHBOARD.USERS.UNDELETE_USER}/${userId}`,
      {
        method: "DELETE",
      },
    );
  };

  const switchUserActiveStatus = async (
    lang: Locale | string,
    isActive: boolean,
    userId: string,
  ): Promise<SwitchUserActiveStatusResponse> => {
    return await authFetcher(
      `${API_ENDPOINTS.DASHBOARD.USERS.SWITCH_USER_ACTIVE_STATUS}/${userId}`,
      {
        method: "PUT",
        body: JSON.stringify({ lang, isActive }),
      },
    );
  };

  return (
    <ActiveUsersContext.Provider
      value={{
        searchQuery,
        setSearchQuery,
        deleteUser,
        unDeleteUser,
        switchUserActiveStatus,
      }}
    >
      {children}
    </ActiveUsersContext.Provider>
  );
};

export const useActiveUsers = () => {
  const context = useContext(ActiveUsersContext);

  if (context === undefined)
    throw new Error("useActiveUsers must be used with ActiveUsersProvider");

  return context;
};
