import { API_ENDPOINT } from "../../../utils/api-endpoint";
import http from "../../../utils/http";

export const reduxUpdateReview = async (id, input) => {
    return http.put(`${API_ENDPOINT.UPDATE_REVIEWS}/${id}`, input);
  };