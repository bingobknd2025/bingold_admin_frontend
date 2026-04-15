// import React from "react";
// import { Users, Truck, TrendingUp } from "lucide-react";
// import { useDashboard } from "../../api/dashboard/Dashboard";
// import StatCard from "./DashboardCard";

// const DashboardPage = () => {
//   const { data, isLoading, isError } = useDashboard();

//   if (isLoading) {
//     return <div className="text-center py-12">Loading dashboard...</div>;
//   }

//   if (isError) {
//     return (
//       <div className="text-center py-12 text-red-600">
//         Failed to load dashboard
//       </div>
//     );
//   }

//   const { userManagement, franchiseSystem, recentActivities } = data || {};

//   // console.log("dashboard", data)
//   // console.log("usermanagement", userManagement)
//   // console.log("franchisesystem", franchiseSystem)
//   // console.log("recentactivities", recentActivities)

//   if (!userManagement || !franchiseSystem || !recentActivities) {
//     return (
//       <div className="text-center py-12 text-red-600">
//         No dashboard data available
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-[1600px] mx-auto space-y-6">
//       {/* Header */}
//       <div>
//         <h1 className="text-xl md:text-2xl lg:text-2xl font-bold text-slate-900 tracking-tight">
//           Dashboard Overview
//         </h1>
//         <p className="text-sm text-slate-600 mt-1">
//           Monitor system statistics and activity
//         </p>
//       </div>

//       {/* STAT CARDS */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         <StatCard
//           title="Total Users"
//           value={userManagement?.totalUsers}
//           icon={<Users className="text-blue-600" size={24} />}
//         />

//         <StatCard
//           title="Active Users"
//           value={userManagement?.activeUsers}
//           icon={<Users className="text-emerald-600" size={24} />}
//         />

//         <StatCard
//           title="Total Franchises"
//           value={franchiseSystem?.totalFranchises}
//           icon={<Truck className="text-amber-600" size={24} />}
//         />

//         <StatCard
//           title="Total Transactions"
//           value={franchiseSystem?.totalTransactions}
//           icon={<TrendingUp className="text-purple-600" size={24} />}
//         />
//       </div>

//       {/*  RECENT ACTIVITIES  */}
//       <div className="bg-white rounded-lg border border-slate-200 p-6">
//         <h3 className="text-lg font-semibold text-slate-900 mb-4">
//           Recent Activities
//         </h3>

//         {recentActivities?.recentTransactions?.length === 0 ? (
//           <p className="text-slate-500">No recent transactions available.</p>
//         ) : (
//           <ul className="space-y-3">
//             {recentActivities.recentTransactions.map((tx, index) => (
//               <li key={index} className="p-3 rounded border bg-slate-50">
//                 {JSON.stringify(tx)}
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>
//     </div>
//   );
// };

// export default DashboardPage;
