import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  order: [],
  discount: [],
};

const createOrderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    createOrder: (state, action) => {
      state.order = action.payload;
    },
    discountOrder: (state, action) => {
      state.discount = action.payload;
    }
  },
});

export const { createOrder, discountOrder } = createOrderSlice.actions;

export default createOrderSlice.reducer;
