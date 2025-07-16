import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  chats: [], // Harus array
  inbox: [],
  loading: false,
  error: null,
};

const chattingSlice = createSlice({
  name: "chatting",
  initialState,
  reducers: {
    setChats: (state, action) => {
      state.chats = Array.isArray(action.payload) ? action.payload : [];
    },
    addChat: (state, action) => {
      state.chats.push(action.payload); // Tambah satu pesan
    },
    setInbox: (state, action) => {
      state.inbox = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setChats, addChat, setInbox, setError, setLoading } =
  chattingSlice.actions;

export default chattingSlice.reducer;