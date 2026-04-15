import { useQuery } from "@tanstack/react-query";
import api from "../../../utils/axios";

const fetchAssignedPermissions = async (roleId) => {
  const response = await api.post("/admin/roles/permissions", { roleId });
  return response.data.data;
};

export const useGetAssignedPermissions = (roleId) => {
  return useQuery({
    queryKey: ["assignedPermissions", roleId],
    queryFn: () => fetchAssignedPermissions(roleId),
    enabled: !!roleId,
  });
};
