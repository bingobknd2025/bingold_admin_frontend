import { useMutation, useQuery } from "@tanstack/react-query";
import api from "../../../utils/axios";

// ── List payment QR codes ──────────────────────────────────
const fetchQrCodes = async (filters) => {
  const response = await api.post("/admin/bingopay/qr/list", filters);
  return response.data.data;
};

export const useListQrCodes = (filters = {}) => {
  return useQuery({
    queryKey: ["bingopayQr", filters],
    queryFn: () => fetchQrCodes(filters),
    keepPreviousData: true,
  });
};

// ── View one payment QR ────────────────────────────────────
const fetchQrCode = async (id) => {
  const response = await api.post("/admin/bingopay/qr/view", { id });
  return response.data.data;
};

export const useViewQrCode = (id) => {
  return useQuery({
    queryKey: ["bingopayQrItem", id],
    queryFn: () => fetchQrCode(id),
    enabled: !!id,
  });
};

// ── Create a payment QR for a vendor (admin) ───────────────
export const useCreateQrCode = () => {
  return useMutation({
    mutationFn: async (data) => {
      const response = await api.post("/admin/bingopay/qr/create", data);
      return response.data;
    },
  });
};

// ── Enable/disable a payment QR ────────────────────────────
export const useChangeQrStatus = () => {
  return useMutation({
    mutationFn: async ({ id, status }) => {
      const response = await api.post("/admin/bingopay/qr/change-status", {
        id,
        status,
      });
      return response.data;
    },
  });
};
