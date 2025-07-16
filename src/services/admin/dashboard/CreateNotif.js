import { API_ENDPOINT } from "../../../utils/api-endpoint";
import http from "../../../utils/http";

export const reduxCreateNotifUser = async (notification) => {
  return await http.post(API_ENDPOINT.CREATE_NOTIFICATIONS, notification);
};
