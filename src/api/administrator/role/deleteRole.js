import api from "../../../utils/axios";
import { useMutation } from "@tanstack/react-query";

export const useDeleteRole = () => {
  return useMutation({
    mutationKey: ["delete-role"],
    mutationFn: async (id) => {
      const response = await api.post(`/admin/roles/delete`, { id });
      return response.data.data;
    },
  });
};
