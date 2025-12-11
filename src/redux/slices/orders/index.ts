import { Order } from "@/types/order.type";
import { BaseResponse } from "@/types/service-response.type";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { changePaymentStatus, getOrder, getOrders } from "./actions";

interface OrderState {
  items: Order[];
  itemsCount: number;
  loading: boolean;
  error: null | string;
  selectedOrder: Order | null;
  searchQuery: string;
  queryKey: string;
}

const initialState: OrderState = {
  items: [],
  itemsCount: 0,
  loading: false,
  error: null,
  selectedOrder: null,
  searchQuery: "",
  queryKey: "orders",
};

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    resetOrdersState: () => ({ ...initialState }),
    setOrdersItems: (state, action: PayloadAction<Order[]>) => {
      state.items = action.payload;
      state.itemsCount = state.items.length;
    },
    setSelectedOrder: (state, action: PayloadAction<Order | null>) => {
      state.selectedOrder = action.payload;
    },
    setOrdersSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
  },
  extraReducers: (builder) => {
    // getOrders
    builder.addCase(getOrders.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getOrders.fulfilled, (state, { payload }) => {
      state.loading = false;
      // payload.data is orders array
      state.items = payload.data || [];
      state.itemsCount = payload.data?.length ?? 0;
    });
    builder.addCase(getOrders.rejected, (state, action) => {
      state.loading = false;
      const payload = action.payload as BaseResponse | undefined;
      state.error = payload?.message ?? "Failed to fetch orders";
    });

    // getOrder
    builder.addCase(getOrder.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getOrder.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.selectedOrder = payload.data ?? null;
    });
    builder.addCase(getOrder.rejected, (state, action) => {
      state.loading = false;
      const payload = action.payload as BaseResponse | undefined;
      state.error = payload?.message ?? "Failed to fetch order";
    });

    // changePaymentStatus
    builder.addCase(changePaymentStatus.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(changePaymentStatus.fulfilled, (state, { payload }) => {
      state.loading = false;

      const updated = payload.data;

      if (!updated) return;

      state.items = state.items.map((o) =>
        o._id === updated._id ? updated : o
      );
    });
    builder.addCase(changePaymentStatus.rejected, (state, action) => {
      state.loading = false;
      const payload = action.payload as BaseResponse | undefined;
      state.error = payload?.message ?? "Failed to change payment status";
    });
  },
});

export const {
  resetOrdersState,
  setOrdersItems,
  setSelectedOrder,
  setOrdersSearchQuery,
} = orderSlice.actions;

export default orderSlice.reducer;