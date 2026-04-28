import {
  User,
  Mail,
  Shield,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  Edit2,
  Key,
  Hash,
  IdCard,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useProfile } from "../../api/profile/Profile";
import InfoRow from "../../components/common/InfoRow";
import SectionCard from "../../components/common/SectionCard";
import { formatDate, formatDateOnly } from "../../helper/helper";

const Profile = () => {
  const navigate = useNavigate();
  const { data: userData, isLoading, isError } = useProfile();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
          <p className="mt-4 text-gray-600 text-sm">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (isError || !userData) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800 text-sm">
          Failed to load profile data.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="space-y-4 sm:space-y-5">
        {/* ── Banner ── */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="border-b border-gray-200 p-4 sm:p-6">
            <div className="flex items-center">
              <User className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 mr-2 sm:mr-3 shrink-0" />
              <div>
                <h1 className="text-lg sm:text-2xl font-semibold text-gray-900">
                  Profile
                </h1>
                <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                  Manage your account information
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200">
              {/* Avatar */}
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-blue-100 flex items-center justify-center shrink-0 overflow-hidden">
                {userData.profile_image ? (
                  <img
                    src={userData.profile_image}
                    alt={userData.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-xl sm:text-2xl font-bold text-blue-600">
                    {userData.name?.charAt(0)?.toUpperCase()}
                  </span>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                  {userData.name}
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 truncate mt-0.5">
                  {userData.email}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {userData.role_detail?.name}
                </p>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                {/* Active Status */}
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                    userData.is_active
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {userData.is_active ? (
                    <>
                      <CheckCircle className="w-3.5 h-3.5" />
                      Active
                    </>
                  ) : (
                    <>
                      <XCircle className="w-3.5 h-3.5" />
                      Inactive
                    </>
                  )}
                </span>

                {/* 2FA */}
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                    userData.otp_enabled
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  <Key className="w-3.5 h-3.5" />
                  {userData.otp_enabled ? "2FA On" : "2FA Off"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Account Information ── */}
        <SectionCard icon={User} title="Account Information">
          <InfoRow label="User ID" value={`#${userData.id}`} icon={Hash} />
          <InfoRow label="Full Name" value={userData.name} icon={User} />
          <InfoRow label="Email" value={userData.email} icon={Mail} />
          <InfoRow
            label="Role"
            value={userData.role_detail?.name}
            icon={Shield}
          />

          {/* NEW FIELDS */}
          <InfoRow
            label="Date of Birth"
            value={formatDateOnly(userData.dob)}
            icon={Calendar}
          />

          <InfoRow
            label="Aadhaar Number"
            value={
              userData.aadhaar_number
                ? `XXXX-XXXX-${userData.aadhaar_number.slice(-4)}`
                : "—"
            }
            icon={IdCard}
          />

          {/* Aadhaar Status */}
          <div className="flex flex-col sm:flex-row sm:items-start py-3 border-b border-gray-100">
            <div className="flex items-center sm:w-52 shrink-0">
              <Shield className="w-3.5 h-3.5 text-gray-400 mr-1.5" />
              <span className="text-xs sm:text-sm text-gray-500">
                Aadhaar Status
              </span>
            </div>

            <div className="sm:ml-2">
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                  userData.aadhaar_status === "verified"
                    ? "bg-green-100 text-green-700"
                    : userData.aadhaar_status === "rejected"
                    ? "bg-red-100 text-red-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {userData.aadhaar_status === "verified" && (
                  <CheckCircle className="w-3.5 h-3.5" />
                )}
                {userData.aadhaar_status === "rejected" && (
                  <XCircle className="w-3.5 h-3.5" />
                )}
                {userData.aadhaar_status === "pending" && (
                  <Clock className="w-3.5 h-3.5" />
                )}

                {userData.aadhaar_status}
              </span>
            </div>
          </div>

          {/* Existing Fields */}
          <InfoRow
            label="Last Login"
            value={formatDate(userData.last_login_at)}
            icon={Clock}
          />
          <InfoRow
            label="Created At"
            value={formatDate(userData.created_at)}
            icon={Calendar}
          />

          {/* Account Status */}
          <div className="flex flex-col sm:flex-row sm:items-start py-3 border-b border-gray-100">
            <div className="flex items-center sm:w-52 shrink-0">
              <CheckCircle className="w-3.5 h-3.5 text-gray-400 mr-1.5" />
              <span className="text-xs sm:text-sm text-gray-500">
                Account Status
              </span>
            </div>

            <div className="sm:ml-2">
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                  userData.is_active
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {userData.is_active ? (
                  <>
                    <CheckCircle className="w-3.5 h-3.5" />
                    Active
                  </>
                ) : (
                  <>
                    <XCircle className="w-3.5 h-3.5" />
                    Inactive
                  </>
                )}
              </span>
            </div>
          </div>
        </SectionCard>

        {/* Footer */}
        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3">
          <button
            onClick={() => navigate("/security")}
            className="px-6 py-2 border border-gray-300 rounded-lg text-sm"
          >
            Change Password
          </button>
          <button
            onClick={() =>
              navigate("/profile/edit", { state: { userData } })
            }
            className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm"
          >
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;