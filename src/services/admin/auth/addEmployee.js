import { API_ENDPOINT } from "../../../utils/api-endpoint";
import http from "../../../utils/http";

export const reduxAddEmployee = async (input) => {
  return await http.post(API_ENDPOINT.ADD_EMPLOYEE, input);
};