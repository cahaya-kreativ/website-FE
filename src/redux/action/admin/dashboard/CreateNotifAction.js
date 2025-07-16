import { showErrorToast } from "../../../../helper/ToastHelper";
import { reduxCreateNotifUser } from "../../../../services/admin/dashboard/CreateNotif";
import { createNotification } from "../../../reducer/admin/dashboard/CreateNotifSlice";

export const createNotifAction = (notification) => async (dispatch) => {
  return reduxCreateNotifUser(notification)
    .then((result) => {
      dispatch(createNotification(result.data.data.notification));
      return result;
    })
    .catch((err) => {
      console.error("reduxCreateNotifUser", err);
      if (err.response) {
        if (err.response.status >= 400 && err.response.status <= 500) {
          showErrorToast(err.response.data.message);
        } else {
          console.error("unexpected Error", err);
        }
      }
    });
};
