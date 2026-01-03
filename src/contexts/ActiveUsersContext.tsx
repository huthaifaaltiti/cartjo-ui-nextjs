"use client";

import { API_ENDPOINTS } from "@/lib/apiEndpoints";
import { Locale } from "@/types/locale";
import {
  DeleteUserResponse,
  SwitchUserActiveStatusResponse,
  UnDeleteUserResponse,
} from "@/types/totalUser";
import { createContext, ReactNode, useContext, useState } from "react";

type ActiveUsersContextProps = {
  searchQuery: string;
  setSearchQuery: (searchQuery: string) => void;
  accessToken: string | null;
  deleteUser: (token: string | null, userId: string) => Promise<DeleteUserResponse>;
  unDeleteUser: (
    token: string | null,
    userId: string
  ) => Promise<UnDeleteUserResponse>;
  switchUserActiveStatus: (
    token: string | null,
    lang: Locale | string,
    isActive: boolean,
    userId: string
  ) => Promise<SwitchUserActiveStatusResponse>;
};

type ActiveUsersContextProviderProps = {
  children: ReactNode;
  accessToken: string | null;
};

const ActiveUsersContext = createContext<undefined | ActiveUsersContextProps>(
  undefined
);

export const ActiveUsersContextProvider = ({
  children,
  accessToken,
}: ActiveUsersContextProviderProps) => {
  const [searchQuery, setSearchQuery] = useState<string>("");

  const deleteUser = async (
    token: string | null,
    userId: string
  ): Promise<UnDeleteUserResponse> => {
    const res = await fetch(
      `${API_ENDPOINTS.DASHBOARD.USERS.DELETE_USER}/${userId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!res.ok) {
      throw new Error("Failed to delete user");
    }

    const resJson = await res.json();
    return resJson;
  };

  const unDeleteUser = async (
    token: string | null,
    userId: string
  ): Promise<DeleteUserResponse> => {
    const res = await fetch(
      `${API_ENDPOINTS.DASHBOARD.USERS.UNDELETE_USER}/${userId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!res.ok) {
      throw new Error("Failed to delete user");
    }

    const resJson = await res.json();
    return resJson;
  };

  const switchUserActiveStatus = async (
    token: string | null,
    lang: Locale | string,
    isActive: boolean,
    userId: string
  ): Promise<SwitchUserActiveStatusResponse> => {
    const res = await fetch(
      `${API_ENDPOINTS.DASHBOARD.USERS.SWITCH_USER_ACTIVE_STATUS}/${userId}`,
      {
        method: "PUT",
        body: JSON.stringify({ lang, isActive }),
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!res.ok) throw new Error("Could not switch user active status");

    const resJson = await res.json();
    return resJson;
  };

  return (
    <ActiveUsersContext.Provider
      value={{
        searchQuery,
        setSearchQuery,
        accessToken,
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
