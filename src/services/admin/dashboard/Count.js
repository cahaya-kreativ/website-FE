import { API_ENDPOINT } from "../../../utils/api-endpoint";
import http from "../../../utils/http";

export const reduxGetCountCustomers = async () => {
  return await http.get(API_ENDPOINT.COUNT_CUSTOMERS);
};

export const reduxGetCountOrders = async () => {
  return await http.get(API_ENDPOINT.COUNT_ORDERS);
};

export const reduxGetCountProducts = async () => {
  return await http.get(API_ENDPOINT.COUNT_PRODUCTS);
};

export const reduxGetCountCategories = async () => {
  return await http.get(API_ENDPOINT.COUNT_CATEGORIES);
};

export const reduxGetDetailDashboard = async () => {
  return await http.get(API_ENDPOINT.DASHBOARD_ADMIN);
};
