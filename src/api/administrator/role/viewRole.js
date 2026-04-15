import { useQuery } from "@tanstack/react-query";
import api from "../../../utils/axios";

// API function
export const viewRole = async (roleId) => {
  const response = await api.post("/admin/roles/view", { roleId });
  return response.data.data;
};

// React Query hook

export const useViewRole = (roleId) => {
  return useQuery({
    queryKey: ["viewRole", roleId],
    queryFn: () => viewRole(roleId),
    enabled: !!roleId, // Only run query if roleId exists
  });
};
