import { showErrorToast, showSuccessToast } from "../../../../helper/ToastHelper";
import { reduxCreateCategories } from "../../../../services/admin/categories/CreateCategories";
import { reduxUpdateCategories } from "../../../../services/admin/categories/UpdateCategories.js";
import { reduxDeleteCategories } from "../../../../services/admin/categories/DeleteCategories.js";
import { createCategories } from "../../../reducer/admin/categories/createCategoriesSlice";

export const createCategoriesAction = (categories) => async (dispatch) => {
  return reduxCreateCategories(categories)
    .then((result) => {
      dispatch(createCategories(result.data.data.categories));
      return result;
    })
    .catch((err) => {
      console.error("reduxCreateCategories", err);
      if (err.response) {
        if (err.response.status >= 400 && err.response.status <= 500) {
          showErrorToast(err.response.data.message);
        } else {
          console.error("unexpected Error", err);
        }
      }
    });
};

export const updateCategoriesAction = (id, categories) => async (dispatch) => {
  try {
    const result = await reduxUpdateCategories(id, categories);
    dispatch(createCategories(result.data.data.categories));
    return result;
  } catch (err) {
    console.error("reduxUpdateCategories", err);
    if (
      err.response &&
      err.response.status >= 400 &&
      err.response.status <= 500
    ) {
      showErrorToast(err.response.data.message);
    } else {
      console.error("Unexpected Error", err);
    }
    return err;
  }
};

export const deleteCategoriesAction = (id) => async (dispatch) => {
  if (!id) {
    showErrorToast("ID kategori tidak valid");
    return true;
  }

  try {
    const result = await reduxDeleteCategories(id);
    dispatch(createCategories(result.data.data.categories)); // Update state
    showSuccessToast("Delete Category Successfully!");
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
