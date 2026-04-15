import api from "../../../utils/axios";
import { useMutation } from "@tanstack/react-query";

export const useAssignRolePermissions = () => {
  return useMutation({
    mutationKey: ["assignRolePermissions"],
    mutationFn: async (payload) => {
      const response = await api.post(
        "/admin/roles/assign-permissions",
        payload,
      );
      return response.data;
    },
  });
};
