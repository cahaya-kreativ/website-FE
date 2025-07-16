import { CookiesKeys, CookieStorage } from "../../../../utils/cookie";
import {
  setIsLoggedIn,
  setAdminToken,
  setAdmin,
  setAdminProfile,
} from "../../../reducer/admin/auth/loginAdminSlice";
import { showSuccessToast } from "../../../../helper/ToastHelper";

export const logoutAdminAction = () => (dispatch) => {
  CookieStorage.remove(CookiesKeys.AdminToken);
  dispatch(setAdminToken(null));
  dispatch(setIsLoggedIn(false));
  dispatch(setAdmin(null));
  dispatch(setAdminProfile(null));
  showSuccessToast("Logout Success");
  setTimeout(() => {
    window.location.href = "/admin/login";
  }, 1000); // 1000 ms = 1 detik
};
