import { API_ENDPOINT } from "../../../utils/api-endpoint";
import http from "../../../utils/http";

export const reduxUpdateCategories = async (id, categories) => {
  const formData = new FormData();
  if (categories.name) formData.append("name", categories.name);
  if (categories.description)
    formData.append("description", categories.description);
  if (categories.image) formData.append("image", categories.image);

  // ✅ Gunakan id dari params
  return await http.put(`${API_ENDPOINT.UPDATE_CATEGORIES}/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};