"use client";

import { TYPE_HINT_CONFIGS_QUERY_KEY } from "@/hooks/react-query/query-options/typeHintConfigs";
import { API_ENDPOINTS } from "@/lib/apiEndpoints";
import { Locale } from "@/types/locale";
import { BaseResponse } from "@/types/service-response.type";
import { authFetcher } from "@/utils/authFetcher";
import { createContext, ReactNode, useContext, useState } from "react";

type TypeHintConfigContextType = {
  queryKey: string;
  searchQuery: string;
  setSearchQuery: (searchQuery: string) => void;
  deleteTypeHintConfig: (
    bannerId: string,
    lang: Locale,
  ) => Promise<BaseResponse>;
  unDeleteTypeHintConfig: (
    bannerId: string,
    lang: Locale,
  ) => Promise<BaseResponse>;
  switchTypeHintConfigActiveStatus: (
    lang: Locale | string,
    isActive: boolean,
    bannerId: string,
  ) => Promise<BaseResponse>;
};

const TypeHintConfigContext = createContext<
  undefined | TypeHintConfigContextType
>(undefined);

type TypeHintConfigContextProviderType = {
  children: ReactNode;
};

export const TypeHintConfigContextProvider = ({
  children,
}: TypeHintConfigContextProviderType) => {
  const queryKey: string = TYPE_HINT_CONFIGS_QUERY_KEY;
  const [searchQuery, setSearchQuery] = useState<string>("");

  const deleteTypeHintConfig = async (
    typeHintConfigId: string,
    lang: Locale,
  ): Promise<BaseResponse> => {
    return await authFetcher(
      `${API_ENDPOINTS.DASHBOARD.TYPE_HINT_CONFIGS.DELETE}/${typeHintConfigId}`,
      {
        method: "DELETE",
        body: JSON.stringify({ lang }),
      },
    );
  };

  const unDeleteTypeHintConfig = async (
    typeHintConfigId: string,
    lang: Locale,
  ): Promise<BaseResponse> => {
    return await authFetcher(
      `${API_ENDPOINTS.DASHBOARD.TYPE_HINT_CONFIGS.UN_DELETE}/${typeHintConfigId}`,
      {
        method: "DELETE",
        body: JSON.stringify({ lang }),
      },
    );
  };

  const switchTypeHintConfigActiveStatus = async (
    lang: Locale | string,
    isActive: boolean,
    typeHintConfigId: string,
  ): Promise<BaseResponse> => {
    return await authFetcher(
      `${API_ENDPOINTS.DASHBOARD.TYPE_HINT_CONFIGS.SWITCH_ACTIVE_STATUS}/${typeHintConfigId}`,
      {
        method: "PUT",
        body: JSON.stringify({ lang, isActive }),
      },
    );
  };

  return (
    <TypeHintConfigContext.Provider
      value={{
        queryKey,
        searchQuery,
        setSearchQuery,
        deleteTypeHintConfig,
        unDeleteTypeHintConfig,
        switchTypeHintConfigActiveStatus,
      }}
    >
      {children}
    </TypeHintConfigContext.Provider>
  );
};

export const useTypeHintConfig = () => {
  const context = useContext(TypeHintConfigContext);

  if (!context)
    throw new Error(
      "Type-Hint Config context should be used within Type-Hint Config context provider",
    );

  return context;
};
