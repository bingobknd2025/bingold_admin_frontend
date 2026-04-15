import api from "../../../utils/axios";
import { useQuery } from "@tanstack/react-query";

export const fetchPermissionGroupList = async () => {
  const response = await api.post("/admin/permissions/group-list");
  return response.data.data; 
};
export const usePermissionGroupList = () => {
  return useQuery({
    queryKey: ["permissionGroupList"],
    queryFn: fetchPermissionGroupList,
  });
};
