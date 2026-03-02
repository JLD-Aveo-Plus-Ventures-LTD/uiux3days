import { useEffect } from "react";
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { useAuth } from "./context/AuthContext.jsx";
import { ProtectedRoute } from "./components/ProtectedRoute.jsx";

import LandingPage from "./components/LandingPage.jsx";
import AdminLogin from "./components/AdminLogin.jsx";
import DashboardPage from "./features/dashboard/DashboardPage.jsx";
import LeadsPage from "./features/leads/LeadsPage.jsx";
import AdminLayout from "./layout/AdminLayout.jsx";
import BookingPage from "./components/BookingPage.jsx";
import RegistrationSuccessPage from "./components/RegistrationSuccessPage.jsx";

/**
 * AppContent - Internal routing component (must be inside Router and AuthProvider)
 * 
 * Handles:
 * - Route logic
 * - Layout selection for admin routes
 * - Protected route wrapping
 * - Auth state via context
 */
function AppContent() {
  const { adminPassword, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/admin/login", { replace: true });
  };

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/booking" element={<BookingPage />} />
      <Route path="/registration-success" element={<RegistrationSuccessPage />} />

      {/* Admin Login Route */}
      <Route
        path="/admin/login"
        element={<AdminLogin />}
      />

      {/* Protected Admin Routes with Layout */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute>
            <AdminLayout onLogout={handleLogout} adminPassword={adminPassword}>
              <DashboardPage adminPassword={adminPassword} />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/leads"
        element={
          <ProtectedRoute>
            <AdminLayout onLogout={handleLogout} adminPassword={adminPassword}>
              <LeadsPage adminPassword={adminPassword} />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppContent;
