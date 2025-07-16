import { API_ENDPOINT } from "../../../utils/api-endpoint";
import http from "../../../utils/http";

export const reduxCreatePortof = async (input) => {
  return await http.post(API_ENDPOINT.CREATE_PORTOFOLIO, input);
};
