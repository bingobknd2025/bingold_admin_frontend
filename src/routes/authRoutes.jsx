import { Route } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";
import Login from "../pages/auth/Login";
import OtpSetup from "../pages/auth/OtpSetup";
import OtpVerify from "../pages/auth/OtpVerify";
import OtpGuard from "../guards/OtpGuard";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";
import ResetAuthenticator from "../pages/auth/ResetAuthenticator";

const authRoutes = (
  <Route element={<AuthLayout />}>
    <>
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/forgot-authenticator" element={<ForgotPassword />} />
      <Route path="/forgot-autheticator" element={<ForgotPassword />} />
      <Route path="/reset-authenticator" element={<ResetAuthenticator />} />

      <Route path="/reset-password" element={<ResetPassword />} />
      <Route
        path="/auth/otp-setup"
        element={
          <OtpGuard>
            <OtpSetup />
          </OtpGuard>
        }
      />

      <Route
        path="/auth/otp-verify"
        element={
          <OtpGuard>
            <OtpVerify />
          </OtpGuard>
        }
      />
    </>
  </Route>
);

export default authRoutes;
