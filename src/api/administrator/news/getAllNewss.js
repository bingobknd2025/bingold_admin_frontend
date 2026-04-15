import { useQuery } from "@tanstack/react-query";
import api from "../../../utils/axios";

const fetchAllNewss = async (page, limit, search) => {
  const response = await api.post("/admin/news/list", { page, limit, ...(search && { search }) });
  return response.data.data;
};

export const useListAllNewss = (page = 1, limit = 10, search = "") => {
  return useQuery({
    queryKey: ["news", page, limit, search],
    queryFn: () => fetchAllNewss(page, limit, search),
    keepPreviousData: true,
  });
};
