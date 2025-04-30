// pages/SupplierMenuProductsPage.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchProductsByVenue } from "../services/api";
import SupplierMenuProducts from "../components/SupplierMenuProducts";
import SupplierSidebar from "../components/SupplierSidebar";
import SupplierHeader from "../components/SupplierHeader";

interface Product {
  _id: string;
  venueId: string;
  name: string;
  image: string;
  description: string;
  price: number;
  category: string;
  choiceExtracted: string[];
  extraSideChoice: { name: string; price: number }[];
  sauces: { name: string }[];
  promotions: string[];
  lavashChoices: { name: string; price: number }[];
  extraTavukDonerChoice?: { name: string; price: number };
}

const SupplierMenuProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [menuOpen, setMenuOpen] = useState(false); // Mobile Sidebar Toggle
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("supplierToken");
    if (token) {
      // Decode the token to retrieve the venueId
      const decodedToken: any = JSON.parse(atob(token.split(".")[1]));
      const venueId = decodedToken.venueId;
      if (!venueId) {
        console.error("❌ Venue ID not found in token.");
        return;
      }
      // Fetch products from the products table using the venueId
      fetchProductsByVenue(venueId)
        .then((data) => setProducts(data))
        .catch((error) => console.error("Error fetching products:", error));
    } else {
      navigate("/supplier");
    }
  }, [navigate]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Header */}
      <SupplierHeader setMenuOpen={setMenuOpen} />

      <div className="flex flex-1">
        {/* Sidebar */}
        <SupplierSidebar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

        {/* Main Content */}
        <div className="flex-1 p-6">
          <SupplierMenuProducts products={products} venueName={""} />
        </div>
      </div>
    </div>
  );
};

export default SupplierMenuProductsPage;
