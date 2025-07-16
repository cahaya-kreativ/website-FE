import { showErrorToast } from "../../../../helper/ToastHelper";
import { reduxCreatePortof } from "../../../../services/admin/product/createPortof";
import { setPortofolio } from "../../../reducer/admin/product/createPortofolioSlice";

export const createPortofolioAction = (input) => async (dispatch) => {
    return reduxCreatePortof(input)
      .then((result) => {
        dispatch(setPortofolio(result.data.data));
        return result;
      })
      .catch((err) => {
        console.error("reduxCreatePortof", err);
        if (err.response) {
          if (err.response.status >= 400 && err.response.status <= 500) {
            showErrorToast(err.response.data.message);
          } else {
            console.error("unexpected Error", err);
          }
        }
      });
  };