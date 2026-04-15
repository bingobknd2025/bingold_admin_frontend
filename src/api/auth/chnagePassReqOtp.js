import api from "../../utils/axios";
import { useMutation } from "@tanstack/react-query";

export const useChangePassReqOtp = () => {
  return useMutation({
    mutationFn: async (payload) => {
      const response = await api.post("/auth/change-password/request-otp", payload);
      return response.data;
    },
  });
};
