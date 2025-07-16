import { API_ENDPOINT } from "../../../utils/api-endpoint";
import http from "../../../utils/http";

export const reduxPostProduct = async (formData) => {
  const response = await http.post(API_ENDPOINT.CREATE_PRODUCTS, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const reduxPutProduct = async (id, formData) => {
  const response = await http.put(`${API_ENDPOINT.UPDATE_PRODUCTS}/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const reduxDeleteProduct = async (id) => {
  return await http.delete(`${API_ENDPOINT.DELETE_PRODUCTS}/${id}`);
};
