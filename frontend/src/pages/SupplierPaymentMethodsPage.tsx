import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SupplierSidebar from "../components/SupplierSidebar";
import SupplierHeader from "../components/SupplierHeader";
import SupplierPaymentMethods from "../components/SupplierPaymentMethods";
import { fetchVenueById } from "../services/api";

interface Venue {
  _id: string;
  name: string;
  description: string;
  location: { address: string; city: string };
  phone: string;
  email: string;
  logo: string;
  deliveryTime: string;
  minimumPayment: string;
  paymentMethod: string[];
  discount: string;
  rating: number;
}

const SupplierPaymentMethodsPage: React.FC = () => {
  const [venue, setVenue] = useState<Venue | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("supplierToken");

    if (token) {
      try {
        // ✅ Decode the token
        const decodedToken: any = JSON.parse(atob(token.split(".")[1]));
        const venueId = decodedToken.venueId;

        if (!venueId) {
          console.error("❌ Venue ID not found in token.");
          return;
        }

        // ✅ Fetch venue details
        fetchVenueById(venueId)
          .then((venueData) => {
            setVenue(venueData);
          })
          .catch((error) => console.error("Error fetching venue:", error));
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    } else {
      // Redirect to supplier login if not authenticated
      navigate("/supplier");
    }
  }, [navigate]);

  if (!venue) {
    return <p className="text-center mt-10 text-gray-500">Loading venue...</p>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* ✅ Header */}
      <SupplierHeader setMenuOpen={setMenuOpen} />

      <div className="flex flex-1">
        {/* ✅ Sidebar */}
        <SupplierSidebar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

        {/* ✅ Main Content */}
        <div className="flex-1 p-6">
          {/* ✅ Pass venue details to SupplierPaymentMethods */}
          <SupplierPaymentMethods
            venueId={venue._id}
            initialMethods={venue.paymentMethod || []}
          />
        </div>
      </div>
    </div>
  );
};

export default SupplierPaymentMethodsPage;
