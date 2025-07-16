import {
  reduxGetCountCustomers,
  reduxGetCountOrders,
  reduxGetCountProducts,
  reduxGetCountCategories,
  reduxGetDetailDashboard,
} from "../../../../services/admin/dashboard/Count";
import {
  getCountCustomers,
  getCountOrders,
  getCountProducts,
  getCountCategories,
  getCountDashboard,
} from "../../../reducer/admin/dashboard/CountSlice";

export const getCountCustomersAction = () => async (dispatch) => {
  try {
    const result = await reduxGetCountCustomers();
    dispatch(getCountCustomers(result.data.data));
    return result.data.data;
  } catch (error) {
    console.error("reduxGetCountCustomers", error);
  }
};

export const getCountOrdersAction = () => async (dispatch) => {
  try {
    const result = await reduxGetCountOrders();
    dispatch(getCountOrders(result.data.data));
    return result.data.data;
  } catch (error) {
    console.error("reduxGetCountOrders", error);
  }
};

export const getCountProductsAction = () => async (dispatch) => {
  try {
    const result = await reduxGetCountProducts();
    dispatch(getCountProducts(result.data.data));
    return result.data.data;
  } catch (error) {
    console.error("reduxGetCountProducts", error);
  }
};

export const getCountCategoriesAction = () => async (dispatch) => {
  try {
    const result = await reduxGetCountCategories();
    dispatch(getCountCategories(result.data.data));
    return result.data.data;
  } catch (error) {
    console.error("reduxGetCountCategories", error);
  }
};

export const getDashboardAction = () => async (dispatch) => {
  try {
    const result = await reduxGetDetailDashboard();
    dispatch(getCountDashboard(result.data.data));
    return result.data.data;
  } catch (error) {
    console.error("reduxGetDetailDashboard", error);
  }
};
