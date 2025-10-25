import { createAsyncThunk } from "@reduxjs/toolkit";
import { API_ENDPOINTS } from "@/lib/apiEndpoints";
import { Locale } from "@/types/locale";
import { BaseResponse } from "@/types/service-response.type";
import { fetcher } from "@/utils/fetcher";
import { FORGOT_PASSWORD } from "./constants";

export const sendIdentifier = createAsyncThunk<
  BaseResponse,
  { identifier: string; lang?: Locale | string },
  { rejectValue: BaseResponse }
>(
  FORGOT_PASSWORD.IDENTIFIER,
  async ({ identifier, lang = "en" }, { rejectWithValue }) => {
    try {
      const url = new URL(
        `${API_ENDPOINTS.AUTH.FORGOT_PASSWORD.ROOT}/${API_ENDPOINTS.AUTH.FORGOT_PASSWORD.SEND_IDENTIFIER}`
      );

      const body = { lang, identifier };

      const response = await fetcher(url.toString(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.isSuccess) {
        return rejectWithValue(response);
      }

      return response;
    } catch (error: any) {
      return rejectWithValue({
        isSuccess: false,
        message: error.message || "Something went wrong",
      });
    }
  }
);

export const verifyResetPasswordCode = createAsyncThunk<
  BaseResponse,
  { identifier: string; code: string; lang?: Locale | string },
  { rejectValue: BaseResponse }
>(
  FORGOT_PASSWORD.CODE,
  async ({ identifier, code, lang = "en" }, { rejectWithValue }) => {
    try {
      const url = new URL(
        `${API_ENDPOINTS.AUTH.FORGOT_PASSWORD.ROOT}/${API_ENDPOINTS.AUTH.FORGOT_PASSWORD.VERIFY_CODE}`
      );

      const body = { lang, identifier, code };

      const response = await fetcher(url.toString(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.isSuccess) {
        return rejectWithValue(response);
      }

      return response;
    } catch (error: any) {
      return rejectWithValue({
        isSuccess: false,
        message: error.message || "Something went wrong",
      });
    }
  }
);

export const resetPassword = createAsyncThunk<
  BaseResponse,
  {
    identifier: string;
    code: string;
    newPassword: string;
    lang?: Locale | string;
  },
  { rejectValue: BaseResponse }
>(
  FORGOT_PASSWORD.RESET,
  async (
    { identifier, code, newPassword, lang = "en" },
    { rejectWithValue }
  ) => {
    try {
      const url = new URL(
        `${API_ENDPOINTS.AUTH.FORGOT_PASSWORD.ROOT}/${API_ENDPOINTS.AUTH.FORGOT_PASSWORD.RESET_PASSWORD}`
      );

      const body = { lang, identifier, code, newPassword };

      const response = await fetcher(url.toString(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.isSuccess) {
        return rejectWithValue(response);
      }

      return response;
    } catch (error: any) {
      return rejectWithValue({
        isSuccess: false,
        message: error.message || "Something went wrong",
      });
    }
  }
);
