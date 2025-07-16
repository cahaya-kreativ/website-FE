import {
  showErrorToast,
  showSuccessToast,
} from "../../../../helper/ToastHelper";
import {
  reduxPostGalleries,
  reduxDeleteGalleries,
} from "../../../../services/admin/gallery/buttonGallery";
import { setGalleries } from "../../../reducer/admin/gallery/GetGallerySlice";

export const createGalleryAction = (input) => async (dispatch) => {
  return reduxPostGalleries(input)
    .then((result) => {
      dispatch(setGalleries(result.data.data.galleries));
      return result;
    })
    .catch((err) => {
      console.error("reduxPostGalleries", err);
      if (err.response) {
        if (err.response.status >= 400 && err.response.status <= 500) {
          showErrorToast(err.response.data.message);
        } else {
          console.error("unexpected Error", err);
        }
      }
    });
};

export const deleteGalleryAction = (id) => async (dispatch) => {
  if (!id) {
    showErrorToast("ID gallery tidak valid");
    return true;
  }

  try {
    const result = await reduxDeleteGalleries(id);
    dispatch(setGalleries(result.data.data.galleries)); // Update state
    showSuccessToast("Delete Gallery Successfully!");
    return result;
  } catch (err) {
    console.error("Gagal menghapus gallery", err);
    if (
      err.response &&
      err.response.status >= 400 &&
      err.response.status <= 500
    ) {
      showErrorToast(err.response.data.message || "Gagal menghapus gallery");
    } else {
      console.error("Unexpected Error", err);
    }
    return err;
  }
};
