import React from "react";
import { CheckCircle, XCircle, AlertCircle, CheckCircle2 } from "lucide-react";

const getStatusConfig = (status) => {
  const configs = {
    pending: {
      icon: AlertCircle,
      bg: "bg-yellow-100",
      text: "text-yellow-700",
      label: "Pending",
    },
    approved: {
      icon: CheckCircle2,
      bg: "bg-green-100",
      text: "text-green-700",
      label: "Approved",
    },
    rejected: {
      icon: XCircle,
      bg: "bg-red-100",
      text: "text-red-700",
      label: "Rejected",
    },
    reject: {
      icon: XCircle,
      bg: "bg-red-100",
      text: "text-red-700",
      label: "Rejected",
    },
    active: {
      icon: CheckCircle,
      bg: "bg-green-100",
      text: "text-green-700",
      label: "Active",
    },
    inactive: {
      icon: XCircle,
      bg: "bg-red-100",
      text: "text-red-700",
      label: "Inactive",
    },
    collected: {
      icon: CheckCircle2,
      bg: "bg-green-100",
      text: "text-green-700",
      label: "Collected",
    },
    in_progress: {
      icon: AlertCircle,
      bg: "bg-yellow-100",
      text: "text-yellow-700",
      label: "In Progress",
    },
    cancelled: {
      icon: XCircle,
      bg: "bg-red-100",
      text: "text-red-800",
      label: "Cancelled",
    },
  };

  return (
    configs[status] || {
      icon: AlertCircle,
      bg: "bg-gray-100",
      text: "text-gray-700",
      label: status || "Unknown",
    }
  );
};

const StatusBadge = ({ status, isActive }) => {
  let finalStatus = "pending";

  // Priority: boolean
  if (typeof isActive === "boolean") {
    finalStatus = isActive ? "active" : "inactive";
  }
  // Otherwise normalize string
  else if (status) {
    finalStatus = status.toLowerCase().replace(/[\s-]/g, "_");
  }

  const cfg = getStatusConfig(finalStatus);
  const Icon = cfg.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${cfg.bg} ${cfg.text}`}
    >
      <Icon className="w-3.5 h-3.5 shrink-0" />
      {cfg.label}
    </span>
  );
};

export default StatusBadge;
