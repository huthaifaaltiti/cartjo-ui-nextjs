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
      const url = new URL(API_ENDPOINTS.AUTH.FORGOT_PASSWORD);

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
