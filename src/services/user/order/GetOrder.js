import { API_ENDPOINT } from "../../../utils/api-endpoint";
import http from "../../../utils/http";

export const reduxGetOrder = async (page = 1, filter) => {
  return await http.get(`${API_ENDPOINT.GET_ALL_ORDERS}?page=${page}&filter=${filter}`);
};

export const reduxGetDetailOrder = async (id) => {
  return await http.get(`${API_ENDPOINT.GET_DETAIL_ORDER}/${id}`);
};
