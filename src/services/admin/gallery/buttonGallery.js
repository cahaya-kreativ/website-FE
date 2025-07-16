import { API_ENDPOINT } from "../../../utils/api-endpoint";
import http from "../../../utils/http";

export const reduxPostGalleries = async (input) => {
  return await http.post(API_ENDPOINT.CREATE_GALLERY, input);
};

export const reduxDeleteGalleries = async (id) => {
  return await http.delete(`${API_ENDPOINT.DELETE_GALLERIES}/${id}`);
};
