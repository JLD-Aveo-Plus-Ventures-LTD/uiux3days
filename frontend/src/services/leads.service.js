/**
 * Leads Service Layer
 * 
 * Encapsulates all lead-related API calls.
 * Provides a clean interface for components to interact with the backend.
 * Handles error handling, response transformation, and caching logic.
 * 
 * This layer decouples components from direct API calls.
 */

import {
    fetchLeads as apiFetchLeads,
    fetchLead as apiFetchLead,
    updateLead as apiUpdateLead,
    getStats as apiGetStats,
    fetchSlots as apiFetchSlots,
    bookLeadAppointment as apiBookLeadAppointment,
    createLead as apiCreateLead,
} from "./api.js";

import { ERROR_MESSAGES } from "../utils/constants.js";

// ============================================================================
// ERROR HANDLING HELPERS
// ============================================================================

/**
 * Parse API error response and return user-friendly message
 */
function getErrorMessage(error, defaultMessage = ERROR_MESSAGES.GENERIC) {
    if (error?.status === 401) {
        return ERROR_MESSAGES.UNAUTHORIZED;
    }

    if (error?.status === 404) {
        return ERROR_MESSAGES.NOT_FOUND;
    }

    if (error?.message) {
        return error.message;
    }

    return defaultMessage;
}

/**
 * Throw error with consistent structure
 */
function throwServiceError(message, originalError = null) {
    const error = new Error(message);
    error.originalError = originalError;
    throw error;
}

// ============================================================================
// LEADS SERVICE API
// ============================================================================

/**
 * Create a new lead (public endpoint)
 * @param {object} payload - Lead data {full_name, email, phone, service_type, etc.}
 * @returns {Promise<{lead: object}>} - Created lead object
 */
export async function createLead(payload) {
    try {
        const response = await apiCreateLead(payload);
        return response;
    } catch (error) {
        throwServiceError(
            getErrorMessage(error, "Failed to create lead"),
            error
        );
    }
}

/**
 * Fetch list of leads with optional filters and pagination (admin only)
 * @param {string} adminPassword - Admin authentication password
 * @param {object} options - Query options {status, search, page, limit}
 * @returns {Promise<{leads: array, total: number, page: number, limit: number}>}
 */
export async function getLeads(adminPassword, options = {}) {
    if (!adminPassword) {
        throwServiceError(ERROR_MESSAGES.UNAUTHORIZED);
    }

    try {
        const response = await apiFetchLeads(adminPassword, options);
        return {
            leads: response.leads || [],
            total: response.total || 0,
            page: response.page || 1,
            limit: response.limit || 20,
        };
    } catch (error) {
        throwServiceError(
            getErrorMessage(error, ERROR_MESSAGES.LOAD_LEADS),
            error
        );
    }
}

/**
 * Fetch a single lead by ID (admin only)
 * @param {string} adminPassword - Admin authentication password
 * @param {number} leadId - Lead ID
 * @returns {Promise<{lead: object}>}
 */
export async function getLeadById(adminPassword, leadId) {
    if (!adminPassword) {
        throwServiceError(ERROR_MESSAGES.UNAUTHORIZED);
    }

    if (!leadId) {
        throwServiceError("Lead ID is required");
    }

    try {
        const response = await apiFetchLead(adminPassword, leadId);
        return response;
    } catch (error) {
        throwServiceError(
            getErrorMessage(error, "Failed to load lead details"),
            error
        );
    }
}

/**
 * Update a lead (admin only)
 * @param {string} adminPassword - Admin authentication password
 * @param {number} leadId - Lead ID
 * @param {object} updates - Fields to update {status, appointment_status, etc.}
 * @returns {Promise<{lead: object}>} - Updated lead
 */
export async function updateLead(adminPassword, leadId, updates) {
    if (!adminPassword) {
        throwServiceError(ERROR_MESSAGES.UNAUTHORIZED);
    }

    if (!leadId) {
        throwServiceError("Lead ID is required");
    }

    if (!updates || typeof updates !== "object") {
        throwServiceError("Updates payload is required");
    }

    try {
        const response = await apiUpdateLead(adminPassword, leadId, updates);
        return response;
    } catch (error) {
        throwServiceError(
            getErrorMessage(error, ERROR_MESSAGES.UPDATE_LEAD),
            error
        );
    }
}

/**
 * Update lead status only (convenience wrapper)
 * @param {string} adminPassword - Admin authentication password
 * @param {number} leadId - Lead ID
 * @param {string} status - New status
 * @returns {Promise<{lead: object}>}
 */
export async function updateLeadStatus(adminPassword, leadId, status) {
    return updateLead(adminPassword, leadId, { status });
}

/**
 * Update appointment status only (convenience wrapper)
 * @param {string} adminPassword - Admin authentication password
 * @param {number} leadId - Lead ID
 * @param {string} appointmentStatus - New appointment status
 * @returns {Promise<{lead: object}>}
 */
export async function updateAppointmentStatus(adminPassword, leadId, appointmentStatus) {
    return updateLead(adminPassword, leadId, { appointment_status: appointmentStatus });
}

/**
 * Get dashboard statistics (admin only)
 * @param {string} adminPassword - Admin authentication password
 * @returns {Promise<{totalLeads, newThisWeek, byStatus, ...}>}
 */
