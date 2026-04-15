import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Shield,
  Tag,
  FileText,
  Save,
  X,
  AlertCircle,
} from "lucide-react";

import { useUpdateRole } from "../../../api/administrator/role/updateRole";
import toast from "react-hot-toast";

const EditRole = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const role = location.state?.role;

  const { mutate: updateRole, isPending, isError, error } = useUpdateRole();

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    roleId: null,
    is_active: true,
    is_default: false,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (role) {
      setFormData({
        name: role.name || "",
        slug: role.slug || "",
        description: role.description || "",
        roleId: role.id,
        is_active: role.is_active ?? true,
        is_default: role.is_default ?? false,
      });
    }
  }, [role]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Role name is required";
    }

    if (!formData.slug.trim()) {
      newErrors.slug = "Slug is required";
    } else if (!/^[a-z0-9-_.]+$/.test(formData.slug)) {
      newErrors.slug =
        "Slug can only contain lowercase letters, numbers, dot, hyphens, and underscores";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    updateRole(formData, {
      onSuccess: () => {
        toast.success("Role updated successfully!");
        navigate("/admin/roles/list");
      },
      onError: (error) => {
        setErrors({
          toast: error.response?.data?.message || "Failed to update role",
          // submit: error.response?.data?.message || "Failed to update role",
        });
      },
    });
  };

  const handleCancel = () => {
    navigate("/admin/roles/list");
  };

  if (!role) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">No role data found</p>
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
            onClick={handleCancel}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Roles
          </button>
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Edit Role</h2>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center space-x-3">
                <Shield className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Role Information
                </h2>
              </div>
            </div>

            <div className="px-6 py-6">
              {errors.submit && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
                  <AlertCircle className="w-5 h-5 text-red-600 mr-3 mt-0.5" />
                  <p className="text-sm text-red-700">{errors.submit}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <Tag className="w-4 h-4 mr-2" />
                    Role Name <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.name ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter role name"
                  />
                  {errors.name && (
                    <p className="text-sm text-red-600">{errors.name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <Tag className="w-4 h-4 mr-2" />
                    Slug <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono ${
                      errors.slug ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="role-slug"
                  />
                  {errors.slug && (
                    <p className="text-sm text-red-600">{errors.slug}</p>
                  )}
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <FileText className="w-4 h-4 mr-2" />
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter role description"
                  />
                </div>

                <div className="space-y-3">
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    Settings
                  </label>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="is_active"
                        checked={formData.is_active}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        Active Role
                      </span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="is_default"
                        checked={formData.is_default}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        Default Role
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleCancel}
                disabled={isPending}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4 mr-2" />
                {isPending ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditRole;
