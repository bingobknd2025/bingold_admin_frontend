import api from "../../../utils/axios";
import { useMutation } from "@tanstack/react-query";

export const useCreateUser = () => {
  return useMutation({
    mutationFn: async (userData) => {
      const response = await api.post("/admin/users/create", userData);
      return response.data;
    },
  });
};
