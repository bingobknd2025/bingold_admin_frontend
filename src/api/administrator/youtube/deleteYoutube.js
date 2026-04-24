import { useMutation } from "@tanstack/react-query";
import api from "../../../utils/axios";

const deleteYoutube = async (id) => {
  const response = await api.post(`/admin/youtube/delete`, { id });
  return response.data;
};

export const useDeleteYoutube = () => {
  return useMutation({ mutationFn: deleteYoutube });
};
