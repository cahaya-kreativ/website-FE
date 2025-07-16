// Service Update Password
import { API_ENDPOINT } from "../../../utils/api-endpoint";
import http from "../../../utils/http";

export const reduxUpdatePass = (input, token) => {
  return http.put(API_ENDPOINT.PASS_UPDATE, input, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
