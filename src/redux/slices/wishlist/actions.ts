import { API_ENDPOINTS } from "@/lib/apiEndpoints";
import { Locale } from "@/types/locale";
import { BaseResponse, DataResponse } from "@/types/service-response.type";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { WISHLIST_CONSTANTS } from "./constants";
import { Wishlist } from "@/types/wishlist.type";
import { Cart } from "@/types/cart.type";
import { Product } from "@/types/product.type";
import { authFetcher } from "@/utils/authFetcher";

export const removeWishlistItem = createAsyncThunk<
  DataResponse<Wishlist>,
  {
    productId: string;
    lang?: Locale | string;
  },
  { rejectValue: BaseResponse }
>(
  WISHLIST_CONSTANTS.removeItem,
  async ({ productId, lang = "en" }, { rejectWithValue }) => {
    try {
      const url = new URL(API_ENDPOINTS.LOGGED_USER.WISHLIST.REMOVE);

      const response = await authFetcher<DataResponse<Wishlist>>(url.toString(), {
        method: "DELETE",
        body: JSON.stringify({ productId, lang }),
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

export const addWishlistItem = createAsyncThunk<
  DataResponse<Wishlist>,
  {
    product: Product;
    lang?: Locale | string;
  },
  { rejectValue: BaseResponse }
>(
  WISHLIST_CONSTANTS.addItem,
  async ({ product, lang = "en" }, { rejectWithValue }) => {
    try {
      const url = new URL(API_ENDPOINTS.LOGGED_USER.WISHLIST.ADD);

      const response = await authFetcher<DataResponse<Wishlist>>(
        url.toString(),
        {
          method: "POST",
          body: JSON.stringify({ productId: product?._id, lang }),
        },
      );

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

export const sendWishlistItemToCart = createAsyncThunk<
  DataResponse<Cart>,
  {
    productId: string;
    variantId: string;
    lang?: Locale | string;
  },
  { rejectValue: BaseResponse }
>(
  WISHLIST_CONSTANTS.sendItemToCart,
  async ({ productId, variantId, lang = "en" }, { rejectWithValue }) => {
    try {
      const url = new URL(API_ENDPOINTS.LOGGED_USER.WISHLIST.SEND_TO_CART);

      const response = await authFetcher<DataResponse<Cart>>(url.toString(), {
        method: "POST",
        body: JSON.stringify({ productId, variantId, lang }),
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

export const removeAllWishlistItems = createAsyncThunk<
  DataResponse<Cart>,
  {
    lang?: Locale | string;
  },
  { rejectValue: BaseResponse }
>(
  WISHLIST_CONSTANTS.removeAllItems,
  async ({ lang = "en" }, { rejectWithValue }) => {
    try {
      const url = new URL(API_ENDPOINTS.LOGGED_USER.WISHLIST.REMOVE_ALL);

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

export const sendAllWishlistItemsToCart = createAsyncThunk<
  DataResponse<Cart>,
  {
    lang?: Locale | string;
    items: { productId: string; variantId: string }[];
  },
  { rejectValue: BaseResponse }
>(
  WISHLIST_CONSTANTS.sendAllItemsToCart,
  async ({ lang = "en", items }, { rejectWithValue }) => {
    try {
      const url = new URL(API_ENDPOINTS.LOGGED_USER.WISHLIST.SEND_ALL_TO_CART);

      const response = await authFetcher<DataResponse<Cart>>(url.toString(), {
        method: "POST",
        body: JSON.stringify({ lang, items }),
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
