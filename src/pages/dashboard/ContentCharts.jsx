import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = {
  Blogs: "#6366f1",
  News: "#f43f5e",
  Youtube: "#eab308",
  Agents: "#10b981",
};

const ContentCharts = ({ contentManagement }) => {
  const data = [
    { name: "Blogs", value: contentManagement?.totalBlogs ?? 0 },
    { name: "News", value: contentManagement?.totalNews ?? 0 },
    { name: "Youtube", value: contentManagement?.totalYoutubeVideos ?? 0 },
    { name: "Agents", value: contentManagement?.totalAgents ?? 0 },
  ];

  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Bar Chart */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <div className="mb-4">
          <h3 className="text-base font-semibold text-slate-900">Content Overview</h3>
          <p className="text-xs text-slate-500 mt-0.5">Total records per module</p>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#475569" }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: "#475569" }} />
              <Tooltip
                contentStyle={{
                  borderRadius: 8,
                  border: "1px solid #e2e8f0",
                  fontSize: 12,
                }}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="value" name="Total" radius={[6, 6, 0, 0]}>
                {data.map((entry) => (
                  <Cell key={entry.name} fill={COLORS[entry.name]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pie Chart */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <div className="mb-4">
          <h3 className="text-base font-semibold text-slate-900">Content Distribution</h3>
          <p className="text-xs text-slate-500 mt-0.5">Share across modules ({total} total)</p>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius={55}
                outerRadius={95}
                paddingAngle={2}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {data.map((entry) => (
                  <Cell key={entry.name} fill={COLORS[entry.name]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  borderRadius: 8,
                  border: "1px solid #e2e8f0",
                  fontSize: 12,
                }}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ContentCharts;
