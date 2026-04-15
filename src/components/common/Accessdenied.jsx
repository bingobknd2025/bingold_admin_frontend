
const AccessDenied = () => {
  const handleContactSupport = (e) => {
    e.preventDefault();
    alert("Support contact: support@example.com");
  };

  return (
    <div className="flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 md:p-12 animate-fade-in">
        <div className="flex justify-center mb-6">
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-full p-6 shadow-lg animate-pulse-slow">
            <svg
              className="w-12 h-12 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
        </div>

        <div className="flex justify-center mb-4">
          <span className="bg-blue-100 text-blue-600 text-xs font-semibold px-4 py-1.5 rounded-full tracking-wider">
            ERROR 403
          </span>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 text-center mb-3">
          Dashboard Access Denied
        </h1>

        <p className="text-gray-600 text-center mb-8 leading-relaxed">
          You don't have permission to access this resource. Please contact your
          administrator if you believe this is a mistake.
        </p>

        <div className="pt-6 border-t border-gray-200 text-center">
          <a
            href="#"
            onClick={handleContactSupport}
            className="text-blue-600 hover:text-blue-700 font-medium text-sm hover:underline transition-colors"
          >
            Need help? Contact Support
          </a>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }

        @keyframes pulse-slow {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }

        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default AccessDenied;
