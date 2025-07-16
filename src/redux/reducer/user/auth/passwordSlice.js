import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  forget: [],
  reset: null,
};

const passwordSlice = createSlice({
  name: "password",
  initialState,
  reducers: {
    setForget: (state, action) => {
      state.forget = action.payload;
    },
    setReset: (state, action) => {
      state.reset = action.payload;
    },
  },
});

export const { setForget, setReset } = passwordSlice.actions;

export default passwordSlice.reducer;
