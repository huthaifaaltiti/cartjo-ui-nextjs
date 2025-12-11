import { API_ENDPOINTS } from "@/lib/apiEndpoints";
import { Locale } from "@/types/locale";
import { BaseResponse, DataResponse } from "@/types/service-response.type";
import { fetcher } from "@/utils/fetcher";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { WISHLIST_CONSTANTS } from "./constants";
import { Wishlist } from "@/types/wishlist.type";
import { Cart } from "@/types/cart.type";
import { Product } from "@/types/product.type";

export const removeWishlistItem = createAsyncThunk<
  DataResponse<Wishlist>,
  {
    productId: string;
    lang?: Locale | string;
    token: string;
  },
  { rejectValue: BaseResponse }
>(
  WISHLIST_CONSTANTS.removeItem,
  async ({ productId, lang = "en", token }, { rejectWithValue }) => {
    try {
      const url = new URL(API_ENDPOINTS.LOGGED_USER.WISHLIST.REMOVE);

      const response = await fetcher(url.toString(), {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId, lang }),
      });

      if (!response.isSuccess) {
        return rejectWithValue(response);
      }

      return response;
    } catch (error) {
      return rejectWithValue({
        isSuccess: false,
        message: error instanceof Error ? error.message : "Something went wrong",
      });
    }
  }
);

export const addWishlistItem = createAsyncThunk<
  DataResponse<Wishlist>,
  {
    product: Product;
    lang?: Locale | string;
    token: string;
  },
  { rejectValue: BaseResponse }
>(
  WISHLIST_CONSTANTS.addItem,
  async ({ product, lang = "en", token }, { rejectWithValue }) => {
    try {
      const url = new URL(API_ENDPOINTS.LOGGED_USER.WISHLIST.ADD);

      const response = await fetcher(url.toString(), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId: product?._id, lang }),
      });

      if (!response.isSuccess) {
        return rejectWithValue(response);
      }

      return response;
    } catch (error) {
      return rejectWithValue({
        isSuccess: false,
        message: error instanceof Error ? error.message : "Something went wrong",
      });
    }
  }
);

export const sendWishlistItemToCart = createAsyncThunk<
  DataResponse<Cart>,
  {
    productId: string;
    lang?: Locale | string;
    token: string;
  },
  { rejectValue: BaseResponse }
>(
  WISHLIST_CONSTANTS.sendItemToCart,
  async ({ productId, lang = "en", token }, { rejectWithValue }) => {
    try {
      const url = new URL(API_ENDPOINTS.LOGGED_USER.WISHLIST.SEND_TO_CART);

      const response = await fetcher(url.toString(), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId, lang }),
      });

      if (!response.isSuccess) {
        return rejectWithValue(response);
      }

      return response;
    } catch (error) {
      return rejectWithValue({
        isSuccess: false,
        message: error instanceof Error ? error.message : "Something went wrong",
      });
    }
  }
);

export const removeAllWishlistItems = createAsyncThunk<
  DataResponse<Cart>,
  {
    lang?: Locale | string;
    token: string;
  },
  { rejectValue: BaseResponse }
>(
  WISHLIST_CONSTANTS.removeAllItems,
  async ({ lang = "en", token }, { rejectWithValue }) => {
    try {
      const url = new URL(API_ENDPOINTS.LOGGED_USER.WISHLIST.REMOVE_ALL);

      const response = await fetcher(url.toString(), {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ lang }),
      });

      if (!response.isSuccess) {
        return rejectWithValue(response);
      }

      return response;
    } catch (error) {
      return rejectWithValue({
        isSuccess: false,
        message: error instanceof Error ? error.message : "Something went wrong",
      });
    }
  }
);

export const sendAllWishlistItemsToCart = createAsyncThunk<
  DataResponse<Cart>,
  {
    lang?: Locale | string;
    token: string;
  },
  { rejectValue: BaseResponse }
>(
  WISHLIST_CONSTANTS.sendAllItemsToCart,
  async ({ lang = "en", token }, { rejectWithValue }) => {
    try {
      const url = new URL(API_ENDPOINTS.LOGGED_USER.WISHLIST.SEND_ALL_TO_CART);

      const response = await fetcher(url.toString(), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ lang }),
      });

      if (!response.isSuccess) {
        return rejectWithValue(response);
      }

      return response;
    } catch (error) {
      return rejectWithValue({
        isSuccess: false,
        message: error instanceof Error ? error.message : "Something went wrong",
      });
    }
  }
);