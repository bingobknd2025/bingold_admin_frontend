import api from "../../utils/axios";
import { useMutation } from "@tanstack/react-query";

export const useUploadPhoto = () => {
  return useMutation({
    mutationFn: async (file) => {
      const formData = new FormData();
      formData.append("file", file);

      const response = await api.post("/admin/common/upload-file", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data.data;
    },
  });
};
