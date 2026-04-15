import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Shield,
  Tag,
  Layers,
  FileText,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useViewRole } from "../../../api/administrator/role/viewRole";
import StatusBadge from "../../../components/common/StatusBadge";

const ViewRole = () => {
  const location = useLocation();
  const id = location.state?.role?.id;

  const navigate = useNavigate();
  const { data, isLoading, isError, error } = useViewRole(id);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Loading role data...</p>
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">
            {error?.message || "No role data found"}
          </p>
          <button
            onClick={() => navigate("/admin/roles/list")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Roles
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="w-full mx-auto">
        <div className="mb-6">
          <button
            onClick={() => navigate("/admin/roles/list")}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Roles
          </button>
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              Role Details
            </h2>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Shield className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900">
                  {data.name}
                </h2>
              </div>
              <div className="flex items-center space-x-2">
                <StatusBadge isActive={data.is_active} />
              </div>
            </div>
          </div>

          <div className="px-6 py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-gray-500">
                  <Tag className="w-4 h-4 mr-2" />
                  Role ID
                </label>
                <p className="text-base text-gray-900 font-mono bg-gray-50 px-3 py-2 rounded">
                  #{data.id}
                </p>
              </div>

              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-gray-500">
                  <Tag className="w-4 h-4 mr-2" />
                  Slug
                </label>
                <p className="text-base text-gray-900 font-mono bg-gray-50 px-3 py-2 rounded">
                  {data.slug}
                </p>
              </div>

              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-gray-500">
                  Default Role
                </label>
                <p className="text-base text-gray-900">
                  {data.is_default ? "Yes" : "No"}
                </p>
              </div>

              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-gray-500">
                  Status
                </label>
                <p className="text-base text-gray-900">
                  <StatusBadge isActive={data.is_active} />
                </p>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="flex items-center text-sm font-medium text-gray-500">
                  <FileText className="w-4 h-4 mr-2" />
                  Description
                </label>
                <p className="text-base text-gray-900 bg-gray-50 px-3 py-2 rounded min-h-[60px]">
                  {data.description || "No description provided"}
                </p>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="flex items-center text-sm font-medium text-gray-500">
                  <Layers className="w-4 h-4 mr-2" />
                  Permissions ({data.permissions?.length || 0})
                </label>
                <div className="bg-gray-50 px-3 py-2 rounded min-h-[60px]">
                  {data.permissions && data.permissions.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {data.permissions.map((perm, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded bg-blue-100 text-blue-800 text-sm"
                        >
                          {perm.name || perm}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No permissions assigned</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
            <button
              onClick={() =>
                navigate(`/admin/roles/edit`, {
                  state: { role: data },
                })
              }
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Edit Role
            </button>
            <button
              onClick={() => navigate("/admin/roles/list")}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewRole;
