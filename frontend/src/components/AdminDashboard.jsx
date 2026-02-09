import { useEffect, useState } from "react";
import { fetchLeads, getStats, updateLead } from "../services/api.js";
import LeadTable from "./LeadTable.jsx";
import LeadDetailModal from "./LeadDetailModal.jsx";

function AdminDashboard({ adminPassword }) {
  const [leads, setLeads] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedLead, setSelectedLead] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all"); //just added
  const [appointmentStatusFilter, setAppointmentStatusFilter] = useState("all");

  const loadData = async () => {
    try {
      const [leadRes, statsRes] = await Promise.all([
        fetchLeads(adminPassword, { limit: 50 }),
        getStats(adminPassword),
      ]);
      setLeads(leadRes.leads);
      setStats(statsRes);
    } catch (err) {
      setError("Unable to load admin data. Check the password and backend.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleStatusChange = async (leadId, status) => {
    const updated = await updateLead(adminPassword, leadId, { status });
    setLeads((prev) => prev.map((l) => (l.id === leadId ? updated.lead : l)));
    setSelectedLead(updated.lead);
  };

  const handleAppointmentStatusChange = async (leadId, appointment_status) => {
    const updated = await updateLead(adminPassword, leadId, { appointment_status });
    setLeads((prev) => prev.map((l) => (l.id === leadId ? updated.lead : l)));
    setSelectedLead(updated.lead);
  };
  // Filter logic
  const filteredLeads = leads.filter((lead) => {
    const matchesStatus =
      statusFilter === "all" ? true : lead.status === statusFilter;
    const matchesApptStatus =
      appointmentStatusFilter === "all"
        ? true
        : (lead.appointment_status || "unbooked") === appointmentStatusFilter;
    return matchesStatus && matchesApptStatus;
  });
  if (loading) {
    return (
      <div className="container" style={{ padding: "32px 0" }}>
        <p>Loading admin dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container" style={{ padding: "32px 0" }}>
        <p style={{ color: "red" }}>{error}</p>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: "32px 0" }}>
      <div className="card" style={{ marginBottom: "16px" }}>
        <h2>Admin Dashboard</h2>
        {stats && (
          <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
            <div>
              <strong>Total leads:</strong> {stats.totalLeads}
            </div>
            <div>
              <strong>New this week:</strong> {stats.newThisWeek}
            </div>
            <div>
              <strong>Status breakdown:</strong>{" "}
              {Object.entries(stats.byStatus || {})
                .map(([k, v]) => `${k}: ${v}`)
                .join(" | ")}
            </div>
          </div>
        )}
      </div>

      <div className="card" style={{ marginBottom: "16px", padding: "12px" }}>
        <label>
          <strong>Filter by status:</strong>
        </label>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{ marginLeft: "8px", padding: "6px" }}
        >
          <option value="all">All</option>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="qualified">Qualified</option>
          <option value="converted">Converted</option>
          <option value="not_interested">Not Interested</option>
        </select>
        <label style={{ marginLeft: "16px" }}>
          <strong>Filter by appointment:</strong>
        </label>
        <select
          value={appointmentStatusFilter}
          onChange={(e) => setAppointmentStatusFilter(e.target.value)}
          style={{ marginLeft: "8px", padding: "6px" }}
        >
          <option value="all">All</option>
          <option value="unbooked">Unbooked</option>
          <option value="booked">Booked</option>
          <option value="confirmed">Confirmed</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* <LeadTable leads={leads} onSelect={setSelectedLead} /> */}
      <LeadTable leads={filteredLeads} onSelect={setSelectedLead} />

      {selectedLead && (
        <LeadDetailModal
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
          onStatusChange={handleStatusChange}
          onAppointmentStatusChange={handleAppointmentStatusChange}
        />
      )}
    </div>
  );
}

export default AdminDashboard;
