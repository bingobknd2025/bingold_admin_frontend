import { useLocation, useNavigate } from "react-router-dom";
import { Receipt } from "lucide-react";
import SectionCard from "../../../../components/common/SectionCard";
import InfoRow from "../../../../components/common/InfoRow";
import StatusBadge from "../../../../components/common/StatusBadge";

const fmt = (v) => (v ? new Date(v).toLocaleString() : "N/A");

const ViewPayment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const item = location.state?.item;

  if (!item) return <div className="p-6">No data available.</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">Payment Details</h2>
        <button onClick={() => navigate(-1)} className="px-4 py-2 border rounded-lg hover:bg-gray-50">
          Back
        </button>
      </div>

      <SectionCard
        icon={Receipt}
        title={item.reference || item.txn_reference || `Payment #${item.id}`}
        badge={<StatusBadge status={item.status} />}
      >
        <InfoRow label="ID" value={item.id} />
        <InfoRow label="Reference" value={item.reference || item.txn_reference} />
        <InfoRow label="Receiver Vendor" value={item.receiver_vendor?.business_name || item.receiver_vendor_id} />
        <InfoRow label="Payer" value={item.payer?.email || item.payer_user_id} />
        <InfoRow label="Amount" value={item.amount} />
        <InfoRow label="Coin" value={item.coin} />
        <InfoRow label="QR ID" value={item.qr_id} />
        <InfoRow label="BinGold Reference" value={item.bingold_reference} />
        <InfoRow label="Status" value={<StatusBadge status={item.status} />} />
        <InfoRow label="Created At" value={fmt(item.created_at)} />
        <InfoRow label="Updated At" value={fmt(item.updated_at)} />
      </SectionCard>
    </div>
  );
};

export default ViewPayment;
