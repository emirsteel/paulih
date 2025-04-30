import React, { useState } from "react";
import SupplierSidebar from "../components/SupplierSidebar";
import SupplierHeader from "../components/SupplierHeader";
import SupplierSupport from "../components/SupplierSupport";

const SupplierSupportPage: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <SupplierHeader setMenuOpen={setMenuOpen} />
      <div className="flex flex-1">
        <SupplierSidebar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
        <div className="flex-1 p-6">
          <h1 className="text-2xl font-bold mb-4">Canlı Destek</h1>
          <SupplierSupport />
        </div>
      </div>
    </div>
  );
};

export default SupplierSupportPage;
