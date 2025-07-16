import { API_ENDPOINT } from "../../../utils/api-endpoint";
import http from "../../../utils/http";

export const reduxCreateOrder = async (productId, orderData) => {
  return await http.post(`${API_ENDPOINT.CREATE_ORDER}/${productId}`, orderData); // Mengirimkan orderData sebagai body
};

export const reduxDiscountOrder = async (code, subtotal) => {
  return await http.put(`${API_ENDPOINT.DISCOUNT}`, { code, subtotal }); // Kirim kode diskon dan subtotal
};