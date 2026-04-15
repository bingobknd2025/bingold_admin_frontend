import { Navigate } from "react-router-dom";

export default function OtpGuard({ children }) {
  const otpSession = sessionStorage.getItem("otp_session");

  if (!otpSession) {
    return <Navigate to="/login" replace />;
  }
  return children;
}
