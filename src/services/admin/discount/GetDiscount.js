import { API_ENDPOINT } from "../../../utils/api-endpoint";
import http from "../../../utils/http";

export const reduxGetDiscount = async () => {
  return await http.get(API_ENDPOINT.GET_DISCOUNT);
};