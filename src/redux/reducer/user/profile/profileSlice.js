import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  birth_date: "",
  address: "",
  city: "",
};

const profileSlice = createSlice({
  name: "profil",
  initialState,
  reducers: {
    setBirth_date: (state, action) => {
      state.birth_date = action.payload;
    },
    setAddress: (state, action) => {
        state.address = action.payload;
      },
    setCity: (state, action) => {
      state.city = action.payload;
    },
  },
});

export const { setBirth_date, setAddress, setCity } = profileSlice.actions;

export default profileSlice.reducer;
