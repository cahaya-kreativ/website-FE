import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  customers: null,
  employees: null,
};

const getCustomersSlice = createSlice({
  name: "customers",
  initialState,
  reducers: {
    getCustomers: (state, action) => {
      state.customers = action.payload;
    },
    getEmployees: (state, action) => {
      state.employees = action.payload;
    },
  },
});

export const { getCustomers, getEmployees } = getCustomersSlice.actions;

export default getCustomersSlice.reducer;
