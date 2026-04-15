import { Shield, Lock, Key } from "lucide-react";

const CARDS = [
  {
    icon: Shield,
    iconColor: "text-blue-600",
    bgColor: "bg-blue-100",
    title: "Account Protected",
    subtitle: "Your account is secure",
  },
  {
    icon: Lock,
    iconColor: "text-emerald-600",
    bgColor: "bg-emerald-100",
    title: "Strong Password",
    subtitle: "Last changed 30 days ago",
  },
  {
    icon: Key,
    iconColor: "text-amber-600",
    bgColor: "bg-amber-100",
    title: "API Access",
    subtitle: "2 active sessions",
  },
];

export default function SecurityStatsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {CARDS.map(({ icon: Icon, iconColor, bgColor, title, subtitle }) => (
        <div
          key={title}
          className="bg-white rounded-lg border border-slate-200 p-6 text-center"
        >
          <div
            className={`w-12 h-12 ${bgColor} rounded-full flex items-center justify-center mx-auto mb-3`}
          >
            <Icon className={iconColor} size={24} />
          </div>
          <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
          <p className="text-xs text-slate-600 mt-1">{subtitle}</p>
        </div>
      ))}
    </div>
  );
}
