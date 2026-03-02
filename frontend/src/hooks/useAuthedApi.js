import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * useAuthedApi - Custom hook for making authenticated API calls with 401 handling
 * Automatically logs out and redirects if backend returns 401 (unauthorized)
 * 
 * @returns {function} - wrapper function to call around service calls
 * 
 * @example
 * const withAuthCheck = useAuthedApi();
 * const leads = await withAuthCheck(() => fetchLeads(adminPassword));
 */
export function useAuthedApi() {
  const navigate = useNavigate();
  const { onUnauthorized } = useAuth();

  const withAuthCheck = useCallback(
    async (apiCall) => {
      try {
        return await apiCall();
      } catch (error) {
        // If backend returns 401, logout and redirect
        if (error?.status === 401) {
          onUnauthorized();
          navigate('/admin/login', { replace: true });
          throw new Error('Session expired. Please log in again.');
        }
        throw error;
      }
    },
    [onUnauthorized, navigate]
  );

  return withAuthCheck;
}
