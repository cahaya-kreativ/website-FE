import { API_ENDPOINT } from "../../../utils/api-endpoint";
import http from "../../../utils/http";

export const reduxGetAllCustomers = async () => {
  return await http.get(API_ENDPOINT.ALL_USER);
};

export const reduxGetAllEmployees = async () => {
  return await http.get(API_ENDPOINT.ALL_EMPLOYEE);
};