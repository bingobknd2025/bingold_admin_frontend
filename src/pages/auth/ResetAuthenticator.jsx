import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SquarePen } from "lucide-react";
import { useRegenerateAuthQrCode } from "../../api/auth/regenerateAuthQrCode";

const ResetAuthenticator = () => {
  const navigate = useNavigate();

  const {
    mutate: getAuthQr,
    isLoading,
    isError,
    error,
    data,
  } = useRegenerateAuthQrCode();

  const resetAuthToken = sessionStorage.getItem("reset_auth_token");

  useEffect(() => {
    if (resetAuthToken) {
      getAuthQr({ token: resetAuthToken });
    }
  }, [getAuthQr, resetAuthToken]);

  return (
    <div className="min-h-screen w-full bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-4">
            <SquarePen className="text-white" size={32} />
          </div>

          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-2">
            Setup Authenticator
          </h1>

          <p className="text-sm text-slate-600">
            Scan the QR code with your authenticator app
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center">

          {isLoading && (
            <p className="text-slate-600">Generating QR Code...</p>
          )}

          {isError && (
            <p className="text-red-500">
              {error?.message || "Something went wrong"}
            </p>
          )}

          {data?.qr_code && (
            <img
              src={data.qr_code}
              alt="QR Code"
              className="w-48 mx-auto my-6"
            />
          )}

          {data?.secret && (
            <div className="bg-slate-100 rounded-lg p-3 text-sm break-all">
              <span className="font-semibold text-slate-700">
                Manual Key:
              </span>
              <p className="mt-1 text-slate-600">{data.secret}</p>
            </div>
          )}

          {data?.message && (
            <p className="text-xs text-gray-500 mt-3">{data.message}</p>
          )}

          <button
            type="button"
            onClick={() => navigate("/login")}
            className="mt-6 bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded w-full"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetAuthenticator;
