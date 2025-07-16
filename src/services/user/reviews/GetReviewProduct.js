import { API_ENDPOINT } from "../../../utils/api-endpoint";
import http from "../../../utils/http";

export const reduxGetReviewsProduct = async (productId, page = 1, filter) => {
  return await http.get(`${API_ENDPOINT.GET_REVIEWS_PRODUCT}/${productId}?page=${page}&filter=${filter}`);
};