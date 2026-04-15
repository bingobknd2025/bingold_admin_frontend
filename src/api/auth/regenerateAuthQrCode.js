import api from "../../utils/axios";
import { useMutation } from "@tanstack/react-query";

export const useRegenerateAuthQrCode = () => {
  return useMutation({
    mutationFn: async ({ token }) => {
      const response = await api.post(
        "auth/regenerate-authenticator",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return response.data;
    },
  });
};
