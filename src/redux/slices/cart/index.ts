import { CartItem } from "@/types/cartItem.type";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  addItemToServer,
  removeAllItemsFromServer,
  removeItemFromServer,
  wishlistItems,
} from "./actions";
import { DataResponse } from "@/types/service-response.type";
import { Cart } from "@/types/cart.type";

interface ServerCartItem extends CartItem {
  productId: string;
}

interface CartState {
  items: CartItem[];
  totalAmount: number;
  itemsCount: number;
  totalItemsCount: number;
  loading: boolean;
}

const initialState: CartState = {
  items: [],
  totalAmount: 0,
  itemsCount: 0,
  totalItemsCount: 0,
  loading: false,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    resetCartState: () => ({ ...initialState }),

    setCartItems: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
      state.totalItemsCount = state.items.reduce(
        (acc, i) => acc + i.quantity,
        0
      );
      state.itemsCount = state.items.length;
      state.totalAmount = state.items.reduce(
        (acc, i) => acc + i.quantity * (i.price ?? 0),
        0
      );
    },
  },
  extraReducers: (builder) => {
    const updateCartState = (state: CartState, payload: DataResponse<Cart>) => {
      if (!payload.data) return;

      const payloadList = payload?.data?.items || [];
      const stateList = state.items;

      if (payloadList.length === 0) {
        state.items = [];
        state.totalAmount = 0;
        state.totalItemsCount = 0;
        state.itemsCount = 0;
        return;
      }

      const payloadMap = new Map<string, ServerCartItem>(
        (payloadList as ServerCartItem[]).map((item) => [item.productId, item])
      );

      state.items = stateList
        .filter((i) => payloadMap.has(i._id))
        .map((i) => {
          const updated = payloadMap.get(i._id);

          return {
            ...i,
            quantity: updated?.quantity ?? i.quantity,
            price: updated?.price ?? i.price,
          };
        });

      state.totalAmount = state.items.reduce(
        (acc, i) => acc + i.quantity * (i.price ?? 0),
        0
      );

      state.itemsCount = state.items.length ?? 0;
      state.totalItemsCount = state.items.reduce(
        (acc, i) => acc + i.quantity,
        0
      );
    };

    builder
      // Add item
      .addCase(addItemToServer.pending, (state) => {
        state.loading = true;
      })
      .addCase(addItemToServer.fulfilled, (state, { payload }) => {
        state.loading = false;

        updateCartState(state, payload);
      })
      .addCase(addItemToServer.rejected, (state) => {
        state.loading = false;
      })

      // Remove item
      .addCase(removeItemFromServer.pending, (state) => {
        state.loading = true;
      })
      .addCase(removeItemFromServer.fulfilled, (state, { payload }) => {
        state.loading = false;

        updateCartState(state, payload);
      })
      .addCase(removeItemFromServer.rejected, (state) => {
        state.loading = false;
      })

      // Remove all items
      .addCase(removeAllItemsFromServer.pending, (state) => {
        state.loading = true;
      })
      .addCase(removeAllItemsFromServer.fulfilled, (state, { payload }) => {
        state.loading = false;

        updateCartState(state, payload);
      })
      .addCase(removeAllItemsFromServer.rejected, (state) => {
        state.loading = false;
      })

      // Wishlist items
      .addCase(wishlistItems.pending, (state) => {
        state.loading = true;
      })
      .addCase(wishlistItems.fulfilled, (state) => {
        state.loading = false;
        state.items = [];
        state.totalAmount = 0;
        state.totalItemsCount = 0;
        state.itemsCount = 0;
      })
      .addCase(wishlistItems.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { resetCartState, setCartItems } = cartSlice.actions;

export default cartSlice.reducer;
