import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye } from "lucide-react";
import {
  useListPayments,
  usePaymentStats,
} from "../../../../api/administrator/bingopay/payments";
import Pagination from "../../../../components/common/Pagination";
import StatusBadge from "../../../../components/common/StatusBadge";

const StatCard = ({ label, value }) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
    <p className="text-xs text-gray-500 uppercase tracking-wider">{label}</p>
    <p className="mt-1 text-2xl font-semibold text-gray-900">{value ?? 0}</p>
  </div>
);

const ListPayments = () => {
  const navigate = useNavigate();
  const limit = 10;

  const [currentPage, setCurrentPage] = useState(1);
  const [status, setStatus] = useState("");
  const [vendorId, setVendorId] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const filters = {
    page: currentPage,
    limit,
    ...(status && { status }),
    ...(vendorId && { receiver_vendor_id: Number(vendorId) }),
    ...(from && { from: new Date(from).toISOString() }),
    ...(to && { to: new Date(to).toISOString() }),
  };

  const { data, isLoading, isError } = useListPayments(filters);
  const { data: stats } = usePaymentStats(
    vendorId ? { receiver_vendor_id: Number(vendorId) } : {},
  );

  const total = data?.total || 0;
  const totalPages = data?.totalPages || 1;

  if (isLoading) return <div className="p-6">Loading payments...</div>;
  if (isError) return <div className="p-6">Error loading payments.</div>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Payments</h2>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total" value={stats?.total ?? stats?.total_count} />
        <StatCard label="Success" value={stats?.success ?? stats?.success_count} />
        <StatCard label="Pending" value={stats?.pending ?? stats?.pending_count} />
        <StatCard
          label="Total Success Amount"
          value={stats?.total_success_amount ?? stats?.success_amount}
        />
      </div>

      {/* Filters */}
      <div className="mb-4 flex flex-wrap gap-3">
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setCurrentPage(1);
          }}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="success">Success</option>
          <option value="failed">Failed</option>
          <option value="cancelled">Cancelled</option>
        </select>
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
        <div className="flex items-center gap-2 text-sm">
          <label className="text-gray-500">From</label>
          <input
            type="date"
            value={from}
            onChange={(e) => {
              setFrom(e.target.value);
              setCurrentPage(1);
            }}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          />
        </div>
        <div className="flex items-center gap-2 text-sm">
          <label className="text-gray-500">To</label>
          <input
            type="date"
            value={to}
            onChange={(e) => {
              setTo(e.target.value);
              setCurrentPage(1);
            }}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ref</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Coin</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data?.data?.length > 0 ? (
                data.data.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">{item.reference || item.txn_reference || item.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.receiver_vendor?.business_name || item.receiver_vendor_id || "-"}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.amount ?? "-"}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.coin || "-"}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm"><StatusBadge status={item.status} /></td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.created_at ? new Date(item.created_at).toLocaleString() : "-"}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        className="text-green-600 hover:text-green-900"
                        onClick={() => navigate("/admin/bingopay/payments/view", { state: { item } })}
                        title="View"
                      >
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-10 text-center text-sm text-gray-500">
                    No payments found
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
    </div>
  );
};

export default ListPayments;
