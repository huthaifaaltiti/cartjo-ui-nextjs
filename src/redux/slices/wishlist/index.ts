import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "@/types/product.type";
import {
  addWishlistItem,
  removeAllWishlistItems,
  removeWishlistItem,
  sendAllWishlistItemsToCart,
  sendWishlistItemToCart,
} from "./actions";

interface WishlistState {
  items: Product[];
  itemsCount: number;
  loading: boolean;
  error: string | null;
  hydrated: boolean;
}

const initialState: WishlistState = {
  items: [],
  itemsCount: 0,
  loading: false,
  error: null,
  hydrated: false,
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,

  reducers: {
    resetWishlistState: () => ({ ...initialState }),
    setWishlistItems: (state, action: PayloadAction<Product[]>) => {
      state.items = action.payload;
      state.itemsCount = action.payload.length;
    },
    setWishlistItemsCount: (state, action: PayloadAction<number>) => {
      state.itemsCount = action.payload;
    },
    hydrateWishlistCounters: (state, action: PayloadAction<number>) => {
      if (state.hydrated) return;

      state.itemsCount = action.payload;
      state.hydrated = true;
    },
  },

  extraReducers: (builder) => {
    builder
      // Removing wishlist item
      .addCase(removeWishlistItem.pending, (state) => {
        state.loading = true;
      })

      .addCase(removeWishlistItem.fulfilled, (state, action) => {
        const removedProductId = action.meta.arg.productId;

        state.loading = false;
        state.items = state.items.filter(
          (i) => i._id.toString() !== removedProductId.toString()
        );
        state.itemsCount = state.items.length ?? 0;
      })

      .addCase(removeWishlistItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to remove wishlist item";
      })

      // Adding wishlist item
      .addCase(addWishlistItem.pending, (state) => {
        state.loading = true;
      })

      .addCase(addWishlistItem.fulfilled, (state, action) => {
        const addedProduct = action.meta.arg.product;

        state.loading = false;
        state.items = [
          ...state.items,
          {
            ...addedProduct,
            isWishListed: true,
          },
        ];
        state.itemsCount = state.items.length ?? 0;
      })

      .addCase(addWishlistItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to add wishlist item";
      })

      // Sending wishlist item to cart
      .addCase(sendWishlistItemToCart.pending, (state) => {
        state.loading = true;
      })

      .addCase(sendWishlistItemToCart.fulfilled, (state, action) => {
        const sentProductId = action.meta.arg.productId;

        state.loading = false;
        state.items = state.items.filter(
          (i) => i._id.toString() !== sentProductId.toString()
        );
        state.itemsCount = state.items.length ?? 0;
      })

      .addCase(sendWishlistItemToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to send item to cart";
      })

      // Remove all wishlist items
      .addCase(removeAllWishlistItems.pending, (state) => {
        state.loading = true;
      })

      .addCase(removeAllWishlistItems.fulfilled, (state) => {
        state.loading = false;
        state.items = [];
        state.itemsCount = 0;
      })
      .addCase(removeAllWishlistItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to remove wishlist items";
      })

      // Send all wishlist items to cart
      .addCase(sendAllWishlistItemsToCart.pending, (state) => {
        state.loading = true;
      })

      .addCase(sendAllWishlistItemsToCart.fulfilled, (state) => {
        state.loading = false;
        state.items = [];
        state.itemsCount = 0;
      })
      .addCase(sendAllWishlistItemsToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to send items to cart";
      });
  },
});

export const {
  resetWishlistState,
  setWishlistItems,
  setWishlistItemsCount,
  hydrateWishlistCounters,
} = wishlistSlice.actions;
export default wishlistSlice.reducer;
