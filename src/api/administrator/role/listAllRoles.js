import { useQuery } from "@tanstack/react-query";
import api from "../../../utils/axios";

const fetchAllRoles = async (page = 1, limit = 10, search = "") => {
  const response = await api.post("/admin/roles/list", {
    page,
    limit,
    ...(search && { search }),
  });
  return response.data.data;
};

export const useListAllRoles = ({ page, limit, search = "" }) => {
  return useQuery({
    queryKey: ["roles", page, limit, search],
    queryFn: () => fetchAllRoles(page, limit, search),
    keepPreviousData: true,
  });  
};
