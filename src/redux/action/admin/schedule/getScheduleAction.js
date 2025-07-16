import { showErrorToast } from "../../../../helper/ToastHelper";
import {
  reduxGetSchedule,
  reduxDeleteSchedule,
  reduxCreateSchedule,
} from "../../../../services/admin/schedule/getSchedule";
import { setSchedule } from "../../../reducer/admin/schedule/getScheduleSlice";

export const getScheduleAction = () => async (dispatch) => {
  try {
    const result = await reduxGetSchedule();
    dispatch(setSchedule(result.data.data));
    return result.data.data;
  } catch (error) {
    console.error("reduxGetSchedule", error);
  }
};

export const createScheduleAction = (input) => async (dispatch) => {
  return reduxCreateSchedule(input)
    .then((result) => {
      dispatch(setSchedule(result.data.data.schedule));
      return result;
    })
    .catch((err) => {
      console.error("reduxCreateSchedule", err);
      if (err.response) {
        if (err.response.status >= 400 && err.response.status <= 500) {
          showErrorToast(err.response.data.message);
        } else {
          console.error("unexpected Error", err);
        }
      }
    });
};

export const deleteScheduleAction = (id) => async (dispatch) => {
  try {
    const result = await reduxDeleteSchedule(id);
    dispatch(setSchedule(result.data.data));
    return result.data.data;
  } catch (error) {
    console.error("reduxDeleteSchedule", error);
  }
};
