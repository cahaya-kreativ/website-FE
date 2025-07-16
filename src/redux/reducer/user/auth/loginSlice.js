import { createSlice } from "@reduxjs/toolkit";
import { CookieStorage, CookiesKeys } from "../../../../utils/cookie";

const initialState = {
  token: CookieStorage.get(CookiesKeys.AuthToken) || null,
  isLoggedIn: false,
  user: null,
  userProfile: null,
  loading: false,
};

const loginSlice = createSlice({
  name: "loginAuth",
  initialState,
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
    },

    setIsLoggedIn: (state, action) => {
      state.isLoggedIn = action.payload;
    },

    setUser: (state, action) => {
      state.user = action.payload;
    },

    setUserProfile: (state, action) => {
      state.userProfile = action.payload;
    },

    startLoading: (state) => {
      state.loading = true;
    },

    endLoading: (state) => {
      state.loading = false;
    },
  },
});

export const {
  setToken,
  setIsLoggedIn,
  setUser,
  setUserProfile,
  startLoading,
  endLoading,
} = loginSlice.actions;

export default loginSlice.reducer;
