import { CookiesKeys, CookieStorage } from "../../../../utils/cookie";
import { reduxLoginAdmin } from "../../../../services/admin/auth/loginAdmin";
import {
  setIsLoggedIn,
  setAdminToken,
  setAdmin,
} from "../../../reducer/admin/auth/loginAdminSlice";
import { showErrorToast } from "../../../../helper/ToastHelper";

export const loginAdminAction = (input) => async (dispatch) => {
  return reduxLoginAdmin(input)
    .then((result) => {
      CookieStorage.set(CookiesKeys.AdminToken, result.data.data.token);
      dispatch(setAdminToken(result.data.data.token));
      dispatch(setIsLoggedIn(true));
      dispatch(setAdmin(result.data.data));
      // console.log("admin kan ini:", result)
      return true;
    })
    .catch((err) => {
      if (err.response) {
        if (err.response.status >= 400 && err.response.status <= 500) {
          showErrorToast(err.response.data.message);
        } else {
          console.error("unexpected Error", err);
        }
      }
    });
};
