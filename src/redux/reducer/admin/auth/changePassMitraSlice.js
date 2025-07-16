import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  password: [],
};

const changePasswordSlice = createSlice({
  name: "change password",
  initialState,
  reducers: {
    setPassword: (state, action) => {
      state.password = action.payload;
    },
  },
});

export const { setPassword } = changePasswordSlice.actions;

export default changePasswordSlice.reducer;
