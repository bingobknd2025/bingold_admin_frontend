import { useMutation } from "@tanstack/react-query";
import api from "../../../utils/axios";

const updateBlog = async ({ id, data }) => {
  const response = await api.post(`/admin/blogs/update`, { id, ...data });
  return response.data;
};

export const useUpdateBlog = () => {
  return useMutation({ mutationFn: updateBlog });
};
