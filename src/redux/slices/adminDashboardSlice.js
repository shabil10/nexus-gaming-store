import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  productsCount: 0,
  usersCount: 0,
  ordersCount: 0,
  revenue: 0,
  lowStockProducts: [],
  recentOrders: [],
  loading: false,
  error: null
};

const adminDashboardSlice = createSlice({
  name: "adminDashboard",

  initialState,

  reducers: {
    setDashboardLoading: (
      state,
      action
    ) => {
      state.loading =
        action.payload;
    },

    setDashboardData: (
      state,
      action
    ) => {
      state.productsCount =
        action.payload.productsCount;

      state.usersCount =
        action.payload.usersCount;

      state.ordersCount =
        action.payload.ordersCount;

      state.revenue =
        action.payload.revenue;

      state.lowStockProducts =
        action.payload.lowStockProducts || [];

      state.recentOrders =
        action.payload.recentOrders || [];

      state.loading = false;
      state.error = null;
    },

    setDashboardError: (
      state,
      action
    ) => {
      state.error =
        action.payload;

      state.loading = false;
    }
  }
});

export const {
  setDashboardLoading,
  setDashboardData,
  setDashboardError
} = adminDashboardSlice.actions;

export default adminDashboardSlice.reducer;