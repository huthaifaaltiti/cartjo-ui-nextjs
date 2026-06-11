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

type TotalUsersContextProps = {
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

type TotalUsersProviderProps = {
  children: ReactNode;
};

const TotalUsersContext = createContext<undefined | TotalUsersContextProps>(
  undefined,
);

export const TotalUsersProvider = ({ children }: TotalUsersProviderProps) => {
  const [searchQuery, setSearchQuery] = useState<string>("");

  const deleteUser = async (userId: string): Promise<DeleteUserResponse> => {
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
    <TotalUsersContext.Provider
      value={{
        searchQuery,
        setSearchQuery,
        deleteUser,
        unDeleteUser,
        switchUserActiveStatus,
      }}
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
