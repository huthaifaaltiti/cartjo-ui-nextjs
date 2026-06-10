"use client";

import { createContext, ReactNode, useContext, useState } from "react";
import { API_ENDPOINTS } from "@/lib/apiEndpoints";
import { Locale } from "@/types/locale";
import { BaseResponse } from "@/types/service-response.type";
import { authFetcher } from "@/utils/authFetcher";

type LogosContextType = {
  queryKey: string;
  searchQuery: string;
  setSearchQuery: (searchQuery: string) => void;
  deleteLogo: (logoId: string, lang: Locale) => Promise<BaseResponse>;
  unDeleteLogo: (logoId: string, lang: Locale) => Promise<BaseResponse>;
  switchLogoActiveStatus: (
    lang: Locale | string,
    isActive: boolean,
    catId: string,
  ) => Promise<BaseResponse>;
};

type LogosContextProviderType = {
  children: ReactNode;
};

const LogosContext = createContext<undefined | LogosContextType>(undefined);

export const LogosContextProvider = ({
  children,
}: LogosContextProviderType) => {
  const queryKey: string = "logos";
  const [searchQuery, setSearchQuery] = useState<string>("");

  const deleteLogo = async (
    logoId: string,
    lang: Locale,
  ): Promise<BaseResponse> => {
    return await authFetcher(
      `${API_ENDPOINTS.DASHBOARD.LOGOS.DELETE}/${logoId}`,
      {
        method: "DELETE",
        body: JSON.stringify({ lang }),
      },
    );
  };

  const unDeleteLogo = async (
    logoId: string,
    lang: Locale,
  ): Promise<BaseResponse> => {
    return await authFetcher(
      `${API_ENDPOINTS.DASHBOARD.LOGOS.UN_DELETE}/${logoId}`,
      {
        method: "DELETE",
        body: JSON.stringify({ lang }),
      },
    );
  };

  const switchLogoActiveStatus = async (
    lang: Locale | string,
    isActive: boolean,
    logoId: string,
  ): Promise<BaseResponse> => {
    return await authFetcher(
      `${API_ENDPOINTS.DASHBOARD.LOGOS.SWITCH_ACTIVE_STATUS}/${logoId}`,
      {
        method: "PUT",
        body: JSON.stringify({ lang, isActive }),
      },
    );
  };

  return (
    <LogosContext.Provider
      value={{
        queryKey,
        searchQuery,
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
      "Logos context should be used within logo context provider",
    );

  return context;
};
