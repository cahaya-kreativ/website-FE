// services Status Order
import { API_ENDPOINT } from "../../../utils/api-endpoint";
import http from "../../../utils/http";

export const reduxValidateOrder = async (id) => {
  return http.put(`${API_ENDPOINT.VALIDATE_ORDER}/${id}`);
};

export const reduxDoneOrder = async (id) => {
  return http.put(`${API_ENDPOINT.DONE_ORDER}/${id}`);
};

export const reduxGetOrder = async () => {
  return http.get(API_ENDPOINT.GET_ORDERS);
};
