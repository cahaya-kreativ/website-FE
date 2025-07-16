// services Update Profile
import { API_ENDPOINT } from "../../../utils/api-endpoint";
import http from "../../../utils/http";

export const reduxCancelOrder = async (id, input) => {
  return http.put(`${API_ENDPOINT.CANCEL_ORDER}/${id}`, input);
};
