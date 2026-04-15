import { KeyRound, Eye, EyeOff, Lock, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useResetPassword } from "../../api/auth/resetPassword";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { mutate: resetPassword, isPending, isError } = useResetPassword();

  const validatePassword = () => {
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return false;
    }

    if (!/(?=.*[a-z])(?=.*[A-Z])/.test(newPassword)) {
      toast.error("Password must contain both uppercase and lowercase letters");
      return false;
    }

    if (!/(?=.*\d)/.test(newPassword)) {
      toast.error("Password must contain at least one number");
      return false;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return false;
    }

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validatePassword()) return;

    const resetToken = sessionStorage.getItem("reset_token");

    if (!resetToken) {
      toast.error("Session expired. Please try again.");
      navigate("/forgot-password", { replace: true });
      return;
    }

    resetPassword(
      {
        token: resetToken,
        newPassword,
      },
      {
        onSuccess: () => {
          toast.success("Password reset successfully!");

          sessionStorage.removeItem("reset_session");
          sessionStorage.removeItem("reset_token");

          navigate("/login", { replace: true });
        },
        onError: (error) => {
          toast.error(
            error?.response?.data?.message || "Failed to reset password",
          );
        },
      },
    );
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-4">
            <KeyRound className="text-white" size={32} />
          </div>

          <h1 className="text-2xl md:text-2xl lg:text-3xl font-bold text-slate-900 mb-2">
            Reset Password
          </h1>

          <p className="text-slate-600">
            Create a strong password for your account
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* New Password Field */}
            <div>
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                New Password
              </label>

              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={20}
                />

                <input
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full pl-11 pr-12 py-3 border border-slate-300 rounded-lg
                  focus:ring-2 focus:ring-blue-500 focus:border-transparent
                  transition-all"
                  placeholder="Enter new password"
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Confirm Password
              </label>

              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={20}
                />

                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-11 pr-12 py-3 border border-slate-300 rounded-lg
                  focus:ring-2 focus:ring-blue-500 focus:border-transparent
                  transition-all"
                  placeholder="Confirm new password"
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>

              {/* Password Match Indicator */}
              {confirmPassword && (
                <div className="mt-2">
                  {newPassword === confirmPassword ? (
                    <div className="flex items-center gap-2 text-green-600 text-sm">
                      <CheckCircle2 size={16} />
                      <span>Passwords match</span>
                    </div>
                  ) : (
                    <div className="text-red-600 text-sm">
                      Passwords do not match
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Password Requirements */}
            <div className="bg-slate-50 rounded-lg p-4">
              <p className="text-sm font-medium text-slate-700 mb-2">
                Password must contain:
              </p>
              <ul className="space-y-1 text-xs text-slate-600">
                <li className="flex items-center gap-2">
                  <div
                    className={`w-1.5 h-1.5 rounded-full ${newPassword.length >= 8 ? "bg-green-500" : "bg-slate-300"}`}
                  />
                  At least 8 characters
                </li>
                <li className="flex items-center gap-2">
                  <div
                    className={`w-1.5 h-1.5 rounded-full ${/(?=.*[a-z])(?=.*[A-Z])/.test(newPassword) ? "bg-green-500" : "bg-slate-300"}`}
                  />
                  Uppercase and lowercase letters
                </li>
                <li className="flex items-center gap-2">
                  <div
                    className={`w-1.5 h-1.5 rounded-full ${/\d/.test(newPassword) ? "bg-green-500" : "bg-slate-300"}`}
                  />
                  At least one number
                </li>
                <li className="flex items-center gap-2">
                  <div
                    className={`w-1.5 h-1.5 rounded-full ${/[!@#$%^&*(),.?":{}|<>]/.test(newPassword) ? "bg-green-500" : "bg-slate-300"}`}
                  />
                  Special character (recommended)
                </li>
              </ul>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary-dark text-white font-medium py-3 rounded-lg transition-all active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Resetting Password..." : "Reset Password"}
            </button>
          </form>

          {/* Back to Login */}
          <div className="mt-6 text-center">
            <button
              onClick={() => navigate("/login")}
              className="text-sm text-primary hover:text-primary-dark font-medium"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
