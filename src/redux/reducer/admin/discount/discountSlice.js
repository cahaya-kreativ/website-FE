import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  discount: [],
};

const createDiscountSlice = createSlice({
  name: "discount",
  initialState,
  reducers: {
    setDiscount: (state, action) => {
      state.discount = action.payload;
    },

  },
});

export const { setDiscount } = createDiscountSlice.actions;

export default createDiscountSlice.reducer;
