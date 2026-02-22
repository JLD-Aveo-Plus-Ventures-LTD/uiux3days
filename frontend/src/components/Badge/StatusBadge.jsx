/**
 * StatusBadge - Reusable status indicator component
 * 
 * Maps status strings to colors via configuration
 * Supports both lead and appointment status types
 * 
 * @component
 * @example
 * <StatusBadge status="Booked" type="appointment" />
 * <StatusBadge status="Qualified" type="lead" />
 */

// Status color configurations (DRY - single source of truth)
const STATUS_COLORS = {
  lead: {
    new: "#3b82f6",           // blue
    contacted: "#9ca3af",      // gray
    qualified: "#f59e0b",      // amber/yellow
    converted: "#22c55e",      // green
    not_interested: "#dc2626", // red
  },
  appointment: {
    unbooked: "#F2F4F7",       // light gray pill
    booked: "#ECFDF3",         // light green pill
    confirmed: "#22c55e",      // green
    completed: "#1f2937",      // dark
    cancelled: "#dc2626",      // red
  },
};

const STATUS_TEXT_COLORS = {
  lead: {
    new: "#1e40af",
    contacted: "#374151",
    qualified: "#92400e",
    converted: "#166534",
    not_interested: "#7f1d1d",
  },
  appointment: {
    unbooked: "#6b7280",       // dark gray text on light gray
    booked: "#166534",         // dark green text on light green
    confirmed: "#166534",
    completed: "#0f172a",
    cancelled: "#7f1d1d",
  },
};

function StatusBadge({ status, type = "lead" }) {
  // Normalize status to lowercase for lookup
  const statusKey = status ? status.toLowerCase().replace(/ /g, "_") : "unbooked";

  // Get colors from config or use default
  const colors = STATUS_COLORS[type] || STATUS_COLORS.lead;
  const textColors = STATUS_TEXT_COLORS[type] || STATUS_TEXT_COLORS.lead;

  const bgColor = colors[statusKey] || colors.new;
  const textColor = textColors[statusKey] || textColors.new;

  // Use pill border radius for appointment status badges
  const isPill = type === "appointment";
  const borderRadius = isPill ? "20px" : "4px";
  const padding = isPill ? "6px 14px" : "6px 12px";

  return (
    <span
      className="badge"
      style={{
        display: "inline-block",
        padding: padding,
        borderRadius: borderRadius,
        fontSize: "13px",
        fontWeight: "500",
        backgroundColor: bgColor,
        color: textColor,
        whiteSpace: "nowrap",
      }}
    >
      {status}
    </span>
  );
}

export default StatusBadge;
