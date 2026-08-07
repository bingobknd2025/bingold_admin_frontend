import { CheckCircle2, CircleDot, Inbox, XCircle } from "lucide-react";

// Statuses of contact_requests. Kept local to this module rather than pushed
// into the shared StatusBadge, which maps a different vocabulary.
const STATUS_CONFIG = {
  NEW: {
    icon: Inbox,
    bg: "bg-blue-100",
    text: "text-blue-700",
    label: "New",
  },
  IN_PROGRESS: {
    icon: CircleDot,
    bg: "bg-yellow-100",
    text: "text-yellow-700",
    label: "In Progress",
  },
  RESOLVED: {
    icon: CheckCircle2,
    bg: "bg-green-100",
    text: "text-green-700",
    label: "Resolved",
  },
  CLOSED: {
    icon: XCircle,
    bg: "bg-gray-100",
    text: "text-gray-700",
    label: "Closed",
  },
};

// Values must match the ENUM in contact_request.model.js on the backend.
export const STATUS_OPTIONS = Object.entries(STATUS_CONFIG).map(
  ([value, config]) => ({ value, label: config.label })
);

const ContactStatusPill = ({ status }) => {
  const config = STATUS_CONFIG[status] || {
    icon: CircleDot,
    bg: "bg-gray-100",
    text: "text-gray-600",
    label: status || "Unknown",
  };
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
    >
      <Icon className="w-3.5 h-3.5" />
      {config.label}
    </span>
  );
};

export default ContactStatusPill;
