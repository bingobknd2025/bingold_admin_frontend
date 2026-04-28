import { useMutation } from "@tanstack/react-query";
import api from "../../../utils/axios";

const updateAgent = async ({ id, data }) => {
  const response = await api.post(`/admin/agents/update`, { id, ...data });
  return response.data;
};

export const useUpdateAgent = () => {
  return useMutation({ mutationFn: updateAgent });
};
