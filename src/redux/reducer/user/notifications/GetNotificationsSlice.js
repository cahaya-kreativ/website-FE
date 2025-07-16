import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  notifications: null,
  status: null,
};

const getAllNotificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    setNotifications: (state, action) => {
      state.notifications = action.payload;
    },
    setStatus: (state, action) => {
      state.status = action.payload;
    },
  },
});

export const { setNotifications, setStatus } = getAllNotificationsSlice.actions;

export default getAllNotificationsSlice.reducer;
