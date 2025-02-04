import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function ProtectedRoute({ children, roles = [] }) {
  const { teacher, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!teacher && !isLoading) {
    return <Navigate to='/login' replace />;
  }

  if (roles.length > 0 && !roles.some((role) => teacher.roles.includes(role))) {
    console.log('User lacks required roles:', roles);
    return <Navigate to='/unauthorized' replace />;
  }

  return children;
}
