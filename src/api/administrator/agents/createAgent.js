import { useMutation } from "@tanstack/react-query";
import api from "../../../utils/axios";

const createAgent = async (data) => {
  const response = await api.post("/admin/agents/create", data);
  return response.data;
};

export const useCreateAgent = () => {
  return useMutation({ mutationFn: createAgent });
};
