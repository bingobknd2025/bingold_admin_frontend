import { useQuery } from "@tanstack/react-query";
import api from "../../../utils/axios";

const fetchAllBlogs = async (page, limit, search) => {
  const response = await api.post("/admin/blogs/list", { page, limit, ...(search && { search }) });
  return response.data.data;
};

export const useListAllBlogs = (page = 1, limit = 10, search = "") => {
  return useQuery({
    queryKey: ["blogs", page, limit, search],
    queryFn: () => fetchAllBlogs(page, limit, search),
    keepPreviousData: true,
  });
};
