function LeadTable({ leads, onSelect }) {
  return (
    <div className="card">
      <h3 style={{ marginTop: 0 }}>Recent Leads</h3>
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Service</th>
            <th>Status</th>
            <th>Appt. Time</th>
            <th>Appt. Status</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr key={lead.id}>
              <td>{lead.full_name}</td>
              <td>{lead.email}</td>
              <td>{lead.service_type}</td>
              <td>{lead.status}</td>
              <td>
                {lead.appointment_time
                  ? new Date(lead.appointment_time).toLocaleString()
                  : "—"}
              </td>
              <td>{lead.appointment_status || "unbooked"}</td>
              <td>
                {lead.createdAt
                  ? new Date(lead.createdAt).toLocaleString()
                  : "—"}
              </td>
              <td>
                <button
                  onClick={() => onSelect(lead)}
                  style={{
                    padding: "6px 10px",
                    borderRadius: "6px",
                    border: "1px solid #cbd5e1",
                  }}
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default LeadTable;
