import { useMutation } from "@tanstack/react-query";
import api from "../../../utils/axios";

export const updateRole = async (data) => {
  const response = await api.post("/admin/roles/update", data);
  return response.data.data;
};

export const useUpdateRole = () => {
  return useMutation({
    mutationFn: updateRole,
  });
};
