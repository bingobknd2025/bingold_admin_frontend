import { useMutation } from "@tanstack/react-query";
import api from "../../../utils/axios";

const regenerateQr = async (id) => {
  const response = await api.post(`/admin/agents/regenerate-qr`, { id });
  return response.data;
};

export const useRegenerateQr = () => {
  return useMutation({ mutationFn: regenerateQr });
};
