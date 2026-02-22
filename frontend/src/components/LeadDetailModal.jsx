import Modal from "./Modal/Modal.jsx";
import SelectField from "./Form/SelectField.jsx";
import StatusBadge from "./Badge/StatusBadge.jsx";
import { LEAD_STATUSES, APPOINTMENT_STATUSES, LEAD_STATUS_LABELS, APPOINTMENT_STATUS_LABELS } from "../utils/constants.js";
import { formatPhone, formatDate, formatLeadStatus, formatAppointmentStatus } from "../utils/formatters.js";

/**
 * LeadDetailModal - Display and edit lead details
 * 
 * Refactored to use reusable components:
 * - Modal wrapper for overlay and layout
 * - SelectField for status inputs
 * - StatusBadge for visual status display
 * - Formatters for consistent data display
 */
function LeadDetailModal({
  lead,
  onClose,
  onStatusChange,
  onAppointmentStatusChange,
}) {
  if (!lead) return null;

  // Convert status arrays to select options
  const leadStatusOptions = LEAD_STATUSES.map((s) => ({
    value: s,
    label: LEAD_STATUS_LABELS[s],
  }));

  const appointmentStatusOptions = APPOINTMENT_STATUSES.map((s) => ({
    value: s,
    label: APPOINTMENT_STATUS_LABELS[s],
  }));

  const appointmentStatus = lead.appointment_status || "unbooked";

  return (
    <Modal isOpen={true} onClose={onClose} title="Lead Details" maxWidth="600px">
      {/* Lead Information Section */}
      <div style={{ display: "grid", gap: "12px", marginBottom: "16px" }}>
        <div>
          <strong style={{ color: "#374151", fontSize: "12px" }}>Name</strong>
          <p style={{ margin: "4px 0 0", fontSize: "14px" }}>{lead.full_name}</p>
        </div>

        <div>
          <strong style={{ color: "#374151", fontSize: "12px" }}>Email</strong>
          <p style={{ margin: "4px 0 0", fontSize: "14px" }}>{lead.email}</p>
        </div>

        <div>
          <strong style={{ color: "#374151", fontSize: "12px" }}>Phone</strong>
          <p style={{ margin: "4px 0 0", fontSize: "14px" }}>{formatPhone(lead.phone) || "—"}</p>
        </div>

        <div>
          <strong style={{ color: "#374151", fontSize: "12px" }}>Service Type</strong>
          <p style={{ margin: "4px 0 0", fontSize: "14px" }}>{lead.service_type || "—"}</p>
        </div>

        <div>
          <strong style={{ color: "#374151", fontSize: "12px" }}>Budget Range</strong>
          <p style={{ margin: "4px 0 0", fontSize: "14px" }}>{lead.budget_range || "—"}</p>
        </div>

        <div>
          <strong style={{ color: "#374151", fontSize: "12px" }}>Timeframe</strong>
          <p style={{ margin: "4px 0 0", fontSize: "14px" }}>{lead.timeframe || "—"}</p>
        </div>

        <div>
          <strong style={{ color: "#374151", fontSize: "12px" }}>Source</strong>
          <p style={{ margin: "4px 0 0", fontSize: "14px" }}>{lead.source || "—"}</p>
        </div>

        <div>
          <strong style={{ color: "#374151", fontSize: "12px" }}>Lead Status</strong>
          <div style={{ margin: "4px 0 0" }}>
            <StatusBadge status={formatLeadStatus(lead.status)} type="lead" />
          </div>
        </div>

        <div>
          <strong style={{ color: "#374151", fontSize: "12px" }}>Appointment Time</strong>
          <p style={{ margin: "4px 0 0", fontSize: "14px" }}>
            {lead.appointment_time ? formatDate(lead.appointment_time, "DATE_TIME", lead.client_timezone) : "Not scheduled"}
          </p>
        </div>

        <div>
          <strong style={{ color: "#374151", fontSize: "12px" }}>Appointment Status</strong>
          <div style={{ margin: "4px 0 0" }}>
            <StatusBadge status={formatAppointmentStatus(appointmentStatus)} type="appointment" />
          </div>
        </div>

        <div>
          <strong style={{ color: "#374151", fontSize: "12px" }}>Client Timezone</strong>
          <p style={{ margin: "4px 0 0", fontSize: "14px" }}>{lead.client_timezone || "—"}</p>
        </div>

        {lead.project_description && (
          <div>
            <strong style={{ color: "#374151", fontSize: "12px" }}>Project Description</strong>
            <p style={{ margin: "4px 0 0", fontSize: "14px", color: "#6b7280" }}>
              {lead.project_description}
            </p>
          </div>
        )}
      </div>

      {/* Edit Section */}
      <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: "16px", display: "grid", gap: "12px" }}>
        <SelectField
          label="Update Lead Status"
          name="lead_status"
          value={lead.status}
          onChange={(e) => onStatusChange(lead.id, e.target.value)}
          options={leadStatusOptions}
        />

        {onAppointmentStatusChange && (
          <SelectField
            label="Update Appointment Status"
            name="appointment_status"
            value={appointmentStatus}
            onChange={(e) => onAppointmentStatusChange(lead.id, e.target.value)}
            options={appointmentStatusOptions}
          />
        )}
      </div>
    </Modal>
  );
}

export default LeadDetailModal;
