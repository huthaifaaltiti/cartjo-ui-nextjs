"use client";

import { createContext, ReactNode, useContext, useState } from "react";
import { API_ENDPOINTS } from "@/lib/apiEndpoints";
import { Locale } from "@/types/locale";
import { BaseResponse } from "@/types/service-response.type";
import { authFetcher } from "@/utils/authFetcher";
import { SHOWCASES_QUERY_KEY } from "@/hooks/react-query/query-options/showcases";

type ShowcasesContextType = {
  queryKey: string;
  searchQuery: string;
  setSearchQuery: (searchQuery: string) => void;
  deleteShowcase: (showcaseId: string, lang: Locale) => Promise<BaseResponse>;
  unDeleteShowcase: (showcaseId: string, lang: Locale) => Promise<BaseResponse>;
  switchShowcaseActiveStatus: (
    lang: Locale | string,
    isActive: boolean,
    showcaseId: string,
  ) => Promise<BaseResponse>;
};

type ShowcasesContextProviderType = {
  children: ReactNode;
};

const ShowcasesContext = createContext<undefined | ShowcasesContextType>(
  undefined,
);

export const ShowcasesContextProvider = ({
  children,
}: ShowcasesContextProviderType) => {
  const queryKey: string = SHOWCASES_QUERY_KEY;
  const [searchQuery, setSearchQuery] = useState<string>("");

  const deleteShowcase = async (
    showcaseId: string,
    lang: Locale,
  ): Promise<BaseResponse> => {
    return await authFetcher(
      `${API_ENDPOINTS.DASHBOARD.SHOWCASES.DELETE}/${showcaseId}`,
      {
        method: "DELETE",
        body: JSON.stringify({ lang }),
      },
    );
  };

  const unDeleteShowcase = async (
    showcaseId: string,
    lang: Locale,
  ): Promise<BaseResponse> => {
    return await authFetcher(
      `${API_ENDPOINTS.DASHBOARD.SHOWCASES.UN_DELETE}/${showcaseId}`,
      {
        method: "DELETE",
        body: JSON.stringify({ lang }),
      },
    );
  };

  const switchShowcaseActiveStatus = async (
    lang: Locale | string,
    isActive: boolean,
    showcaseId: string,
  ): Promise<BaseResponse> => {
    return await authFetcher(
      `${API_ENDPOINTS.DASHBOARD.SHOWCASES.SWITCH_ACTIVE_STATUS}/${showcaseId}`,
      {
        method: "PUT",
        body: JSON.stringify({ lang, isActive }),
      },
    );
  };

  return (
    <ShowcasesContext.Provider
      value={{
        queryKey,
        searchQuery,
        setSearchQuery,
        deleteShowcase,
        unDeleteShowcase,
        switchShowcaseActiveStatus,
      }}
    >
      {children}
    </ShowcasesContext.Provider>
  );
};

export const useShowcases = () => {
  const context = useContext(ShowcasesContext);

  if (context === undefined)
    throw new Error(
      "Showcases context should be used within showcase context provider",
    );

  return context;
};
