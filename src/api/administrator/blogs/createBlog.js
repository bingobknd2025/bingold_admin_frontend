import { useMutation } from "@tanstack/react-query";
import api from "../../../utils/axios";

const createBlog = async (data) => {
  const response = await api.post("/admin/blogs/create", data);
  return response.data;
};

export const useCreateBlog = () => {
  return useMutation({ mutationFn: createBlog });
};
