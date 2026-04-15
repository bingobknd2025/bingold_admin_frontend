import { useQuery } from "@tanstack/react-query";
import api from "../../../utils/axios";

const fetchBlogDetails = async (id) => {
  const response = await api.get(`/admin/blogs/${id}`);
  return response.data.data;
};

export const useGetBlogDetails = (id) => {
  return useQuery({
    queryKey: ["blogDetail", id],
    queryFn: () => fetchBlogDetails(id),
    enabled: !!id,
  });
};
