import { useEffect, useMemo, useState } from "react";
import AdminDashboard from "../../components/AdminDashboard.jsx";
import { getLeadsSeries } from "../../services/leads.service.js";
import LeadsChart from "./components/LeadsChart.jsx";
import "./styles/dashboard.css";

const PERIOD_OPTIONS = [
  { value: "week", label: "This Week" },
  { value: "month", label: "This Month" },
  { value: "year", label: "This Year" },
];

function DashboardPage({ adminPassword }) {
  const [period, setPeriod] = useState("week");
  const [series, setSeries] = useState({
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    values: [0, 0, 0, 0, 0, 0, 0],
  });
  const [chartLoading, setChartLoading] = useState(true);
  const [chartError, setChartError] = useState("");

  useEffect(() => {
    const loadSeries = async () => {
      if (!adminPassword) {
        setChartError("Authentication required");
        setChartLoading(false);
        return;
      }

      setChartLoading(true);
      setChartError("");

      try {
        const response = await getLeadsSeries(adminPassword, {
          period,
          tz: "UTC",
        });
        setSeries({
          labels: response.labels || [],
          values: response.values || [],
        });
      } catch (error) {
        setChartError(error.message || "Failed to load leads chart data");
      } finally {
        setChartLoading(false);
      }
    };

    loadSeries();
  }, [adminPassword, period]);

  const chartData = useMemo(
    () => ({
      labels: series.labels,
      datasets: [
        {
          label: "Leads",
          data: series.values,
          backgroundColor: "#16A34A",
          borderColor: "#16A34A",
          borderRadius: 4,
          borderSkipped: false,
        },
      ],
    }),
    [series],
  );

  return (
    <div className="dashboard">
      {/* Page Header */}
      <div className="dashboard__header">
        <h1 className="dashboard__title">Dashboard</h1>
      </div>

      {/* Stats Section */}
      <AdminDashboard adminPassword={adminPassword} />

      {/* Chart Section */}
      <div className="dashboard__chart-card">
        <div className="dashboard__chart-header">
          <h2 className="dashboard__chart-title">Total Leads</h2>
          <select
            className="dashboard__period-select"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            aria-label="Select chart period"
          >
            {PERIOD_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {chartError ? <p className="dashboard__chart-error">{chartError}</p> : null}

        {chartLoading ? (
          <div className="dashboard__chart-loading">Loading chart data...</div>
        ) : (
          <LeadsChart data={chartData} />
        )}
      </div>
    </div>
  );
}

export default DashboardPage;
