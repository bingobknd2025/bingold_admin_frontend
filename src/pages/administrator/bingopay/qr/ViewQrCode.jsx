import { useLocation, useNavigate } from "react-router-dom";
import { QrCode } from "lucide-react";
import SectionCard from "../../../../components/common/SectionCard";
import InfoRow from "../../../../components/common/InfoRow";
import StatusBadge from "../../../../components/common/StatusBadge";

const fmt = (v) => (v ? new Date(v).toLocaleString() : "N/A");

const ViewQrCode = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const item = location.state?.item;

  if (!item) return <div className="p-6">No data available.</div>;

  const qrImage = item.qr_image || item.qr_code;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">Payment QR Details</h2>
        <button onClick={() => navigate(-1)} className="px-4 py-2 border rounded-lg hover:bg-gray-50">
          Back
        </button>
      </div>

      <SectionCard
        icon={QrCode}
        title={item.label || `QR #${item.id}`}
        badge={<StatusBadge isActive={!!item.status} />}
      >
        {qrImage && (
          <div className="flex justify-center py-4 border-b border-gray-100">
            <a href={qrImage} target="_blank" rel="noreferrer">
              <img src={qrImage} alt="QR" className="w-40 h-40 object-contain border rounded" />
            </a>
          </div>
        )}
        <InfoRow label="ID" value={item.id} />
        <InfoRow label="Vendor" value={item.vendor?.business_name || item.vendor_id} />
        <InfoRow label="QR Type" value={item.qr_type} />
        <InfoRow label="Amount" value={item.amount} />
        <InfoRow label="Coin" value={item.coin} />
        <InfoRow label="Label" value={item.label} />
        <InfoRow label="Reference" value={item.reference || item.qr_reference} />
        <InfoRow label="Status" value={<StatusBadge isActive={!!item.status} />} />
        <InfoRow label="Created At" value={fmt(item.created_at)} />
        <InfoRow label="Updated At" value={fmt(item.updated_at)} />
      </SectionCard>
    </div>
  );
};

export default ViewQrCode;
