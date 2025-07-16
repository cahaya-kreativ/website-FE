import {
  reduxGetChatAdmin,
  reduxChatAdmin,
} from "../../../../services/admin/chat/chatAdmin";
import { setChats, setSelectedUserId } from "../../../reducer/admin/chat/chatAdminSlice"; // Ganti setInbox → setChat
import { showErrorToast } from "../../../../helper/ToastHelper";

// Ambil chat admin berdasarkan userId
export const getChatAdminAction = (userId) => async (dispatch) => {
  try {
    dispatch(setSelectedUserId(userId)); // Set selectedUserId saat mengambil chat
    const result = await reduxGetChatAdmin(userId);
    dispatch(setChats(result.data.data));
    return result.data.data;
  } catch (error) {
    console.error("Error Get Chat", error);
  }
};

// Kirim pesan ke user
export const createChatAdminAction = (input) => async (dispatch) => {
  return reduxChatAdmin(input)
    .then((result) => {
      dispatch(setChats(result.data.data.chat));
      return result;
    })
    .catch((err) => {
      console.error("reduxChatAdmin", err);
      if (err.response) {
        if (err.response.status >= 400 && err.response.status <= 500) {
          showErrorToast(err.response.data.message);
        } else {
          console.error("Unexpected Error", err);
        }
      }
    });
};
