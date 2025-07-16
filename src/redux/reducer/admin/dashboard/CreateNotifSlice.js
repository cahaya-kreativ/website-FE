import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  notification: [],
};

const createNotificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    createNotification: (state, action) => {
      state.notification = action.payload;
    },

  },
});

export const { createNotification } = createNotificationSlice.actions;

export default createNotificationSlice.reducer;
