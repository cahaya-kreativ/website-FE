import { CookiesKeys, CookieStorage } from "../../../../utils/cookie";
import {
  setIsLoggedIn,
  setToken,
  setUser,
  setUserProfile,
} from "../../../reducer/user/auth/loginSlice";
import { showSuccessToast } from "../../../../helper/ToastHelper";

export const logoutAction = () => (dispatch) => {
  CookieStorage.remove(CookiesKeys.AuthToken);
  dispatch(setToken(null));
  dispatch(setIsLoggedIn(false));
  dispatch(setUser(null));
  dispatch(setUserProfile(null));
  showSuccessToast("Logout Success");
  setTimeout(() => {
    window.location.href = "/";
  }, 1000); // 1000 ms = 1 detik
};
