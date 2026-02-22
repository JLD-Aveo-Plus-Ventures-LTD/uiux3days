import DataTable from "../../components/Table/DataTable.jsx";
import StatusBadge from "../../components/Badge/StatusBadge.jsx";
import { formatDate, formatLeadStatus, formatAppointmentStatus, formatPhone } from "../../utils/formatters.js";

/**
 * LeadTable - Display list of leads
 * 
 * Refactored to use DataTable component with column-based config
 * Removed hardcoded table markup - now uses generic DataTable
 */
function LeadTable({ leads, onSelect }) {
  // Define table columns with render functions
  const columns = [
    {
      header: "Name",
      accessorKey: "full_name",
      sortable: true,
      width: "150px",
    },
    {
      header: "Email",
      accessorKey: "email",
      sortable: true,
      width: "180px",
    },
    {
      header: "Service",
      accessorKey: "service_type",
      width: "120px",
    },
    {
      header: "Status",
      accessorKey: "status",
      render: (value) => (
        <span style={{ fontSize: "13px", color: "#1f2937" }}>
          {formatLeadStatus(value)}
        </span>
      ),
      width: "100px",
    },
    {
      header: "Appt. Time",
      accessorKey: "appointment_time",
      render: (value) => (
        <span style={{ fontSize: "13px" }}>
          {value ? formatDate(value, "DATE_TIME") : "—"}
        </span>
      ),
      width: "160px",
    },
    {
      header: "Appt. Status",
      accessorKey: "appointment_status",
      render: (value) => (
        <StatusBadge
          status={formatAppointmentStatus(value || "unbooked")}
          type="appointment"
        />
      ),
      width: "100px",
    },
    {
      header: "Created",
      accessorKey: "createdAt",
      render: (value) => (
        <span style={{ fontSize: "13px" }}>
          {value ? formatDate(value, "DATE_ONLY") : "—"}
        </span>
      ),
      width: "110px",
    },
    {
      header: "Actions",
      render: (_, row) => (
        <button
          onClick={() => onSelect(row)}
          style={{
            padding: "6px 10px",
            borderRadius: "6px",
            border: "1px solid #cbd5e1",
            backgroundColor: "#ffffff",
            cursor: "pointer",
            fontSize: "13px",
            fontWeight: "500",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = "#f3f4f6";
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = "#ffffff";
          }}
        >
          View
        </button>
      ),
      width: "80px",
    },
  ];

  return (
    <div className="lead-table">
      <h3 style={{ marginTop: 0, marginBottom: "12px", fontSize: "18px" }}>
        Recent Leads
      </h3>
      <DataTable
        data={leads}
        columns={columns}
        loading={false}
        emptyState="No leads found matching your filters."
      />
    </div>
  );
}

export default LeadTable;
