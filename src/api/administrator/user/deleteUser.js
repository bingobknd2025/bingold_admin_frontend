import api from "../../../utils/axios";
import { useMutation } from "@tanstack/react-query";

export const useDeleteUser = () => {
  return useMutation({
    mutationKey: ["delete-user"],
    mutationFn: async (id) => {
      const response = await api.post(`/admin/users/delete`, { id });
      return response.data.data;
    },
  });
};
