import { useMutation } from "@tanstack/react-query";
import api from "../../../utils/axios";

const updateNews = async ({ id, data }) => {
  const response = await api.post(`/admin/news/update`, { id, ...data });
  return response.data;
};

export const useUpdateNews = () => {
  return useMutation({ mutationFn: updateNews });
};
