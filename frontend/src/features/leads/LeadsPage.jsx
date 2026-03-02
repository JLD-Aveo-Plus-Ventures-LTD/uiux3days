/**
 * LeadsPage - Leads management and filtering page
 * 
 * Features:
 * - List of all leads with sortable columns
 * - Filter by lead status and appointment status
 * - Pagination with configurable page size
 * - Lead detail modal for viewing/editing
 * - Responsive design
 */

import { useState, useCallback } from "react";
import { IoFilterSharp, IoCalendarOutline } from "react-icons/io5";
import { ClipLoader } from "react-spinners";
import useLeadsPaginated from "../../hooks/useLeadsPaginated.js";
import { PaginationControls } from "../../components/index.js";
import LeadTable from "./LeadTable.jsx";
import LeadDetailModal from "./LeadDetailModal.jsx";
import { LEAD_STATUSES, APPOINTMENT_STATUSES } from "../../utils/constants.js";
import { API_BASE_URL } from "../../services/api.js";
import "../../components/Pagination/Pagination.css";
import "./LeadsPage.css";

function LeadsPage({ adminPassword }) {
    const pageSize = 10;
    const [currentPage, setCurrentPage] = useState(1);
    const [filters, setFilters] = useState({
        status: "",
        appointmentStatus: "",
        startDate: "",
        endDate: "",
    });
    const [selectedLead, setSelectedLead] = useState(null);

    const {
        leads,
        currentPage: hookPage,
        totalPages,
        total,
        loading,
        error,
        setFilters: setHookFilters,
        refetch,
    } = useLeadsPaginated(adminPassword, currentPage, pageSize, filters);

    // Sync pagination controls with hook
    const handlePageChange = useCallback((page) => {
        setCurrentPage(page);
    }, []);

    const handleFilterChange = useCallback((filterKey, value) => {
        setCurrentPage(1); // Reset to first page on filter change
        
        // Validate date range: endDate cannot be before startDate
        if (filterKey === "endDate" && filters.startDate && value < filters.startDate) {
            return; // Silently ignore invalid date range
        }
        
        if (filterKey === "startDate" && filters.endDate && value > filters.endDate) {
            return; // Silently ignore invalid date range
        }
        
        setFilters((prev) => ({
            ...prev,
            [filterKey]: value,
        }));
    }, [filters.startDate, filters.endDate]);

    const handleSelectLead = (lead) => {
        setSelectedLead(lead);
    };

    const handleCloseLead = () => {
        setSelectedLead(null);
    };

    const handleLeadUpdate = () => {
        setSelectedLead(null);
        refetch();
    };

    const handleExport = async (format) => {
        try {
            const params = new URLSearchParams();
            if (filters.status) params.append('status', filters.status);
            if (filters.appointmentStatus) params.append('appointment_status', filters.appointmentStatus);
            if (filters.startDate) params.append('start_date', filters.startDate);
            if (filters.endDate) params.append('end_date', filters.endDate);
            
            const response = await fetch(`${API_BASE_URL}/leads/export/${format}?${params.toString()}`, {
                headers: {
                    'x-admin-password': adminPassword,
                },
            });

            if (!response.ok) {
                throw new Error('Export failed');
            }

            // Get the file name from content-disposition header
            const contentDisposition = response.headers.get('content-disposition');
            const fileName = contentDisposition?.split('filename="')[1]?.split('"')[0] || `leads.${format}`;

            // Create blob and download
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error(`Export failed: ${error.message}`);
            alert(`Failed to export as ${format.toUpperCase()}. Please try again.`);
        }
    };

    // Calculate entry summary
    const startEntry = (currentPage - 1) * pageSize + 1;
    const endEntry = Math.min(currentPage * pageSize, total);
    const entrySummary = total > 0
        ? `Showing data ${startEntry} to ${endEntry} of ${total} entries`
        : "No leads found";

    if (loading && leads.length === 0) {
        return (
            <div className="leads-page__loading">
                <ClipLoader color="#16A34A" size={36} />
            </div>
        );
    }

    return (
        <div className="leads-page">
            {/* Page Header & Filters */}
            <div className="leads-page__header">
                <h1 className="leads-page__title">Recent Leads</h1>

                {/* Filter Bar - Status, Appointment, & Date Range */}
                <div className="leads-page__filters">
                    <div className="leads-page__filter">
                        <label htmlFor="filter-status" className="leads-page__filter-label">
                            <IoFilterSharp /> Filter by Status
                        </label>
                        <select
                            id="filter-status"
                            value={filters.status}
                            onChange={(e) => handleFilterChange("status", e.target.value)}
                            className="leads-page__filter-select"
                        >
                            <option value="">All Statuses</option>
                            {LEAD_STATUSES.map((status) => (
                                <option key={status.value} value={status.value}>
                                    {status.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="leads-page__filter">
                        <label htmlFor="filter-appointment" className="leads-page__filter-label">
                            <IoFilterSharp /> Filter by Appointment
                        </label>
                        <select
                            id="filter-appointment"
                            value={filters.appointmentStatus}
                            onChange={(e) => handleFilterChange("appointmentStatus", e.target.value)}
                            className="leads-page__filter-select"
                        >
                            <option value="">All Appointments</option>
                            {APPOINTMENT_STATUSES.map((status) => (
                                <option key={status.value} value={status.value}>
                                    {status.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="leads-page__date-filter">
                        <label htmlFor="filter-start-date" className="leads-page__date-filter-label">
                            <IoCalendarOutline /> From
                        </label>
                        <input
                            id="filter-start-date"
                            type="date"
                            value={filters.startDate}
                            onChange={(e) => handleFilterChange("startDate", e.target.value)}
                            max={filters.endDate}
                            className="leads-page__date-input"
                        />
                    </div>

                    <div className="leads-page__date-filter">
                        <label htmlFor="filter-end-date" className="leads-page__date-filter-label">
                            <IoCalendarOutline /> To
                        </label>
                        <input
                            id="filter-end-date"
                            type="date"
                            value={filters.endDate}
                            onChange={(e) => handleFilterChange("endDate", e.target.value)}
                            min={filters.startDate}
                            className="leads-page__date-input"
                        />
                    </div>
                </div>
            </div>

            {/* Export Buttons */}
            <div className="leads-page__export">
                <button
                    onClick={() => handleExport('csv')}
                    className="leads-page__export-btn leads-page__export-btn--csv"
                >
                    📥 Export as CSV
                </button>
                <button
                    onClick={() => handleExport('xlsx')}
                    className="leads-page__export-btn leads-page__export-btn--xlsx"
                >
                    📊 Export as XLSX
                </button>
                <button
                    onClick={() => handleExport('pdf')}
                    className="leads-page__export-btn leads-page__export-btn--pdf"
                >
                    📄 Export as PDF
                </button>
            </div>

            {/* Error State */}
            {error && (
                <div className="leads-page__error">
                    {error}
                    <button onClick={refetch} className="leads-page__retry-btn">
                        Retry
                    </button>
                </div>
            )}

            {/* Leads Table */}
            <div className="leads-page__table-wrap">
                <div className="leads-page__table-scroll">
                    <LeadTable leads={leads} onSelect={handleSelectLead} />
                </div>
                {loading && (
                    <div className="leads-page__table-loading">
                        <ClipLoader color="#16A34A" size={30} />
                    </div>
                )}
            </div>

            {/* Entry Summary */}
            <div className="leads-page__summary">
                <p className="leads-page__summary-text">{entrySummary}</p>
            </div>

            {/* Pagination Controls */}
            <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                options={{ siblingCount: 1 }}
            />

            {/* Lead Detail Modal */}
            {selectedLead && (
                <LeadDetailModal
                    lead={selectedLead}
                    onClose={handleCloseLead}
                    onStatusChange={handleLeadUpdate}
                    onAppointmentStatusChange={handleLeadUpdate}
                />
            )}
        </div>
    );
}

export default LeadsPage;
