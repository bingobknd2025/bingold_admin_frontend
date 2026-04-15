const StatCard = ({ title, value, icon }) => {
  return (
    <div className="relative bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition">
      <div className="flex items-center justify-between mb-3">
        <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
          {icon}
        </div>
      </div>

      <p className="text-sm font-medium text-slate-500">{title}</p>

      <p className="mt-2 text-3xl font-bold text-slate-900">{value ?? 0}</p>
    </div>
  );
};

export default StatCard;