import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  // Temporarily disabled authentication check for development
  return children;

  // Original authentication check (commented out for now)
  /*
  const isAuthenticated = localStorage.getItem('token');
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
  */
};

export default ProtectedRoute; 