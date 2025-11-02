import { createAsyncThunk } from "@reduxjs/toolkit";
import { API_ENDPOINTS } from "@/lib/apiEndpoints";
import { Locale } from "@/types/locale";
import { BaseResponse } from "@/types/service-response.type";
import { fetcher } from "@/utils/fetcher";
import { VERIFY_EMAIL } from "./constants";

export const verifyEmail = createAsyncThunk<
  BaseResponse,
  { token: string; lang?: Locale | string }
>(VERIFY_EMAIL.VERIFY, async ({ token, lang = "en" }) => {
  const url = new URL(API_ENDPOINTS.VERIFY_EMAIL.VERIFY);
  url.searchParams.append("token", token);
  url.searchParams.append("lang", lang);

  return await fetcher(url.toString(), {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
});

export const reVerifyEmail = createAsyncThunk<
  BaseResponse,
  { email: string; lang?: Locale | string }
>(VERIFY_EMAIL.REVERIFY, async ({ email, lang = "en" }) => {
  const url = new URL(API_ENDPOINTS.VERIFY_EMAIL.REVERIFY);

  return await fetcher(url.toString(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, lang }),
  });
});
