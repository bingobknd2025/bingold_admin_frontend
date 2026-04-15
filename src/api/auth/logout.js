import { useMutation } from "@tanstack/react-query";
import api from "../../utils/axios";

export const useAdminLogout = () => {
  // const token = localStorage.getItem("accessToken");
  // const token = sessionStorage.getItem("accessToken");
  return useMutation({
    mutationFn: async ({ refreshToken }) => {
      const response = await api.post("auth/logout", { refreshToken });
      return response.data;
    },
  });
};
