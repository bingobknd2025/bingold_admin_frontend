import { useQuery } from "@tanstack/react-query";
import api from "../../../utils/axios";

export const getRoles = async ({ page = 1, limit = 100 }) => {
  const response = await api.get("/admin/roles/list", { page, limit });
  return response.data.data;
};

export const useGetRoles = () => {
  return useQuery({
    queryKey: ["getRoles"],
    queryFn: getRoles,
  });
};
