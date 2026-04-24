import { useMutation } from "@tanstack/react-query";
import api from "../../../utils/axios";

const createYoutube = async (data) => {
  const response = await api.post("/admin/youtube/create", data);
  return response.data;
};

export const useCreateYoutube = () => {
  return useMutation({ mutationFn: createYoutube });
};
