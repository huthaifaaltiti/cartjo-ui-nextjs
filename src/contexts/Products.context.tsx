"use client";

import { createContext, ReactNode, useContext, useState } from "react";
import { API_ENDPOINTS } from "@/lib/apiEndpoints";
import { Locale } from "@/types/locale";
import { BaseResponse } from "@/types/service-response.type";

type ProductsContextType = {
  token: string | null;
  queryKey: string;
  searchQuery: string;
  setSearchQuery: (searchQuery: string) => void;
  deleteProduct: (
    token: string | null,
    locale: string,
    prodId: string
  ) => Promise<BaseResponse>;
  unDeleteProduct: (
    token: string | null,
    locale: string,
    prodId: string
  ) => Promise<BaseResponse>;
  switchProductActiveStatus: (
    token: string | null,
    lang: Locale | string,
    isActive: boolean,
    prodId: string
  ) => Promise<BaseResponse>;
};

const ProductsContext = createContext<ProductsContextType | undefined>(
  undefined
);

type ProductsContextProviderType = {
  children: ReactNode;
  token: string | null;
};

export const ProductsContextProvider = ({
  children,
  token,
}: ProductsContextProviderType) => {
  const queryKey: string = "products";
  const [searchQuery, setSearchQuery] = useState<string>("");

  const deleteProduct = async (
    token: string | null,
    locale: string,
    prodId: string
  ): Promise<BaseResponse> => {
    const res = await fetch(
      `${API_ENDPOINTS.DASHBOARD.PRODUCTS.DELETE}/${prodId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ lang: locale }),
      }
    );

    if (!res.ok) throw new Error("Failed to delete product");

    const resJson = await res.json();

    return resJson;
  };

  const unDeleteProduct = async (
    token: string | null,
    locale: string,
    prodId: string
  ): Promise<BaseResponse> => {
    const res = await fetch(
      `${API_ENDPOINTS.DASHBOARD.PRODUCTS.UN_DELETE}/${prodId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ lang: locale }),
      }
    );

    if (!res.ok) throw new Error("Failed to un-delete product");

    const resJson = await res.json();

    return resJson;
  };

  const switchProductActiveStatus = async (
    token: string | null,
    lang: Locale | string,
    isActive: boolean,
    prodId: string
  ): Promise<BaseResponse> => {
    const res = await fetch(
      `${API_ENDPOINTS.DASHBOARD.PRODUCTS.SWITCH_ACTIVE_STATUS}/${prodId}`,
      {
        method: "PUT",
        body: JSON.stringify({ lang, isActive }),
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!res.ok) throw new Error("Could not switch active status for product");

    const resJson = await res.json();

    return resJson;
  };

  return (
    <ProductsContext
      value={{
        token,
        searchQuery,
        setSearchQuery,
        queryKey,
        deleteProduct,
        unDeleteProduct,
        switchProductActiveStatus,
      }}
    >
      {children}
    </ProductsContext>
  );
};

export const useProducts = () => {
  const context = useContext(ProductsContext);

  if (context === undefined)
    throw new Error(
      "Products context should be used within products context provider"
    );

  return context;
};
