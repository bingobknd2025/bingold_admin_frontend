import { useMutation } from "@tanstack/react-query";
import api from "../../../utils/axios";

const deleteNews = async (id) => {
  const response = await api.delete(`/admin/news/delete/${id}`);
  return response.data;
};

export const useDeleteNews = () => {
  return useMutation({ mutationFn: deleteNews });
};
