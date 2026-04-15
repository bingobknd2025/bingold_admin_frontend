import { useMutation } from "@tanstack/react-query";
import api from "../../../utils/axios";

const createNews = async (data) => {
  const response = await api.post("/admin/news/create", data);
  return response.data;
};

export const useCreateNews = () => {
  return useMutation({ mutationFn: createNews });
};
