import { Truck, ScanLine } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function OtpSetup() {
  const navigate = useNavigate();
  const [otpData, setOtpData] = useState(null);

  useEffect(() => {
    const storedOtp = sessionStorage.getItem("otp_session");
    if (!storedOtp) {
      navigate("/login", { replace: true });
      return;
    }
    setOtpData(JSON.parse(storedOtp));
  }, [navigate]);

  if (!otpData) return null;
  const { qr_code, secret, email } = otpData;

  return (
    <div className="min-h-screen w-full bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-4">
            <ScanLine className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Verify your account
          </h1>

          <p className="text-slate-600">
            Scan the QR code using your authenticator app to continue
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <img src={qr_code} alt="OTP QR Code" className="mx-auto mb-4 w-56" />

          <p className="text-sm text-gray-600 mb-4 text-center">
            Scan this QR using Google Authenticator
          </p>

          {/* <img src={`data:image/png;base64,${base64Image}`} alt="Profile" /> */}

          <button
            onClick={() => navigate("/auth/otp-verify")}
            className="bg-primary cursor-pointer hover:bg-primary-dark text-white px-4 py-2 rounded w-full"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
