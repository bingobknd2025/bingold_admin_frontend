import { useLocation, useNavigate } from "react-router-dom";
import { User } from "lucide-react";
import SectionCard from "../../../../components/common/SectionCard";
import InfoRow from "../../../../components/common/InfoRow";
import StatusBadge from "../../../../components/common/StatusBadge";

const fmt = (v) => (v ? new Date(v).toLocaleString() : "N/A");

const ViewBingopayUser = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const item = location.state?.item;

  if (!item) return <div className="p-6">No data available.</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">BingoPay User Details</h2>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 border rounded-lg hover:bg-gray-50"
        >
          Back
        </button>
      </div>

      <SectionCard
        icon={User}
        title={item.name || item.full_name || item.email || "User"}
        badge={<StatusBadge status={item.status} />}
      >
        <InfoRow label="ID" value={item.id} />
        <InfoRow label="Name" value={item.name || item.full_name} />
        <InfoRow label="Email" value={item.email} />
        <InfoRow label="Phone" value={item.phone} />
        <InfoRow
          label="Account Type"
          value={item.account_type ? item.account_type.replace("_", " ") : null}
        />
        <InfoRow label="BinGold User ID" value={item.bingold_user_id} />
        <InfoRow
          label="KYC Status"
          value={item.kyc_status ? <StatusBadge status={item.kyc_status} /> : null}
        />
        <InfoRow
          label="Status"
          value={<StatusBadge status={item.status} />}
        />
        <InfoRow label="Created At" value={fmt(item.created_at)} />
        <InfoRow label="Updated At" value={fmt(item.updated_at)} />
      </SectionCard>
    </div>
  );
};

export default ViewBingopayUser;
