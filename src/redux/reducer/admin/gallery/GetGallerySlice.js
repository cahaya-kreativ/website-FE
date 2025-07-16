import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  galleries: [],
};

const getGalleriesSlice = createSlice({
  name: "galleries",
  initialState,
  reducers: {
    setGalleries: (state, action) => {
      state.galleries = action.payload;
    },
  },
});

export const { setGalleries } = getGalleriesSlice.actions;

export default getGalleriesSlice.reducer;
