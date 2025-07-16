import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  reviews: null,
};

const getReviewSlice = createSlice({
  name: "Reviews",
  initialState,
  reducers: {
    setReview: (state, action) => {
      state.reviews = action.payload;
    },
  },
});

export const { setReview } = getReviewSlice.actions;

export default getReviewSlice.reducer;
