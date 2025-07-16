import { API_ENDPOINT } from "../../../utils/api-endpoint";
import http from "../../../utils/http";

export const reduxGetSchedule = async () => {
  return await http.get(API_ENDPOINT.GET_ALL_SCHEDULE);
};

export const reduxDeleteSchedule = async (id) => {
  return await http.delete(`${API_ENDPOINT.DELETE_SCHEDULE}/${id}`);
};

export const reduxCreateSchedule = async (input) => {
  return await http.post(API_ENDPOINT.CREATE_SCHEDULE, input);
};