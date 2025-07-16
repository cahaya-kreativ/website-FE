import { reduxGetNotif } from "../../../../services/user/notifications/GetNotification";
import { setNotifications } from "../../../reducer/user/notifications/GetNotificationsSlice";

export const getNotificationsAction = (page = 1) => async (dispatch) => {
  try {
    const result = await reduxGetNotif(page); // Panggil API dengan halaman
    dispatch(setNotifications(result.data.data.notifications));
    return result.data.data;
  } catch (error) {
    console.error("reduxGetNotifications", error);
  }
};
