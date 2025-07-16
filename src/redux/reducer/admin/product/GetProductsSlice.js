import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  products: null,
  productDetail: null, 
};

const getProductsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload;
    },
    setProductDetail: (state, action) => {
      state.productDetail = action.payload;
    },
  },
});

export const { setProducts, setProductDetail } = getProductsSlice.actions;

export default getProductsSlice.reducer;
