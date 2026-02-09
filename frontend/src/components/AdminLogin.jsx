import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
    <div className="container" style={{ padding: "32px 0" }}>
      <div
        className="card"
        style={{ maxWidth: "480px", margin: "0 auto", padding: "24px" }}
      >
        <h2>Admin Login</h2>
        <p>Enter the admin password to view and manage leads.</p>

        <form
          onSubmit={handleSubmit}
          style={{ display: "grid", gap: "12px", marginTop: "16px" }}
        >
          <div>
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "6px",
                border: "1px solid #cbd5e1",
              }}
            />
          </div>

          {error && <p style={{ color: "red" }}>{error}</p>}

          <button
            type="submit"
            style={{
              padding: "10px",
              background: "#22c55e",
              border: "none",
              borderRadius: "6px",
              color: "#0f172a",
              fontWeight: 600,
            }}
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;
