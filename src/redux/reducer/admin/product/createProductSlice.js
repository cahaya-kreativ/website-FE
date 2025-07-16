import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  product: null,
};

const createProductsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setProduct: (state, action) => {
      state.product = action.payload;
    },
    
  },
});

export const { setProduct } = createProductsSlice.actions;

export default createProductsSlice.reducer;
