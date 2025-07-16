import { reduxGetCategories } from "../../../../services/admin/categories/GetCategories";
import { reduxGetDetailCategories } from "../../../../services/admin/categories/GetDetailCategories";
import { setCategories } from "../../../reducer/admin/categories/GetCategoriesSlice";

export const getCategoriesAction = () => async (dispatch) => {
  try {
    const result = await reduxGetCategories();
    dispatch(setCategories(result.data.data));
    return result.data.data;
  } catch (error) {
    console.error("reduxGetCategories", error);
  }
};

export const getDetailCategoriesAction = (id) => async (dispatch) => {
  try {
    const result = await reduxGetDetailCategories(id);
    dispatch(setCategories(result.data.data.categories));
    return result.data.data;
  } catch (error) {
    console.error("reduxGetDetailCategories", error);
  }
};

