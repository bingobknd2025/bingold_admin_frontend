import api from "../../../utils/axios";

export const getAllPermission = async (page, limit = 10, search = "") => {
  const response = await api.post("/admin/permissions/list", {
    page,
    limit,
    ...(search && { search }),
  });
  return response.data.data;
};