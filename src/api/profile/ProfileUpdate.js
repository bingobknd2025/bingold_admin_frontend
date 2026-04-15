import api from "../../utils/axios";
import { useMutation } from "@tanstack/react-query";

export const useUpdateProfile = () => {
  return useMutation({
    mutationFn: async (payload) => {
      const response = await api.post("/admin/users/me/profile/update", payload);
      return response.data;
    },
  });
};
