import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  countCustomers: null,
  countOrders: null,
  countProducts: null,
  countCategories: null,
  dashboard: null,
};

const getCountSlice = createSlice({
  name: "count",
  initialState,
  reducers: {
    getCountCustomers: (state, action) => {
      state.countCustomers = action.payload;
    },
    getCountOrders: (state, action) => {
      state.countOrders = action.payload;
    },
    getCountProducts: (state, action) => {
      state.countProducts = action.payload;
    },
    getCountCategories: (state, action) => {
      state.countCategories = action.payload;
    },
    getCountDashboard: (state, action) => {
      state.dashboard = action.payload;
    },
  },
});

export const {
  getCountCustomers,
  getCountOrders,
  getCountProducts,
  getCountCategories,
  getCountDashboard,
} = getCountSlice.actions;

export default getCountSlice.reducer;
