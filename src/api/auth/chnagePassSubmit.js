import api from "../../utils/axios";
import { useMutation } from "@tanstack/react-query";

export const useChangePassSubmit = () => {
  return useMutation({
    mutationFn: async (data) => {
      const response = await api.post("/auth/change-password/confirm", data);
      return response.data;
    },
  });
};
