// services/user/chat/Chatting.js
import http from "../../../utils/http";
import { API_ENDPOINT } from "../../../utils/api-endpoint";

export const reduxChatUser = async (input) => {
  const response = await http.post(API_ENDPOINT.CREATE_CHAT, input);
  return response.data;
};

export const getChatBetweenUsers = async (senderId, receiverId) => {
  // Validasi bahwa senderId & receiverId tersedia
  if (!senderId || !receiverId || isNaN(senderId) || isNaN(receiverId)) {
    console.error("Invalid senderId or receiverId");
    throw new Error("Invalid senderId or receiverId");
  }

  const url = API_ENDPOINT.USER_GET_CHAT
    .replace(":senderId", senderId)
    .replace(":receiverId", receiverId);

  try {
    const response = await http.get(url);
    return response.data;
  } catch (err) {
    console.error("Error fetching chat:", err.message);
    throw err;
  }
};