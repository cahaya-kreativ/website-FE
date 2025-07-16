import { API_ENDPOINT } from "../../../utils/api-endpoint";
import http from "../../../utils/http";

export const reduxPutNotifId = async (notificationId) => {
  return await http.put(`${API_ENDPOINT.UPDATE_NOTIFICATION}/${notificationId}`);
};
