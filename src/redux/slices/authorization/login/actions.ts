import { createAsyncThunk } from "@reduxjs/toolkit";
import { Locale } from "@/types/locale";
import { BaseResponse } from "@/types/service-response.type";
import { Media } from "@/types/media.type";
import { LOGIN } from "./constants";

export interface LoginPayload {
  identifier: string;
  password: string;
  rememberMe?: boolean;
  lang?: Locale | string;
}

export interface LoginUser {
  id: string;
  email?: string;
  username?: string;
  role: string;
  firstName?: string;
  lastName?: string;
  profilePic?: Media;
}

export interface LoginResponse extends BaseResponse {
  user?: LoginUser;
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
