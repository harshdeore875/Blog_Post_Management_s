import { Navigate } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner.jsx';
import { useAuth } from '../../hooks/useAuth.jsx';
import { getRoleHomePath } from '../../utils/roleRedirect.js';

function RoleRedirect() {
  const { isAuthenticated, loading, role } = useAuth();

  if (loading) {
    return <LoadingSpinner label="Loading" />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Navigate to={getRoleHomePath(role)} replace />;
}

export default RoleRedirect;
