import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  get: [],
};

const getOrderSlice = createSlice({
  name: "get Order",
  initialState,
  reducers: {
    getOrder: (state, action) => {
      state.get = action.payload;
    },
  },
});

export const { getOrder } = getOrderSlice.actions;

export default getOrderSlice.reducer;
