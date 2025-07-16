import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  review: [],
};

const createReviewSlice = createSlice({
  name: "Reviews",
  initialState,
  reducers: {
    createReview: (state, action) => {
      state.review = action.payload;
    },
  },
});

export const { createReview } = createReviewSlice.actions;

export default createReviewSlice.reducer;
