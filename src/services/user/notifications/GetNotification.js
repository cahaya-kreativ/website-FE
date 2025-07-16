import { API_ENDPOINT } from "../../../utils/api-endpoint";
import http from "../../../utils/http";

export const reduxGetNotif = async (page = 1) => {
  return await http.get(`${API_ENDPOINT.GET_ALL_NOTIFICATIONS}?page=${page}`);
};
