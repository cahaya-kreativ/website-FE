// Service Profile User
import { API_ENDPOINT } from "../../../utils/api-endpoint";
import http from "../../../utils/http";

export const reduxGetProfileUser = async () => {
  return await http.get(API_ENDPOINT.PROFILE_USER);
};
