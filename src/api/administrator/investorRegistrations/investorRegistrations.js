import { useQuery } from "@tanstack/react-query";
import api from "../../../utils/axios";

// ── List investor registrations captured from the investor-ui ──
const fetchInvestorRegistrations = async (filters) => {
  const response = await api.post("/admin/investor-registrations/list", filters);
  return response.data.data;
};

export const useListInvestorRegistrations = (filters = {}) => {
  return useQuery({
    queryKey: ["investorRegistrations", filters],
    queryFn: () => fetchInvestorRegistrations(filters),
    keepPreviousData: true,
  });
};

// ── View one registration, with its uploaded documents ─────────
const fetchInvestorRegistration = async (id) => {
  const response = await api.post("/admin/investor-registrations/view", { id });
  return response.data.data;
};

export const useViewInvestorRegistration = (id) => {
  return useQuery({
    queryKey: ["investorRegistration", id],
    queryFn: () => fetchInvestorRegistration(id),
    enabled: !!id,
  });
};
