"use client";

import { createContext, ReactNode, useContext, useState } from "react";
import { API_ENDPOINTS } from "@/lib/apiEndpoints";
import { Locale } from "@/types/locale";
import { BaseResponse } from "@/types/service-response.type";

type LogosContextType = {
  queryKey: string;
  searchQuery: string;
  accessToken: string | null;
  setSearchQuery: (searchQuery: string) => void;
  deleteLogo: (
    token: string | null,
    logoId: string,
    lang: Locale
  ) => Promise<BaseResponse>;
  unDeleteLogo: (
    token: string | null,
    logoId: string,
    lang: Locale
  ) => Promise<BaseResponse>;
  switchLogoActiveStatus: (
    token: string | null,
    lang: Locale | string,
    isActive: boolean,
    catId: string
  ) => Promise<BaseResponse>;
};

type LogosContextProviderType = {
  accessToken: string | null;
  children: ReactNode;
};

const LogosContext = createContext<undefined | LogosContextType>(undefined);

export const LogosContextProvider = ({
  accessToken,
  children,
}: LogosContextProviderType) => {
  const queryKey: string = "logos";
  const [searchQuery, setSearchQuery] = useState<string>("");

  const deleteLogo = async (
    token: string | null,
    logoId: string,
    lang: Locale
  ): Promise<BaseResponse> => {
    const res = await fetch(
      `${API_ENDPOINTS.DASHBOARD.LOGOS.DELETE}/${logoId}`,
      {
        method: "DELETE",
        body: JSON.stringify({ lang }),
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!res.ok) {
      throw new Error("Failed to delete logo");
    }

    const resJson = await res.json();
    return resJson;
  };

  const unDeleteLogo = async (
    token: string | null,
    logoId: string,
    lang: Locale
  ): Promise<BaseResponse> => {
    const res = await fetch(
      `${API_ENDPOINTS.DASHBOARD.LOGOS.UN_DELETE}/${logoId}`,
      {
        method: "DELETE",
        body: JSON.stringify({ lang }),
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!res.ok) {
      throw new Error("Failed to un-delete logo");
    }

    const resJson = await res.json();
    return resJson;
  };

  const switchLogoActiveStatus = async (
    token: string | null,
    lang: Locale | string,
    isActive: boolean,
    logoId: string
  ): Promise<BaseResponse> => {
    const res = await fetch(
      `${API_ENDPOINTS.DASHBOARD.LOGOS.SWITCH_ACTIVE_STATUS}/${logoId}`,
      {
        method: "PUT",
        body: JSON.stringify({ lang, isActive }),
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!res.ok) throw new Error("Could not switch active status to logo");

    const resJson = await res.json();
    return resJson;
  };

  return (
    <LogosContext.Provider
      value={{
        queryKey,
        searchQuery,
        accessToken,
        setSearchQuery,
        deleteLogo,
        unDeleteLogo,
        switchLogoActiveStatus,
      }}
    >
      {children}
    </LogosContext.Provider>
  );
};

export const useLogos = () => {
  const context = useContext(LogosContext);

  if (context === undefined)
    throw new Error(
      "Logos context should be used within logo context provider"
    );

  return context;
};
