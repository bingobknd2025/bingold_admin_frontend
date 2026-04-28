import { SquarePen } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useVerifyAuthenticatorCode } from "../../api/auth/verifyAuthenticatorCode";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import OtpInput from "../../components/common/OtpInput";

export default function OtpVerify() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  const navigate = useNavigate();
  const {
    mutate: verifyOtp,
    isPending: loading,
    isError,
    error,
  } = useVerifyAuthenticatorCode();

  const reduxModule = useSelector((state) => state.permission.modules);

  const hasModule = (moduleName) => {
    return reduxModule?.some(
      (module) => module.toLowerCase() === moduleName.toLowerCase(),
    );
  };

  const otpSession = JSON.parse(sessionStorage.getItem("otp_session"));
  const email = otpSession?.email;

  function handleVerify(e) {
    e.preventDefault();

    const code = otp.join("");

    // Validate OTP length
    if (code.length !== 6) {
      toast.error("Please enter complete 6-digit OTP");
      return;
    }

    verifyOtp(
      { email, otp: code, type: "LOGIN", method: "TOTP" },
      {
        onSuccess: (data) => {
          toast.success("OTP verified successfully!");

          // Store tokens in sessionStorage (tab-specific)
          sessionStorage.setItem("accessToken", data.data.accessToken);
          sessionStorage.setItem("refreshToken", data.data.refreshToken);
          sessionStorage.setItem("otpVerified", "true");

          sessionStorage.removeItem("otp_session");

          navigate("/dashboard", { replace: true });
        },

        onError: (err) => {
          const status = err?.response?.status;
          const message = err?.response?.data?.message;

          if (status === 401) {
            toast.error(message || "Invalid or expired OTP");
          } else if (status === 429) {
            toast.error("Too many attempts. Please try again later");
          } else {
            toast.error(message || "OTP verification failed");
          }

          // Optional: Clear OTP on error for better UX
          setOtp(["", "", "", "", "", ""]);
        },
      },
    );
  }

  // Helper function to get error message
  const getErrorMessage = () => {
    if (!error) return "";
    const status = error?.response?.status;
    const message = error?.response?.data?.message;

    if (status === 401) {
      return message || "Invalid or expired OTP";
    } else if (status === 429) {
      return "Too many attempts. Please try again later";
    }
    return message || "OTP verification failed";
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-2">
            <SquarePen className="text-white" size={32} />
          </div>

          <h1 className="text-2xl md:text-2xl lg:text-3xl font-bold text-slate-900 mb-2">
            Verify Your Account
          </h1>

          <p className="text-slate-600 text-sm">
            Enter the 6-digit code from your authenticator app
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <OtpInput
            otp={otp}
            setOtp={setOtp}
            email={email}
            onVerify={handleVerify}
            onResend={() => {}}
            onBack={() => navigate("/login")}
            isVerifying={loading}
            isResending={false}
            hideResend={true}
          />
        </div>
      </div>
    </div>
  );
}
