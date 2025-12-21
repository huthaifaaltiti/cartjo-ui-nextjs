import { createAsyncThunk } from "@reduxjs/toolkit";
import { API_ENDPOINTS } from "@/lib/apiEndpoints";
import { Locale } from "@/types/locale";
import {
  BaseResponse,
  DataListResponse,
  DataResponse,
} from "@/types/service-response.type";
import { fetcher } from "@/utils/fetcher";
import { Order } from "@/types/order.type";
import { ORDER_CONSTANTS } from "./constants";
import { PaymentStatus } from "@/enums/paymentStatus.enum";
import { ShippingAddress } from "@/types/shippingAddress.type";

// GET /api/v1/order/all
export const getOrders = createAsyncThunk<
  DataListResponse<Order>,
  {
    lang?: Locale | string;
    token: string;
    limit?: number;
    lastId?: string;
    search?: string;
  },
  { rejectValue: BaseResponse }
>(
  ORDER_CONSTANTS.getOrders,
  async (
    { lang = "en", token, limit = 10, lastId, search },
    { rejectWithValue }
  ) => {
    try {
      const url = new URL(
        API_ENDPOINTS.ORDER.GetAll,
        process.env.NEXT_PUBLIC_API_URL || process.env.APP_URL
      );
      url.searchParams.set("lang", String(lang));
      url.searchParams.set("limit", String(limit));
      if (lastId) url.searchParams.set("lastId", lastId);
      if (search) url.searchParams.set("search", search);

      const response = await fetcher<DataListResponse<Order>>(url.toString(), {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.isSuccess) {
        return rejectWithValue(response);
      }

      return response as DataListResponse<Order>;
    } catch (error) {
      return rejectWithValue({
        isSuccess: false,
        message:
          error instanceof Error ? error.message : "Something went wrong",
      });
    }
  }
);

export const getOrder = createAsyncThunk<
  DataResponse<Order>,
  { id: string; lang?: Locale | string; token: string },
  { rejectValue: BaseResponse }
>(
  ORDER_CONSTANTS.getOrder,
  async ({ id, lang = "en", token }, { rejectWithValue }) => {
    try {
      const url = new URL(API_ENDPOINTS.ORDER.GetOne.replace(":id", id));
      url.searchParams.set("lang", String(lang));

      const response = await fetcher<DataResponse<Order>>(url.toString(), {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.isSuccess) {
        return rejectWithValue(response);
      }

      return response as DataResponse<Order>;
    } catch (error) {
      return rejectWithValue({
        isSuccess: false,
        message:
          error instanceof Error ? error.message : "Something went wrong",
      });
    }
  }
);

export const changePaymentStatus = createAsyncThunk<
  DataResponse<Order>,
  {
    orderId: string;
    status: PaymentStatus;
    lang?: Locale | string;
    token: string;
  },
  { rejectValue: BaseResponse }
>(
  ORDER_CONSTANTS.changePaymentStatus,
  async ({ orderId, status, lang = "en", token }, { rejectWithValue }) => {
    try {
      const url = new URL(
        API_ENDPOINTS.ORDER.ChangePaymentStatus.replace(":id", orderId)
      );

      const response = await fetcher<DataResponse<Order>>(url.toString(), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ orderId, status, lang }),
      });

      if (!response.isSuccess) return rejectWithValue(response);

      return response as DataResponse<Order>;
    } catch (error) {
      return rejectWithValue({
        isSuccess: false,
        message:
          error instanceof Error ? error.message : "Something went wrong",
      });
    }
  }
);

// POST delete order -> expects body: { lang }
export const deleteOrder = createAsyncThunk<
  DataResponse<Order>,
  { id: string; lang?: Locale | string; token: string },
  { rejectValue: BaseResponse }
>(
  ORDER_CONSTANTS.deleteOrder,
  async ({ id, lang = "en", token }, { rejectWithValue }) => {
    try {
      const url = new URL(
        API_ENDPOINTS.ORDER.Delete.replace(":id", id),
        process.env.NEXT_PUBLIC_API_URL || process.env.APP_URL
      );

      const response = await fetcher<DataResponse<Order>>(url.toString(), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ lang }),
      });

      if (!response.isSuccess) return rejectWithValue(response);

      return response as DataResponse<Order>;
    } catch (error) {
      return rejectWithValue({
        isSuccess: false,
        message:
          error instanceof Error ? error.message : "Something went wrong",
      });
    }
  }
);

// POST restore order -> expects body: { lang }
export const restoreOrder = createAsyncThunk<
  DataResponse<Order>,
  { id: string; lang?: Locale | string; token: string },
  { rejectValue: BaseResponse }
>(
  ORDER_CONSTANTS.restoreOrder,
  async ({ id, lang = "en", token }, { rejectWithValue }) => {
    try {
      const url = new URL(
        API_ENDPOINTS.ORDER.UnDelete.replace(":id", id),
        process.env.NEXT_PUBLIC_API_URL || process.env.APP_URL
      );

      const response = await fetcher<DataResponse<Order>>(url.toString(), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ lang }),
      });

      if (!response.isSuccess) return rejectWithValue(response);

      return response as DataResponse<Order>;
    } catch (error) {
      return rejectWithValue({
        isSuccess: false,
        message:
          error instanceof Error ? error.message : "Something went wrong",
      });
    }
  }
);

// POST create order -> body same as your API expects
export const createOrder = createAsyncThunk<
  DataResponse<Order>,
  {
    amount: number;
    currency: string;
    email: string;
    merchantReference: string;
    transactionId?: string | null;
    paymentMethod: string;
    shippingAddress: ShippingAddress;
    lang?: Locale | string;
    token: string;
  },
  { rejectValue: BaseResponse }
>(ORDER_CONSTANTS.createOrder, async (payload, { rejectWithValue }) => {
  try {
    const { token, lang = "en", ...body } = payload;

    const url = new URL(
      API_ENDPOINTS.ORDER.Create,
      process.env.NEXT_PUBLIC_API_URL || process.env.APP_URL
    );

    const response = await fetcher<DataResponse<Order>>(url.toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ ...body }),
    });

    if (!response.isSuccess) return rejectWithValue(response);

    return response as DataResponse<Order>;
  } catch (error) {
    return rejectWithValue({
      isSuccess: false,
      message: error instanceof Error ? error.message : "Something went wrong",
    });
  }
});
