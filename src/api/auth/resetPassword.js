import api from "../../utils/axios";
import { useMutation } from "@tanstack/react-query";

export const useResetPassword = () => {
  return useMutation({
    mutationFn: async ({ newPassword, token }) => {
      const response = await api.post(
        "/auth/reset-password",
        { newPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`, // 🔥 token in header
          },
        },
      );
      return response.data;
    },
  });
};
