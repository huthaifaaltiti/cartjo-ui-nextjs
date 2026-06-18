"use client";

import { createContext, ReactNode, useContext, useState } from "react";
import { API_ENDPOINTS } from "@/lib/apiEndpoints";
import { Locale } from "@/types/locale";
import { BaseResponse } from "@/types/service-response.type";
import { authFetcher } from "@/utils/authFetcher";
import { PRODUCTS_KEY } from "@/hooks/react-query/query-options/products";

type ProductsContextType = {
  queryKey: string;
  searchQuery: string;
  setSearchQuery: (searchQuery: string) => void;
  deleteProductVariant: (
    locale: string,
    prodId: string,
    varId: string,
  ) => Promise<BaseResponse>;
  unDeleteProductVariant: (
    locale: string,
    prodId: string,
    varId: string,
  ) => Promise<BaseResponse>;
  deleteProduct: (locale: string, prodId: string) => Promise<BaseResponse>;
  unDeleteProduct: (locale: string, prodId: string) => Promise<BaseResponse>;
  switchProductActiveStatus: (
    lang: Locale | string,
    isActive: boolean,
    prodId: string,
  ) => Promise<BaseResponse>;
  switchProductVariantActiveStatus: (
    lang: Locale | string,
    isActive: boolean,
    prodId: string,
    varId: string,
  ) => Promise<BaseResponse>;
};

const ProductsContext = createContext<ProductsContextType | undefined>(
  undefined,
);

type ProductsContextProviderType = {
  children: ReactNode;
};

export const ProductsContextProvider = ({
  children,
}: ProductsContextProviderType) => {
  const queryKey: string = PRODUCTS_KEY;
  const [searchQuery, setSearchQuery] = useState<string>("");

  const deleteProduct = async (
    locale: string,
    prodId: string,
  ): Promise<BaseResponse> => {
    return await authFetcher(
      `${API_ENDPOINTS.DASHBOARD.PRODUCTS.DELETE}/${prodId}`,
      {
        method: "DELETE",
        body: JSON.stringify({ lang: locale }),
      },
    );
  };

  const deleteProductVariant = async (
    locale: string,
    prodId: string,
    varId: string,
  ): Promise<BaseResponse> => {
    if (!varId || !prodId) console.warn("No Variant ID or no product ID.");

    const url = `${API_ENDPOINTS.DASHBOARD.PRODUCTS.DELETE}/${prodId}/variant/${varId}`;

    return await authFetcher(url, {
      method: "DELETE",
      body: JSON.stringify({ lang: locale }),
    });
  };

  const unDeleteProductVariant = async (
    locale: string,
    prodId: string,
    varId: string,
  ): Promise<BaseResponse> => {
    if (!varId || !prodId) console.warn("No Variant ID or no product ID.");

    const url = `${API_ENDPOINTS.DASHBOARD.PRODUCTS.UN_DELETE}/${prodId}/variant/${varId}`;

    return await authFetcher(url, {
      method: "DELETE",
      body: JSON.stringify({ lang: locale }),
    });
  };

  const switchProductVariantActiveStatus = async (
    lang: Locale | string,
    isActive: boolean,
    prodId: string,
    varId: string,
  ): Promise<BaseResponse> => {
    if (!varId || !prodId) console.warn("No Variant ID or no product ID.");

    const url = `${API_ENDPOINTS.DASHBOARD.PRODUCTS.SWITCH_ACTIVE_STATUS}/${prodId}/variant/${varId}`;

    return await authFetcher(url, {
      method: "PUT",
      body: JSON.stringify({ lang, isActive }),
    });
  };

  const unDeleteProduct = async (
    locale: string,
    prodId: string,
  ): Promise<BaseResponse> => {
    return await authFetcher(
      `${API_ENDPOINTS.DASHBOARD.PRODUCTS.UN_DELETE}/${prodId}`,
      {
        method: "DELETE",

        body: JSON.stringify({ lang: locale }),
      },
    );
  };

  const switchProductActiveStatus = async (
    lang: Locale | string,
    isActive: boolean,
    prodId: string,
  ): Promise<BaseResponse> => {
    return await authFetcher(
      `${API_ENDPOINTS.DASHBOARD.PRODUCTS.SWITCH_ACTIVE_STATUS}/${prodId}`,
      {
        method: "PUT",
        body: JSON.stringify({ lang, isActive }),
      },
    );
  };

  return (
    <ProductsContext
      value={{
        searchQuery,
        setSearchQuery,
        queryKey,
        deleteProduct,
        unDeleteProduct,
        switchProductActiveStatus,
        deleteProductVariant,
        unDeleteProductVariant,
        switchProductVariantActiveStatus,
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
      "Products context should be used within products context provider",
    );

  return context;
};
