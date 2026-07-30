import { AlertCircle, CheckCircle2, Clock, FileCheck2 } from "lucide-react";

// Statuses of temporary_investor_registrations. Kept local to this module rather
// than pushed into the shared StatusBadge, which maps a different vocabulary.
const STATUS_CONFIG = {
  PENDING_OTP: {
    icon: Clock,
    bg: "bg-gray-100",
    text: "text-gray-700",
    label: "Awaiting OTP",
  },
  PENDING_DOCUMENTS: {
    icon: AlertCircle,
    bg: "bg-yellow-100",
    text: "text-yellow-700",
    label: "Documents Pending",
  },
  DOCS_SUBMITTED: {
    icon: FileCheck2,
    bg: "bg-blue-100",
    text: "text-blue-700",
    label: "Documents Submitted",
  },
  COMPLETED: {
    icon: CheckCircle2,
    bg: "bg-green-100",
    text: "text-green-700",
    label: "Completed",
  },
};

export const STATUS_OPTIONS = Object.entries(STATUS_CONFIG).map(
  ([value, config]) => ({ value, label: config.label })
);

export const ACCOUNT_TYPE_OPTIONS = [
  { value: "", label: "All Account Types" },
  { value: "individual", label: "Individual" },
  { value: "company", label: "Company" },
];

const RegistrationStatusPill = ({ status }) => {
  const config = STATUS_CONFIG[status] || {
    icon: AlertCircle,
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

export default RegistrationStatusPill;
