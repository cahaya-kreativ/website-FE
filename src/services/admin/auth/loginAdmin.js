// Service Login Admin
import { API_ENDPOINT } from "../../../utils/api-endpoint";
import http from "../../../utils/http";

export const reduxLoginAdmin = async (input) => {
  return await http.post(API_ENDPOINT.ADMIN_LOGIN, input);
};

