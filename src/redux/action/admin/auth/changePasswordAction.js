import { showErrorToast } from "../../../../helper/ToastHelper";
import { reduxUpdatePasswordMitra } from "../../../../services/admin/auth/changePassword";
import { setPassword } from ".././../../reducer/admin/auth/changePassMitraSlice";

export const changePassword = (input, adminToken) => async (dispatch) => {
  try {
    const result = await reduxUpdatePasswordMitra(input, adminToken);
    dispatch(setPassword(result.data.data));
    return result;
  } catch (err) {
    if (err.response) {
      if (err.response.status >= 400 && err.response.status <= 500) {
        showErrorToast(err.response.data.message);
      } else {
        console.error("unexpected Error", err);
      }
    }
  }
};
