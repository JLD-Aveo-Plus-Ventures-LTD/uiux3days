import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import "./AdminLogin.css";

function AdminLogin() {
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState("");
  const navigate = useNavigate();
  const { isAuthed, login, loading, error, clearError } = useAuth();

  // If already authenticated, redirect to dashboard
  useEffect(() => {
    if (isAuthed) {
      navigate("/admin/dashboard", { replace: true });
    }
  }, [isAuthed, navigate]);

  // Clear context error when component unmounts
  useEffect(() => {
    return () => clearError();
  }, [clearError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");

    if (!password) {
      setLocalError("Please enter the admin password.");
      return;
    }

    // Call context login function
    const success = await login(password);
    
    // Clear password field after submission (success or failure)
    setPassword("");

    if (success) {
      // Navigate to dashboard on successful login
      navigate("/admin/dashboard", { replace: true });
    }
    // Error is handled by context and displayed below
  };

  return (
    <section className="admin-login">
      <div className="admin-login__card">
        <h1 className="admin-login__title">Admin Login</h1>
        <p className="admin-login__subtitle">
          Enter the admin password to view and manage leads.
        </p>

        <form
          onSubmit={handleSubmit}
          className="admin-login__form"
        >
          <div className="admin-login__field">
            <label htmlFor="admin-password">Password</label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              disabled={loading}
            />
          </div>

          {(localError || error) && (
            <p className="admin-login__error">{localError || error}</p>
          )}

          <button 
            type="submit" 
            className="admin-login__submit"
            disabled={loading}
          >
            {loading ? "Verifying..." : "Continue"}
          </button>
        </form>
      </div>
    </section>
  );
}

export default AdminLogin;
