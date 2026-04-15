import { useQuery } from "@tanstack/react-query";
import api from "../../utils/axios";

const fetchProfile = async () => {
  const response = await api.post("/admin/users/me/profile");
  return response.data.data;
};

export const useProfile = () => {
  return useQuery({
    queryKey: ["profile"],
    queryFn: fetchProfile,
  });
};
