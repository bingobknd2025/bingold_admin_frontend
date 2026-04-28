import { useQuery } from "@tanstack/react-query";
import api from "../../../utils/axios";

const fetchAgentDetails = async (id) => {
  const response = await api.post(`/admin/agents/view`, { id });
  return response.data.data;
};

export const useGetAgentDetails = (id) => {
  return useQuery({
    queryKey: ["agentDetail", id],
    queryFn: () => fetchAgentDetails(id),
    enabled: !!id,
  });
};
