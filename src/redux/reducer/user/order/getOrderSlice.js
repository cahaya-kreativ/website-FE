import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  orders: null,
  orderDetail: null, 
};

const getOrdersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    setOrders: (state, action) => {
      state.orders = action.payload;
    },
    setOrderDetail: (state, action) => {
      state.orderDetail = action.payload;
    },
  },
});

export const { setOrders, setOrderDetail } = getOrdersSlice.actions;

export default getOrdersSlice.reducer;
