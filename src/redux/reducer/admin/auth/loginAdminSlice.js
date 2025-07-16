import { createSlice } from "@reduxjs/toolkit";
import { CookieStorage, CookiesKeys } from "../../../../utils/cookie";

const initialState = {
  adminToken: CookieStorage.get(CookiesKeys.AdminToken) || null,
  isLoggedIn: false,
  admin: null,
  adminProfile: null,
  loading: false,
};

const loginAdminSlice = createSlice({
  name: "loginAdminAuth",
  initialState,
  reducers: {
    setAdminToken: (state, action) => {
      state.adminToken = action.payload;
    },

    setIsLoggedIn: (state, action) => {
      state.isLoggedIn = action.payload;
    },

    setAdmin: (state, action) => {
      state.admin = action.payload;
    },

    setAdminProfile: (state, action) => {
      state.adminProfile = action.payload;
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
  setAdminToken,
  setIsLoggedIn,
  setAdmin,
  setAdminProfile,
  startLoading,
  endLoading,
} = loginAdminSlice.actions;

export default loginAdminSlice.reducer;
