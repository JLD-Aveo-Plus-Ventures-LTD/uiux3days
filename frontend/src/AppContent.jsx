import { useState } from "react";
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";

import LandingPage from "./components/LandingPage.jsx";
import AdminLogin from "./components/AdminLogin.jsx";
import DashboardPage from "./features/dashboard/DashboardPage.jsx";
import LeadsPage from "./features/leads/LeadsPage.jsx";
import AdminLayout from "./layout/AdminLayout.jsx";
import BookingPage from "./components/BookingPage.jsx";
import RegistrationSuccessPage from "./components/RegistrationSuccessPage.jsx";

/**
 * AppContent - Internal routing component (must be inside Router)
 * 
 * Handles:
 * - Authentication state
 * - Route logic
 * - Layout selection for admin routes
 */
function AppContent() {
  const [adminPassword, setAdminPassword] = useState("");
  const [isAuthed, setIsAuthed] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (password) => {
    setAdminPassword(password);
    setIsAuthed(true);
  };

  const handleLogout = () => {
    setAdminPassword("");
    setIsAuthed(false);
    navigate("/admin/login", { replace: true });
  };

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/booking" element={<BookingPage />} />
      <Route path="/registration-success" element={<RegistrationSuccessPage />} />

      {/* Admin Routes */}
      <Route
        path="/admin/login"
        element={<AdminLogin onLogin={handleLogin} />}
      />

      {/* Protected Admin Routes with Layout */}
      <Route
        path="/admin/dashboard"
        element={
          isAuthed ? (
            <AdminLayout onLogout={handleLogout} adminPassword={adminPassword}>
              <DashboardPage adminPassword={adminPassword} />
            </AdminLayout>
          ) : (
            <Navigate to="/admin/login" replace />
          )
        }
      />

      <Route
        path="/admin/leads"
        element={
          isAuthed ? (
            <AdminLayout onLogout={handleLogout} adminPassword={adminPassword}>
              <LeadsPage adminPassword={adminPassword} />
            </AdminLayout>
          ) : (
            <Navigate to="/admin/login" replace />
          )
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppContent;
