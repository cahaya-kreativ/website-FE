import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  portofolio: null,
};

const createPortofoliosSlice = createSlice({
  name: "portofolio",
  initialState,
  reducers: {
    setPortofolio: (state, action) => {
      state.portofolio = action.payload;
    },
    
  },
});

export const { setPortofolio } = createPortofoliosSlice.actions;

export default createPortofoliosSlice.reducer;
