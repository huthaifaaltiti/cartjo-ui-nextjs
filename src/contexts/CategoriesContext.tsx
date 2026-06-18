"use client";

import { createContext, ReactNode, useContext, useState } from "react";
import { API_ENDPOINTS } from "@/lib/apiEndpoints";
import { Locale } from "@/types/locale";
import { BaseResponse } from "@/types/service-response.type";
import { authFetcher } from "@/utils/authFetcher";
import { CATEGORIES_KEY } from "@/hooks/react-query/query-options/categories";

type CategoriesContextType = {
  queryKey: string;
  searchQuery: string;
  setSearchQuery: (searchQuery: string) => void;
  deleteCategory: (catId: string, lang: Locale) => Promise<BaseResponse>;
  unDeleteCategory: (catId: string, lang: Locale) => Promise<BaseResponse>;
  switchCategoryActiveStatus: (
    lang: Locale | string,
    isActive: boolean,
    catId: string,
  ) => Promise<BaseResponse>;
};

type CategoriesContextProviderType = {
  children: ReactNode;
};

const CategoriesContext = createContext<undefined | CategoriesContextType>(
  undefined,
);

export const CategoriesContextProvider = ({
  children,
}: CategoriesContextProviderType) => {
  const queryKey: string = CATEGORIES_KEY;
  const [searchQuery, setSearchQuery] = useState<string>("");

  const deleteCategory = async (
    catId: string,
    lang: Locale,
  ): Promise<BaseResponse> => {
    return await authFetcher(
      `${API_ENDPOINTS.DASHBOARD.CATEGORIES.DELETE}/${catId}`,
      {
        method: "DELETE",
        body: JSON.stringify({ lang }),
      },
    );
  };

  const unDeleteCategory = async (
    catId: string,
    lang: Locale,
  ): Promise<BaseResponse> => {
    return await authFetcher(
      `${API_ENDPOINTS.DASHBOARD.CATEGORIES.UN_DELETE}/${catId}`,
      {
        method: "DELETE",
        body: JSON.stringify({ lang }),
      },
    );
  };

  const switchCategoryActiveStatus = async (
    lang: Locale | string,
    isActive: boolean,
    catId: string,
  ): Promise<BaseResponse> => {
    return await authFetcher(
      `${API_ENDPOINTS.DASHBOARD.CATEGORIES.SWITCH_ACTIVE_STATUS}/${catId}`,
      {
        method: "PUT",
        body: JSON.stringify({ lang, isActive }),
      },
    );
  };

  return (
    <CategoriesContext.Provider
      value={{
        queryKey,
        searchQuery,
        setSearchQuery,
        deleteCategory,
        unDeleteCategory,
        switchCategoryActiveStatus,
      }}
    >
      {children}
    </CategoriesContext.Provider>
  );
};

export const useCategories = () => {
  const context = useContext(CategoriesContext);

  if (context === undefined)
    throw new Error(
      "Categories context should be used within categories context provider",
    );

  return context;
};
