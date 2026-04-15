import { useQuery } from "@tanstack/react-query";
import api from "../../../utils/axios";

const fetchAllUsers = async (page, limit, search) => {
  const response = await api.post("/admin/users/list", { page, limit, ...(search && { search }) });
  return response.data.data;
};

export const useListAllUsers = (page = 1, limit = 10, search = "") => {
  return useQuery({
    queryKey: ["users", page, limit, search],
    queryFn: () => fetchAllUsers(page, limit, search),
    keepPreviousData: true,
  });
};