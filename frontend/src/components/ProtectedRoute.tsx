import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactElement;
  redirectPath?: string;
}

// Redirect logged-in users away from the login/signup page
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, redirectPath = '/home' }) => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to={redirectPath} />;
  }

  return children;
};

export default ProtectedRoute;
