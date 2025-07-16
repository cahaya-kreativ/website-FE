import {
  reduxGetAllCustomers,
  reduxGetAllEmployees,
} from "../../../../services/admin/dashboard/GetCustomers";
import {
  getCustomers,
  getEmployees,
} from "../../../reducer/admin/dashboard/GetCustomersSlice";

export const getCustomersAction = () => async (dispatch) => {
  try {
    const result = await reduxGetAllCustomers();
    dispatch(getCustomers(result.data.data));
    return result.data.data;
  } catch (error) {
    console.error("reduxGetAllCustomers", error);
  }
};

export const getEmployeesAction = () => async (dispatch) => {
  try {
    const result = await reduxGetAllEmployees();
    dispatch(getEmployees(result.data.data));
    return result.data.data;
  } catch (error) {
    console.error("reduxGetAllEmployees", error);
  }
};
