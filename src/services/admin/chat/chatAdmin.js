import { API_ENDPOINT } from "../../../utils/api-endpoint";
import http from "../../../utils/http";

export const reduxGetChatAdmin = async (userId) => {
  return await http.get(`${API_ENDPOINT.ADMIN_GET_CHAT}/${userId}`);
};

export const reduxChatAdmin = async (input) => {
  return await http.post(API_ENDPOINT.CREATE_CHAT, input);
};
