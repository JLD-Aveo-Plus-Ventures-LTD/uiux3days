import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * ProtectedRoute - Wraps routes that require authentication
 * Redirects to login if user is not authenticated
 * CRITICAL: Does NOT render any content if not authenticated
 * 
 * @param {React.ReactNode} children - Route content
 * @returns {React.ReactElement}
 */
export function ProtectedRoute({ children }) {
  const { isAuthed, loading } = useAuth();

  // Show loading state only if actively checking
  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <p>Authenticating...</p>
      </div>
    );
  }

  // STRICT: If not authenticated, redirect immediately - do NOT render children
  if (!isAuthed) {
    return <Navigate to="/admin/login" replace />;
  }

  // Only render children if explicitly authenticated
  return children;
}
