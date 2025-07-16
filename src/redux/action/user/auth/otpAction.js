import { showErrorToast } from "../../../../helper/ToastHelper";
import {
  reduxOtpUser,
  reduxResendOtpUser,
} from "../../../../services/user/auth/Otp";
import { setResend, setVerify } from "../../../reducer/user/auth/otpSlice";

export const otpAction = (email) => async (dispatch) => {
  return reduxOtpUser(email)
    .then((result) => {
      dispatch(setVerify(result.data.data));
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

export const getResendOtp = (email) => async (dispatch) => {
  return reduxResendOtpUser(email)
    .then((result) => {
      dispatch(setResend(result.data.data));
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
