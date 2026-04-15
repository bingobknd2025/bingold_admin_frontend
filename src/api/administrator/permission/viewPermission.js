import api from "../../../utils/axios";
import { useQuery } from "@tanstack/react-query";
export const useViewPermission = (id) => {
  return useQuery({
    queryKey: ["permission", id],
    queryFn: async () => {
      const response = await api.post("/admin/permissions/view", { id });
      return response.data;
    },
  });
};
