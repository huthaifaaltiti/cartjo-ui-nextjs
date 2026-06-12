import { createAsyncThunk } from "@reduxjs/toolkit";
import { Locale } from "@/types/locale";
import { BaseResponse } from "@/types/service-response.type";
import { LOGIN } from "./constants";
import { TokenSession } from "@/types/tokenSession.type";

export interface LoginPayload {
  identifier: string;
  password: string;
  rememberMe?: boolean;
  lang?: Locale | string;
}

export interface LoginResponse extends BaseResponse {
  user?: TokenSession;
}

export const login = createAsyncThunk<
  LoginResponse,
  LoginPayload,
  { rejectValue: BaseResponse }
>(
  LOGIN.LOGIN,
  async (
    { identifier, password, rememberMe, lang = "en" },
    { rejectWithValue },
  ) => {
    try {
      const resp = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password, rememberMe, lang }),
      });

      const result: LoginResponse = await resp.json();

      if (!resp.ok) {
        return rejectWithValue({
          isSuccess: false,
          message: result.message ?? "Login failed",
        });
      }

      return result;
    } catch (error) {
      return rejectWithValue({
        isSuccess: false,
        message: error instanceof Error ? error.message : "Login failed",
      });
    }
  },
);
