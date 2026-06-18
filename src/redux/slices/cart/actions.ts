import { API_ENDPOINTS } from "@/lib/apiEndpoints";
import { Locale } from "@/types/locale";
import { BaseResponse, DataResponse } from "@/types/service-response.type";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { CART_CONSTANTS } from "./constants";
import { Cart } from "@/types/cart.type";
import { authFetcher } from "@/utils/authFetcher";

export const addItemToServer = createAsyncThunk<
  DataResponse<Cart>,
  {
    productId: string;
    variantId: string;
    quantity: number;
    lang?: Locale | string;
  },
  { rejectValue: BaseResponse }
>(
  CART_CONSTANTS.addItem,
  async (
    { productId, variantId, quantity, lang = "en" },
    { rejectWithValue },
  ) => {
    try {
      const url = new URL(API_ENDPOINTS.LOGGED_USER.CART.ADD);

      const response = await authFetcher<DataResponse<Cart>>(url.toString(), {
        method: "POST",
        body: JSON.stringify({ productId, variantId, quantity, lang }),
      });

      if (!response.isSuccess) {
        return rejectWithValue(response);
      }

      return response;
    } catch (error) {
      return rejectWithValue({
        isSuccess: false,
        message:
          error instanceof Error ? error.message : "Something went wrong",
      });
    }
  },
);

export const removeItemFromServer = createAsyncThunk<
  DataResponse<Cart>,
  {
    productId: string;
    variantId: string;
    quantity: number;
    lang?: Locale | string;
  },
  { rejectValue: BaseResponse }
>(
  CART_CONSTANTS.removeItem,
  async (
    { productId, variantId, quantity, lang = "en" },
    { rejectWithValue },
  ) => {
    try {
      const url = new URL(API_ENDPOINTS.LOGGED_USER.CART.REMOVE);

      const response = await authFetcher<DataResponse<Cart>>(url.toString(), {
        method: "DELETE",
        body: JSON.stringify({ productId, variantId, quantity, lang }),
      });

      if (!response.isSuccess) {
        return rejectWithValue(response);
      }

      return response;
    } catch (error) {
      return rejectWithValue({
        isSuccess: false,
        message:
          error instanceof Error ? error.message : "Something went wrong",
      });
    }
  },
);

export const removeAllItemsFromServer = createAsyncThunk<
  DataResponse<Cart>,
  {
    lang?: Locale | string;
  },
  { rejectValue: BaseResponse }
>(
  CART_CONSTANTS.removeAllItems,
  async ({ lang = "en" }, { rejectWithValue }) => {
    try {
      const url = new URL(API_ENDPOINTS.LOGGED_USER.CART.REMOVE_ALL);

      const response = await authFetcher<DataResponse<Cart>>(url.toString(), {
        method: "DELETE",
        body: JSON.stringify({ lang }),
      });

      if (!response.isSuccess) {
        return rejectWithValue(response);
      }

      return response;
    } catch (error) {
      return rejectWithValue({
        isSuccess: false,
        message:
          error instanceof Error ? error.message : "Something went wrong",
      });
    }
  },
);

export const wishlistItems = createAsyncThunk<
  DataResponse<Cart>,
  {
    lang?: Locale | string;
  },
  { rejectValue: BaseResponse }
>(
  CART_CONSTANTS.wishlistItems,
  async ({ lang = "en" }, { rejectWithValue }) => {
    try {
      const url = new URL(API_ENDPOINTS.LOGGED_USER.CART.WISHLIST_ITEMS);

      const response = await authFetcher<DataResponse<Cart>>(url.toString(), {
        method: "POST",
        body: JSON.stringify({ lang }),
      });

      if (!response.isSuccess) {
        return rejectWithValue(response);
      }

      return response;
    } catch (error) {
      return rejectWithValue({
        isSuccess: false,
        message:
          error instanceof Error ? error.message : "Something went wrong",
      });
    }
  },
);
