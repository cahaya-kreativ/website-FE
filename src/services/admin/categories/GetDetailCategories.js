import { API_ENDPOINT } from "../../../utils/api-endpoint";
import http from "../../../utils/http";

export const reduxGetDetailCategories = async (id) => {
  return await http.get(`${API_ENDPOINT.GET_DETAIL_CATEGORIES}/${id}`);
};