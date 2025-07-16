import { API_ENDPOINT } from "../../../utils/api-endpoint";
import http from "../../../utils/http";

export const reduxCreateDiscount = async (discount) => {
  return await http.post(API_ENDPOINT.CREATE_DISCOUNT, discount);
};
