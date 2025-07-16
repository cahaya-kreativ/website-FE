// Service Update Password
import { API_ENDPOINT } from "../../../utils/api-endpoint";
import http from "../../../utils/http";

export const reduxUpdatePasswordMitra = (input, adminToken) => {
  return http.put(API_ENDPOINT.CHANGE_PASS, input, {
    headers: {
      Authorization: `Bearer ${adminToken}`,
    },
  });
};
