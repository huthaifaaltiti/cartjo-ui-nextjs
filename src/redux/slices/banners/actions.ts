import { createAsyncThunk } from "@reduxjs/toolkit";
import { API_ENDPOINTS } from "@/lib/apiEndpoints";
import {
  BaseResponse,
  DataListResponse,
  DataResponse,
} from "@/types/service-response.type";
import { Banner } from "@/types/banner.type";
import { Locale } from "@/types/locale";
import { Locale as LocaleEnum } from "@/enums/locale.enum";
import { authFetcher } from "@/utils/authFetcher";
import { BANNER_CONSTANTS } from "./constants";

// GET banners
export const getBanners = createAsyncThunk<
  DataListResponse<Banner>,
  {
    lang?: Locale | string;
    limit?: number;
    lastId?: string;
    search?: string;
  },
  { rejectValue: BaseResponse }
>(
  BANNER_CONSTANTS.getBanners,
  async (
    { lang = LocaleEnum.EN, limit = 10, lastId, search },
    { rejectWithValue },
  ) => {
    try {
      const url = new URL(
        API_ENDPOINTS.DASHBOARD.BANNERS.ALL,
        process.env.NEXT_PUBLIC_API_URL || process.env.APP_URL,
      );

      url.searchParams.set("lang", String(lang));
      url.searchParams.set("limit", String(limit));

      if (lastId) {
        url.searchParams.set("lastId", lastId);
      }

      if (search) {
        url.searchParams.set("search", search);
      }

      const response = await authFetcher<DataListResponse<Banner>>(
        url.toString(),
        {
          method: "GET",
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

// DELETE banner
export const deleteBanner = createAsyncThunk<
  DataResponse<Banner>,
  {
    id: string;
    lang?: Locale | string;
  },
  { rejectValue: BaseResponse }
>(
  BANNER_CONSTANTS.deleteBanner,
  async ({ id, lang = LocaleEnum.EN }, { rejectWithValue }) => {
    try {
      const url = new URL(
        `${API_ENDPOINTS.DASHBOARD.BANNERS.DELETE}/${id}`,
        process.env.NEXT_PUBLIC_API_URL || process.env.APP_URL,
      );

      const response = await authFetcher<DataResponse<Banner>>(url.toString(), {
        method: "DELETE",
        body: JSON.stringify({ lang }),
      });

      if (!response.isSuccess) {
        return rejectWithValue(response);
      }

      return response as DataResponse<Banner>;
    } catch (error) {
      return rejectWithValue({
        isSuccess: false,
        message:
          error instanceof Error ? error.message : "Something went wrong",
      });
    }
  },
);

// RESTORE banner
export const restoreBanner = createAsyncThunk<
  DataResponse<Banner>,
  {
    id: string;
    lang?: Locale | string;
  },
  { rejectValue: BaseResponse }
>(
  BANNER_CONSTANTS.restoreBanner,
  async ({ id, lang = LocaleEnum.EN }, { rejectWithValue }) => {
    try {
      const url = new URL(
        `${API_ENDPOINTS.DASHBOARD.BANNERS.UN_DELETE}/${id}`,
        process.env.NEXT_PUBLIC_API_URL || process.env.APP_URL,
      );

      const response = await authFetcher<DataResponse<Banner>>(url.toString(), {
        method: "DELETE",
        body: JSON.stringify({ lang }),
      });

      if (!response.isSuccess) {
        return rejectWithValue(response);
      }

      return response as DataResponse<Banner>;
    } catch (error) {
      return rejectWithValue({
        isSuccess: false,
        message:
          error instanceof Error ? error.message : "Something went wrong",
      });
    }
  },
);

// SWITCH ACTIVE STATUS
export const switchBannerActiveStatus = createAsyncThunk<
  DataResponse<Banner>,
  {
    id: string;
    isActive: boolean;
    lang?: Locale | string;
  },
  { rejectValue: BaseResponse }
>(
  BANNER_CONSTANTS.switchBannerActiveStatus,
  async ({ id, isActive, lang = LocaleEnum.EN }, { rejectWithValue }) => {
    try {
      const url = new URL(
        `${API_ENDPOINTS.DASHBOARD.BANNERS.SWITCH_ACTIVE_STATUS}/${id}`,
        process.env.NEXT_PUBLIC_API_URL || process.env.APP_URL,
      );

      const response = await authFetcher<DataResponse<Banner>>(url.toString(), {
        method: "PUT",
        body: JSON.stringify({
          lang,
          isActive,
        }),
      });

      if (!response.isSuccess) {
        return rejectWithValue(response);
      }

      return response as DataResponse<Banner>;
    } catch (error) {
      return rejectWithValue({
        isSuccess: false,
        message:
          error instanceof Error ? error.message : "Something went wrong",
      });
    }
  },
);
