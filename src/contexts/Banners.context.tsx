"use client";

import { createContext, ReactNode, useContext, useState } from "react";
import { Locale } from "@/types/locale";
import { BaseResponse } from "@/types/service-response.type";
import { API_ENDPOINTS } from "@/lib/apiEndpoints";

type BannerContextProps = {
  searchQuery: string;
  setSearchQuery: (searchQuery: string) => void;
  queryKey: string;
  token: string | null;
  deleteBanner: (
    token: string | null,
    bannerId: string,
    lang: Locale
  ) => Promise<BaseResponse>;
  unDeleteBanner: (
    token: string | null,
    bannerId: string,
    lang: Locale
  ) => Promise<BaseResponse>;
  switchBannerActiveStatus: (
    token: string | null,
    lang: Locale | string,
    isActive: boolean,
    bannerId: string
  ) => Promise<BaseResponse>;
};

const BannersContext = createContext<BannerContextProps | undefined>(undefined);

type BannersContextProviderProps = {
  children: ReactNode;
  token: string | null;
};

export const BannersContextProvider = ({
  children,
  token,
}: BannersContextProviderProps) => {
  const queryKey = "banners";
  const [searchQuery, setSearchQuery] = useState<string>("");

  const deleteBanner = async (
    token: string | null,
    bannerId: string,
    lang: Locale
  ): Promise<BaseResponse> => {
    const res = await fetch(
      `${API_ENDPOINTS.DASHBOARD.BANNERS.DELETE}/${bannerId}`,
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
      throw new Error("Failed to delete banner");
    }

    const resJson = await res.json();
    return resJson;
  };

  const unDeleteBanner = async (
    token: string | null,
    bannerId: string,
    lang: Locale
  ): Promise<BaseResponse> => {
    const res = await fetch(
      `${API_ENDPOINTS.DASHBOARD.BANNERS.UN_DELETE}/${bannerId}`,
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
      throw new Error("Failed to un-delete banner");
    }

    const resJson = await res.json();
    return resJson;
  };

  const switchBannerActiveStatus = async (
    token: string | null,
    lang: Locale | string,
    isActive: boolean,
    bannerId: string
  ): Promise<BaseResponse> => {
    const res = await fetch(
      `${API_ENDPOINTS.DASHBOARD.BANNERS.SWITCH_ACTIVE_STATUS}/${bannerId}`,
      {
        method: "PUT",
        body: JSON.stringify({ lang, isActive }),
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!res.ok) throw new Error("Could not switch active status to banner");

    const resJson = await res.json();
    return resJson;
  };

  return (
    <BannersContext.Provider
      value={{
        searchQuery,
        setSearchQuery,
        queryKey,
        token,
        deleteBanner,
        unDeleteBanner,
        switchBannerActiveStatus,
      }}
    >
      {children}
    </BannersContext.Provider>
  );
};

export const useBanners = () => {
  const context = useContext(BannersContext);

  if (!context)
    throw new Error("useBanners must be used within a BannersContextProvider");

  return context;
};
