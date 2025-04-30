import React, { useEffect, useState } from "react";
import SupplierLogin from "../components/SupplierLogin";
import SupplierDashboard from "../components/SupplierDashboard";

const OrderFoodSupplier: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("supplierToken");
    setIsAuthenticated(!!token); // Set to true if token exists
  }, []);

  return isAuthenticated ? <SupplierDashboard /> : <SupplierLogin />;
};

export default OrderFoodSupplier;
