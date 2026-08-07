import { useMutation, useQuery } from "@tanstack/react-query";
import api from "../../../utils/axios";

// ── List contact-us tickets submitted from the public form ──────
const fetchContactRequests = async (filters) => {
  const response = await api.post("/admin/contact-requests/list", filters);
  return response.data.data;
};

export const useListContactRequests = (filters = {}) => {
  return useQuery({
    queryKey: ["contactRequests", filters],
    queryFn: () => fetchContactRequests(filters),
    keepPreviousData: true,
  });
};

// ── Per-status totals, for the list header badges ───────────────
const fetchContactRequestCounts = async () => {
  const response = await api.post("/admin/contact-requests/counts", {});
  return response.data.data;
};

export const useContactRequestCounts = () => {
  return useQuery({
    queryKey: ["contactRequestCounts"],
    queryFn: fetchContactRequestCounts,
  });
};

// ── One ticket, with the full message and who resolved it ───────
const fetchContactRequest = async (id) => {
  const response = await api.post("/admin/contact-requests/view", { id });
  return response.data.data;
};

export const useViewContactRequest = (id) => {
  return useQuery({
    queryKey: ["contactRequest", id],
    queryFn: () => fetchContactRequest(id),
    enabled: !!id,
  });
};

// ── Move a ticket through NEW → IN_PROGRESS → RESOLVED/CLOSED ───
const updateContactRequestStatus = async ({ id, status, admin_note }) => {
  const response = await api.post("/admin/contact-requests/update-status", {
    id,
    status,
    admin_note,
  });
  return response.data;
};

export const useUpdateContactRequestStatus = () => {
  return useMutation({ mutationFn: updateContactRequestStatus });
};

// ── Delete (spam cleanup) ───────────────────────────────────────
const deleteContactRequest = async (id) => {
  const response = await api.post("/admin/contact-requests/delete", { id });
  return response.data;
};

export const useDeleteContactRequest = () => {
  return useMutation({ mutationFn: deleteContactRequest });
};
