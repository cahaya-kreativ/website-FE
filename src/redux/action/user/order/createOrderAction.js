import { showErrorToast } from "../../../../helper/ToastHelper";
import {
  reduxCreateOrder,
  reduxDiscountOrder,
} from "../../../../services/user/order/CreateOrder";
import {
  createOrder,
  discountOrder,
} from "../../../reducer/user/order/createOrderSlice";

export const createOrderAction = (productId, orderData) => async (dispatch) => {
  return reduxCreateOrder(productId, orderData)
    .then((result) => {
      dispatch(createOrder(result.data.data.order));
      return result;
    })
    .catch((err) => {
      console.error("reduxCreateOrder", err);
      if (err.response) {
        if (err.response.status >= 400 && err.response.status <= 500) {
          showErrorToast(err.response.data.message);
        } else {
          console.error("unexpected Error", err);
        }
      }
    });
};

export const discountAction = (code, subtotal) => async (dispatch) => {
  try {
      const result = await reduxDiscountOrder(code, subtotal); // Kirim kode diskon dan subtotal
      dispatch(discountOrder(result.data.data));
      return result.data.data; // Kembalikan data diskon
  } catch (err) {
      console.error("reduxDiscountOrder", err);
      if (err.response) {
          if (err.response.status >= 400 && err.response.status <= 500) {
              showErrorToast(err.response.data.message);
          } else {
              console.error("unexpected Error", err);
          }
      }
  }
};
