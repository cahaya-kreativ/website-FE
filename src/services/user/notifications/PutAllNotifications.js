import { API_ENDPOINT } from "../../../utils/api-endpoint";
import http from "../../../utils/http";

export const reduxPutNotifAll = async () => {
  return await http.put(API_ENDPOINT.UPDATE_ALL_NOTIFICATIONS);
};
