import { useMutation } from "@tanstack/react-query";
import api from "../../../utils/axios";
// API function
export const createRole = async (roleData) => {
  const response = await api.post("/admin/roles/create", roleData);
  return response.data.data;
};

// React Query hook
export const useCreateRole = () => {
  return useMutation({
    mutationFn: createRole,
  });
};
