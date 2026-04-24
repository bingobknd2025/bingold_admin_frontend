import { useQuery } from "@tanstack/react-query";
import api from "../../../utils/axios";

const fetchYoutubeDetails = async (id) => {
  const response = await api.get(`/admin/youtube/${id}`);
  return response.data.data;
};

export const useGetYoutubeDetails = (id) => {
  return useQuery({
    queryKey: ["youtubeDetail", id],
    queryFn: () => fetchYoutubeDetails(id),
    enabled: !!id,
  });
};
