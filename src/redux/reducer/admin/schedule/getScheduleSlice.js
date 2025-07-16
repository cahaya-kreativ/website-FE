import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  schedule: null,
};

const getScheduleSlice = createSlice({
  name: "schedules",
  initialState,
  reducers: {
    setSchedule: (state, action) => {
      state.schedule = action.payload;
    },
  },
});

export const { setSchedule } = getScheduleSlice.actions;

export default getScheduleSlice.reducer;
