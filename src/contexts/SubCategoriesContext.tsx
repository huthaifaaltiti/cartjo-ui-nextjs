"use client";

import { createContext, ReactNode, useContext, useState } from "react";
import { API_ENDPOINTS } from "@/lib/apiEndpoints";
import { Locale } from "@/types/locale";
import { SwitchUserActiveStatusResponse } from "@/types/totalUser";
import { BaseResponse } from "@/types/service-response.type";

interface SubCategoriesContextType {
  accessToken: string | null;
  searchQuery: string;
  setSearchQuery: (searchQuery: string) => void;
  queryKey: string;
  deleteSubCategory: (
    token: string | null,
    subCatId: string
  ) => Promise<BaseResponse>;
  unDeleteSubCategory: (
    token: string | null,
    subCatId: string
  ) => Promise<BaseResponse>;
  switchSubCategoryActiveStatus: (
    token: string | null,
    lang: Locale | string,
    isActive: boolean,
    subCatId: string
  ) => Promise<BaseResponse>;
  selectedCatId?: string;
  setSelectedCatId?: (id: string | undefined) => void;
}

interface SubCategoriesContextProviderProps {
  children: ReactNode;
  accessToken: string | null;
}

const SubCategoriesContext = createContext<
  SubCategoriesContextType | undefined
>(undefined);

export const SubCategoriesContextProvider = ({
  children,
  accessToken,
}: SubCategoriesContextProviderProps) => {
  const queryKey = "subCategories";
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCatId, setSelectedCatId] = useState<string | undefined>();

  const deleteSubCategory = async (
    token: string | null,
    subCatId: string
  ): Promise<BaseResponse> => {
    const res = await fetch(
      `${API_ENDPOINTS.DASHBOARD.SUB_CATEGORIES.DELETE}/${subCatId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!res.ok) {
      throw new Error("Failed to delete sub-category");
    }

    const resJson = await res.json();
    return resJson;
  };

  const unDeleteSubCategory = async (
    token: string | null,
    subCatId: string
  ): Promise<BaseResponse> => {
    const res = await fetch(
      `${API_ENDPOINTS.DASHBOARD.SUB_CATEGORIES.UN_DELETE}/${subCatId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!res.ok) {
      throw new Error("Failed to un-delete sub-category");
    }

    const resJson = await res.json();
    return resJson;
  };

  const switchSubCategoryActiveStatus = async (
    token: string | null,
    lang: Locale | string,
    isActive: boolean,
    subCatId: string
  ): Promise<SwitchUserActiveStatusResponse> => {
    const res = await fetch(
      `${API_ENDPOINTS.DASHBOARD.SUB_CATEGORIES.SWITCH_ACTIVE_STATUS}/${subCatId}`,
      {
        method: "PUT",
        body: JSON.stringify({ lang, isActive }),
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!res.ok) throw new Error("Could not switch active status");

    const resJson = await res.json();
    return resJson;
  };

  return (
    <SubCategoriesContext.Provider
      value={{
        accessToken,
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
      "SubCategories context should be used within SubCategories provider"
    );

  return context;
};
