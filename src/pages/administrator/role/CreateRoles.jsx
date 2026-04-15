import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Shield, Tag, FileText, X } from "lucide-react";
import toast from "react-hot-toast";
import { useCreateRole } from "../../../api/administrator/role/createRole";

const CreateRole = () => {
  const navigate = useNavigate();
  const { mutate: createRole, isPending } = useCreateRole();
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    is_default: false,
    is_active: true,
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleToggle = (field) => {
    setFormData((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Role name is required";
    if (!formData.slug.trim()) newErrors.slug = "Slug is required";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});

    const submitData = {
      ...formData,
      description:
        formData.description.trim() === "" ? null : formData.description,
    };

    createRole(submitData, {
      onSuccess: () => {
        toast.success("Role created successfully!");
        navigate("/admin/roles/list");
      },
      onError: (error) => {
        toast.error(
          error?.response?.data?.message ||
            error?.message ||
            "Failed to create role",
        );
      },
    });
  };

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
          <h2 className="text-xl font-semibold text-gray-800">Create Role</h2>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center space-x-3">
              <Shield className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">
                Role Details
              </h2>
            </div>
          </div>

          <div className="px-6 py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Role Name */}
              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-gray-700">
                  <Tag className="w-4 h-4 mr-2" />
                  Role Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter role name"
                />
                {errors.name && (
                  <p className="text-xs text-red-500">{errors.name}</p>
                )}
              </div>

              {/* Slug */}
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
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-mono ${
                    errors.slug ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="e.g., sub_admin"
                />
                {errors.slug && (
                  <p className="text-xs text-red-500">{errors.slug}</p>
                )}
              </div>

              {/* Description */}
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
                  placeholder="Enter role description (optional)"
                />
              </div>

              {/* Toggle Switches */}
              <div className="md:col-span-2 border-t border-gray-200 pt-6 mt-2">
                <h3 className="text-sm font-semibold text-gray-700 mb-4">
                  Role Settings
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Is Active Toggle */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex-1">
                      <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                        Active Status
                      </label>
                      <p className="text-xs text-gray-500">
                        {formData.is_active
                          ? "Role is active and can be assigned"
                          : "Role is inactive and cannot be assigned"}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleToggle("is_active")}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                        formData.is_active ? "bg-blue-600" : "bg-gray-300"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          formData.is_active ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate("/admin/roles/list")}
              className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isPending}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? "Creating..." : "Create Role"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateRole;