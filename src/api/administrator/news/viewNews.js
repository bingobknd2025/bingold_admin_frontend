import { useQuery } from "@tanstack/react-query";
import api from "../../../utils/axios";

const fetchNewsDetails = async (id) => {
  const response = await api.get(`/admin/news/${id}`);
  return response.data.data;
};

export const useGetNewsDetails = (id) => {
  return useQuery({
    queryKey: ["newsDetail", id],
    queryFn: () => fetchNewsDetails(id),
    enabled: !!id,
  });
};
