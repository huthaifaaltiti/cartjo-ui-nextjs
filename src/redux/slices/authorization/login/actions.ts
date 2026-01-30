import { createAsyncThunk } from "@reduxjs/toolkit";
import { API_ENDPOINTS } from "@/lib/apiEndpoints";
import { Locale } from "@/types/locale";
import { BaseResponse } from "@/types/service-response.type";
import { fetcher } from "@/utils/fetcher";
import { LOGIN } from "./constants";

export interface LoginPayload {
  identifier: string;
  password: string;
  lang?: Locale | string;
}

export interface LoginResponse extends BaseResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export const login = createAsyncThunk<
  LoginResponse,
  LoginPayload,
  { rejectValue: BaseResponse }
>(
  LOGIN.LOGIN,
  async ({ identifier, password, lang = "en" }, { rejectWithValue }) => {
    try {
      const response = await fetcher<LoginResponse>(API_ENDPOINTS.AUTH.LOGIN, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password, lang }),
      });

      console.log({response})

      if (
        !response.isSuccess ||
        !response.accessToken ||
        !response.refreshToken
      ) {
        return rejectWithValue(response);
      }

      return response;
    } catch (error) {
      return rejectWithValue({
        isSuccess: false,
        message: error instanceof Error ? error.message : "Login failed",
      });
    }
  },
);
