// chatAdminSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  chat: [],
  selectedUserId: null,
};

const chatAdminSlice = createSlice({
  name: "chatAdmin",
  initialState,
  reducers: {
    setChats: (state, action) => {
      state.chat = action.payload;
    },
    setSelectedUserId: (state, action) => { // Tambahkan reducer untuk mengatur selectedUserId
      state.selectedUserId = action.payload;
    },
  },
});

export const { setChats, setSelectedUserId } = chatAdminSlice.actions;

export default chatAdminSlice.reducer;
