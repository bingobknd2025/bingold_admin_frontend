import { useMutation } from "@tanstack/react-query";
import api from "../../utils/axios";

export const useVerifyAuthenticatorCode = () => {
  return useMutation({
    mutationFn: async (payload) => {
      const response = await api.post("auth/verify-otp", payload);
      return response.data;
    },
  });
};
