/**
 * Constants & Configuration
 * 
 * Centralized configuration for:
 * - Status mappings (colors, labels)
 * - Table column definitions
 * - Filter configurations
 * - Pagination defaults
 * - Other UI constants
 */

// ============================================================================
// LEAD STATUS CONFIGURATION
// ============================================================================

export const LEAD_STATUSES = ["new", "contacted", "qualified", "not_interested", "converted"];

export const LEAD_STATUS_LABELS = {
    new: "New",
    contacted: "Contacted",
    qualified: "Qualified",
    not_interested: "Not Interested",
    converted: "Converted",
};

// ============================================================================
// APPOINTMENT STATUS CONFIGURATION
// ============================================================================

export const APPOINTMENT_STATUSES = [
    "unbooked",
    "booked",
    "confirmed",
    "completed",
    "cancelled",
];

export const APPOINTMENT_STATUS_LABELS = {
    unbooked: "Unbooked",
    booked: "Booked",
    confirmed: "Confirmed",
    completed: "Completed",
    cancelled: "Cancelled",
};

// ============================================================================
// STATUS COLOR MAPPINGS (for StatusBadge)
// ============================================================================

export const LEAD_STATUS_COLORS = {
    new: "#3b82f6",           // blue
    contacted: "#9ca3af",      // gray
    qualified: "#f59e0b",      // amber/yellow
    converted: "#22c55e",      // green
    not_interested: "#dc2626", // red
};

export const APPOINTMENT_STATUS_COLORS = {
    unbooked: "#9ca3af",       // gray
    booked: "#3b82f6",         // blue
    confirmed: "#22c55e",      // green
    completed: "#1f2937",      // dark
    cancelled: "#dc2626",      // red
};

// ============================================================================
// STATS CARD CONFIGURATION
// ============================================================================

export const STATS_CARD_CONFIG = [
    {
        id: "total_leads",
        title: "Total Leads",
        dataKey: "totalLeads",
        color: "#FBE8F0",      // soft pink
    },
    {
        id: "new_this_week",
        title: "New This Week",
        dataKey: "newThisWeek",
        color: "#FFF6D9",      // soft yellow
    },
    {
        id: "contacted",
        title: "Contacted",
        dataKey: "byStatus.contacted",
        color: "#E8F2FF",      // soft blue
    },
    {
        id: "qualified",
        title: "Qualified",
        dataKey: "byStatus.qualified",
        color: "#FFF0DA",      // soft amber
    },
    {
        id: "converted",
        title: "Converted",
        dataKey: "byStatus.converted",
        color: "#E9F8EE",      // soft green
    },
];

// ============================================================================
// DATATABLE COLUMN CONFIGURATION (for LeadsTable)
// ============================================================================

// Note: This is exported as a function to allow runtime access to StatusBadge
// The actual column definitions will be built in the dashboard component
// This export serves as documentation of expected columns
export const LEADS_TABLE_COLUMN_KEYS = [
    "full_name",
    "email",
    "service_type",
    "status",
    "appointment_time",
    "appointment_status",
    "createdAt",
    "actions",
];

// ============================================================================
// FILTER CONFIGURATION
// ============================================================================

export const FILTER_CONFIG = [
    {
        key: "status",
        label: "Filter by Status",
        options: [
            { value: "all", label: "All" },
            { value: "new", label: "New" },
            { value: "contacted", label: "Contacted" },
            { value: "qualified", label: "Qualified" },
            { value: "not_interested", label: "Not Interested" },
            { value: "converted", label: "Converted" },
        ],
    },
    {
        key: "appointmentStatus",
        label: "Filter by Appointment",
        options: [
            { value: "all", label: "All" },
            { value: "unbooked", label: "Unbooked" },
            { value: "booked", label: "Booked" },
            { value: "confirmed", label: "Confirmed" },
            { value: "completed", label: "Completed" },
            { value: "cancelled", label: "Cancelled" },
        ],
    },
];

// ============================================================================
// PAGINATION CONFIGURATION
// ============================================================================

export const PAGINATION_CONFIG = {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 20,
    MAX_LIMIT: 50,
    AVAILABLE_LIMITS: [10, 20, 50],
};

// ============================================================================
// SERVICE TYPES
// ============================================================================

export const SERVICE_TYPES = [
    "Web Development",
    "Mobile App",
    "UI/UX Design",
    "Consulting",
    "Other",
];

// ============================================================================
// BUDGET RANGES
// ============================================================================

export const BUDGET_RANGES = [
    "Under $5,000",
    "$5,000 - $10,000",
    "$10,000 - $25,000",
    "$25,000 - $50,000",
    "$50,000+",
];

// ============================================================================
// TIMEFRAMES
// ============================================================================

export const TIMEFRAMES = [
    "ASAP",
    "Within 1 week",
    "Within 1 month",
    "Within 3 months",
    "6 months+",
];

// ============================================================================
// CONTACT METHODS
// ============================================================================

export const CONTACT_METHODS = ["Call", "WhatsApp", "Email"];

// ============================================================================
// MODAL SIZE CONFIGURATIONS
// ============================================================================

export const MODAL_SIZES = {
    SMALL: "400px",
    MEDIUM: "600px",
    LARGE: "900px",
};

// ============================================================================
// ERROR MESSAGES
// ============================================================================

export const ERROR_MESSAGES = {
    GENERIC: "Something went wrong. Please try again.",
    NETWORK: "Unable to connect to server. Check your internet connection.",
    UNAUTHORIZED: "Unauthorized. Please check your password.",
    NOT_FOUND: "Resource not found.",
    VALIDATION: "Please check all required fields.",
    LOAD_LEADS: "Unable to load leads. Please try again.",
    LOAD_STATS: "Unable to load statistics.",
    UPDATE_LEAD: "Failed to update lead. Please try again.",
};

// ============================================================================
// SUCCESS MESSAGES
// ============================================================================

export const SUCCESS_MESSAGES = {
    LEAD_UPDATED: "Lead updated successfully.",
    STATUS_CHANGED: "Status changed successfully.",
    APPOINTMENT_BOOKED: "Appointment booked successfully.",
};

// ============================================================================
// STORAGE KEYS (for localStorage)
// ============================================================================

export const STORAGE_KEYS = {
    ADMIN_PASSWORD: "admin_password",
    LAST_FILTER: "last_filter_state",
    THEME: "theme",
};

// ============================================================================
// FORMATTING CONSTANTS
// ============================================================================

export const DATE_FORMAT_OPTIONS = {
    DATE_ONLY: { year: "numeric", month: "short", day: "numeric" },
    DATE_TIME: { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" },
    TIME_ONLY: { hour: "2-digit", minute: "2-digit" },
    FULL: { weekday: "short", year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" },
};

// ============================================================================
// TIMEZONE CONSTANTS
// ============================================================================

export const DEFAULT_TIMEZONE = "Europe/London";

// ============================================================================
// API ENDPOINTS (for reference)
// ============================================================================

export const API_ENDPOINTS = {
    LEADS: "/leads",
    LEADS_STATS: "/stats/summary",
    LEADS_SLOTS: "/leads/slots",
};

// ============================================================================
// DEBOUNCE DELAYS
// ============================================================================

export const DEBOUNCE_DELAY = {
    SEARCH: 300,
    FILTER: 200,
    AUTO_SAVE: 1000,
};
