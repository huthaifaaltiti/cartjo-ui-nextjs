"use client";

import { API_ENDPOINTS } from "@/lib/apiEndpoints";
import { Locale } from "@/types/locale";
import { BaseResponse } from "@/types/service-response.type";
import { handleUnauthorizedResponse } from "@/utils/handleUnauthorizedResponse";
import { createContext, ReactNode, useContext, useState } from "react";

type WishlistContextType = {
  queryKey: string;
  wishlistItemsCount: number;
  setWishlistItemsCount: (wishlistItemsCount: number) => void;
  deleteAllWishlistItems: (
    token: string | null,
    lang: Locale | string
  ) => Promise<BaseResponse>;
  removeWishlistItem: (
    token: string,
    lang: Locale | string,
    prodId: string
  ) => Promise<BaseResponse>;
};

const WishlistContext = createContext<undefined | WishlistContextType>(
  undefined
);

type WishlistContextProviderType = {
  children: ReactNode;
};
export const WishlistContextProvider = ({
  children,
}: WishlistContextProviderType) => {
  const queryKey: string = "wishlistItems";
  const [wishlistItemsCount, setWishlistItemsCount] = useState<number>(0);

  const deleteAllWishlistItems = async (
    token: string | null,
    lang: Locale | string
  ): Promise<BaseResponse> => {
    const res = await fetch(
      `${API_ENDPOINTS.LOGGED_USER.WISHLIST.REMOVE_ALL}`,
      {
        method: "DELETE",
        body: JSON.stringify({ lang }),
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    handleUnauthorizedResponse(res, lang);

    if (!res.ok) {
      throw new Error("Failed to delete wishlist items");
    }

    const resJson = await res.json();
    return resJson;
  };

  const removeWishlistItem = async (
    token: string,
    lang: Locale | string,
    prodId: string
  ) => {
    const res = await fetch(`${API_ENDPOINTS.LOGGED_USER.WISHLIST.REMOVE}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ lang, productId: prodId }),
    });

    handleUnauthorizedResponse(res, lang);

    const resJson = await res.json();

    if (!res.ok) {
      throw new Error(resJson.message || "Failed to remove item from wishlist");
    }

    return resJson;
  };

  return (
    <WishlistContext.Provider
      value={{
        queryKey,
        wishlistItemsCount,
        setWishlistItemsCount,
        deleteAllWishlistItems,
        removeWishlistItem,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);

  if (!context)
    throw Error(
      "Wishlist context should be used within wishlist context provider"
    );

  return context;
};
