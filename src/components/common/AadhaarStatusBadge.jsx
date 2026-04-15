
const AadhaarStatusBadge = ({ status }) => {
  const map = {
    pending: {
      bg: "bg-yellow-100",
      text: "text-yellow-700",
      label: "Pending",
    },
    verified: {
      bg: "bg-green-100",
      text: "text-green-700",
      label: "Verified",
    },
    rejected: {
      bg: "bg-red-100",
      text: "text-red-700",
      label: "Rejected",
    },
  };

  const cfg = map[status] || map.pending;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.text}`}
    >
      {cfg.label}
    </span>
  );
};

export default AadhaarStatusBadge;