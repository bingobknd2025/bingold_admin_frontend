import api from "../../../utils/axios";
import { useMutation } from "@tanstack/react-query";

export const useUpdateUser = () => {
  return useMutation({
    mutationFn: async (payload) => {
      const response = await api.post("/admin/users/update", payload);
      return response.data;
    },
  });
};
