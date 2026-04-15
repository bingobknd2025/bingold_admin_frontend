import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Mail,
  Calendar,
  CreditCard,
  Shield,
  Clock,
  User,
  CheckCircle,
  Edit,
  Hash,
} from "lucide-react";
import { formatDate } from "../../../helper/helper";
import InfoRow from "../../../components/common/InfoRow";
import SectionCard from "../../../components/common/SectionCard";
import StatusBadge from "../../../components/common/StatusBadge";
import AadhaarStatusBadge from "../../../components/common/AadhaarStatusBadge";

const ViewUser = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = location.state?.user;

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800 text-sm">
          No user data available
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-4 sm:mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
        <span className="text-sm sm:text-base">Back to Users</span>
      </button>

      <div className="space-y-4 sm:space-y-5">
        {/* ── Profile Banner ── */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="border-b border-gray-200 p-4 sm:p-6">
            <div className="flex items-center">
              <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 mr-2 sm:mr-3 shrink-0" />
              <h1 className="text-lg sm:text-2xl font-semibold text-gray-900">
                User Details
              </h1>
            </div>
          </div>
          <div className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200">
              {/* Avatar */}
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-blue-100 flex items-center justify-center shrink-0 overflow-hidden">
                {user.profile_image ? (
                  <img
                    src={user.profile_image}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-xl sm:text-2xl font-bold text-blue-600">
                    {user.name?.charAt(0)?.toUpperCase()}
                  </span>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                  {user.name}
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 truncate mt-0.5">
                  {user.email}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {user.user_role?.name || "No Role Assigned"}
                </p>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <StatusBadge isActive={user.is_active} />
              </div>
            </div>
          </div>
        </div>

        {/* ── Basic Information ── */}
        <SectionCard icon={User} title="Basic Information">
          <InfoRow label="User ID" value={`#${user.id}`} icon={Hash} />
          <InfoRow label="Full Name" value={user.name} icon={User} />
          <InfoRow label="Email" value={user.email} icon={Mail} />
          <InfoRow
            label="Date of Birth"
            value={formatDate(user.dob)}
            icon={Calendar}
          />
          <InfoRow
            label="Role"
            value={user.user_role?.name || "No Role"}
            icon={Shield}
          />
        </SectionCard>

        {/* ── Account Details ── */}
        <SectionCard icon={CreditCard} title="Account Details">
          <InfoRow
            label="Aadhaar Number"
            value={user.aadhaar_number}
            icon={CreditCard}
          />

          {/* Aadhaar Status */}
          <div className="flex flex-col sm:flex-row sm:items-start py-3 border-b border-gray-100 gap-0.5 sm:gap-0">
            <div className="flex items-center sm:w-48 shrink-0">
              <CheckCircle className="w-3.5 h-3.5 text-gray-400 mr-1.5 shrink-0" />
              <span className="text-xs sm:text-sm text-gray-500">
                Aadhaar Status
              </span>
            </div>
            <div className="sm:ml-2">
              <AadhaarStatusBadge status={user.aadhaar_status} />
            </div>
          </div>

          {/* OTP Enabled */}
          <div className="flex flex-col sm:flex-row sm:items-start py-3 border-b border-gray-100 gap-0.5 sm:gap-0">
            <div className="flex items-center sm:w-48 shrink-0">
              <Shield className="w-3.5 h-3.5 text-gray-400 mr-1.5 shrink-0" />
              <span className="text-xs sm:text-sm text-gray-500">
                OTP Enabled
              </span>
            </div>
            <div className="sm:ml-2">
              <span
                className={`text-xs sm:text-sm font-medium ${
                  user.otp_enabled ? "text-green-600" : "text-red-600"
                }`}
              >
                {user.otp_enabled ? "Yes" : "No"}
              </span>
            </div>
          </div>

          <InfoRow
            label="Last Login"
            value={formatDate(user.last_login_at)}
            icon={Clock}
          />
        </SectionCard>

        {/* ── Footer Actions ── */}
        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-3 pb-4 sm:pb-6">
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
          >
            Close
          </button>
          <button
            onClick={() => navigate("/admin/users/edit", { state: { user } })}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center justify-center gap-2"
          >
            <Edit className="w-4 h-4" />
            Edit User
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewUser;
