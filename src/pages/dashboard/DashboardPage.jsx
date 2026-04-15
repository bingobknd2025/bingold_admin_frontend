import React from "react";
import { Users, Truck, TrendingUp } from "lucide-react";
import { useDashboard } from "../../api/dashboard/dashboard";
import StatCard from "./DashboardCard";

const DashboardPage = () => {
  const { data, isLoading, isError } = useDashboard();

  if (isLoading) {
    return <div className="text-center py-12">Loading dashboard...</div>;
  }

  if (isError) {
    return (
      <div className="text-center py-12 text-red-600">
        Failed to load dashboard
      </div>
    );
  }

  const { userManagement } = data || {};
  const { contentManagement } = data || {};

  if (!userManagement) {
    return (
      <div className="text-center py-12 text-red-600">
        No dashboard data available
      </div>
    );
  }
  if (!contentManagement) {
    return (
      <div className="text-center py-12 text-red-600">
        No dashboard data available
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl md:text-2xl lg:text-2xl font-bold text-slate-900 tracking-tight">
          Dashboard Overview
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Monitor system statistics and activity
        </p>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={userManagement?.totalUsers}
          icon={<Users className="text-blue-600" size={24} />}
        />

        <StatCard
          title="Active Users"
          value={userManagement?.activeUsers}
          icon={<Users className="text-emerald-600" size={24} />}
        />

        <StatCard
          title="Total Roles"
          value={userManagement?.totalRoles}
          icon={<Users className="text-amber-600" size={24} />}
        />

        <StatCard
          title="Total Permissions"
          value={userManagement?.totalPermissions}
          icon={<Users className="text-purple-600" size={24} />}
        />
        <StatCard
          title="Total Blogs"
          value={contentManagement?.totalBlogs}
          icon={<Users className="text-purple-600" size={24} />}
        />
        <StatCard
          title="Total News"
          value={contentManagement?.totalNews}
          icon={<Users className="text-purple-600" size={24} />}
        />
      </div>
    </div>
  );
};

export default DashboardPage;
