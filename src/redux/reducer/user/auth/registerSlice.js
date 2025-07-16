import { createSlice } from "@reduxjs/toolkit";
import { CookiesKeys, CookieStorage } from "../../../../utils/cookie";

const initialState = {
  token: CookieStorage.get(CookiesKeys.AuthToken) || null,
  isRegister: false,
  user: null,
};

const registerSlice = createSlice({
  name: "RegisterAuth",
  initialState,
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
    },
    setIsLoggedIn: (state, action) => {
      state.isRegister = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
});

export const { setToken, setIsLoggedIn, setUser } = registerSlice.actions;

export default registerSlice.reducer;
