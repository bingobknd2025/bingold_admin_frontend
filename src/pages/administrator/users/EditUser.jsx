import {
  ArrowLeft,
  Edit,
  User,
  Mail,
  Lock,
  UserCircle,
  Eye,
  EyeOff,
  Shield,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useUpdateUser } from "../../../api/administrator/user/updateUser";
import { useListAllRoles } from "../../../api/administrator/role/listAllRoles";
import { useSelector } from "react-redux";

const EditUser = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = location.state?.user;
  const { mutate: updateUser, isPending } = useUpdateUser();

  const { data: rolesResponse, isLoading: rolesLoading } = useListAllRoles({
    page: 1,
    limit: 100,
  });

  const permissionModule = useSelector((state) => state.permission.permissions);
  const hasModule = (slugName) =>
    permissionModule?.some(
      (p) => p.slug?.toLowerCase() === slugName.toLowerCase(),
    );

  const roles = rolesResponse?.roles || rolesResponse?.data?.roles || [];
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role_id: user?.user_role?.id || "",
    is_active: true,
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        password: "",
        role_id: user.user_role?.id || "",
        is_active: user.is_active ?? true,
      });
    }
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800 text-sm">
          No user data available
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.role_id) {
      toast.error("Please select a role");
      return;
    }
    updateUser(
      {
        id: user.id,
        name: formData.name,
        email: formData.email,
        role_id: formData.role_id,
        is_active: formData.is_active,
        password: formData.password,
      },
      {
        onSuccess: () => {
          toast.success("User updated successfully!");
          navigate("/admin/users/list");
        },
        onError: (err) => {
          toast.error(
            err?.response?.data?.message ||
              err.message ||
              "Failed to update user",
          );
        },
      },
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      {/* Back Button */}
      <button
        onClick={() => navigate("/admin/users/list")}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-4 sm:mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
        <span className="text-sm sm:text-base">Back to Users</span>
      </button>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Header */}
        <div className="border-b border-gray-200 p-4 sm:p-6">
          <div className="flex items-center">
            <Edit className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 mr-2 sm:mr-3 shrink-0" />
            <div>
              <h1 className="text-lg sm:text-2xl font-semibold text-gray-900">
                Edit User
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                Update details for{" "}
                <span className="font-medium text-gray-700">{user.name}</span>
              </p>
            </div>
          </div>
        </div>

        {/* User Preview Banner */}
        <div className="px-4 sm:px-6 pt-4 sm:pt-6">
          <div className="flex items-center gap-3 p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
              <User className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {user.name}
              </p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>
            <span
              className={`shrink-0 px-2.5 py-1 rounded-full text-xs font-medium ${
                user.is_active
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {user.is_active ? "Active" : "Inactive"}
            </span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="p-4 sm:p-6 space-y-4 sm:space-y-5">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter full name"
                  className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email address"
                  className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                />
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                New Password{" "}
                <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Leave blank to keep current password"
                  className="w-full pl-9 pr-10 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Role */}
            {hasModule("user.assign.role") && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Role <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <UserCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  <select
                    name="role_id"
                    value={formData.role_id}
                    onChange={handleChange}
                    disabled={rolesLoading}
                    className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:opacity-50 disabled:cursor-not-allowed appearance-none"
                  >
                    <option value="">
                      {rolesLoading ? "Loading roles..." : "Select a role"}
                    </option>
                    {roles.map((role) => (
                      <option key={role.id} value={role.id}>
                        {role.name}
                      </option>
                    ))}
                  </select>
                </div>
                {!rolesLoading && roles.length === 0 && (
                  <p className="text-xs text-red-500 mt-1.5">No roles found</p>
                )}
              </div>
            )}

            {/* Is Active Toggle */}
            {hasModule("user.change-status") && (
              <div className="flex items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      is_active: !prev.is_active,
                    }))
                  }
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    formData.is_active ? "bg-blue-600" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                      formData.is_active ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
                <label
                  className="text-sm font-medium text-gray-700 cursor-pointer select-none"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      is_active: !prev.is_active,
                    }))
                  }
                >
                  Active User
                </label>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    formData.is_active
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {formData.is_active ? "Active" : "Inactive"}
                </span>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 px-4 sm:px-6 py-4 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate("/admin/users/list")}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending || !formData.role_id}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium flex items-center justify-center gap-2"
            >
              {isPending && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
              )}
              {isPending ? "Updating..." : "Update User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUser;
