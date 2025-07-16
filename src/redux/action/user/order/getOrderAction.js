import { reduxGetOrder, reduxGetDetailOrder } from "../../../../services/user/order/GetOrder";
import { setOrders, setOrderDetail } from "../../../reducer/user/order/getOrderSlice";

export const getOrdersAction = (page = 1, filter) => async (dispatch) => {
  try {
    const result = await reduxGetOrder(page, filter);
    dispatch(setOrders(result.data.data));
    return result.data.data;
  } catch (error) {
    console.error("reduxGetOrder", error);
  }
};

export const getDetailOrderAction = (id) => async (dispatch) => {
  try {
    const result = await reduxGetDetailOrder(id);
    dispatch(setOrderDetail(result.data.data));
    return result.data.data;
  } catch (error) {
    console.error("reduxGetDetailOrder", error);
  }
};

