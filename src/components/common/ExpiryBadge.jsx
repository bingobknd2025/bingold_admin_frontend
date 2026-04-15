import { XCircle, AlertTriangle, CheckCircle } from "lucide-react";
import { formatDateOnly, isExpired, isExpiringSoon } from "../../helper/helper";

const ExpiryBadge = ({ date }) => {
  if (!date) {
    return <span className="text-gray-400 italic text-xs">N/A</span>;
  }

  if (isExpired(date)) {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-600">
        <XCircle className="w-3.5 h-3.5" />
        {formatDateOnly(date)} · Expired
      </span>
    );
  }

  if (isExpiringSoon(date)) {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold text-yellow-600">
        <AlertTriangle className="w-3.5 h-3.5" />
        {formatDateOnly(date)} · Expiring Soon
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-600">
      <CheckCircle className="w-3.5 h-3.5" />
      {formatDateOnly(date)}
    </span>
  );
};

export default ExpiryBadge;
