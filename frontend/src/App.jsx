import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link,
} from "react-router-dom";

import LandingPage from "./components/LandingPage.jsx";
import AdminLogin from "./components/AdminLogin.jsx";
import AdminDashboard from "./components/AdminDashboard.jsx";
import BookingPage from "./components/BookingPage.jsx";

function App() {
  const [adminPassword, setAdminPassword] = useState("");
  const [isAuthed, setIsAuthed] = useState(false);

  const handleLogin = (password) => {
    setAdminPassword(password);
    setIsAuthed(true);
  };

  return (
    <Router>
      <div>
        {/* <header
          style={{ padding: "16px", background: "#0f172a", color: "white" }}
        >
          <div
            className="container"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {//Simple public nav (Admin link hidden from visitors) }
            <nav style={{ display: "flex", gap: "12px" }}>
              <Link
                to="/"
                style={{
                  padding: "8px 12px",
                  background: "white",
                  border: "1px solid #cbd5e1",
                  borderRadius: "6px",
                  color: "#0f172a",
                  textDecoration: "none",
                  fontSize: "14px",
                }}
              >
                Home
              </Link>

              <Link
                to="/admin/login"
                style={{
                  padding: "8px 12px",
                  background: "#22c55e",
                  borderRadius: "6px",
                  color: "#0f172a",
                  textDecoration: "none",
                  fontSize: "14px",
                }}
              >
                Admin
              </Link>
            </nav>
          </div>
        </header> */}

        {/* Route definitions */}
        <Routes>
          {/* Public funnel pages */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/booking" element={<BookingPage />} />

          {/* Admin routes */}
          <Route
            path="/admin/login"
            element={<AdminLogin onLogin={handleLogin} />}
          />
          <Route
            path="/admin/dashboard"
            element={
              isAuthed ? (
                <AdminDashboard adminPassword={adminPassword} />
              ) : (
                <Navigate to="/admin/login" replace />
              )
            }
          />

          {/* Fallback: any unknown route goes home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
