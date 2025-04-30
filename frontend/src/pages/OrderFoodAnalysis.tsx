import React, { useState } from "react";
import SupplierSidebar from "../components/SupplierSidebar";
import SupplierHeader from "../components/SupplierHeader";
import SupplierAnalysis from "../components/SupplierAnalysis";

const OrderFoodAnalysis: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false); // ✅ Mobile Sidebar Toggle

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* ✅ Header - Same as Dashboard */}
      <SupplierHeader setMenuOpen={setMenuOpen} />

      <div className="flex flex-1">
        {/* ✅ Sidebar - Same as Dashboard */}
        <SupplierSidebar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

        {/* ✅ Main Content */}
        <div className="flex-1 p-6">
          <h1 className="text-2xl font-bold mb-4">Sipariş Analizi</h1>
          <SupplierAnalysis />
        </div>
      </div>
    </div>
  );
};

export default OrderFoodAnalysis;
