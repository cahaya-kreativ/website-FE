import { API_ENDPOINT } from "../../../utils/api-endpoint";
import http from "../../../utils/http";

export const reduxDeleteCategories = async (id) => {
  return await http.delete(`${API_ENDPOINT.DELETE_CATEGORIES}/${id}`);
};
