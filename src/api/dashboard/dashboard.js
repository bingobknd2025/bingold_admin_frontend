import { useQuery } from "@tanstack/react-query";
import api from "../../utils/axios";

const fetchDashboard = async () => {
  const response = await api.post("/admin/dashboard");
  return response.data.data;
};

export const useDashboard = () => {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: fetchDashboard,
  });
};
