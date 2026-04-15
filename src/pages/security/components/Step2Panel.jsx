import {
  ArrowRight,
  Lock,
  RotateCcw,
  AlertCircle,
  CheckCircle,
} from "lucide-react"; 
import PasswordInput from "./Passwordinput";

export default function Step2Panel({
  otp,
  onOtpChange,
  newPassword,
  onNewPasswordChange,
  confirmPassword,
  onConfirmPasswordChange,
  timer,
  onSubmit,
  onResend,
  onBack,
}) {
  const passwordsMatch =
    confirmPassword.length > 0 && newPassword === confirmPassword;
  const passwordsMismatch =
    confirmPassword.length > 0 && newPassword !== confirmPassword;
  const isDisabled =
    otp.length < 6 || !newPassword || !confirmPassword || passwordsMismatch;

  return (
    <div className="max-w-sm mx-auto">
      {/* OTP section */}
      <div className="flex items-center justify-center gap-2 mb-1">
        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
          <Lock className="text-blue-600" size={14} />
        </div>
        <span className="text-sm text-slate-600">Check your email</span>
      </div>
      <div className="space-y-4">
        <label
          htmlFor="new-password"
          className="block text-sm font-medium text-slate-700 mb-2 "
        >
          OTP
        </label>
        <input
          type="text"
          value={otp}
          onChange={(e) => onOtpChange(e.target.value)}
          placeholder="Enter OTP"
          maxLength={6}
          className="w-full px-4 py-3 mb-3 pr-12 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
        />
      </div>

      {/* New password */}
      <div className="space-y-4">
        <div>
          <label
            htmlFor="new-password"
            className="block text-sm font-medium text-slate-700 mb-2"
          >
            New Password
          </label>
          <PasswordInput
            id="new-password"
            value={newPassword}
            onChange={(e) => onNewPasswordChange(e.target.value)}
            placeholder="Enter new password"
          />
        </div>

        {/* Confirm password */}
        <div>
          <label
            htmlFor="confirm-password"
            className="block text-sm font-medium text-slate-700 mb-2"
          >
            Confirm New Password
          </label>
          <div className="relative">
            <PasswordInput
              id="confirm-password"
              value={confirmPassword}
              onChange={(e) => onConfirmPasswordChange(e.target.value)}
              placeholder="Re-enter new password"
            />
            {passwordsMatch && (
              <CheckCircle
                className="absolute right-10 top-1/2 -translate-y-1/2 text-emerald-500 pointer-events-none"
                size={16}
              />
            )}
          </div>
          {passwordsMismatch && (
            <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
              <AlertCircle size={12} /> Passwords do not match
            </p>
          )}
          {passwordsMatch && (
            <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
              <CheckCircle size={12} /> Passwords match
            </p>
          )}
        </div>

        <button
          onClick={onSubmit}
          disabled={isDisabled}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-medium px-6 py-3 rounded-lg transition-all flex items-center justify-center gap-2"
        >
          Update Password <ArrowRight size={16} />
        </button>

        <button
          onClick={onBack}
          className="w-full text-xs text-slate-400 hover:text-slate-600 underline text-center"
        >
          ← Go back
        </button>
      </div>
    </div>
  );
}
