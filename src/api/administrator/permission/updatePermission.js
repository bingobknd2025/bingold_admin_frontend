import api from "../../../utils/axios";

export const updatePermission = async (permissionData) => {
  const response = await api.post("/admin/permissions/update", permissionData);
  return response.data.data;
};