import { API_ENDPOINT } from "../../../utils/api-endpoint";
import http from "../../../utils/http";

export const reduxOtpUser = async (input) => {
  return await http.put(API_ENDPOINT.VERIFY_OTP, input);
};

export const reduxResendOtpUser = async (input) => {
  return await http.put(API_ENDPOINT.RESEND_OTP, input);
};
