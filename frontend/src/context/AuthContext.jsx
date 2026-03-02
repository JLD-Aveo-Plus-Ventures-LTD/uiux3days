import { createContext, useState, useCallback, useEffect, useContext } from 'react';
import { API_BASE_URL } from '../services/api.js';

const AuthContext = createContext(null);

const STORAGE_KEY = 'jld_admin_auth_token';
const AUTH_CHECK_URL = `${API_BASE_URL}/leads?limit=1`;

function isValidAuthResponse(data) {
  return Boolean(data) && Array.isArray(data.leads) && typeof data.total === 'number';
}

async function parseJsonSafely(response) {
  try {
    return await response.json();
  } catch (err) {
    return null;
  }
}

/**
 * AuthProvider - Manages global authentication state
 * Provides login, logout, checkAuth, and clearError functions
 * Persists auth to localStorage for session continuity
 */
export function AuthProvider({ children }) {
  const [adminPassword, setAdminPassword] = useState('');
  const [isAuthed, setIsAuthed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const clearAuthState = useCallback(() => {
    setIsAuthed(false);
    setAdminPassword('');
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  /**
   * Login - Validates password and sets auth state
   * Makes API call to verify password before granting access
   */
  const login = useCallback(async (password) => {
    if (!password) {
      setError('Please enter a password');
      return false;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(AUTH_CHECK_URL, {
        headers: {
          'x-admin-password': password,
        },
      });
      const data = await parseJsonSafely(response);

      if (!response.ok) {
        setError(data?.message || 'Invalid admin password');
        clearAuthState();
        return false;
      }

      if (!isValidAuthResponse(data)) {
        setError('Authentication check failed. Please try again.');
        clearAuthState();
        return false;
      }

      // Success - store password and set auth state
      setAdminPassword(password);
      setIsAuthed(true);
      localStorage.setItem(STORAGE_KEY, password);
      setError('');
      return true;
    } catch (err) {
      setError('Connection error. Please try again.');
      clearAuthState();
      return false;
    } finally {
      setLoading(false);
    }
  }, [clearAuthState]);

  /**
   * Logout - Clears auth state and localStorage
   */
  const logout = useCallback(() => {
    setAdminPassword('');
    setIsAuthed(false);
    setError('');
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  /**
   * CheckAuth - Verifies stored password on app load
   * Restores session from localStorage if valid
   */
  const checkAuth = useCallback(async () => {
    const storedPassword = localStorage.getItem(STORAGE_KEY);

    if (!storedPassword) {
      setIsAuthed(false);
      setAdminPassword('');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(AUTH_CHECK_URL, {
        headers: {
          'x-admin-password': storedPassword,
        },
      });
      const data = await parseJsonSafely(response);

      if (response.ok && isValidAuthResponse(data)) {
        setAdminPassword(storedPassword);
        setIsAuthed(true);
      } else {
        // Stored password is invalid
        clearAuthState();
      }
    } catch (err) {
      clearAuthState();
    } finally {
      setLoading(false);
    }
  }, [clearAuthState]);

  /**
   * ClearError - Resets error message
   */
  const clearError = useCallback(() => {
    setError('');
  }, []);

  /**
   * OnUnauthorized - Called when API returns 401
   * Clears auth and redirects to login
   */
  const onUnauthorized = useCallback(() => {
    logout();
    setError('Session expired. Please log in again.');
  }, [logout]);

  // Check auth on mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const value = {
    adminPassword,
    isAuthed,
    loading,
    error,
    login,
    logout,
    checkAuth,
    clearError,
    onUnauthorized,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * useAuth - Hook to access authentication context
 * @returns {object} - Auth context value with all functions
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
