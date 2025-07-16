import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  categories: null,
};

const getCategoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    setCategories: (state, action) => {
      state.categories = action.payload;
    },
  },
});

export const { setCategories } = getCategoriesSlice.actions;

export default getCategoriesSlice.reducer;
