import { reduxPutNotifId } from "../../../../services/user/notifications/PutNotificationId";
import { setStatus } from "../../../reducer/user/notifications/GetNotificationsSlice";

export const putNotificationAction = (notificationId) => (dispatch) => {
  return reduxPutNotifId(notificationId)
    .then((result) => {
      dispatch(setStatus(result.data.data.notifications));
      return true;
    })
    .catch((err) => {
      console.error("reduxPutStatus", err);
    });
};
