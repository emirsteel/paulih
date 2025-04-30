import React, { useState, useEffect } from "react";
import SupplierSidebar from "../components/SupplierSidebar";
import SupplierHeader from "../components/SupplierHeader";
import SupplierInfo from "../components/SupplierInfo";
import { fetchVenueById } from "../services/api"; // API function to get venue details
import { useNavigate } from "react-router-dom";

interface Venue {
  _id: string;
  name: string;
  category: string;
  subcategory: string;
  location: { address: string; city: string };
  rating: number;
  phone: string;
  email: string;
  logo: string;
  photos: string[];
  description: string;
  deliveryTime: string;
  deliveryPrice: string;
  minimumPayment: string;
  discount: string;
  likedBy: string[];
  deliveryBy: string;
  paymentMethod: string[];
  menu: string[];
  username: string;
  activeDays: { day: string; open: string; close: string }[];
}

const SupplierInfoPage: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [venue, setVenue] = useState<Venue | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("supplierToken"); // Get token from localStorage
    if (!token) {
      navigate("/supplier"); // Redirect if not logged in
      return;
    }

    try {
      const decodedToken: any = JSON.parse(atob(token.split(".")[1])); // Decode JWT
      const venueId = decodedToken.venueId;

      if (!venueId) {
        console.error("❌ Venue ID not found in token.");
        return;
      }

      // Fetch venue info using venueId
      fetchVenueById(venueId)
        .then((data) => setVenue(data))
        .catch((error) => console.error("Error fetching venue:", error));
    } catch (error) {
      console.error("Invalid token:", error);
      navigate("/supplier"); // Redirect on invalid token
    }
  }, [navigate]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <SupplierHeader setMenuOpen={setMenuOpen} />

      <div className="flex flex-1">
        <SupplierSidebar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

        <div className="flex-1 p-6">
          <h1 className="text-2xl font-bold mb-4">Tedarikçi Bilgileri</h1>
          {venue ? (
            <SupplierInfo venue={venue} />
          ) : (
            <p className="text-red-500">Mekan bilgileri yükleniyor...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SupplierInfoPage;
