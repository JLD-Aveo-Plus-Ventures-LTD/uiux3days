/**
 * DashboardPage - Dashboard feature page
 * 
 * Displays:
 * - Summary statistics cards (5 cards)
 * - Weekly leads chart (Mon-Sun bar chart)
 * - Page styling with dashboard.css
 */

import AdminDashboard from "../../components/AdminDashboard.jsx";
import LeadsChart from "./components/LeadsChart.jsx";
import "./styles/dashboard.css";

/**
 * Sample weekly leads data
 * In production, this would come from the backend API
 */
const getWeeklyChartData = () => ({
  labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  datasets: [
    {
      label: "Leads",
      data: [12, 19, 8, 15, 22, 10, 14],
      backgroundColor: "#16A34A",
      borderColor: "#16A34A",
      borderRadius: 4,
      borderSkipped: false,
    },
  ],
});

function DashboardPage({ adminPassword }) {
  const chartData = getWeeklyChartData();

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
        <h2 className="dashboard__chart-title">Total Leads</h2>
        <LeadsChart data={chartData} />
      </div>
    </div>
  );
}

export default DashboardPage;

