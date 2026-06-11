import { useQuery } from "@tanstack/react-query";
import api from "../../../utils/axios";

// ── List payment transactions (paginated, filterable) ──────
const fetchPayments = async (filters) => {
  const response = await api.post("/admin/bingopay/payments/list", filters);
  return response.data.data;
};

export const useListPayments = (filters = {}) => {
  return useQuery({
    queryKey: ["bingopayPayments", filters],
    queryFn: () => fetchPayments(filters),
    keepPreviousData: true,
  });
};

// ── View one payment transaction ───────────────────────────
const fetchPayment = async (id) => {
  const response = await api.post("/admin/bingopay/payments/view", { id });
  return response.data.data;
};

export const useViewPayment = (id) => {
  return useQuery({
    queryKey: ["bingopayPayment", id],
    queryFn: () => fetchPayment(id),
    enabled: !!id,
  });
};

// ── Payment stats (counts + total success amount) ──────────
const fetchPaymentStats = async (filters) => {
  const response = await api.post("/admin/bingopay/payments/stats", filters);
  return response.data.data;
};

export const usePaymentStats = (filters = {}) => {
  return useQuery({
    queryKey: ["bingopayPaymentStats", filters],
    queryFn: () => fetchPaymentStats(filters),
  });
};