export async function getStats(adminPassword) {
    if (!adminPassword) {
        throwServiceError(ERROR_MESSAGES.UNAUTHORIZED);
    }

    try {
        const response = await apiGetStats(adminPassword);
        return {
            totalLeads: response.totalLeads || 0,
            newThisWeek: response.newThisWeek || 0,
            byStatus: response.byStatus || {},
            ...response, // Include any additional fields from API
        };
    } catch (error) {
        throwServiceError(
            getErrorMessage(error, ERROR_MESSAGES.LOAD_STATS),
            error
        );
    }
}

/**
 * Fetch available appointment slots for a given date (public)
 * @param {string} date - Date in YYYY-MM-DD format
 * @returns {Promise<{date, timezone, slots}>}
 */
export async function getAvailableSlots(date) {
    if (!date) {
        throwServiceError("Date is required");
    }

    try {
        const response = await apiFetchSlots(date);
        return {
            date: response.date || date,
            timezone: response.timezone || "Europe/London",
            slots: response.slots || [],
        };
    } catch (error) {
        throwServiceError(
            getErrorMessage(error, "Failed to load available slots"),
            error
        );
    }
}

/**
 * Book an appointment for a lead (public)
 * @param {number} leadId - Lead ID
 * @param {object} payload - Booking data {appointment_time, client_timezone, preferred_contact_method}
 * @returns {Promise<{lead: object}>}
 */
export async function bookAppointment(leadId, payload) {
    if (!leadId) {
        throwServiceError("Lead ID is required");
    }

    if (!payload || typeof payload !== "object") {
        throwServiceError("Booking payload is required");
    }

    if (!payload.appointment_time) {
        throwServiceError("Appointment time is required");
    }

    try {
        const response = await apiBookLeadAppointment(leadId, payload);
        return response;
    } catch (error) {
        if (error?.status === 409) {
            throwServiceError(
                "This slot was just booked by someone else. Please select a different time.",
                error
            );
        }

        throwServiceError(
            getErrorMessage(error, "Failed to book appointment"),
            error
        );
    }
}

// ============================================================================
// BATCH OPERATIONS (BONUS)
// ============================================================================

/**
 * Load both leads and stats in parallel (optimization)
 * @param {string} adminPassword - Admin authentication password
 * @param {object} options - Query options for leads
 * @returns {Promise<{leads, stats, total, page, limit}>}
 */
export async function getDashboardData(adminPassword, options = {}) {
    if (!adminPassword) {
        throwServiceError(ERROR_MESSAGES.UNAUTHORIZED);
    }

    try {
        const [leadsRes, statsRes] = await Promise.all([
            apiFetchLeads(adminPassword, options),
            apiGetStats(adminPassword),
        ]);

        return {
            leads: leadsRes.leads || [],
            stats: {
                totalLeads: statsRes.totalLeads || 0,
                newThisWeek: statsRes.newThisWeek || 0,
                byStatus: statsRes.byStatus || {},
            },
            total: leadsRes.total || 0,
            page: leadsRes.page || 1,
            limit: leadsRes.limit || 20,
        };
    } catch (error) {
        throwServiceError(
            getErrorMessage(error, ERROR_MESSAGES.LOAD_LEADS),
            error
        );
    }
}

/**
 * Search leads by name, email, or service type
 * @param {string} adminPassword - Admin authentication password
 * @param {string} query - Search query
 * @returns {Promise<{leads, total}>}
 */
export async function searchLeads(adminPassword, query) {
    if (!adminPassword) {
        throwServiceError(ERROR_MESSAGES.UNAUTHORIZED);
    }

    if (!query || query.trim().length === 0) {
        throwServiceError("Search query is required");
    }

    try {
        const response = await apiFetchLeads(adminPassword, {
            search: query.trim(),
            limit: 50,
        });

        return {
            leads: response.leads || [],
            total: response.total || 0,
        };
    } catch (error) {
        throwServiceError(
            getErrorMessage(error, "Search failed"),
            error
        );
    }
}

/**
 * Filter leads by multiple criteria
 * @param {string} adminPassword - Admin authentication password
 * @param {object} filters - Filter criteria {status, appointmentStatus, search}
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 * @returns {Promise<{leads, total, page, limit}>}
 */
export async function filterLeads(adminPassword, filters = {}, page = 1, limit = 20) {
    if (!adminPassword) {
        throwServiceError(ERROR_MESSAGES.UNAUTHORIZED);
    }

    try {
        const queryOptions = { page, limit };

        // Map frontend filter keys to API parameter names
        if (filters.status && filters.status !== "all") {
            queryOptions.status = filters.status;
        }

        if (filters.search) {
            queryOptions.search = filters.search;
        }

        const response = await apiFetchLeads(adminPassword, queryOptions);

        // Client-side filtering for appointment status (API doesn't support it yet)
        let filteredLeads = response.leads || [];
        if (filters.appointmentStatus && filters.appointmentStatus !== "all") {
            filteredLeads = filteredLeads.filter(
                (lead) => (lead.appointment_status || "unbooked") === filters.appointmentStatus
            );
        }

        return {
            leads: filteredLeads,
            total: response.total || 0,
            page: response.page || 1,
            limit: response.limit || 20,
        };
    } catch (error) {
        throwServiceError(
            getErrorMessage(error, "Filter failed"),
            error
        );
    }
}
