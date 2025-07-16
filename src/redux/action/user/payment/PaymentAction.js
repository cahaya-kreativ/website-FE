import { showErrorToast } from "../../../../helper/ToastHelper";
import { reduxCreatePayment } from "../../../../services/user/payment/Payment";
import { createPayment } from "../../../reducer/user/payment/PaymentSlice";

export const createPaymentAction =
  (orderId, methodPayment) => async (dispatch) => {
    return reduxCreatePayment(orderId, methodPayment)
      .then((result) => {
        dispatch(createPayment(result.data.data.payments));
        return result;
      })
      .catch((err) => {
        console.error("reduxCreatePayment", err);
        if (err.response) {
          if (err.response.status >= 400 && err.response.status <= 500) {
            showErrorToast(err.response.data.message);
          } else {
            console.error("unexpected Error", err);
          }
        }
      });
  };
