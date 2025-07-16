import { API_ENDPOINT } from "../../../utils/api-endpoint";
import http from "../../../utils/http";

export const reduxCreateReview = async (orderId, input) => {
  return await http.post(`${API_ENDPOINT.CREATE_REVIEWS}/${orderId}`, input);
};
