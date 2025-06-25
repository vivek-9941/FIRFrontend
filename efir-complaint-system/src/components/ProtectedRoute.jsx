import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Assuming you have an auth context

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, checkAuthStatus } = useAuth();

  if (!checkAuthStatus) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    // Redirect to home if user doesn't have required role
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute; 