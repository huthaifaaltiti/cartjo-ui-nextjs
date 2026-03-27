import { SLICES_INFO } from "@/redux/slices-info";
import { Category } from "@/types/category.type";
import { createSlice } from "@reduxjs/toolkit";
import { getCategories } from "./actions";
import { BaseResponse } from "@/types/service-response.type";

interface CategoryState {
  loading: boolean;
  err: BaseResponse | null;
  categories: Category[];
}

const initialState: CategoryState = {
  loading: false,
  err: null,
  categories: [],
};

const categorySlice = createSlice({
  name: SLICES_INFO.CATEGORY.name,
  initialState,
  reducers: {
    setCategories: (state, action) => {
      console.log({ action });
      state.categories = action.payload;
      state.loading = false;
      state.err = null;
    },
  },
  extraReducers: (builder) => {
    // Loading
    builder.addCase(getCategories.pending, (state) => {
      state.loading = true;
    });

    // Fulfilled
    builder.addCase(getCategories.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.categories = payload.data ?? [];
    });

    // Rejected
    builder.addCase(getCategories.rejected, (state, { payload }) => {
      state.loading = false;
      state.err = payload ?? null;
    });
  },
});

export const { setCategories } = categorySlice.actions;
export default categorySlice.reducer;
