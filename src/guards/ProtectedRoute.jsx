import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  // const accessToken = localStorage.getItem("accessToken");
  const accessToken = sessionStorage.getItem("accessToken");
  const isAuthenticated = Boolean(accessToken);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
