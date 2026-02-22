import { useState } from "react";
import Modal from "../../components/Modal/Modal.jsx";
import SelectField from "../../components/Form/SelectField.jsx";
import StatusBadge from "../../components/Badge/StatusBadge.jsx";
import { LEAD_STATUSES, APPOINTMENT_STATUSES, LEAD_STATUS_LABELS, APPOINTMENT_STATUS_LABELS } from "../../utils/constants.js";
import { formatPhone, formatDate, formatLeadStatus, formatAppointmentStatus } from "../../utils/formatters.js";

/**
 * LeadDetailModal - Display and edit lead details
 * 
 * Features:
 * - Neutral modal background
 * - Grid layout for read-only content (3 columns)
 * - Editable status fields in same row
 * - Note textarea
 * - Green action buttons
 */
function LeadDetailModal({
    lead,
    onClose,
    onStatusChange,
    onAppointmentStatusChange,
}) {
    const [note, setNote] = useState(lead?.notes || "");
    const [leadStatus, setLeadStatus] = useState(lead?.status || "new");
    const [appointmentStatus, setAppointmentStatus] = useState(lead?.appointment_status || "unbooked");

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

    const handleSave = () => {
        if (leadStatus !== lead.status) {
            onStatusChange(lead.id, leadStatus);
        }
        if (appointmentStatus !== lead.appointment_status) {
            onAppointmentStatusChange(lead.id, appointmentStatus);
        }
        onClose();
    };

    const readOnlyField = (label, value) => (
        <div>
            <label style={{ display: "block", fontSize: "11px", fontWeight: "600", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "4px" }}>
                {label}
            </label>
            <p style={{ margin: 0, fontSize: "14px", color: "#1f2937" }}>
                {value || "—"}
            </p>
        </div>
    );

    return (
        <Modal
            isOpen={true}
            onClose={onClose}
            title="LEAD DETAILS"
            maxWidth="800px"
            closeButtonLabel="Close"
        >
            {/* Read-Only Info Grid (3 columns, 3 rows) */}
            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "16px",
                marginBottom: "24px",
                paddingBottom: "16px",
                borderBottom: "1px solid #e5e7eb",
            }}>
                {readOnlyField("Name", lead.full_name)}
                {readOnlyField("Email", lead.email)}
                {readOnlyField("Phone", formatPhone(lead.phone))}

                {readOnlyField("Service Type", lead.service_type)}
                {readOnlyField("Budget Range", lead.budget_range)}
                {readOnlyField("Timeframe", lead.timeframe)}

                {readOnlyField("Source", lead.source)}
                {readOnlyField("Lead Status", formatLeadStatus(lead.status))}
                {readOnlyField("Appointment Time", lead.appointment_time ? formatDate(lead.appointment_time, "DATE_TIME", lead.client_timezone) : "Not scheduled")}

                {readOnlyField("Appointment Status", formatAppointmentStatus(appointmentStatus))}
                {readOnlyField("Client Timezone", lead.client_timezone)}
                {lead.project_description && readOnlyField("Project Description", lead.project_description)}
            </div>

            {/* Edit Section */}
            <div style={{ display: "grid", gap: "16px" }}>
                {/* Status Fields in Same Row */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                    <div>
                        <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#374151", marginBottom: "6px" }}>
                            Update Lead Status
                        </label>
                        <select
                            value={leadStatus}
                            onChange={(e) => setLeadStatus(e.target.value)}
                            style={{
                                width: "100%",
                                padding: "8px 12px",
                                border: "1px solid #d1d5db",
                                borderRadius: "6px",
                                backgroundColor: "#ffffff",
                                color: "#1f2937",
                                fontSize: "14px",
                                fontFamily: "inherit",
                            }}
                        >
                            {leadStatusOptions.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#374151", marginBottom: "6px" }}>
                            Update Appointment Status
                        </label>
                        <select
                            value={appointmentStatus}
                            onChange={(e) => setAppointmentStatus(e.target.value)}
                            style={{
                                width: "100%",
                                padding: "8px 12px",
                                border: "1px solid #d1d5db",
                                borderRadius: "6px",
                                backgroundColor: "#ffffff",
                                color: "#1f2937",
                                fontSize: "14px",
                                fontFamily: "inherit",
                            }}
                        >
                            {appointmentStatusOptions.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Note Textarea */}
                <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#374151", marginBottom: "6px" }}>
                        Note
                    </label>
                    <textarea
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="Add notes about this lead..."
                        style={{
                            width: "100%",
                            minHeight: "80px",
                            padding: "10px 12px",
                            border: "1px solid #d1d5db",
                            borderRadius: "6px",
                            backgroundColor: "#ffffff",
                            color: "#1f2937",
                            fontSize: "14px",
                            fontFamily: "inherit",
                            resize: "vertical",
                        }}
                    />
                </div>

                {/* Close Button */}
                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "8px", gap: "12px" }}>
                    <button
                        onClick={handleSave}
                        style={{
                            padding: "10px 20px",
                            backgroundColor: "#33AA28",
                            color: "#ffffff",
                            border: "none",
                            borderRadius: "8px",
                            fontSize: "14px",
                            fontWeight: "600",
                            cursor: "pointer",
                            transition: "all 0.2s",
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.opacity = "0.9";
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.opacity = "1";
                        }}
                    >
                        Save
                    </button>
                </div>
            </div>
        </Modal>
    );
}

export default LeadDetailModal;
