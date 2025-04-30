import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loading from "./Loading"; // ✅ Import your custom loading component

interface PrivateRouteProps {
  children: JSX.Element;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  // Show loading indicator while authentication state is being restored
  if (loading) {
    return <Loading />; // ✅ Use your custom loader
  }

  // If user is not authenticated, redirect to login page
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Render the children if authenticated
  return children;
};

export default PrivateRoute;
