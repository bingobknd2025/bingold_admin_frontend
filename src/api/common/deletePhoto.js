import api from "../../utils/axios";
import { useMutation } from "@tanstack/react-query";

export const useDeleteImage = () => {
  return useMutation({
    mutationFn: async (public_id) => {
      const response = await api.delete("/admin/common/delete-file", {
        data: { public_id },
      });
      return response.data.data;
    },
  });
};
