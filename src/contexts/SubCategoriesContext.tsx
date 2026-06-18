"use client";

import { createContext, ReactNode, useContext, useState } from "react";
import { API_ENDPOINTS } from "@/lib/apiEndpoints";
import { Locale } from "@/types/locale";
import { SwitchUserActiveStatusResponse } from "@/types/totalUser";
import { BaseResponse } from "@/types/service-response.type";
import { authFetcher } from "@/utils/authFetcher";
import { SUB_CATEGORIES_KEY } from "@/hooks/react-query/query-options/subCategories";

interface SubCategoriesContextType {
  searchQuery: string;
  setSearchQuery: (searchQuery: string) => void;
  queryKey: string;
  deleteSubCategory: (subCatId: string) => Promise<BaseResponse>;
  unDeleteSubCategory: (subCatId: string) => Promise<BaseResponse>;
  switchSubCategoryActiveStatus: (
    lang: Locale | string,
    isActive: boolean,
    subCatId: string,
  ) => Promise<BaseResponse>;
  selectedCatId?: string;
  setSelectedCatId?: (id: string | undefined) => void;
}

interface SubCategoriesContextProviderProps {
  children: ReactNode;
}

const SubCategoriesContext = createContext<
  SubCategoriesContextType | undefined
>(undefined);

export const SubCategoriesContextProvider = ({
  children,
}: SubCategoriesContextProviderProps) => {
  const queryKey = SUB_CATEGORIES_KEY;

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCatId, setSelectedCatId] = useState<string | undefined>();

  const deleteSubCategory = async (subCatId: string): Promise<BaseResponse> => {
    return await authFetcher(
      `${API_ENDPOINTS.DASHBOARD.SUB_CATEGORIES.DELETE}/${subCatId}`,
      {
        method: "DELETE",
      },
    );
  };

  const unDeleteSubCategory = async (
    subCatId: string,
  ): Promise<BaseResponse> => {
    return await authFetcher(
      `${API_ENDPOINTS.DASHBOARD.SUB_CATEGORIES.UN_DELETE}/${subCatId}`,
      {
        method: "DELETE",
      },
    );
  };

  const switchSubCategoryActiveStatus = async (
    lang: Locale | string,
    isActive: boolean,
    subCatId: string,
  ): Promise<SwitchUserActiveStatusResponse> => {
    return await authFetcher(
      `${API_ENDPOINTS.DASHBOARD.SUB_CATEGORIES.SWITCH_ACTIVE_STATUS}/${subCatId}`,
      {
        method: "PUT",
        body: JSON.stringify({ lang, isActive }),
      },
    );
  };

  return (
    <SubCategoriesContext.Provider
      value={{
        searchQuery,
        setSearchQuery,
        queryKey,
        deleteSubCategory,
        unDeleteSubCategory,
        switchSubCategoryActiveStatus,
        selectedCatId,
        setSelectedCatId,
      }}
    >
      {children}
    </SubCategoriesContext.Provider>
  );
};

export const useSubCategories = () => {
  const context = useContext(SubCategoriesContext);

  if (context === undefined)
    throw new Error(
      "SubCategories context should be used within SubCategories provider",
    );

  return context;
};
