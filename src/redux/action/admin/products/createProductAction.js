import {
  showErrorToast,
  showSuccessToast,
} from "../../../../helper/ToastHelper";
import {
  reduxPostProduct,
  reduxPutProduct,
  reduxDeleteProduct,
} from "../../../../services/admin/product/createProduct";
import { setProduct } from "../../../reducer/admin/product/createProductSlice";

export const createProductAction = (formData) => async (dispatch) => {
  return reduxPostProduct(formData)
    .then((result) => {
      dispatch(setProduct(result.data.data));
      return result;
    })
    .catch((err) => {
      console.error("reduxPostProduct", err);
      if (err.response) {
        if (err.response.status >= 400 && err.response.status <= 500) {
          showErrorToast(err.response.data.message);
        } else {
          console.error("unexpected Error", err);
        }
      }
    });
};

export const updateProductAction = (id, formData) => async (dispatch) => {
  return reduxPutProduct(id, formData)
    .then((result) => {
      dispatch(setProduct(result.data.data));
      return result;
    })
    .catch((err) => {
      console.error("reduxPostProduct", err);
      if (err.response) {
        if (err.response.status >= 400 && err.response.status <= 500) {
          showErrorToast(err.response.data.message);
        } else {
          console.error("unexpected Error", err);
        }
      }
    });
};

export const deleteProductAction = (id) => async (dispatch) => {
  if (!id) {
    showErrorToast("ID Product tidak valid");
    return true;
  }

  try {
    const result = await reduxDeleteProduct(id);
    dispatch(setProduct(result.data.data));
    showSuccessToast("Delete Product Successfully!");
    return result;
  } catch (err) {
    console.error("Gagal menghapus Product", err);
    if (
      err.response &&
      err.response.status >= 400 &&
      err.response.status <= 500
    ) {
      showErrorToast(err.response.data.message || "Gagal menghapus Product");
    } else {
      console.error("Unexpected Error", err);
    }
    return err;
  }
};
