import { useMutation } from "@tanstack/react-query";
import api from "../../../utils/axios";

const updateYoutube = async ({ id, data }) => {
  const response = await api.post(`/admin/youtube/update`, { id, ...data });
  return response.data;
};

export const useUpdateYoutube = () => {
  return useMutation({ mutationFn: updateYoutube });
};
