import { reduxPutNotifAll } from "../../../../services/user/notifications/PutAllNotifications";
import { setStatus } from "../../../reducer/user/notifications/GetNotificationsSlice";

export const putAllNotificationAction = () => async (dispatch) => {
  try {
    const result = await reduxPutNotifAll();
    dispatch(setStatus(result.data.data.notifications));
    return true;
  } catch (err) {
    console.error("reduxPutStatus", err);
    return false;
  }
};
