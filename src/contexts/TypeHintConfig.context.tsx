"use client";

import { API_ENDPOINTS } from "@/lib/apiEndpoints";
import { Locale } from "@/types/locale";
import { BaseResponse } from "@/types/service-response.type";
import { createContext, ReactNode, useContext, useState } from "react";

type TypeHintConfigContextType = {
  token: string | null;
  queryKey: string;
  searchQuery: string;
  setSearchQuery: (searchQuery: string) => void;
  deleteTypeHintConfig: (
    token: string | null,
    bannerId: string,
    lang: Locale
  ) => Promise<BaseResponse>;
  unDeleteTypeHintConfig: (
    token: string | null,
    bannerId: string,
    lang: Locale
  ) => Promise<BaseResponse>;
  switchTypeHintConfigActiveStatus: (
    token: string | null,
    lang: Locale | string,
    isActive: boolean,
    bannerId: string
  ) => Promise<BaseResponse>;
};

const TypeHintConfigContext = createContext<
  undefined | TypeHintConfigContextType
>(undefined);

type TypeHintConfigContextProviderType = {
  children: ReactNode;
  token: string | null;
};

export const TypeHintConfigContextProvider = ({
  children,
  token,
}: TypeHintConfigContextProviderType) => {
  const queryKey: string = "typeHintConfigs";
  const [searchQuery, setSearchQuery] = useState<string>("");

  const deleteTypeHintConfig = async (
    token: string | null,
    typeHintConfigId: string,
    lang: Locale
  ): Promise<BaseResponse> => {
    const res = await fetch(
      `${API_ENDPOINTS.DASHBOARD.TYPE_HINT_CONFIGS.DELETE}/${typeHintConfigId}`,
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
      throw new Error("Failed to delete typeHintConfig");
    }

    const resJson = await res.json();
    return resJson;
  };

  const unDeleteTypeHintConfig = async (
    token: string | null,
    typeHintConfigId: string,
    lang: Locale
  ): Promise<BaseResponse> => {
    const res = await fetch(
      `${API_ENDPOINTS.DASHBOARD.TYPE_HINT_CONFIGS.UN_DELETE}/${typeHintConfigId}`,
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
      throw new Error("Failed to un-delete typeHintConfig");
    }

    const resJson = await res.json();
    return resJson;
  };

  const switchTypeHintConfigActiveStatus = async (
    token: string | null,
    lang: Locale | string,
    isActive: boolean,
    typeHintConfigId: string
  ): Promise<BaseResponse> => {
    const res = await fetch(
      `${API_ENDPOINTS.DASHBOARD.TYPE_HINT_CONFIGS.SWITCH_ACTIVE_STATUS}/${typeHintConfigId}`,
      {
        method: "PUT",
        body: JSON.stringify({ lang, isActive }),
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!res.ok)
      throw new Error("Could not switch active status to typeHintConfig");

    const resJson = await res.json();
    return resJson;
  };

  return (
    <TypeHintConfigContext.Provider
      value={{
        token,
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
      "Type-Hint Config context should be used within Type-Hint Config context provider"
    );

  return context;
};
