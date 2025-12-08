"use client";

import { createContext, ReactNode, useContext, useState } from "react";

import { API_ENDPOINTS } from "@/lib/apiEndpoints";

import { DeletingResponse } from "@/types/common";
import { Locale } from "@/types/locale";
import { SwitchActiveStatusResponse } from "@/types/common";

interface SubCategoriesContextType {
  accessToken: string;
  searchQuery: string;
  setSearchQuery: (searchQuery: string) => void;
  queryKey: string;
  deleteSubCategory: (
    token: string,
    subCatId: string
  ) => Promise<DeletingResponse>;
  unDeleteSubCategory: (
    token: string,
    subCatId: string
  ) => Promise<DeletingResponse>;
  switchSubCategoryActiveStatus: (
    token: string,
    lang: Locale | string,
    isActive: boolean,
    subCatId: string
  ) => Promise<SwitchActiveStatusResponse>;
  selectedCatId?: string;
  setSelectedCatId?: (id: string | undefined) => void;
}

interface SubCategoriesContextProviderProps {
  children: ReactNode;
  accessToken: string;
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
    token: string,
    subCatId: string
  ): Promise<DeletingResponse> => {
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
    token: string,
    subCatId: string
  ): Promise<DeletingResponse> => {
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
    token: string,
    lang: Locale | string,
    isActive: boolean,
    subCatId: string
  ): Promise<SwitchActiveStatusResponse> => {
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
