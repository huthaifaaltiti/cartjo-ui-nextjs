"use client";

import { createContext, ReactNode, useContext, useState } from "react";
import { API_ENDPOINTS } from "@/lib/apiEndpoints";
import { Locale } from "@/types/locale";
import { BaseResponse } from "@/types/service-response.type";

type ShowcasesContextType = {
  queryKey: string;
  searchQuery: string;
  accessToken: string | null;
  setSearchQuery: (searchQuery: string) => void;
  deleteShowcase: (
    token: string | null,
    showcaseId: string,
    lang: Locale
  ) => Promise<BaseResponse>;
  unDeleteShowcase: (
    token: string | null,
    showcaseId: string,
    lang: Locale
  ) => Promise<BaseResponse>;
  switchShowcaseActiveStatus: (
    token: string | null,
    lang: Locale | string,
    isActive: boolean,
    showcaseId: string
  ) => Promise<BaseResponse>;
};

type ShowcasesContextProviderType = {
  accessToken: string | null;
  children: ReactNode;
};

const ShowcasesContext = createContext<undefined | ShowcasesContextType>(
  undefined
);

export const ShowcasesContextProvider = ({
  accessToken,
  children,
}: ShowcasesContextProviderType) => {
  const queryKey: string = "showcases";
  const [searchQuery, setSearchQuery] = useState<string>("");

  const deleteShowcase = async (
    token: string | null,
    showcaseId: string,
    lang: Locale
  ): Promise<BaseResponse> => {
    const res = await fetch(
      `${API_ENDPOINTS.DASHBOARD.SHOWCASES.DELETE}/${showcaseId}`,
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
      throw new Error("Failed to delete showcase");
    }

    const resJson = await res.json();
    return resJson;
  };

  const unDeleteShowcase = async (
    token: string | null,
    showcaseId: string,
    lang: Locale
  ): Promise<BaseResponse> => {
    const res = await fetch(
      `${API_ENDPOINTS.DASHBOARD.SHOWCASES.UN_DELETE}/${showcaseId}`,
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
      throw new Error("Failed to un-delete showcase");
    }

    const resJson = await res.json();
    return resJson;
  };

  const switchShowcaseActiveStatus = async (
    token: string | null,
    lang: Locale | string,
    isActive: boolean,
    showcaseId: string
  ): Promise<BaseResponse> => {
    const res = await fetch(
      `${API_ENDPOINTS.DASHBOARD.SHOWCASES.SWITCH_ACTIVE_STATUS}/${showcaseId}`,
      {
        method: "PUT",
        body: JSON.stringify({ lang, isActive }),
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!res.ok) throw new Error("Could not switch active status to showcase");

    const resJson = await res.json();
    return resJson;
  };

  return (
    <ShowcasesContext.Provider
      value={{
        queryKey,
        searchQuery,
        accessToken,
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
      "Showcases context should be used within showcase context provider"
    );

  return context;
};
