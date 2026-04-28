import { useQuery } from "@tanstack/react-query";
import api from "../../../utils/axios";

const fetchAllAgents = async (page, limit, search) => {
  const response = await api.post("/admin/agents/list", { page, limit, ...(search && { search }) });
  return response.data.data;
};

export const useListAllAgents = (page = 1, limit = 10, search = "") => {
  return useQuery({
    queryKey: ["agents", page, limit, search],
    queryFn: () => fetchAllAgents(page, limit, search),
    keepPreviousData: true,
  });
};
