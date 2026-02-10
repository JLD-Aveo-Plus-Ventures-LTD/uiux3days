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
            <h1 style={{ margin: 0 }}>JLD Automated Lead Engine</h1>
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
