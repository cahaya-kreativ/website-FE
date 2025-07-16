import { showErrorToast } from "../../../../helper/ToastHelper";
import { setDiscount } from "../../../reducer/admin/discount/discountSlice";
import { reduxGetDiscount } from "../../../../services/admin/discount/GetDiscount";
import { reduxCreateDiscount } from "../../../../services/admin/discount/CreateDiscount";
import { reduxUpdateDiscount } from "../../../../services/admin/discount/UpdateDiscount";
import { reduxDeleteDiscount } from "../../../../services/admin/discount/DeleteDiscount";

export const getDiscountAction = () => async (dispatch) => {
  try {
    const result = await reduxGetDiscount();
    dispatch(setDiscount(result.data.data));
    return result.data.data;
  } catch (error) {
    console.error("reduxGetDiscount", error);
  }
};

export const createDiscountAction = (discount) => async (dispatch) => {
  return reduxCreateDiscount(discount)
    .then((result) => {
      dispatch(setDiscount(result.data.data.discount));
      return result;
    })
    .catch((err) => {
      console.error("reduxCreateDiscount", err);
      if (err.response) {
        if (err.response.status >= 400 && err.response.status <= 500) {
          showErrorToast(err.response.data.message);
        } else {
          console.error("unexpected Error", err);
        }
      }
    });
};

export const updateDiscountAction = (id, discount) => async (dispatch) => {
  return reduxUpdateDiscount(id, discount)
    .then((result) => {
      dispatch(setDiscount(result.data.data.discount));
      return result;
    })
    .catch((err) => {
      console.error("reduxUpdateDiscount", err);
      if (err.response) {
        if (err.response.status >= 400 && err.response.status <= 500) {
          showErrorToast(err.response.data.message);
        } else {
          console.error("unexpected Error", err);
        }
      }
    });
};

export const deleteDiscountAction = (id) => async (dispatch) => {
  if (!id) {
    showErrorToast("ID Discount tidak valid");
    return true;
  }

  try {
    const result = await reduxDeleteDiscount(id);
    dispatch(setDiscount(result.data.data.discount)); // Update state
    return result;
  } catch (err) {
    console.error("Gagal menghapus kategori", err);
    if (
      err.response &&
      err.response.status >= 400 &&
      err.response.status <= 500
    ) {
      showErrorToast(err.response.data.message || "Gagal menghapus kategori");
    } else {
      console.error("Unexpected Error", err);
    }
    return err;
  }
};
