import { useMutation, useQuery } from "@tanstack/react-query";
import api from "../../../utils/axios";

// ── List vendors (paginated, filterable) ───────────────────
const fetchVendors = async (filters) => {
  const response = await api.post("/admin/bingopay/vendors/list", filters);
  return response.data.data;
};

export const useListVendors = (filters = {}) => {
  return useQuery({
    queryKey: ["bingopayVendors", filters],
    queryFn: () => fetchVendors(filters),
    keepPreviousData: true,
  });
};

// ── View one vendor ────────────────────────────────────────
const fetchVendor = async (id) => {
  const response = await api.post("/admin/bingopay/vendors/view", { id });
  return response.data.data;
};

export const useViewVendor = (id) => {
  return useQuery({
    queryKey: ["bingopayVendor", id],
    queryFn: () => fetchVendor(id),
    enabled: !!id,
  });
};

// ── Onboard a vendor (admin) ───────────────────────────────
export const useCreateVendor = () => {
  return useMutation({
    mutationFn: async (data) => {
      const response = await api.post("/admin/bingopay/vendors/create", data);
      return response.data;
    },
  });
};

// ── Update vendor business fields ──────────────────────────
export const useUpdateVendor = () => {
  return useMutation({
    mutationFn: async ({ id, ...data }) => {
      const response = await api.post("/admin/bingopay/vendors/update", {
        id,
        ...data,
      });
      return response.data;
    },
  });
};

// ── Approve vendor ─────────────────────────────────────────
export const useApproveVendor = () => {
  return useMutation({
    mutationFn: async (id) => {
      const response = await api.post("/admin/bingopay/vendors/approve", { id });
      return response.data;
    },
  });
};

// ── Reject vendor ──────────────────────────────────────────
export const useRejectVendor = () => {
  return useMutation({
    mutationFn: async ({ id, reason }) => {
      const response = await api.post("/admin/bingopay/vendors/reject", {
        id,
        reason,
      });
      return response.data;
    },
  });
};

// ── Set vendor status ──────────────────────────────────────
export const useChangeVendorStatus = () => {
  return useMutation({
    mutationFn: async ({ id, status }) => {
      const response = await api.post("/admin/bingopay/vendors/change-status", {
        id,
        status,
      });
      return response.data;
    },
  });
};

// ── Start Sumsub (online) KYC ──────────────────────────────
export const useInitiateVendorKyc = () => {
  return useMutation({
    mutationFn: async (id) => {
      const response = await api.post("/admin/bingopay/vendors/initiate-kyc", {
        id,
      });
      return response.data;
    },
  });
};

// ── Submit offline KYC documents (multipart) ───────────────
export const useSubmitVendorKyc = () => {
  return useMutation({
    mutationFn: async (formData) => {
      const response = await api.post(
        "/admin/bingopay/vendors/kyc/submit",
        formData,
      );
      return response.data;
    },
  });
};

// ── List offline KYC documents for a vendor ────────────────
const fetchVendorKycDocuments = async (vendorId) => {
  const response = await api.post("/admin/bingopay/vendors/kyc/documents", {
    vendor_id: vendorId,
  });
  return response.data.data;
};

export const useVendorKycDocuments = (vendorId) => {
  return useQuery({
    queryKey: ["bingopayVendorKycDocs", vendorId],
    queryFn: () => fetchVendorKycDocuments(vendorId),
    enabled: !!vendorId,
  });
};

// ── Approve/reject a single KYC document ───────────────────
export const useReviewKycDocument = () => {
  return useMutation({
    mutationFn: async ({ document_id, status, note }) => {
      const response = await api.post(
        "/admin/bingopay/vendors/kyc/review-document",
        { document_id, status, note },
      );
      return response.data;
    },
  });
};
