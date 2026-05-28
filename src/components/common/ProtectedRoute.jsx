import { Navigate, Outlet, useLocation } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner.jsx';
import { useAuth } from '../../hooks/useAuth.jsx';

function ProtectedRoute({ allowedRoles }) {
  const { isAuthenticated, loading, role } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner label="Checking access" />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
