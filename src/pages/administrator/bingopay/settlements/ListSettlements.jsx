import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Eye, Plus, RefreshCw } from "lucide-react";
import {
  useListSettlements,
  useUpdateSettlementStatus,
} from "../../../../api/administrator/bingopay/settlements";
import Pagination from "../../../../components/common/Pagination";
import StatusBadge from "../../../../components/common/StatusBadge";
import StatusSelectModal from "../../../../components/common/StatusSelectModal";

const SETTLEMENT_STATUS = [
  { value: "pending", label: "Pending" },
  { value: "processing", label: "Processing" },
  { value: "completed", label: "Completed" },
  { value: "failed", label: "Failed" },
];

const ListSettlements = () => {
  const navigate = useNavigate();
  const limit = 10;

  const [currentPage, setCurrentPage] = useState(1);
  const [vendorId, setVendorId] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const filters = {
    page: currentPage,
    limit,
    ...(vendorId && { vendor_id: Number(vendorId) }),
    ...(statusFilter && { settlement_status: statusFilter }),
  };

  const { data, isLoading, isError, refetch } = useListSettlements(filters);
  const total = data?.total || 0;
  const totalPages = data?.totalPages || 1;

  const { mutate: updateStatus, isPending } = useUpdateSettlementStatus();
  const [statusModal, setStatusModal] = useState({ isOpen: false, item: null });

  const handleUpdateStatus = ({ value, note }) => {
    updateStatus(
      { id: statusModal.item.id, status: value, note },
      {
        onSuccess: () => {
          toast.success("Settlement status updated!");
          setStatusModal({ isOpen: false, item: null });
          refetch();
        },
        onError: (err) =>
          toast.error(err?.response?.data?.message || "Error updating status"),
      },
    );
  };

  if (isLoading) return <div className="p-6">Loading settlements...</div>;
  if (isError) return <div className="p-6">Error loading settlements.</div>;

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">Settlements</h2>
        <button
          onClick={() => navigate("/admin/bingopay/settlements/create")}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Settlement
        </button>
      </div>

      <div className="mb-4 flex flex-wrap gap-3">
        <input
          type="number"
          value={vendorId}
          onChange={(e) => {
            setVendorId(e.target.value);
            setCurrentPage(1);
          }}
          placeholder="Vendor ID"
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm max-w-[160px]"
        />
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
        >
          <option value="">All Status</option>
          {SETTLEMENT_STATUS.map((o) => (
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Batch</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Coin</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data?.data?.length > 0 ? (
                data.data.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">{item.batch_reference || `#${item.id}`}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.vendor?.business_name || item.vendor_id || "-"}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.total_amount ?? "-"}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.coin || "-"}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm"><StatusBadge status={item.settlement_status || item.status} /></td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.created_at ? new Date(item.created_at).toLocaleDateString() : "-"}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-3 items-center">
                        <button
                          className="text-green-600 hover:text-green-900"
                          onClick={() => navigate("/admin/bingopay/settlements/view", { state: { item } })}
                          title="View"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          className="text-purple-600 hover:text-purple-900"
                          onClick={() => setStatusModal({ isOpen: true, item })}
                          title="Update Status"
                        >
                          <RefreshCw size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-10 text-center text-sm text-gray-500">
                    No settlements found
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
        title="Update Settlement Status"
        options={SETTLEMENT_STATUS}
        initialValue={statusModal.item?.settlement_status || statusModal.item?.status}
        noteLabel="Note"
        isLoading={isPending}
      />
    </div>
  );
};

export default ListSettlements;
