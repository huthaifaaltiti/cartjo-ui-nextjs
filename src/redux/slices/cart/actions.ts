import { API_ENDPOINTS } from "@/lib/apiEndpoints";
import { Locale } from "@/types/locale";
import { BaseResponse, DataResponse } from "@/types/service-response.type";
import { fetcher } from "@/utils/fetcher";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { CART_CONSTANTS } from "./constants";
import { Cart } from "@/types/cart.type";

export const addItemToServer = createAsyncThunk<
  DataResponse<Cart>,
  { productId: string; quantity: number; lang?: Locale | string; token: string },
  { rejectValue: BaseResponse }
>(
  CART_CONSTANTS.addItem,
  async ({ productId, quantity, lang = "en", token }, { rejectWithValue }) => {
    try {
      const url = new URL(API_ENDPOINTS.LOGGED_USER.CART.ADD);

      const response = await fetcher(url.toString(), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId, quantity, lang }),
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

export const removeItemFromServer = createAsyncThunk<
  DataResponse<Cart>,
  {
    productId: string;
    quantity: number;
    lang?: Locale | string;
    token: string;
  },
  { rejectValue: BaseResponse }
>(
  CART_CONSTANTS.removeItem,
  async ({ productId, quantity, lang = "en", token }, { rejectWithValue }) => {
    try {
      const url = new URL(API_ENDPOINTS.LOGGED_USER.CART.REMOVE);

      const response = await fetcher(url.toString(), {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId, quantity, lang }),
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

export const removeAllItemsFromServer = createAsyncThunk<
  DataResponse<Cart>,
  {
    lang?: Locale | string;
    token: string;
  },
  { rejectValue: BaseResponse }
>(
  CART_CONSTANTS.removeAllItems,
  async ({ lang = "en", token }, { rejectWithValue }) => {
    try {
      const url = new URL(API_ENDPOINTS.LOGGED_USER.CART.REMOVE_ALL);

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

export const wishlistItems = createAsyncThunk<
  DataResponse<string[]>,
  {
    lang?: Locale | string;
    token: string;
  },
  { rejectValue: BaseResponse }
>(
  CART_CONSTANTS.wishlistItems,
  async ({ lang = "en", token }, { rejectWithValue }) => {
    try {
      const url = new URL(API_ENDPOINTS.LOGGED_USER.CART.WISHLIST_ITEMS);

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