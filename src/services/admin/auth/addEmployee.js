import { API_ENDPOINT } from "../../../utils/api-endpoint";
import http from "../../../utils/http";

export const reduxAddEmployee = async (input) => {
  return await http.post(API_ENDPOINT.ADD_EMPLOYEE, input);
};

export const reduxEditEmployee = async (id, input) => {
  return await http.put(`${API_ENDPOINT.EDIT_EMPLOYEE}/${id}`, input)
};

export const reduxDeleteEmployee = async (id) => {
  return await http.delete(`${API_ENDPOINT.DELETE_EMPLOYEE}/${id}`)
};