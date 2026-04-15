import api from "../../../utils/axios";
import { useMutation } from "@tanstack/react-query";

export const useDeletePermission = () => {
  return useMutation({
    mutationKey: ["delete-permission"],
    mutationFn: async (id) => {
      const response = await api.post(`admin/permissions/delete`, { id });
      return response.data.data;
    },
  });
};
