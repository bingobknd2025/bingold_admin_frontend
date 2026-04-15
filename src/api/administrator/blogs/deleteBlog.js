import { useMutation } from "@tanstack/react-query";
import api from "../../../utils/axios";

const deleteBlog = async (id) => {
  const response = await api.delete(`/admin/blogs/delete/${id}`);
  return response.data;
};

export const useDeleteBlog = () => {
  return useMutation({ mutationFn: deleteBlog });
};
