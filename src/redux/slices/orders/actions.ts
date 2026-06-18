import { createAsyncThunk } from "@reduxjs/toolkit";
import { API_ENDPOINTS } from "@/lib/apiEndpoints";
import { Locale } from "@/types/locale";
import {
  BaseResponse,
  DataListResponse,
  DataResponse,
} from "@/types/service-response.type";
import { Order } from "@/types/order.type";
import { ORDER_CONSTANTS } from "./constants";
import { PaymentStatus } from "@/enums/paymentStatus.enum";
import { ShippingAddress } from "@/types/shippingAddress.type";
import { OrderDeliveryStatus } from "@/enums/orderDeliveryStatus.enum";
import { authFetcher } from "@/utils/authFetcher";
import { Locale as LocaleEnum } from "@/enums/locale.enum";

// GET /api/v1/order/all
export const getOrders = createAsyncThunk<
  DataListResponse<Order>,
  {
    lang?: Locale | string;
    limit?: number;
    lastId?: string;
    search?: string;
  },
  { rejectValue: BaseResponse }
>(
  ORDER_CONSTANTS.getOrders,
  async (
    { lang = LocaleEnum.EN, limit = 10, lastId, search },
    { rejectWithValue },
  ) => {
    try {
      const url = new URL(
        API_ENDPOINTS.ORDER.GetAll,
        process.env.NEXT_PUBLIC_API_URL || process.env.APP_URL,
      );
      url.searchParams.set("lang", String(lang));
      url.searchParams.set("limit", String(limit));
      if (lastId) url.searchParams.set("lastId", lastId);
      if (search) url.searchParams.set("search", search);

      const response = await authFetcher<DataListResponse<Order>>(
        url.toString(),
        {
          method: "GET",
        },
      );

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
  },
);

export const getOrder = createAsyncThunk<
  DataResponse<Order>,
  { id: string; lang?: Locale | string },
  { rejectValue: BaseResponse }
>(
  ORDER_CONSTANTS.getOrder,
  async ({ id, lang = LocaleEnum.EN }, { rejectWithValue }) => {
    try {
      const url = new URL(API_ENDPOINTS.ORDER.GetOne.replace(":id", id));
      url.searchParams.set("lang", String(lang));

      const response = await authFetcher<DataResponse<Order>>(url.toString(), {
        method: "GET",
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
  },
);

export const changePaymentStatus = createAsyncThunk<
  DataResponse<Order>,
  {
    orderId: string;
    status: PaymentStatus;
    lang?: Locale | string;
  },
  { rejectValue: BaseResponse }
>(
  ORDER_CONSTANTS.changePaymentStatus,
  async ({ orderId, status, lang = LocaleEnum.EN }, { rejectWithValue }) => {
    try {
      const url = new URL(
        API_ENDPOINTS.ORDER.ChangePaymentStatus.replace(":id", orderId),
      );

      const response = await authFetcher<DataResponse<Order>>(url.toString(), {
        method: "POST",
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
  },
);

// POST delete order -> expects body: { lang }
export const deleteOrder = createAsyncThunk<
  DataResponse<Order>,
  { id: string; lang?: Locale | string },
  { rejectValue: BaseResponse }
>(
  ORDER_CONSTANTS.deleteOrder,
  async ({ id, lang = LocaleEnum.EN }, { rejectWithValue }) => {
    try {
      const url = new URL(
        API_ENDPOINTS.ORDER.Delete.replace(":id", id),
        process.env.NEXT_PUBLIC_API_URL || process.env.APP_URL,
      );

      const response = await authFetcher<DataResponse<Order>>(url.toString(), {
        method: "POST",
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
  },
);

// POST restore order -> expects body: { lang }
export const restoreOrder = createAsyncThunk<
  DataResponse<Order>,
  { id: string; lang?: Locale | string },
  { rejectValue: BaseResponse }
>(
  ORDER_CONSTANTS.restoreOrder,
  async ({ id, lang = LocaleEnum.EN }, { rejectWithValue }) => {
    try {
      const url = new URL(
        API_ENDPOINTS.ORDER.UnDelete.replace(":id", id),
        process.env.NEXT_PUBLIC_API_URL || process.env.APP_URL,
      );

      const response = await authFetcher<DataResponse<Order>>(url.toString(), {
        method: "POST",
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
  },
);

// POST create order -> body same as your API expects
export const createOrder = createAsyncThunk<
  DataResponse<Order>,
  {
    amount: number;
    deliveryCost: number;
    currency: string;
    email: string;
    merchantReference: string;
    transactionId?: string | null;
    paymentMethod: string;
    shippingAddress: ShippingAddress;
    lang?: Locale | string;
  },
  { rejectValue: BaseResponse }
>(ORDER_CONSTANTS.createOrder, async (payload, { rejectWithValue }) => {
  try {
    const { ...body } = payload;

    const url = new URL(
      API_ENDPOINTS.ORDER.Create,
      process.env.NEXT_PUBLIC_API_URL || process.env.APP_URL,
    );

    const response = await authFetcher<DataResponse<Order>>(url.toString(), {
      method: "POST",
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

export const getMyOrder = createAsyncThunk<
  DataResponse<Order>,
  { id: string; lang?: Locale | string; userId: string | undefined },
  { rejectValue: BaseResponse }
>(
  ORDER_CONSTANTS.getMyOrder,
  async ({ id, lang = LocaleEnum.EN, userId }, { rejectWithValue }) => {
    try {
      const url = new URL(`${API_ENDPOINTS.ORDER.GetMyOrder}/${userId}/${id}`);

      url.searchParams.set("lang", String(lang));

      const response = await authFetcher<DataResponse<Order>>(url.toString(), {
        method: "GET",
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
  },
);

export const changeDeliveryStatus = createAsyncThunk<
  DataResponse<Order>,
  {
    orderId: string;
    status: OrderDeliveryStatus;
    lang?: Locale | string;
  },
  { rejectValue: BaseResponse }
>(
  ORDER_CONSTANTS.changeDeliveryStatus,
  async ({ orderId, status, lang = LocaleEnum.EN }, { rejectWithValue }) => {
    try {
      const url = new URL(
        API_ENDPOINTS.ORDER.ChangeDeliveryStatus.replace(":id", orderId),
      );

      const response = await authFetcher<DataResponse<Order>>(url.toString(), {
        method: "POST",
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
  },
);
