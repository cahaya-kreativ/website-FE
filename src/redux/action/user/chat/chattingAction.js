// redux/action/user/chat/createChatAction.js
import { showErrorToast } from "../../../../helper/ToastHelper";
import {
  reduxChatUser,
  getChatBetweenUsers,
} from "../../../../services/user/chat/Chatting";
import {
  addChat,
  setChats,
  setLoading,
  setError,
} from "../../../reducer/user/chat/chattingSlice";

export const createChatAction = (input) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const result = await reduxChatUser(input);
    dispatch(addChat(result.data)); // Tambahkan ke Redux
    dispatch(setLoading(false));
    return result; // Kembalikan full response
  } catch (err) {
    dispatch(setError(err.message));
    showErrorToast("Gagal mengirim pesan");
    return Promise.reject(err);
  }
};

export const fetchChatBetweenUsers =
  (senderId, receiverId) => async (dispatch) => {
    // Validasi input sebelum lanjut
    if (!senderId || !receiverId || isNaN(senderId) || isNaN(receiverId)) {
      dispatch(setError("Invalid senderId or receiverId"));
      showErrorToast("Invalid chat IDs");
      return Promise.reject("Invalid chat IDs");
    }

    dispatch(setLoading(true));
    try {
      const result = await getChatBetweenUsers(
        Number(senderId),
        Number(receiverId),
      );
      if (result.status) {
        dispatch(setChats(result.data)); // Simpan array chat
      }
      dispatch(setLoading(false));
      return result;
    } catch (err) {
      dispatch(setError("Gagal mengambil pesan"));
      dispatch(setLoading(false));
      showErrorToast("Failed to load messages");
      return Promise.reject(err);
    }
  };
