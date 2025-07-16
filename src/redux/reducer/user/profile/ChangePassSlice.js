import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  change: [],
};

const changePassSlice = createSlice({
  name: "change password",
  initialState,
  reducers: {
    setChange: (state, action) => {
      state.change = action.payload;
    },
  },
});

export const { setChange } = changePassSlice.actions;

export default changePassSlice.reducer;
