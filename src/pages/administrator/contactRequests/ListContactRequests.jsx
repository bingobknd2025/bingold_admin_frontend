import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Eye, RefreshCw, Search, Trash2, X } from "lucide-react";
import {
  useContactRequestCounts,
  useDeleteContactRequest,
  useListContactRequests,
  useUpdateContactRequestStatus,
} from "../../../api/administrator/contactRequests/contactRequests";
import Pagination from "../../../components/common/Pagination";
import StatusSelectModal from "../../../components/common/StatusSelectModal";
import DeletePopup from "../../../components/common/DeletePopup";
import ContactStatusPill, { STATUS_OPTIONS } from "./ContactStatusPill";

const formatDate = (value) =>
  value
    ? new Date(value).toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "-";

// Order matters — this is the order the badges appear in the header.
const COUNT_BADGES = [
  { key: "NEW", label: "New", cls: "bg-blue-100 text-blue-700" },
  { key: "IN_PROGRESS", label: "In Progress", cls: "bg-yellow-100 text-yellow-700" },
  { key: "RESOLVED", label: "Resolved", cls: "bg-green-100 text-green-700" },
  { key: "CLOSED", label: "Closed", cls: "bg-gray-100 text-gray-700" },
];

const ListContactRequests = () => {
  const navigate = useNavigate();
  const limit = 10;

  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setCurrentPage(1);
    }, 800);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const filters = {
    page: currentPage,
    limit,
    ...(search && { search }),
    ...(statusFilter && { status: statusFilter }),
  };

  const { data, isLoading, isError, refetch } = useListContactRequests(filters);
  const { data: counts, refetch: refetchCounts } = useContactRequestCounts();

  const rows = data?.requests || [];
  const total = data?.total || 0;
  const totalPages = data?.totalPages || 1;

  const { mutate: updateStatus, isPending: isUpdating } =
    useUpdateContactRequestStatus();
  const { mutate: removeRequest, isPending: isDeleting } =
    useDeleteContactRequest();

  const [statusModal, setStatusModal] = useState({ isOpen: false, item: null });
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, item: null });

  const refreshAll = () => {
    refetch();
    refetchCounts();
  };

  const handleUpdateStatus = ({ value, note }) => {
    updateStatus(
      { id: statusModal.item.id, status: value, admin_note: note },
      {
        onSuccess: () => {
          toast.success("Contact request updated!");
          setStatusModal({ isOpen: false, item: null });
          refreshAll();
        },
        onError: (err) =>
          toast.error(err?.response?.data?.message || "Error updating status"),
      },
    );
  };

  const handleDelete = () => {
    removeRequest(deleteModal.item.id, {
      onSuccess: () => {
        toast.success("Contact request deleted!");
        setDeleteModal({ isOpen: false, item: null });
        refreshAll();
      },
      onError: (err) =>
        toast.error(err?.response?.data?.message || "Error deleting request"),
    });
  };

  if (isLoading) return <div className="p-6">Loading contact requests...</div>;
  if (isError) return <div className="p-6">Error loading contact requests.</div>;

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            Contact Requests
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Enquiries submitted from the public contact form. Replies are sent
            outside the system — use the status to track what has been handled.
          </p>
        </div>
        <button
          onClick={refreshAll}
          className="inline-flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {/* Status counts */}
      {counts && (
        <div className="mb-4 flex flex-wrap gap-2">
          {COUNT_BADGES.map((badge) => (
            <button
              key={badge.key}
              onClick={() => {
                setStatusFilter(statusFilter === badge.key ? "" : badge.key);
                setCurrentPage(1);
              }}
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${badge.cls} ${
                statusFilter === badge.key ? "ring-2 ring-offset-1 ring-blue-500" : ""
              }`}
            >
              {badge.label}
              <span className="font-semibold">{counts[badge.key] ?? 0}</span>
            </button>
          ))}
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
            Total <span className="font-semibold">{counts.TOTAL ?? 0}</span>
          </span>
        </div>
      )}

      {/* Filters */}
      <div className="mb-4 flex flex-wrap gap-3">
        <div className="relative max-w-sm flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by ref, name, email, subject..."
            className="w-full pl-9 pr-9 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {searchInput && (
            <button
              onClick={() => setSearchInput("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
        >
          <option value="">All Status</option>
          {STATUS_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ref</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">From</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Received</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {rows.length > 0 ? (
                rows.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-xs font-mono text-gray-600">
                      {item.ticket_ref}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="flex flex-col">
                        <span>{item.name}</span>
                        <span className="text-xs text-gray-500">{item.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                      <div className="flex flex-col">
                        <span className="truncate font-medium">{item.subject}</span>
                        <span className="text-xs text-gray-500 truncate">
                          {item.message}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <ContactStatusPill status={item.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                      {item.source || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(item.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-3">
                        <button
                          className="text-green-600 hover:text-green-900"
                          onClick={() =>
                            navigate("/admin/contact-requests/view", {
                              state: { item },
                            })
                          }
                          title="View"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          className="text-blue-600 hover:text-blue-900"
                          onClick={() => setStatusModal({ isOpen: true, item })}
                          title="Change status"
                        >
                          <RefreshCw size={16} />
                        </button>
                        <button
                          className="text-red-600 hover:text-red-900"
                          onClick={() => setDeleteModal({ isOpen: true, item })}
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-10 text-center text-sm text-gray-500"
                  >
                    No contact requests found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        total={total}
        itemsPerPage={limit}
        onPageChange={setCurrentPage}
      />

      <StatusSelectModal
        isOpen={statusModal.isOpen}
        onClose={() => setStatusModal({ isOpen: false, item: null })}
        onConfirm={handleUpdateStatus}
        title="Update Contact Request"
        label="Status"
        options={STATUS_OPTIONS}
        initialValue={statusModal.item?.status || "NEW"}
        isLoading={isUpdating}
        noteLabel="Internal note (optional)"
      />

      <DeletePopup
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, item: null })}
        onConfirm={handleDelete}
        title="Delete Contact Request"
        message={deleteModal.item?.ticket_ref || ""}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default ListContactRequests;
