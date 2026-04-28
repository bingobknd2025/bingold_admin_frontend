import { useMutation } from "@tanstack/react-query";
import api from "../../../utils/axios";

const deleteAgent = async (id) => {
  const response = await api.post(`/admin/agents/delete`, { id });
  return response.data;
};

export const useDeleteAgent = () => {
  return useMutation({ mutationFn: deleteAgent });
};
