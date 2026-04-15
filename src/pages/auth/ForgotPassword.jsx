import { Mail, KeyRound, ScanLine } from "lucide-react";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { useForgotPassword } from "../../api/auth/forgotPassword";
import { useVerifyAuthenticatorCode } from "../../api/auth/verifyAuthenticatorCode";
import OtpInput from "../../components/common/OtpInput";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [showOtpInput, setShowOtpInput] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const isPassword = location.pathname.includes("password");

  const { mutate: forgotPassword, isPending: isSendingEmail } =
    useForgotPassword();

  const { mutate: verifyOtp, isPending: isVerifyingOtp } =
    useVerifyAuthenticatorCode();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Email is required");
      return;
    }

    forgotPassword(
      { email },
      {
        onSuccess: () => {
          sessionStorage.setItem("reset_session", JSON.stringify({ email }));
          toast.success("Reset OTP sent to your email");
          setShowOtpInput(true);
        },
        onError: (error) => {
          toast.error(
            error?.response?.data?.message ||
              error?.message ||
              "Something went wrong",
          );
        },
      },
    );
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();

    const otpValue = otp.join("");

    if (otpValue.length !== 6) {
      toast.error("Please enter complete OTP");
      return;
    }

    const payload = {
      email,
      otp: otpValue,
      type: "FORGOT_PASSWORD",
      method: "EMAIL",
    };

    verifyOtp(payload, {
      onSuccess: (data) => {
        toast.success("OTP verified successfully");

        const token = data?.data?.accessToken;

        if (isPassword) {
          sessionStorage.setItem("reset_token", token);
          navigate("/reset-password", { replace: true });
        } else {
          sessionStorage.setItem("reset_auth_token", token);
          navigate("/reset-authenticator", { replace: true });
        }
      },
      onError: (error) => {
        toast.error(
          error?.response?.data?.message || error?.message || "Invalid OTP",
        );
      },
    });
  };

  const handleResendOtp = () => {
    forgotPassword(
      { email },
      {
        onSuccess: () => {
          toast.success("OTP resent successfully");
          setOtp(["", "", "", "", "", ""]);
        },
        onError: (error) => {
          toast.error(error?.response?.data?.message || "Failed to resend OTP");
        },
      },
    );
  };

  const handleBackToEmail = () => {
    setShowOtpInput(false);
    setOtp(["", "", "", "", "", ""]);
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-4">
            {isPassword ? (
              <KeyRound className="text-white" size={32} />
            ) : (
              <ScanLine className="text-white" size={32} />
            )}
          </div>

          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-2">
            {showOtpInput
              ? "Verify OTP"
              : isPassword
                ? "Forgot Password"
                : "Forgot Authenticator"}
          </h1>

          <p className="text-slate-600">
            {showOtpInput
              ? `Enter the 6-digit code sent to ${email}`
              : "Enter your registered email to receive a reset OTP"}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          {!showOtpInput ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-slate-700 mb-2"
                >
                  Email Address
                </label>

                <div className="relative">
                  <Mail
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={20}
                  />

                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="admin@fleetmanager.com"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSendingEmail}
                className="w-full bg-primary hover:bg-primary-dark text-white font-medium py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSendingEmail ? "Sending..." : "Send Reset OTP"}
              </button>
            </form>
          ) : (
            <OtpInput
              otp={otp}
              setOtp={setOtp}
              email={email}
              onVerify={handleVerifyOtp}
              onResend={handleResendOtp}
              onBack={handleBackToEmail}
              isVerifying={isVerifyingOtp}
              isResending={isSendingEmail}
            />
          )}

          {!showOtpInput && (
            <div className="mt-6 text-center">
              <button
                onClick={() => navigate("/login")}
                className="text-sm text-primary hover:text-primary-dark font-medium"
              >
                Back to Login
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
