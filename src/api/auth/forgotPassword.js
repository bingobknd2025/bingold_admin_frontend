import api from "../../utils/axios";
import { useMutation } from "@tanstack/react-query";

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: async (data) => {
      const response = await api.post("/auth/forgot-password", data);
      return response.data;
    },
  });
};
