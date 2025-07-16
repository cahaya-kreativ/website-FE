import { API_ENDPOINT } from "../../../utils/api-endpoint";
import http from "../../../utils/http";

export const reduxCreatePayment = async (orderId, methodPayment) => {
  return await http.post(`${API_ENDPOINT.CREATE_PAYMENT_MIDTRANS}/${orderId}`, methodPayment); // Mengirimkan methodPayment sebagai body
};