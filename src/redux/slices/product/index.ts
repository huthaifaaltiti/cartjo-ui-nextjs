import { createSlice } from "@reduxjs/toolkit";
import { VariantServer } from "@/types/product.type";

interface ProductState {
  selectedVariant: VariantServer | null;
}

const initialState: ProductState = {
  selectedVariant: null,
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    resetProductState: () => ({ ...initialState }),
    setSelectedServerVariant: (state, { payload }) => {
      state.selectedVariant = { ...payload };
    },
  },
});

export const { setSelectedServerVariant } = productSlice.actions;

export default productSlice.reducer;
