// Service User
import { API_ENDPOINT } from "../../../utils/api-endpoint";
import http from "../../../utils/http";

export const reduxGetUser = async () => {
  return await http.get(API_ENDPOINT.AUTH_USER);
};
