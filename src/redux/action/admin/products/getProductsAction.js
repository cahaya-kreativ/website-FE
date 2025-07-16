import { reduxGetProducts } from "../../../../services/admin/product/GetProducts";
import { reduxGetDetailProduct } from "../../../../services/admin/product/GetDetailProduct";
import { setProducts, setProductDetail } from "../../../reducer/admin/product/GetProductsSlice";

export const getProductsAction = () => async (dispatch) => {
  try {
    const result = await reduxGetProducts();
    dispatch(setProducts(result.data.data));
    return result.data.data;
  } catch (error) {
    console.error("reduxGetProducts", error);
  }
};

export const getDetailProductAction = (id) => async (dispatch) => {
  try {
    const result = await reduxGetDetailProduct(id);
    dispatch(setProductDetail(result.data.data));
    return result.data.data;
  } catch (error) {
    console.error("reduxGetDetailProduct", error);
  }
};

