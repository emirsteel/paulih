// src/components/PrivateCourierRoute.tsx
import React from "react";
import { Navigate } from "react-router-dom";

interface PrivateCourierRouteProps {
  children: JSX.Element;
}

const PrivateCourierRoute: React.FC<PrivateCourierRouteProps> = ({
  children,
}) => {
  const token = localStorage.getItem("courierToken");
  return token ? children : <Navigate to="/courier/login" />;
};

export default PrivateCourierRoute;
