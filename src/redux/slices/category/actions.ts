import { Category } from "@/types/category.type";
import { BaseResponse, DataListResponse } from "@/types/service-response.type";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { CATEGORY_CONSTANTS } from "./constants";
import { API_ENDPOINTS } from "@/lib/apiEndpoints";
import { Locale } from "@/types/locale";
import { fetcher } from "@/utils/fetcher";

export const getCategories = createAsyncThunk<
  DataListResponse<Category>,
  {
    token: string;
    lang: Locale;
    lastId: string;
    search: string;
    limit: number;
  },
  { rejectValue: BaseResponse }
>(
  CATEGORY_CONSTANTS.GET_ALL,
  async ({ token, lastId, search, limit, lang }, { rejectWithValue }) => {
    try {
      const url = new URL(API_ENDPOINTS.DASHBOARD.CATEGORIES.GET_ALL);

      if (limit && limit > 0)
        url.searchParams.append("limit", limit.toString());
      if (lang) url.searchParams.append("lang", lang);
      if (lastId) url.searchParams.append("lastId", lastId);
      if (search) url.searchParams.append("search", search);

      const response = await fetcher<DataListResponse<Category>>(
        url.toString(),
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
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
          error instanceof Error
            ? error.message
            : "Something went wrong, could not retrieve categories.",
      });
    }
  },
);
