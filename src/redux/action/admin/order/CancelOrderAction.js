import { showErrorToast } from "../../../../helper/ToastHelper";
import { reduxCancelOrder } from "../../../../services/admin/order/CancelOrder";
import {
  reduxValidateOrder,
  reduxDoneOrder,
} from "../../../../services/admin/order/StatusOrder";
import { cancelOrder, validateOrder, doneOrder, } from "../../../reducer/admin/order/CancelOrderSlice";

export const cancelOrderAction = (id, input) => async (dispatch) => {
  return reduxCancelOrder(id, input)
    .then((result) => {
      dispatch(cancelOrder(result.data.data.cancel));
      return result;
    })
    .catch((err) => {
      console.error("reduxCancelOrder", err);
      if (err.response) {
        if (err.response.status >= 400 && err.response.status <= 500) {
          showErrorToast(err.response.data.message);
        } else {
          console.error("unexpected Error", err);
        }
      }
    });
};

export const validateOrderAction = (id) => async (dispatch) => {
  return reduxValidateOrder(id)
    .then((result) => {
      dispatch(validateOrder(result.data.data.validate));
      return result;
    })
    .catch((err) => {
      console.error("reduxValidateOrder", err);
      if (err.response) {
        if (err.response.status >= 400 && err.response.status <= 500) {
          showErrorToast(err.response.data.message);
        } else {
          console.error("unexpected Error", err);
        }
      }
    });
};

export const doneOrderAction = (id) => async (dispatch) => {
  return reduxDoneOrder(id)
    .then((result) => {
      dispatch(doneOrder(result.data.data.done));
      return result;
    })
    .catch((err) => {
      console.error("reduxDoneOrder", err);
      if (err.response) {
        if (err.response.status >= 400 && err.response.status <= 500) {
          showErrorToast(err.response.data.message);
        } else {
          console.error("unexpected Error", err);
        }
      }
    });
};
