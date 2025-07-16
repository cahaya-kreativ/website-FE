import { createSlice } from "@reduxjs/toolkit";
import { CookiesKeys, CookieStorage } from "../../../../utils/cookie";

const initialState = {
  token: CookieStorage.get(CookiesKeys.AdminToken) || null,
  isRegister: false,
  employee: null,
};

const addEmployeeSlice = createSlice({
  name: "Add Employee",
  initialState,
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
    },
    setIsLoggedIn: (state, action) => {
      state.isRegister = action.payload;
    },
    setEmployee: (state, action) => {
      state.employee = action.payload;
    },
  },
});

export const { setToken, setIsLoggedIn, setEmployee } = addEmployeeSlice.actions;

export default addEmployeeSlice.reducer;
