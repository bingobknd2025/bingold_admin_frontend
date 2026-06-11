import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Check,
  Eye,
  Pencil,
  Plus,
  Search,
  ShieldCheck,
  X,
  XCircle,
} from "lucide-react";
import {
  useListVendors,
  useApproveVendor,
  useRejectVendor,
  useChangeVendorStatus,
} from "../../../../api/administrator/bingopay/vendors";
import Pagination from "../../../../components/common/Pagination";
import StatusBadge from "../../../../components/common/StatusBadge";
import StatusSelectModal from "../../../../components/common/StatusSelectModal";

const VENDOR_STATUS = [
  { value: "pending", label: "Pending" },
  { value: "active", label: "Active" },
  { value: "suspended", label: "Suspended" },
  { value: "rejected", label: "Rejected" },
];

const KYC_STATUS = [
  { value: "", label: "All KYC" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];

const ListVendors = () => {
  const navigate = useNavigate();
  const limit = 10;

  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [kycFilter, setKycFilter] = useState("");

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
    ...(kycFilter && { kyc_status: kycFilter }),
  };

  const { data, isLoading, isError, refetch } = useListVendors(filters);
  const total = data?.total || 0;
  const totalPages = data?.totalPages || 1;

  const { mutate: approveVendor } = useApproveVendor();
  const { mutate: rejectVendor, isPending: isRejecting } = useRejectVendor();
  const { mutate: changeStatus, isPending: isChanging } = useChangeVendorStatus();

  const [statusModal, setStatusModal] = useState({ isOpen: false, vendor: null });
  const [rejectModal, setRejectModal] = useState({ isOpen: false, vendor: null });

  const handleApprove = (vendor) => {
    if (!window.confirm(`Approve vendor "${vendor.business_name}"?`)) return;
    approveVendor(vendor.id, {
      onSuccess: () => {
        toast.success("Vendor approved!");
        refetch();
      },
      onError: (err) =>
        toast.error(err?.response?.data?.message || "Error approving vendor"),
    });
  };

  const handleReject = ({ note }) => {
    rejectVendor(
      { id: rejectModal.vendor.id, reason: note },
      {
        onSuccess: () => {
          toast.success("Vendor rejected!");
          setRejectModal({ isOpen: false, vendor: null });
          refetch();
        },
        onError: (err) =>
          toast.error(err?.response?.data?.message || "Error rejecting vendor"),
      },
    );
  };

  const handleChangeStatus = ({ value }) => {
    changeStatus(
      { id: statusModal.vendor.id, status: value },
      {
        onSuccess: () => {
          toast.success("Vendor status updated!");
          setStatusModal({ isOpen: false, vendor: null });
          refetch();
        },
        onError: (err) =>
          toast.error(err?.response?.data?.message || "Error updating status"),
      },
    );
  };

  if (isLoading) return <div className="p-6">Loading vendors...</div>;
  if (isError) return <div className="p-6">Error loading vendors.</div>;

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">Vendors</h2>
        <button
          onClick={() => navigate("/admin/bingopay/vendors/create")}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
        >
          <Plus className="w-4 h-4 mr-2" />
          Onboard Vendor
        </button>
      </div>

      <div className="mb-4 flex flex-wrap gap-3">
        <div className="relative max-w-sm flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by business name, email..."
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
          {VENDOR_STATUS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <select
          value={kycFilter}
          onChange={(e) => {
            setKycFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
        >
          {KYC_STATUS.map((o) => (
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Business</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">GST</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">KYC</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data?.data?.length > 0 ? (
                data.data.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{item.business_name || "-"}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.business_type || "-"}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">{item.gst_number || "-"}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm"><StatusBadge status={item.kyc_status} /></td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm"><StatusBadge status={item.status} /></td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-3 items-center">
                        <button
                          className="text-green-600 hover:text-green-900"
                          onClick={() =>
                            navigate("/admin/bingopay/vendors/view", { state: { id: item.id } })
                          }
                          title="View"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          className="text-blue-600 hover:text-blue-900"
                          onClick={() =>
                            navigate("/admin/bingopay/vendors/edit", { state: { item } })
                          }
                          title="Edit"
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          className="text-emerald-600 hover:text-emerald-900"
                          onClick={() => handleApprove(item)}
                          title="Approve"
                        >
                          <Check size={18} />
                        </button>
                        <button
                          className="text-red-600 hover:text-red-900"
                          onClick={() => setRejectModal({ isOpen: true, vendor: item })}
                          title="Reject"
                        >
                          <XCircle size={18} />
                        </button>
                        <button
                          className="text-purple-600 hover:text-purple-900"
                          onClick={() => setStatusModal({ isOpen: true, vendor: item })}
                          title="Change Status"
                        >
                          <ShieldCheck size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center text-sm text-gray-500">
                    No vendors found
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
        onClose={() => setStatusModal({ isOpen: false, vendor: null })}
        onConfirm={handleChangeStatus}
        title="Change Vendor Status"
        options={VENDOR_STATUS}
        initialValue={statusModal.vendor?.status}
        isLoading={isChanging}
      />

      <StatusSelectModal
        isOpen={rejectModal.isOpen}
        onClose={() => setRejectModal({ isOpen: false, vendor: null })}
        onConfirm={handleReject}
        title="Reject Vendor"
        label="Action"
        options={[{ value: "rejected", label: "Reject" }]}
        initialValue="rejected"
        noteLabel="Reason"
        isLoading={isRejecting}
      />
    </div>
  );
};

export default ListVendors;
