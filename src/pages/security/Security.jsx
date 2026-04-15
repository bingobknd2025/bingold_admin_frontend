import { useState } from "react";
import { AlertCircle } from "lucide-react";
import toast from "react-hot-toast";

import { useChangePassReqOtp } from "../../api/auth/chnagePassReqOtp";
import { useChangePassSubmit } from "../../api/auth/chnagePassSubmit";

import StepIndicator from "./components/StepIndicator";
import SecurityStatsCards from "./components/SecurityStatsCards";
import SuccessView from "./components/SuccessView";
import Step1Panel from "./components/Step1Panel";
import Step2Panel from "./components/Step2Panel";

const STEP_DESCRIPTIONS = {
  1: "Enter your current password to receive a one-time verification code.",
  2: "Enter the OTP sent to your email and set your new password.",
};

export default function SecurityPage() {
  const [step, setStep] = useState(1);
  const [currentPassword, setCurrentPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [timer, setTimer] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const { mutate: changePassReqOtp, isPending } = useChangePassReqOtp();
  const { mutate: changePassSubmit, isPending: isSubmitting } =
    useChangePassSubmit();

  const handleGetOTP = () => {
    setError("");
    if (!currentPassword) {
      setError("Please enter your current password.");
      return;
    }
    changePassReqOtp(
      { oldPassword: currentPassword, method: "EMAIL" },
      {
        onSuccess: () => {
          toast.success("OTP sent to your email");
          setStep(2);
          setOtp("");
        },
        onError: (err) => {
          setError(
            err?.response?.data?.message || err.message || "Failed to send OTP",
          );
        },
      },
    );
  };

  const handleResendOTP = () => {
    setOtp("");
    setTimer(60);
    setError("");
  };

  const handleUpdatePassword = () => {
    setError("");
    if (otp.length < 6) {
      setError("Please enter the full 6-digit OTP.");
      return;
    }
    if (!newPassword) {
      setError("Please enter a new password.");
      return;
    }
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    changePassSubmit(
      { otp, newPassword },
      {
        onSuccess: () => {
          toast.success("Password updated successfully");
          setSuccess(true);
        },
        onError: (err) => {
          setError(
            err?.response?.data?.message ||
              err.message ||
              "Failed to update password",
          );
        },
      },
    );
  };

  const handleReset = () => {
    setSuccess(false);
    setStep(1);
    setCurrentPassword("");
    setOtp("");
    setNewPassword("");
    setConfirmPassword("");
    setError("");
  };

  if (success) return <SuccessView onReset={handleReset} />;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1
          className="text-xl md:text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight"
          data-testid="security-title"
        >
          Security Settings
        </h1>
        <p className="text-slate-600 text-sm mt-1">
          Manage your account security and authentication
        </p>
      </div>

      <SecurityStatsCards />

      <div className="bg-white rounded-xl border border-slate-200 p-6 md:p-8">
        <h2 className="text-xl font-semibold text-slate-900 mb-2">
          Change Password
        </h2>
        <p className="text-sm text-slate-500 mb-6">{STEP_DESCRIPTIONS[step]}</p>

        <StepIndicator currentStep={step} />

        {error && (
          <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-4">
            <AlertCircle
              className="text-red-500 flex-shrink-0 mt-0.5"
              size={16}
            />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <div className="max-w-sm mx-auto">
          {step === 1 && (
            <Step1Panel
              currentPassword={currentPassword}
              onChange={setCurrentPassword}
              onSubmit={handleGetOTP}
              isPending={isPending}
            />
          )}
        </div>

        {step === 2 && (
          <Step2Panel
            otp={otp}
            onOtpChange={setOtp}
            newPassword={newPassword}
            onNewPasswordChange={setNewPassword}
            confirmPassword={confirmPassword}
            onConfirmPasswordChange={setConfirmPassword}
            timer={timer}
            onSubmit={handleUpdatePassword}
            onResend={handleResendOTP}
            isPending={isSubmitting}
            onBack={() => {
              setStep(1);
              setError("");
              setOtp("");
            }}
          />
        )}
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3">
        <AlertCircle className="text-amber-600 flex-shrink-0" size={20} />
        <div>
          <h3 className="text-sm font-semibold text-amber-900">Security Tip</h3>
          <p className="text-sm text-amber-700 mt-1">
            Use a strong password with a combination of letters, numbers, and
            special characters. Change your password regularly for better
            security.
          </p>
        </div>
      </div>
    </div>
  );
}
