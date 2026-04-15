import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Home } from "lucide-react";

const PageNotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center h-[80vh] bg-gray-100">
      <div className="w-[70%] h-full flex items-center justify-center  px-6">
        <div className="text-center max-w-md">
          <h1 className="text-8xl font-extrabold text-blue-600 mb-4">404</h1>

          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Page Not Found
          </h2>

          <p className="text-gray-500 mb-6">
            Sorry, the page you are looking for doesn’t exist or has been moved.
          </p>

          <div className="flex justify-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </button>

            <button
              onClick={() => navigate("/dashboard")}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageNotFound;
