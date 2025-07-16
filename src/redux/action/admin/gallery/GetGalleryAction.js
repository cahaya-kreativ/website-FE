import { reduxGetGalleries } from "../../../../services/admin/gallery/GetGallery";
import { setGalleries } from "../../../reducer/admin/gallery/GetGallerySlice";

export const getGalleriesAction = () => async (dispatch) => {
  try {
    const result = await reduxGetGalleries();
    dispatch(setGalleries(result.data.data));
    return result.data.data;
  } catch (error) {
    console.error("reduxGetGalleries", error);
  }
};