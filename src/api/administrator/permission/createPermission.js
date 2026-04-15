import { useMutation } from "@tanstack/react-query";
import api from "../../../utils/axios";

// API function (plain async function)
export const createPermission = async (permissionData) => {
  const response = await api.post("admin/permissions/create", permissionData);
  return response.data.data;
};

// Custom hook using React Query hello
export const useCreatePermission = () => {
  return useMutation({
    mutationFn: createPermission,
  });
};
