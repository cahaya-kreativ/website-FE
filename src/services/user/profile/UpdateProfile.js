// services Update Profile
import { API_ENDPOINT } from "../../../utils/api-endpoint";
import http from "../../../utils/http";

export const reduxUpdateProfile = async (input) => {
    return http.put(API_ENDPOINT.PROFILE_UPDATE, input);
  };