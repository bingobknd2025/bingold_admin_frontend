import { useMutation, useQuery } from "@tanstack/react-query";
import api from "../../../utils/axios";

// ── List settlement batches ────────────────────────────────
const fetchSettlements = async (filters) => {
  const response = await api.post("/admin/bingopay/settlements/list", filters);
  return response.data.data;
};

export const useListSettlements = (filters = {}) => {
  return useQuery({
    queryKey: ["bingopaySettlements", filters],
    queryFn: () => fetchSettlements(filters),
    keepPreviousData: true,
  });
};

// ── View one settlement ────────────────────────────────────
const fetchSettlement = async (id) => {
  const response = await api.post("/admin/bingopay/settlements/view", { id });
  return response.data.data;
};

export const useViewSettlement = (id) => {
  return useQuery({
    queryKey: ["bingopaySettlement", id],
    queryFn: () => fetchSettlement(id),
    enabled: !!id,
  });
};

// ── Create a settlement batch for a vendor ─────────────────
export const useCreateSettlement = () => {
  return useMutation({
    mutationFn: async (data) => {
      const response = await api.post(
        "/admin/bingopay/settlements/create",
        data,
      );
      return response.data;
    },
  });
};

// ── Advance settlement status ──────────────────────────────
export const useUpdateSettlementStatus = () => {
  return useMutation({
    mutationFn: async ({ id, status, bingold_withdraw_reference, note }) => {
      const response = await api.post(
        "/admin/bingopay/settlements/update-status",
        { id, status, bingold_withdraw_reference, note },
      );
      return response.data;
    },
  });
};
