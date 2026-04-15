import {
  User,
  Mail,
  Calendar,
  Shield,
  Upload,
  ArrowLeft,
  Save,
  IdCard,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";
import { useUploadPhoto } from "../../api/common/uploadPhoto";
import { useDeleteImage } from "../../api/common/deletePhoto";
import { useUpdateProfile } from "../../api/profile/ProfileUpdate";
import SectionCard from "../../components/common/SectionCard";

// ── Shared input class ────────────────────────────────────
const inputCls =
  "w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors";

// ── EditRow ───────────────────────────────────────────────
const EditRow = ({ label, icon: Icon, children, last }) => (
  <div
    className={`flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-0 py-3 ${!last ? "border-b border-gray-100" : ""}`}
  >
    <div className="flex items-center sm:w-52 shrink-0">
      {Icon && <Icon className="w-3.5 h-3.5 text-gray-400 mr-1.5 shrink-0" />}
      <span className="text-xs sm:text-sm text-gray-500">{label}</span>
    </div>
    <div className="flex-1 sm:ml-2">{children}</div>
  </div>
);



// ── Main ──────────────────────────────────────────────────
const ProfileEditPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const userData = state?.userData;

  const { mutate: uploadPhoto, isPending: isUploading } = useUploadPhoto();
  const { mutate: deleteImage, isPending: isDeleting } = useDeleteImage();
  const { mutate: updateProfile, isPending: isUpdating } = useUpdateProfile();

  const [formData, setFormData] = useState({
    name: userData?.name || "",
    email: userData?.email || "",
    dob: userData?.dob || "",
    aadhaar_number: userData?.aadhaar_number || "",
    aadhaar_status: userData?.aadhaar_status || "pending",
    profile_image: userData?.profile_image || "",
    profile_image_public_id: "",
  });

  const [preview, setPreview] = useState(userData?.profile_image || "");

  if (!userData) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800 text-sm">
          No profile data found.
        </div>
      </div>
    );
  }

  // ── Handlers ─────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    uploadPhoto(file, {
      onSuccess: (res) => {
        setFormData((p) => ({
          ...p,
          profile_image: res?.url,
          profile_image_public_id: res?.public_id,
        }));
      },
      onError: () => {
        toast.error("Upload failed");
        setPreview(userData?.profile_image || "");
      },
    });
  };

  const handleRemoveImage = () => {
    if (!formData.profile_image_public_id) {
      setPreview("");
      setFormData((p) => ({
        ...p,
        profile_image: "",
        profile_image_public_id: "",
      }));
      return;
    }
    deleteImage(formData.profile_image_public_id, {
      onSuccess: () => {
        setPreview("");
        setFormData((p) => ({
          ...p,
          profile_image: "",
          profile_image_public_id: "",
        }));
      },
      onError: () => toast.error("Failed to delete image"),
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfile(
      {
        name: formData.name,
        email: formData.email,
        dob: formData.dob,
        aadhaar_number: formData.aadhaar_number,
        aadhaar_status: formData.aadhaar_status,
        profile_image: formData.profile_image,
      },
      {
        onSuccess: () => {
          toast.success("Profile updated successfully!");
          navigate("/profile");
        },
        onError: (err) => {
          toast.error(err?.response?.data?.message || "Update failed");
        },
      },
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      {/* Back */}
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-4 sm:mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
        <span className="text-sm sm:text-base">Back</span>
      </button>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
        {/* ── Page Header Card ── */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="border-b border-gray-200 p-4 sm:p-6">
            <div className="flex items-center">
              <User className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 mr-2 sm:mr-3 shrink-0" />
              <div>
                <h1 className="text-lg sm:text-2xl font-semibold text-gray-900">
                  Edit Profile
                </h1>
                <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                  Update your account information
                </p>
              </div>
            </div>
          </div>

          {/* Avatar banner */}
          <div className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200">
              {/* Avatar */}
              <div className="relative w-14 h-14 sm:w-16 sm:h-16 shrink-0">
                <div className="w-full h-full rounded-full bg-blue-100 overflow-hidden flex items-center justify-center">
                  {preview ? (
                    <img
                      src={preview}
                      alt="profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-xl font-bold text-blue-600">
                      {formData.name?.charAt(0)?.toUpperCase()}
                    </span>
                  )}
                </div>
                {preview && (
                  <button
                    type="button"
                    disabled={isDeleting}
                    onClick={handleRemoveImage}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs transition-colors disabled:opacity-50"
                  >
                    {isDeleting ? "…" : "✕"}
                  </button>
                )}
              </div>

              {/* Info + upload */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900">
                  {formData.name}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {formData.email}
                </p>
              </div>

              <label
                className={`shrink-0 inline-flex items-center gap-1.5 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  isUploading
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-gray-50 text-gray-700"
                }`}
              >
                <Upload className="w-4 h-4" />
                {isUploading ? "Uploading..." : "Change Photo"}
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  disabled={isUploading}
                  onChange={handleImageUpload}
                />
              </label>
            </div>
          </div>
        </div>

        {/* ── Account Information ── */}
        <SectionCard icon={User} title="Account Information">
          <EditRow label="Full Name" icon={User}>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter full name"
              className={inputCls}
            />
          </EditRow>

          <EditRow label="Email" icon={Mail}>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email"
              className={inputCls}
            />
          </EditRow>

          <EditRow label="Date of Birth" icon={Calendar}>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              className={inputCls}
            />
          </EditRow>

          <EditRow label="Aadhaar Number" icon={IdCard}>
            <input
              value={formData.aadhaar_number}
              onChange={(e) =>
                setFormData((p) => ({
                  ...p,
                  aadhaar_number: e.target.value.replace(/\D/g, ""),
                }))
              }
              maxLength={12}
              placeholder="12-digit Aadhaar number"
              className={inputCls}
            />
          </EditRow>

          <EditRow label="Aadhaar Status" icon={Shield} last>
            <select
              name="aadhaar_status"
              value={formData.aadhaar_status}
              onChange={handleChange}
              className={`${inputCls} appearance-none bg-white`}
            >
              <option value="pending">Pending</option>
              <option value="verified">Verified</option>
              <option value="rejected">Rejected</option>
            </select>
          </EditRow>
        </SectionCard>

        {/* ── Footer Actions ── */}
        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-3 pb-4 sm:pb-6">
          <button
            type="button"
            onClick={() => navigate("/profile")}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isUpdating || isUploading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium flex items-center justify-center gap-2"
          >
            {isUpdating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />{" "}
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" /> Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileEditPage;
