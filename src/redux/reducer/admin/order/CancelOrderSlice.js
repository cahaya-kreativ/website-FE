import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cancel: [],
  validate: [],
  done: [],
};

const statusOrderSlice = createSlice({
  name: "Status Order",
  initialState,
  reducers: {
    cancelOrder: (state, action) => {
      state.cancel = action.payload;
    },
    doneOrder: (state, action) => {
      state.done = action.payload;
    },
    validateOrder: (state, action) => {
      state.validate = action.payload;
    },
  },
});

export const { cancelOrder, doneOrder, validateOrder } = statusOrderSlice.actions;

export default statusOrderSlice.reducer;
