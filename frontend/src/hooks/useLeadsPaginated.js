/**
 * useLeadsPaginated Hook
 * 
 * Custom hook for managing paginated lead list fetching
 * Encapsulates all pagination logic and API calls
 * Reduces boilerplate in dashboard component
 * 
 * @param {string} adminPassword - Admin authentication password
 * @param {number} initialPage - Starting page (default: 1)
 * @param {number} itemsPerPage - Items per page (default: 20)
 * 
 * @returns {object} - {
 *   leads: array,
 *   total: number,
 *   currentPage: number,
 *   itemsPerPage: number,
 *   totalPages: number,
 *   loading: boolean,
 *   error: string,
 *   canGoPrev: boolean,
 *   canGoNext: boolean,
 *   goToPage: function,
 *   nextPage: function,
 *   prevPage: function,
 *   setFilters: function,
 *   refetch: function,
 * }
 * 
 * @example
 * const {
 *   leads,
 *   currentPage,
 *   totalPages,
 *   nextPage,
 *   prevPage,
 *   loading,
 *   error,
 * } = useLeadsPaginated(adminPassword);
 * 
 * return (
 *   <>
 *     {loading && <p>Loading...</p>}
 *     {error && <p style={{color: 'red'}}>{error}</p>}
 *     <LeadTable leads={leads} />
 *     <button onClick={prevPage} disabled={currentPage === 1}>Prev</button>
 *     <span>{currentPage} / {totalPages}</span>
 *     <button onClick={nextPage} disabled={currentPage === totalPages}>Next</button>
 *   </>
 * );
 */

import { useState, useEffect, useCallback } from "react";
import { getLeads, filterLeads } from "../services/leads.service.js";

function useLeadsPaginated(adminPassword, initialPage = 1, itemsPerPage = 20) {
  const [leads, setLeads] = useState([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({});

  // Sync hook's currentPage with prop changes (when parent updates its currentPage)
  useEffect(() => {
    setCurrentPage(initialPage);
  }, [initialPage]);

  // Derived values
  const totalPages = Math.ceil(total / itemsPerPage);
  const canGoNext = currentPage < totalPages;
  const canGoPrev = currentPage > 1;

  /**
   * Fetch leads for current page and filters
   */
  const fetchData = useCallback(async () => {
    if (!adminPassword) {
      setError("Authentication required");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let response;

      // Use filterLeads if filters are applied, otherwise use getLeads for efficiency
      if (Object.keys(filters).length > 0) {
        response = await filterLeads(
          adminPassword,
          filters,
          currentPage,
          itemsPerPage
        );
      } else {
        response = await getLeads(adminPassword, {
          page: currentPage,
          limit: itemsPerPage,
        });
      }

      setLeads(response.leads || []);
      setTotal(response.total || 0);
    } catch (err) {
      setError(err.message || "Failed to load leads");
      setLeads([]);
    } finally {
      setLoading(false);
    }
  }, [adminPassword, currentPage, itemsPerPage, filters]);

  /**
   * Fetch data whenever page, itemsPerPage, or filters change
   */
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  /**
   * Navigate to specific page
   */
  const goToPage = useCallback((pageNum) => {
    const validPage = Math.max(1, Math.min(pageNum, totalPages || 1));
    setCurrentPage(validPage);
  }, [totalPages]);

  /**
   * Go to next page
   */
  const nextPage = useCallback(() => {
    if (canGoNext) {
      setCurrentPage((prev) => prev + 1);
    }
  }, [canGoNext]);

  /**
   * Go to previous page
   */
  const prevPage = useCallback(() => {
    if (canGoPrev) {
      setCurrentPage((prev) => prev - 1);
    }
  }, [canGoPrev]);

  /**
   * Update filters and reset to page 1
   */
  const updateFilters = useCallback((newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  }, []);

  /**
   * Manual refetch (for refresh button)
   */
  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return {
    // Data
    leads,
    total,
    currentPage,
    itemsPerPage,
    totalPages,

    // State
    loading,
    error,

    // Pagination helpers
    canGoNext,
    canGoPrev,

    // Navigation functions
    goToPage,
    nextPage,
    prevPage,

    // Filter control
    setFilters: updateFilters,

    // Manual refresh
    refetch,
  };
}

export default useLeadsPaginated;
