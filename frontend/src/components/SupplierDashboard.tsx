import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  fetchSupplierStats,
  fetchRecentOrders,
  fetchBestSellingProducts,
  fetchVenueById,
  fetchPurchasedProducts,
} from "../services/api";
import SupplierSidebar from "../components/SupplierSidebar";
import SupplierHeader from "../components/SupplierHeader";
import SupplierRecentlyPurchasedProducts from "../components/SupplierRecentlyPurchasedProducts";

const SupplierDashboard: React.FC = () => {
  const [venue, setVenue] = useState<{ name: string; _id: string } | null>(
    null
  );
  const [stats, setStats] = useState<any>({});
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [bestSellingProducts, setBestSellingProducts] = useState<any[]>([]);
  const [purchasedProducts, setPurchasedProducts] = useState<any[]>([]);
  const [orderStatus, setOrderStatus] = useState<{ [key: string]: string }>({});
  const [menuOpen, setMenuOpen] = useState(false); // ✅ Add this state for sidebar
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("supplierToken");

    if (token) {
      const decodedToken: any = JSON.parse(atob(token.split(".")[1]));
      const venueId = decodedToken.venueId;

      if (!venueId) {
        console.error("❌ Venue ID not found in token.");
        return;
      }

      fetchVenueById(venueId).then(setVenue);
      fetchSupplierStats(venueId).then(setStats);
      fetchRecentOrders(venueId).then(setRecentOrders);
      fetchBestSellingProducts(venueId).then(setBestSellingProducts);

      fetchPurchasedProducts(venueId).then((data) => {
        setPurchasedProducts(data);

        const initialStatus = data.reduce(
          (acc: { [key: string]: string }, product: any) => {
            acc[product.orderId] =
              product.orderStatus === "Order Received"
                ? "Order Preparation"
                : product.orderStatus;
            return acc;
          },
          {}
        );

        setOrderStatus(initialStatus);
      });
    } else {
      navigate("/supplier");
    }
  }, [navigate]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* ✅ Pass setMenuOpen to SupplierHeader */}
      <SupplierHeader setMenuOpen={setMenuOpen} />

      <div className="flex flex-1">
        {/* ✅ Pass menuOpen and setMenuOpen to SupplierSidebar */}
        <SupplierSidebar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

        {/* Main Content */}
        <div className="flex-1 p-6">
          <SupplierRecentlyPurchasedProducts
            purchasedProducts={purchasedProducts}
            orderStatus={orderStatus}
            setOrderStatus={setOrderStatus}
          />
        </div>
      </div>
    </div>
  );
};

export default SupplierDashboard;
