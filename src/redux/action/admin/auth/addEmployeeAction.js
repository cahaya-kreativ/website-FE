import { CookiesKeys, CookieStorage } from "../../../../utils/cookie";
import { setToken, setEmployee } from "../../../reducer/admin/auth/addEmployeeSlice";
import { reduxAddEmployee, reduxEditEmployee, reduxDeleteEmployee } from "../../../../services/admin/auth/addEmployee";
import { showErrorToast, showSuccessToast } from "../../../../helper/ToastHelper";

export const addEmployeeAction = (input) => async (dispatch) => {
  return reduxAddEmployee(input)
    .then((result) => {
      dispatch(setEmployee(result.data.data));
      return result;
      // CookieStorage.set(CookiesKeys.AdminToken, result.data.data.token);
      // dispatch(setToken(result.data.data.token));
      // return true;
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

export const updateEmployeeAction = (id, input) => async (dispatch) => {
  return reduxEditEmployee(id, input)
    .then((result) => {
      dispatch(setEmployee(result.data.data));
      return result;
    })
    .catch((err) => {
      console.error("reduxPutEmployee", err);
      if (err.response) {
        if (err.response.status >= 400 && err.response.status <= 500) {
          showErrorToast(err.response.data.message);
        } else {
          console.error("unexpected Error", err);
        }
      }
    });
};

export const deleteEmployeeAction = (id) => async (dispatch) => {
  if (!id) {
    showErrorToast("ID Karyawan tidak valid");
    return true;
  }

  try {
    const result = await reduxDeleteEmployee(id);
    dispatch(setEmployee(result.data.data));
    showSuccessToast("Delete Employee Successfully!");
    return result;
  } catch (err) {
    console.error("Gagal menghapus Karyawan", err);
    if (
      err.response &&
      err.response.status >= 400 &&
      err.response.status <= 500
    ) {
      showErrorToast(err.response.data.message || "Gagal menghapus Karyawan");
    } else {
      console.error("Unexpected Error", err);
    }
    return err;
  }
};
