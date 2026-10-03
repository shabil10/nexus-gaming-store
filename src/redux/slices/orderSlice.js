import {
  createAsyncThunk,
  createSlice
} from "@reduxjs/toolkit";

import {
  getOrders,
  updateOrderStatus
} from "../../services/orderService";

export const fetchOrders = createAsyncThunk(
  "orders/fetchOrders",
  async () => {
    const data = await getOrders();

    return data;
  }
);

export const editOrderStatus = createAsyncThunk(
  "orders/editOrderStatus",
  async ({ id, status }) => {
    const data = await updateOrderStatus(
      id,
      status
    );

    return data;
  }
);

export const cancelOrder = createAsyncThunk(
  "orders/cancelOrder",
  async (id) => {
    const data = await updateOrderStatus(
      id,
      "Cancelled"
    );

    return data;
  }
);

const initialState = {
  orders: [],
  loading: false,
  error: null
};

const orderSlice = createSlice({
  name: "orders",

  initialState,

  reducers: {
    addOrder: (state, action) => {
      state.orders.unshift(
        action.payload
      );
    }
  },

  extraReducers: (builder) => {
    builder
      .addCase(
        fetchOrders.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        fetchOrders.fulfilled,
        (state, action) => {
          state.loading = false;

          state.orders = [
            ...action.payload
          ].reverse();
        }
      )

      .addCase(
        fetchOrders.rejected,
        (state, action) => {
          state.loading = false;

          state.error =
            action.error.message;
        }
      )

      .addCase(
        editOrderStatus.pending,
        (state) => {
          state.error = null;
        }
      )

      .addCase(
        editOrderStatus.fulfilled,
        (state, action) => {
          const index =
            state.orders.findIndex(
              (order) =>
                String(order.id) ===
                String(action.payload.id)
            );

          if (index !== -1) {
            state.orders[index] =
              action.payload;
          }
        }
      )

      .addCase(
        editOrderStatus.rejected,
        (state, action) => {
          state.error =
            action.error.message;
        }
      )

      .addCase(
        cancelOrder.pending,
        (state) => {
          state.error = null;
        }
      )

      .addCase(
        cancelOrder.fulfilled,
        (state, action) => {
          const index =
            state.orders.findIndex(
              (order) =>
                String(order.id) ===
                String(action.payload.id)
            );

          if (index !== -1) {
            state.orders[index] =
              action.payload;
          }
        }
      )

      .addCase(
        cancelOrder.rejected,
        (state, action) => {
          state.error =
            action.error.message;
        }
      );
  }
});

export const {
  addOrder
} = orderSlice.actions;

export default orderSlice.reducer;