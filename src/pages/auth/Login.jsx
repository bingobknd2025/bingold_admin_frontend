import { Truck, Mail, Lock, EyeOff, Eye } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAdminLogin } from "../../api/auth/login";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Login = () => {
  const [email, setEmail] = useState("work.adityasahgal@gmail.com");
  const [password, setPassword] = useState("Admin@321");
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const { mutate: login, isPending: loading, isError, error } = useAdminLogin();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Clear previous session
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("otpVerified");
    sessionStorage.removeItem("refreshToken");
    sessionStorage.removeItem("otp_session");

    login(
      { email, password },
      {
        onSuccess: (data) => {
          if (data.otp_required) {
            sessionStorage.setItem(
              "otp_session",
              JSON.stringify({
                email,
                qr_code: data.qr_code,
                secret: data.secret,
              }),
            );

            navigate("/auth/otp-setup", { replace: true });
          }

          if (!data?.qr_code) {
            sessionStorage.setItem("otp_session", JSON.stringify({ email }));

            navigate("/auth/otp-verify", { replace: true });
          }
        },

        onError: (error) => {
          toast.error(
            error?.response?.data?.message || error?.message || "Login failed",
          );
        },
      },
    );
  };

  // Helper function to get error message
  const getErrorMessage = () => {
    if (!error) return "";
    return error?.response?.data?.message || error?.message || "Login failed";
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-2">
            <Truck className="text-white" size={32} />
          </div>
          <h1 className="text-2xl md:text-2xl lg:text-3xl font-bold text-slate-900 mb-2">
            Welcome Back
          </h1>
          <p className="text-slate-600">
            Sign in to your Fleet Manager account
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
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
                  data-testid="login-email-input"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Password
              </label>

              <div className="relative">
                {/* Lock Icon */}
                <Lock
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={20}
                />

                {/* Password Input */}
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-11 py-3 border border-slate-300 rounded-lg
      focus:ring-2 focus:ring-blue-500 focus:border-transparent
      transition-all"
                  placeholder="Enter your password"
                  required
                  data-testid="login-password-input"
                />

                {/* Eye Icon */}
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400
      hover:text-slate-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary-dark text-white font-medium py-3 rounded-lg transition-all active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed"
              data-testid="login-submit-btn"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="flex justify-between items-center mt-4 text-sm">
            <button
              type="button"
              onClick={() => navigate("/forgot-password")}
              className="text-primary hover:text-primary-dark hover:underline transition"
            >
              Forgot Password
            </button>

            <span className="text-slate-300">|</span>

            <button
              type="button"
              onClick={() => navigate("/forgot-autheticator")}
              className="text-primary hover:text-primary-dark hover:underline transition"
            >
              Forgot Authenticator
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;