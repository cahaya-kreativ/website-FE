import { reduxGetOrder } from "../../../../services/admin/order/StatusOrder";
import { getOrder } from "../../../reducer/admin/order/GetOrderSlice";

export const getOrdersAction = () => async (dispatch) => {
  try {
    const result = await reduxGetOrder();
    dispatch(getOrder(result.data.data));
    return result.data.data;
  } catch (error) {
    console.error("reduxGetOrder", error);
  }
};
