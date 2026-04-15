import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Shield,
  Tag,
  Layers,
  FileText,
} from "lucide-react";
import { useViewPermission } from "../../../api/administrator/permission/viewPermission";
import TextStatusBadge from "../../../components/common/TextStatusBadge";
import StatusBadge from "../../../components/common/StatusBadge";

const ViewPermission = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { permission } = location.state || {};

  const {
    data: permissionData,
    isLoading,
    isError,
    error,
  } = useViewPermission(permission.id);

  if (!permissionData && isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">No permission data found</p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back
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
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </button>
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Permissions</h2>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Shield className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900">
                  {permissionData.data.name}
                </h2>
              </div>
              <div className="flex items-center space-x-2">
                <StatusBadge
                  status={permissionData.data.is_active ? "Active" : "Inactive"}
                />
              </div>
            </div>
          </div>

          <div className="px-6 py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-gray-500">
                  <Tag className="w-4 h-4 mr-2" />
                  Permission ID
                </label>
                <p className="text-base text-gray-900 font-mono bg-gray-50 px-3 py-2 rounded">
                  #{permissionData.data.id}
                </p>
              </div>

              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-gray-500">
                  <Tag className="w-4 h-4 mr-2" />
                  Slug
                </label>
                <p className="text-base text-gray-900 font-mono bg-gray-50 px-3 py-2 rounded">
                  {permissionData.data.slug}
                </p>
              </div>

              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-gray-500">
                  <Layers className="w-4 h-4 mr-2" />
                  Module
                </label>
                <p className="text-base text-gray-900 bg-blue-50 px-3 py-2 rounded inline-block">
                  {permissionData.data.module}
                </p>
              </div>

              <div className="space-y-2">
                <TextStatusBadge
                  status={permissionData.data.is_active ? "Active" : "Inactive"}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="flex items-center text-sm font-medium text-gray-500">
                  <FileText className="w-4 h-4 mr-2" />
                  Description
                </label>
                <p className="text-base text-gray-900 bg-gray-50 px-3 py-2 rounded min-h-[60px]">
                  {permissionData.data.description || "No description provided"}
                </p>
              </div>
            </div>
          </div>

          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
            <button
              onClick={() =>
                navigate(`/admin/permissions/edit`, {
                  state: { permission },
                })
              }
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Edit Permission
            </button>
            <button
              onClick={() => navigate(-1)}
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

export default ViewPermission;
