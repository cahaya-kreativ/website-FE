import { showErrorToast } from "../../../../helper/ToastHelper";
import { reduxUpdatePass } from "../../../../services/user/profile/UpdatePass";
import { setChange } from ".././../../reducer/user/profile/ChangePassSlice";

export const changePass = (input, token) => async (dispatch) => {
  try {
    const result = await reduxUpdatePass(input, token);
    dispatch(setChange(result.data.data));
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
