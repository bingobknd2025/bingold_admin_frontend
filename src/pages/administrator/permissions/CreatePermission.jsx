import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Shield,
  Tag,
  Layers,
  FileText,
  Save,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import { useCreatePermission } from "../../../api/administrator/permission/createPermission";

const CreatePermission = () => {
  const navigate = useNavigate();
  const { mutate, isPending } = useCreatePermission();

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    module: "",
    description: "",
  });

  const [errors, setErrors] = useState({});

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Remove error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Validation Function
  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Permission name is required";
    }

    if (!formData.slug.trim()) {
      newErrors.slug = "Slug is required";
    }

    if (!formData.module.trim()) {
      newErrors.module = "Module is required";
    }

    return newErrors;
  };

  // Submit Handler
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

    mutate(submitData, {
      onSuccess: () => {
        toast.success("Permission created successfully!");
        navigate("/admin/permissions/list");
      },
      onError: (error) => {
        toast.error(
          error?.response?.data?.message ||
            error?.message ||
            "Failed to create permission",
        );
      },
    });
  };

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

          <h2 className="text-xl font-semibold text-gray-800">
            Create Permission
          </h2>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center space-x-3">
                <Shield className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Permission Details
                </h2>
              </div>
            </div>

            <div className="px-6 py-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
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
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${
                      errors.name ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter permission name"
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
                    placeholder="e.g., dashboards.view"
                  />
                  {errors.slug && (
                    <p className="text-xs text-red-500">{errors.slug}</p>
                  )}
                </div>

                {/* Module */}
                <div className="space-y-2 md:col-span-2">
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <Layers className="w-4 h-4 mr-2" />
                    Module *
                  </label>
                  <input
                    type="text"
                    name="module"
                    value={formData.module}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${
                      errors.module ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter module name"
                  />
                  {errors.module && (
                    <p className="text-xs text-red-500">{errors.module}</p>
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
                    placeholder="Enter permission description (optional)"
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </button>

              <button
                type="submit"
                disabled={isPending}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4 mr-2" />
                {isPending ? "Creating..." : "Create Permission"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePermission;
