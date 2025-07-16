import { API_ENDPOINT } from "../../../utils/api-endpoint";
import http from "../../../utils/http";

export const reduxForgetPass = async (email) => {
  return await http.post(API_ENDPOINT.FORGET_PASS, email);
};
