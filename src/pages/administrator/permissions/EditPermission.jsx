import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import {
  ArrowLeft,
  Shield,
  Tag,
  Layers,
  FileText,
  Save,
  X,
} from "lucide-react";
import { updatePermission } from "../../../api/administrator/permission/updatePermission";

const EditPermission = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { permission } = location.state || {};

  const [formData, setFormData] = useState({
    id: permission?.id || "",
    name: permission?.name || "",
    slug: permission?.slug || "",
    module: permission?.module || "",
    description: permission?.description || "",
    is_active: permission?.is_active || false,
  });

  const mutation = useMutation({
    mutationFn: updatePermission,
    onSuccess: (data) => {
      toast.success("Permission updated successfully!");
      navigate("/admin/permissions/list");
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to update permission"
      );
    },
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  if (!permission) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">No permission data found</p>
          <button
            onClick={() => navigate("/admin/permissions/list")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Permissions
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
            Back to Permissions
          </button>
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              Edit Permission
            </h2>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center space-x-3">
                <Shield className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Edit Permission Details
                </h2>
              </div>
            </div>

            <div className="px-6 py-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <Tag className="w-4 h-4 mr-2" />
                    Permission Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="Enter permission name"
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <Tag className="w-4 h-4 mr-2" />
                    Slug *
                  </label>
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-mono"
                    placeholder="e.g., dashboards.view"
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <Layers className="w-4 h-4 mr-2" />
                    Module *
                  </label>
                  <input
                    type="text"
                    name="module"
                    value={formData.module}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="Enter module name"
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <div className="flex items-center space-x-3 h-[42px]">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="is_active"
                        checked={formData.is_active}
                        onChange={handleChange}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Active</span>
                    </label>
                  </div>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <FileText className="w-4 h-4 mr-2" />
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="4"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
                    placeholder="Enter permission description"
                  />
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => navigate(-1)}
                disabled={mutation.isPending}
                className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </button>
              <button
                type="submit"
                disabled={mutation.isPending}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4 mr-2" />
                {mutation.isPending ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPermission;
