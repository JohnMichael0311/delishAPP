import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import NotFound from '../NotFound/NotFound';
import AuthRoute from '../AuthRoute/AuthRoute';

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  
  // Check if user exists and is either an admin or a restaurant user
  const hasAccess = user && (user.type === "admin" || user.type === "restaurant");

  return hasAccess ? (
    children
  ) : (
    <NotFound
      linkRoute="/dashboard"
      linkText="Go to Dashboard"
      message="You don't have access to this page"
    />
  );
}

const ProtectedRouteExport = ({ children }) => (
  <AuthRoute>
    <ProtectedRoute>{children}</ProtectedRoute>
  </AuthRoute>
);

export default ProtectedRouteExport;
