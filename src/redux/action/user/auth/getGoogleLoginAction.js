import { reduxGetUser } from "../../../../services/user/auth/GetUser";
import { CookieStorage, CookiesKeys } from "../../../../utils/cookie";
import {
  endLoading,
  setIsLoggedIn,
  setToken,
  setUser,
  startLoading,
} from "../../../reducer/user/auth/loginSlice";
import { showSuccessToast } from "../../../../helper/ToastHelper";

export const getGoogleLoginAction = (tokenFromGoogle) => async (dispatch) => {
  try {
    dispatch(startLoading());

    // Simpan token di cookie
    if (tokenFromGoogle) {
      CookieStorage.set(CookiesKeys.AuthToken, tokenFromGoogle);
    }

    const result = await reduxGetUser();

    // Mengecualikan properti userProfile dari respons API
    const {
      data: {
        data: {
          user: { Profile, ...filteredUserData },
        },
      },
    } = result;

    // Set token dan status login di Redux
    dispatch(setToken(tokenFromGoogle));
    dispatch(setIsLoggedIn(true));
    dispatch(setUser(filteredUserData));

    showSuccessToast("Login Successfully!");

    return true;
  } catch (error) {
    console.error("getGoogleLoginAction", error);
  } finally {
    dispatch(endLoading());
  }
};
