"use client";

import { createContext, ReactNode, useContext, useState } from "react";

import { API_ENDPOINTS } from "@/lib/apiEndpoints";
import { DeletingResponse, SwitchActiveStatusResponse } from "@/types/common";
import { Locale } from "@/types/locale";

type CategoriesContextType = {
  queryKey: string;
  searchQuery: string;
  accessToken: string;
  setSearchQuery: (searchQuery: string) => void;
  deleteCategory: (
    token: string,
    catId: string,
    lang: Locale
  ) => Promise<DeletingResponse>;
  unDeleteCategory: (
    token: string,
    catId: string,
    lang: Locale
  ) => Promise<DeletingResponse>;
  switchCategoryActiveStatus: (
    token: string,
    lang: Locale | string,
    isActive: boolean,
    catId: string
  ) => Promise<SwitchActiveStatusResponse>;
};

type CategoriesContextProviderType = {
  accessToken: string;
  children: ReactNode;
};

const CategoriesContext = createContext<undefined | CategoriesContextType>(
  undefined
);

export const CategoriesContextProvider = ({
  accessToken,
  children,
}: CategoriesContextProviderType) => {
  const queryKey: string = "categories";
  const [searchQuery, setSearchQuery] = useState<string>("");

  const deleteCategory = async (
    token: string,
    catId: string,
    lang: Locale
  ): Promise<DeletingResponse> => {
    const res = await fetch(
      `${API_ENDPOINTS.DASHBOARD.CATEGORIES.DELETE}/${catId}`,
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
      throw new Error("Failed to delete category");
    }

    const resJson = await res.json();
    return resJson;
  };

  const unDeleteCategory = async (
    token: string,
    catId: string,
    lang: Locale
  ): Promise<DeletingResponse> => {
    const res = await fetch(
      `${API_ENDPOINTS.DASHBOARD.CATEGORIES.UN_DELETE}/${catId}`,
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
      throw new Error("Failed to un-delete category");
    }

    const resJson = await res.json();
    return resJson;
  };

  const switchCategoryActiveStatus = async (
    token: string,
    lang: Locale | string,
    isActive: boolean,
    catId: string
  ): Promise<SwitchActiveStatusResponse> => {
    const res = await fetch(
      `${API_ENDPOINTS.DASHBOARD.CATEGORIES.SWITCH_ACTIVE_STATUS}/${catId}`,
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
    <CategoriesContext.Provider
      value={{
        queryKey,
        searchQuery,
        accessToken,
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
      "Categories context should be used within categories context provider"
    );

  return context;
};
