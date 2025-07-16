// Service Register User
import { API_ENDPOINT } from "../../../utils/api-endpoint";
import http from "../../../utils/http";

export const reduxRegisterUser = async (input) => {
  return await http.post(API_ENDPOINT.USER_REGISTER, input);
};
