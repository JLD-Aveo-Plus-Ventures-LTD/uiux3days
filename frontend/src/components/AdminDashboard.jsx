import { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";
import StatsCard from "./StatsCard.jsx";
import { getStats } from "../services/leads.service.js";
import { STATS_CARD_CONFIG } from "../utils/constants.js";

/**
 * AdminDashboard - Dashboard stats section
 * 
 * Displays summary metrics (5 cards):
 * - Total Leads
 * - New This Week
 * - Contacted
 * - Qualified
 * - Converted
 * 
 * Uses:
 * - StatsCard component (reusable, data-driven)
 * - leads.service.js for API calls
 * - Constants for stat configuration
 */
function AdminDashboard({ adminPassword }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /**
   * Load dashboard statistics
   */
  const loadStats = async () => {
    if (!adminPassword) {
      setError("Authentication required");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const data = await getStats(adminPassword);
      setStats(data);
    } catch (err) {
      setError(err.message || "Failed to load dashboard stats");
      setStats(null);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Load stats on mount
   */
  useEffect(() => {
    loadStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Get stat value by key (handles nested properties)
   */
  const getStatValue = (stat) => {
    if (!stats) return "—";
    const keys = stat.dataKey.split(".");
    let value = stats;
    for (const key of keys) {
      value = value?.[key];
    }
    return value ?? "—";
  };

  // Loading state
  if (loading) {
    return (
      <div style={{ padding: "24px", display: "flex", justifyContent: "center" }}>
        <ClipLoader color="#16A34A" size={34} />
      </div>
    );
  }

  // Error state
  if (error && !stats) {
    return (
      <div style={{ padding: "24px" }}>
        <p style={{ color: "#dc2626", fontWeight: "500" }}>{error}</p>
        <button
          onClick={loadStats}
          style={{
            marginTop: "12px",
            padding: "8px 16px",
            backgroundColor: "#16A34A",
            color: "#ffffff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="stats-section" style={{ marginBottom: "24px" }}>
      {/* Error Banner */}
      {error && (
        <div
          style={{
            marginBottom: "16px",
            padding: "12px 16px",
            backgroundColor: "#fee2e2",
            border: "1px solid #fca5a5",
            borderRadius: "6px",
            color: "#991b1b",
            fontSize: "14px",
          }}
        >
          {error}
        </div>
      )}

      {/* Stats Grid */}
      <div className="stats-grid">
        {STATS_CARD_CONFIG.map((stat) => (
          <StatsCard
            key={stat.id}
            title={stat.title}
            value={getStatValue(stat)}
            color={stat.color}
          />
        ))}
      </div>
    </div>
  );
}

export default AdminDashboard;
