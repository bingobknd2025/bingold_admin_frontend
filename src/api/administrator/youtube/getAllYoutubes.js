import { useQuery } from "@tanstack/react-query";
import api from "../../../utils/axios";

const fetchAllYoutubes = async (page, limit, search) => {
  const response = await api.post("/admin/youtube/list", { page, limit, ...(search && { search }) });
  return response.data.data;
};

export const useListAllYoutubes = (page = 1, limit = 10, search = "") => {
  return useQuery({
    queryKey: ["youtube", page, limit, search],
    queryFn: () => fetchAllYoutubes(page, limit, search),
    keepPreviousData: true,
  });
};
