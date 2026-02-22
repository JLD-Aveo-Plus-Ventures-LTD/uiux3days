import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminLogin.css";

function AdminLogin({ onLogin }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!password) {
      setError("Please enter the admin password.");
      return;
    }

    // Call parent to set password + mark admin authenticated
    onLogin(password);

    // Redirect to dashboard
    navigate("/admin/dashboard");
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
            />
          </div>

          {error && <p className="admin-login__error">{error}</p>}

          <button type="submit" className="admin-login__submit">
            Continue
          </button>
        </form>
      </div>
    </section>
  );
}

export default AdminLogin;
