import { CookiesKeys, CookieStorage } from "../../../../utils/cookie";
import { setToken } from "../../../reducer/admin/auth/addEmployeeSlice";
import { reduxAddEmployee } from "../../../../services/admin/auth/addEmployee";
import { showErrorToast } from "../../../../helper/ToastHelper";

export const addEmployeeAction = (input) => async (dispatch) => {
  return reduxAddEmployee(input)
    .then((result) => {
      CookieStorage.set(CookiesKeys.AdminToken, result.data.data.token);
      dispatch(setToken(result.data.data.token));
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
