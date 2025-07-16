import { API_ENDPOINT } from "../../../utils/api-endpoint";
import http from "../../../utils/http";

export const reduxUpdateDiscount = async (id, discount) => {
  return await http.put(`${API_ENDPOINT.UPDATE_DISCOUNT}/${id}`, discount);
};
