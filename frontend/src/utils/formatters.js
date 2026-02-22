/**
 * Formatters Utility Functions
 * 
 * Pure functions for formatting data display:
 * - Date/time formatting
 * - Phone formatting
 * - Currency formatting
 * - Status label formatting
 * 
 * These functions are reusable across all components
 */

import { DATE_FORMAT_OPTIONS, DEFAULT_TIMEZONE } from "./constants.js";

/**
 * Format ISO date string to readable date format
 * @param {string} isoDate - ISO 8601 date string
 * @param {string} format - 'DATE_ONLY', 'DATE_TIME', 'TIME_ONLY', 'FULL'
 * @param {string} timezone - IANA timezone (e.g., 'Europe/London')
 * @returns {string} - Formatted date string
 */
export function formatDate(isoDate, format = "DATE_TIME", timezone = DEFAULT_TIMEZONE) {
    if (!isoDate) return "—";

    try {
        const date = new Date(isoDate);
        const formatter = new Intl.DateTimeFormat("en-GB", {
            ...DATE_FORMAT_OPTIONS[format],
            timeZone: timezone,
        });
        return formatter.format(date);
    } catch {
        return "—";
    }
}

/**
 * Format time difference as a human-readable string
 * @param {string} isoDate - ISO 8601 date string
 * @returns {string} - e.g., "2 days ago", "in 3 hours"
 */
export function formatRelativeTime(isoDate) {
    if (!isoDate) return "—";

    try {
        const date = new Date(isoDate);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return "just now";
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;

        return formatDate(isoDate, "DATE_ONLY");
    } catch {
        return "—";
    }
}

/**
 * Format phone number to readable format (E.164 to display format)
 * E164 example: +441234567890 -> +44 1234 567890
 * @param {string} e164 - Phone number in E.164 format
 * @returns {string} - Formatted phone number
 */
export function formatPhone(e164) {
    if (!e164) return "—";

    try {
        // Remove + and country code
        const cleaned = e164.replace(/\D/g, "");
        // Add spaces/dashes for readability (simple approach)
        return `+${cleaned.slice(0, 2)} ${cleaned.slice(2, 5)} ${cleaned.slice(5, 8)} ${cleaned.slice(8)}`;
    } catch {
        return e164;
    }
}

/**
 * Format currency amount
 * @param {number} amount - Amount in dollars
 * @param {string} currency - Currency code (default: 'USD')
 * @returns {string} - Formatted currency string
 */
export function formatCurrency(amount, currency = "USD") {
    if (amount == null) return "—";

    try {
        return new Intl.NumberFormat("en-GB", {
            style: "currency",
            currency,
            minimumFractionDigits: 0,
        }).format(amount);
    } catch {
        return `${amount} ${currency}`;
    }
}

/**
 * Format status to human-readable label with capitalization
 * @param {string} status - Status key (e.g., 'not_interested')
 * @returns {string} - Formatted status label
 */
export function formatStatus(status) {
    if (!status) return "—";

    // Handle camelCase or snake_case
    return status
        .replace(/_/g, " ")
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(" ");
}

/**
 * Format lead status with proper casing
 * @param {string} status - Lead status key
 * @returns {string} - Formatted status
 */
export function formatLeadStatus(status) {
    const statusMap = {
        new: "New",
        contacted: "Contacted",
        qualified: "Qualified",
        not_interested: "Not Interested",
        converted: "Converted",
    };
    return statusMap[status] || formatStatus(status);
}

/**
 * Format appointment status with proper casing
 * @param {string} status - Appointment status key
 * @returns {string} - Formatted status
 */
export function formatAppointmentStatus(status) {
    const statusMap = {
        unbooked: "Unbooked",
        booked: "Booked",
        confirmed: "Confirmed",
        completed: "Completed",
        cancelled: "Cancelled",
    };
    return statusMap[status] || formatStatus(status);
}

/**
 * Truncate text to specified length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} - Truncated text with ellipsis
 */
export function truncateText(text, maxLength = 50) {
    if (!text) return "—";
    if (text.length <= maxLength) return text;
    return `${text.substring(0, maxLength)}...`;
}

/**
 * Format number with thousands separator
 * @param {number} num - Number to format
 * @returns {string} - Formatted number
 */
export function formatNumber(num) {
    if (num == null) return "—";
    return new Intl.NumberFormat("en-GB").format(num);
}

/**
 * Format percentage
 * @param {number} value - Decimal value (0-1) or percentage (0-100)
 * @param {boolean} isDecimal - Whether value is decimal or percentage
 * @returns {string} - Formatted percentage
 */
export function formatPercentage(value, isDecimal = true) {
    if (value == null) return "—";
    const num = isDecimal ? value * 100 : value;
    return `${num.toFixed(1)}%`;
}

/**
 * Get time difference in human-readable format
 * Used for appointment timing (e.g., "in 2 hours", "3 days ago")
 * @param {Date|string} date1 - First date
 * @param {Date|string} date2 - Second date (default: now)
 * @returns {string} - Human readable difference
 */
export function getTimeDifference(date1, date2 = new Date()) {
    try {
        const d1 = typeof date1 === "string" ? new Date(date1) : date1;
        const d2 = typeof date2 === "string" ? new Date(date2) : date2;

        const diffMs = Math.abs(d2 - d1);
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return "Less than a minute";
        if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? "s" : ""}`;
        if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""}`;
        return `${diffDays} day${diffDays > 1 ? "s" : ""}`;
    } catch {
        return "—";
    }
}

/**
 * Format ISO date to time string only (HH:mm)
 * @param {string} isoDate - ISO date string
 * @param {string} timezone - IANA timezone
 * @returns {string} - Time string (HH:mm)
 */
export function formatTime(isoDate, timezone = DEFAULT_TIMEZONE) {
    if (!isoDate) return "—";

    try {
        const date = new Date(isoDate);
        const formatter = new Intl.DateTimeFormat("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
            timeZone: timezone,
        });
        return formatter.format(date);
    } catch {
        return "—";
    }
}

/**
 * Get display name for a lead (fallback if full_name missing)
 * @param {object} lead - Lead object
 * @returns {string} - Display name
 */
export function getLeadDisplayName(lead) {
    if (!lead) return "Unknown";
    if (lead.full_name) return lead.full_name;
    if (lead.email) return lead.email.split("@")[0];
    return "Lead #" + (lead.id || "?");
}

/**
 * Get display text for appointment time (null-safe)
 * @param {string} appointmentTime - ISO date string
 * @param {string} timezone - IANA timezone
 * @returns {string} - Formatted appointment time or dash
 */
export function getAppointmentTimeDisplay(appointmentTime, timezone = DEFAULT_TIMEZONE) {
    if (!appointmentTime) return "Not scheduled";
    return formatDate(appointmentTime, "DATE_TIME", timezone);
}

/**
 * Format a lead object for display (summary card)
 * @param {object} lead - Lead object
 * @returns {object} - Formatted lead summary
 */
export function formatLeadSummary(lead) {
    if (!lead) return {};

    return {
        name: getLeadDisplayName(lead),
        email: lead.email || "—",
        phone: formatPhone(lead.phone),
        service: lead.service_type || "—",
        status: formatLeadStatus(lead.status),
        appointmentTime: getAppointmentTimeDisplay(lead.appointment_time),
        appointmentStatus: formatAppointmentStatus(lead.appointment_status),
        createdAt: formatRelativeTime(lead.createdAt),
    };
}
