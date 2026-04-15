import { useMutation } from "@tanstack/react-query";
import api from "../../utils/axios";

// changes

export const useAdminLogin = () => {
  return useMutation({
    mutationFn: async (payload) => {
      const response = await api.post("auth/login", payload);
      return response.data;
    },
  });
};
