import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import authRoutes from "./authRoutes";
import dashboardRoutes from "./dashboardRoutes";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {authRoutes}
        {dashboardRoutes}

        {/* Fallback redirect */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
