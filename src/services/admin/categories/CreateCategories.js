import { API_ENDPOINT } from "../../../utils/api-endpoint";
import http from "../../../utils/http";

export const reduxCreateCategories = async (categories) => {
  return await http.post(API_ENDPOINT.CREATE_CATEGORIES, categories);
};
