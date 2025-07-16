import { API_ENDPOINT } from "../../../utils/api-endpoint";
import http from "../../../utils/http";

export const reduxDeleteDiscount = async (id) => {
  return await http.delete(`${API_ENDPOINT.DELETE_DISCOUNT}/${id}`); 
};
