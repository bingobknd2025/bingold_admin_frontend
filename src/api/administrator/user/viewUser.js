import { useQuery } from "@tanstack/react-query";
import api from "../../../utils/axios";

// API function
export const viewUser = async (id) => {
  const response = await api.post("/admin/users/view", { id });
  return response.data.data;
};

// React Query hook

export const useViewUser = (id) => {
  return useQuery({
    queryKey: ["viewUser", id],
    queryFn: () => viewUser(id),
    enabled: !!id, // Only run query if userId exists
  });
};
