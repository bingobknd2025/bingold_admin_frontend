const TextStatusBadge = ({ status }) => {
  const normalized = status?.toLowerCase();

  const statusMap = {
    approved: "bg-green-100 text-green-800",
    pending: "bg-yellow-100 text-yellow-800",
    reject: "bg-red-100 text-red-800",
    active: "bg-green-100 text-green-800",
    inactive: "bg-red-100 text-red-800",
    collected: "bg-green-100 text-green-800",
    in_progress: "bg-yellow-100 text-yellow-800",
    rejected: "bg-red-100 text-red-800",
    cancelled: "bg-red-100 text-red-800",
    assigned: "bg-green-100 text-green-800",
  };

  const labelMap = {
    approved: "Approved",
    pending: "Pending",
    reject: "Rejected",
    active: "Active",
    inactive: "Inactive",
    collected: "COLLECTED",
    in_progress: "In Progress",
    rejected: "Rejected",
    cancelled: "Cancelled",
    assigned: "Assigned",
  };

  const colorClass = statusMap[normalized] || "bg-gray-100 text-gray-700";
  const label = labelMap[normalized] || status;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${colorClass}`}
    >
      {label}
    </span>
  );
};

export default TextStatusBadge;
