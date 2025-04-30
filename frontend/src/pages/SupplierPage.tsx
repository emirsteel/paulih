import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SupplierLogin from "../components/SupplierLogin";
import SupplierDashboard from "../components/SupplierDashboard";

const SupplierPage: React.FC = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("supplierToken");
    if (token) {
      setIsAuthenticated(true);
      navigate("/supplier-dashboard"); // Redirect to dashboard
    } else {
      setIsAuthenticated(false);
    }
  }, [navigate]);

  return isAuthenticated ? <SupplierDashboard /> : <SupplierLogin />;
};

export default SupplierPage;
