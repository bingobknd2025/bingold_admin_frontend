import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Landmark, RefreshCw } from "lucide-react";
import { useUpdateSettlementStatus } from "../../../../api/administrator/bingopay/settlements";
import SectionCard from "../../../../components/common/SectionCard";
import InfoRow from "../../../../components/common/InfoRow";
import StatusBadge from "../../../../components/common/StatusBadge";

const SETTLEMENT_STATUS = [
  { value: "pending", label: "Pending" },
  { value: "processing", label: "Processing" },
  { value: "completed", label: "Completed" },
  { value: "failed", label: "Failed" },
];

const fmt = (v) => (v ? new Date(v).toLocaleString() : "N/A");

const ViewSettlement = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [item, setItem] = useState(location.state?.item);

  const { mutate: updateStatus, isPending } = useUpdateSettlementStatus();
  const [showForm, setShowForm] = useState(false);
  const [status, setStatus] = useState(
    item?.settlement_status || item?.status || "pending",
  );
  const [reference, setReference] = useState("");
  const [note, setNote] = useState("");

  if (!item) return <div className="p-6">No data available.</div>;

  const handleUpdate = () => {
    updateStatus(
      {
        id: item.id,
        status,
        ...(reference && { bingold_withdraw_reference: reference }),
        ...(note && { note }),
      },
      {
        onSuccess: () => {
          toast.success("Settlement status updated!");
          setItem((prev) => ({ ...prev, settlement_status: status, status }));
          setShowForm(false);
        },
        onError: (err) =>
          toast.error(err?.response?.data?.message || "Error updating status"),
      },
    );
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">Settlement Details</h2>
        <button onClick={() => navigate(-1)} className="px-4 py-2 border rounded-lg hover:bg-gray-50">
          Back
        </button>
      </div>

      <div className="flex">
        <button
          onClick={() => setShowForm((p) => !p)}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm"
        >
          <RefreshCw size={16} /> Update Status
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2 text-sm"
              >
                {SETTLEMENT_STATUS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">BinGold Withdraw Reference</label>
              <input
                type="text"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2 text-sm"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Note</label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={2}
                className="w-full border border-gray-300 rounded-lg p-2 text-sm"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              onClick={handleUpdate}
              disabled={isPending}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm disabled:opacity-50"
            >
              {isPending ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      )}

      <SectionCard
        icon={Landmark}
        title={item.batch_reference || `Settlement #${item.id}`}
        badge={<StatusBadge status={item.settlement_status || item.status} />}
      >
        <InfoRow label="ID" value={item.id} />
        <InfoRow label="Batch Reference" value={item.batch_reference} />
        <InfoRow label="Vendor" value={item.vendor?.business_name || item.vendor_id} />
        <InfoRow label="Total Amount" value={item.total_amount} />
        <InfoRow label="Coin" value={item.coin} />
        <InfoRow label="BinGold Withdraw Reference" value={item.bingold_withdraw_reference} />
        <InfoRow label="Note" value={item.note} />
        <InfoRow
          label="Status"
          value={<StatusBadge status={item.settlement_status || item.status} />}
        />
        <InfoRow label="Created At" value={fmt(item.created_at)} />
        <InfoRow label="Updated At" value={fmt(item.updated_at)} />
      </SectionCard>
    </div>
  );
};

export default ViewSettlement;
