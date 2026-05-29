import { Banner } from "@/types/banner.type";
import { BaseResponse } from "@/types/service-response.type";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  deleteBanner,
  getBanners,
  restoreBanner,
  switchBannerActiveStatus,
} from "./actions";

interface BannersState {
  items: Banner[];
  selectedBanner: Banner | null;
  loading: boolean;
  error: string | null;
  searchQuery: string;
}

const initialState: BannersState = {
  items: [],
  selectedBanner: null,
  loading: false,
  error: null,
  searchQuery: "",
};

const bannersSlice = createSlice({
  name: "banners",
  initialState,
  reducers: {
    resetBannersState: () => ({ ...initialState }),

    setBannersItems: (state, action: PayloadAction<Banner[]>) => {
      state.items = action.payload;
    },

    setSelectedBanner: (state, action: PayloadAction<Banner | null>) => {
      state.selectedBanner = action.payload;
    },

    setBannersSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
  },

  extraReducers: (builder) => {
    // getBanners
    builder.addCase(getBanners.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(getBanners.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.items = payload.data || [];
    });

    builder.addCase(getBanners.rejected, (state, action) => {
      state.loading = false;

      const payload = action.payload as BaseResponse | undefined;

      state.error = payload?.message ?? "Failed to fetch banners";
    });

    // deleteBanner
    builder.addCase(deleteBanner.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(deleteBanner.fulfilled, (state, {}) => {
      state.loading = false;
    });

    builder.addCase(deleteBanner.rejected, (state, action) => {
      state.loading = false;

      const payload = action.payload as BaseResponse | undefined;

      state.error = payload?.message ?? "Failed to delete banner";
    });

    // restoreBanner
    builder.addCase(restoreBanner.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(restoreBanner.fulfilled, (state, {}) => {
      state.loading = false;
    });

    builder.addCase(restoreBanner.rejected, (state, action) => {
      state.loading = false;

      const payload = action.payload as BaseResponse | undefined;

      state.error = payload?.message ?? "Failed to restore banner";
    });

    // switchBannerActiveStatus
    builder.addCase(switchBannerActiveStatus.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(switchBannerActiveStatus.fulfilled, (state, {}) => {
      state.loading = false;
    });

    builder.addCase(switchBannerActiveStatus.rejected, (state, action) => {
      state.loading = false;

      const payload = action.payload as BaseResponse | undefined;

      state.error = payload?.message ?? "Failed to switch banner active status";
    });
  },
});

export const {
  resetBannersState,
  setBannersItems,
  setSelectedBanner,
  setBannersSearchQuery,
} = bannersSlice.actions;

export default bannersSlice.reducer;
