import { useMutation, useQuery } from "@tanstack/react-query";
import api from "../../../utils/axios";

// ── List BingoPay users (mappings to BinGold) ──────────────
const fetchBingopayUsers = async (filters) => {
  const response = await api.post("/admin/bingopay/users/list", filters);
  return response.data.data;
};

export const useListBingopayUsers = (filters = {}) => {
  return useQuery({
    queryKey: ["bingopayUsers", filters],
    queryFn: () => fetchBingopayUsers(filters),
    keepPreviousData: true,
  });
};

// ── View one BingoPay user ─────────────────────────────────
const fetchBingopayUser = async (id) => {
  const response = await api.post("/admin/bingopay/users/view", { id });
  return response.data.data;
};

export const useViewBingopayUser = (id) => {
  return useQuery({
    queryKey: ["bingopayUser", id],
    queryFn: () => fetchBingopayUser(id),
    enabled: !!id,
  });
};

// ── Change a BingoPay user status ──────────────────────────
export const useChangeBingopayUserStatus = () => {
  return useMutation({
    mutationFn: async ({ id, status }) => {
      const response = await api.post("/admin/bingopay/users/change-status", {
        id,
        status,
      });
      return response.data;
    },
  });
};

// ── Check an email against BinGold & persist the mapping ───
export const useCheckBingold = () => {
  return useMutation({
    mutationFn: async (email) => {
      const response = await api.post("/admin/bingopay/users/check-bingold", {
        email,
      });
      return response.data;
    },
  });
};
