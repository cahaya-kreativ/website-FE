import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  payments: [],
};

const paymentSlice = createSlice({
  name: "payments",
  initialState,
  reducers: {
    createPayment: (state, action) => {
      state.payments = action.payload;
    },
  },
});

export const { createPayment } = paymentSlice.actions;

export default paymentSlice.reducer;
