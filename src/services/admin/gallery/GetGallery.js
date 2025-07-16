import { API_ENDPOINT } from "../../../utils/api-endpoint";
import http from "../../../utils/http";

export const reduxGetGalleries = async () => {
  return await http.get(API_ENDPOINT.GET_GALLERIES);
};
