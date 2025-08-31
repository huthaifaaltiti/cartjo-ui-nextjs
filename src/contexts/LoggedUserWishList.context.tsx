"use client";

import { createContext, ReactNode, useContext, useState } from "react";
import { API_ENDPOINTS } from "@/lib/apiEndpoints";
import { BaseResponse } from "@/types/service-response.type";
import { Locale } from "@/types/locale";
import { handleUnauthorizedResponse } from "@/utils/handleUnauthorizedResponse";

type LoggedUserWishlistContextType = {
  addItem: (
    token: string,
    lang: Locale | string,
    prodId: string
  ) => Promise<BaseResponse>;
  removeItem: (
    token: string,
    lang: Locale | string,
    prodId: string
  ) => Promise<BaseResponse>;
  removeAll: (token: string, lang: Locale) => Promise<BaseResponse>;
  wishlist: string[]; // array of product IDs in the wishlist
  setWishlist: (wishlist: string[]) => void;
};

const LoggedUserWishlistContext = createContext<
  LoggedUserWishlistContextType | undefined
>(undefined);

type ProviderProps = {
  children: ReactNode;
  initialWishlist?: string[];
};

export const LoggedUserWishlistProvider = ({
  children,
  initialWishlist = [],
}: ProviderProps) => {
  const [wishlist, setWishlist] = useState<string[]>(initialWishlist);

  const addItem = async (
    token: string,
    lang: Locale | string,
    prodId: string
  ) => {
    const res = await fetch(API_ENDPOINTS.LOGGED_USER.WISHLIST.ADD, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ lang, productId: prodId }),
    });

    handleUnauthorizedResponse(res, lang);

    const resJson = await res.json();

    if (!res.ok) {
      // use backend error message if provided
      throw new Error(resJson.message || "Failed to add item to wishlist");
    }

    return resJson;
  };

  const removeItem = async (
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

  const removeAll = async (token: string, lang: Locale) => {
    const res = await fetch(API_ENDPOINTS.LOGGED_USER.WISHLIST.REMOVE_ALL, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ lang }),
    });

    const resJson = await res.json();

    if (!res.ok) {
      throw new Error(
        resJson.message || "Failed to remove all items from wishlist"
      );
    }

    setWishlist([]);
    return resJson;
  };

  return (
    <LoggedUserWishlistContext.Provider
      value={{ wishlist, addItem, removeItem, removeAll, setWishlist }}
    >
      {children}
    </LoggedUserWishlistContext.Provider>
  );
};

export const useLoggedUserWishlist = () => {
  const context = useContext(LoggedUserWishlistContext);

  if (!context)
    throw new Error(
      "useLoggedUserWishlist must be used within LoggedUserWishlistProvider"
    );

  return context;
};
