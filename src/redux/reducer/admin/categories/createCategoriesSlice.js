import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  categories: [],
};

const createCategorySlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    createCategories: (state, action) => {
      state.categories = action.payload;
    },
  },
});

export const { createCategories } = createCategorySlice.actions;

export default createCategorySlice.reducer;
