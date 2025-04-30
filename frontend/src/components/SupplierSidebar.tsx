import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  FaClipboardList,
  FaShoppingCart,
  FaUtensils,
  FaMapMarkerAlt,
  FaWallet,
  FaClock,
  FaMoneyBillWave,
  FaStore,
  FaHeadset,
  FaPhone,
  FaChartLine,
  FaChevronDown,
} from "react-icons/fa";
import axios from "axios"; // Import axios for API request

interface SupplierSidebarProps {
  menuOpen: boolean;
  setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const SupplierSidebar: React.FC<SupplierSidebarProps> = ({
  menuOpen,
  setMenuOpen,
}) => {
  const location = useLocation();
  const currentPath = location.pathname; // Get the active path
  const [menuDropdownOpen, setMenuDropdownOpen] = useState(false);
  const [paymentsDropdownOpen, setPaymentsDropdownOpen] = useState(false);
  const [venueId, setVenueId] = useState<string | null>(null); // Store venue ID

  // Fetch supplier's venueId when the component mounts
  useEffect(() => {
    const fetchVenueId = async () => {
      try {
        const token = localStorage.getItem("token"); // Assuming the supplier is authenticated
        if (!token) return;

        const response = await axios.get(
          "http://localhost:5001/api/suppliers/me",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.data && response.data.venueId) {
          setVenueId(response.data.venueId);
        }
      } catch (error) {
        console.error("Error fetching supplier venue ID:", error);
      }
    };

    fetchVenueId();
  }, []);

  return (
    <>
      {/* Overlay for Mobile */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setMenuOpen(false)}
        ></div>
      )}

      {/* Sidebar - Mobile (Slide-in) & Desktop (Fixed Full Height) */}
      <div
        className={`fixed md:relative top-0 left-0 h-screen w-64 bg-white border-r border-gray-200 p-3 z-50 transform transition-transform duration-300
        ${menuOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:flex md:flex-col`}
      >
        {/* Close Button for Mobile */}
        <button
          className="md:hidden absolute top-3 right-3 text-gray-600"
          onClick={() => setMenuOpen(false)}
        >
          ✕
        </button>

        <nav className="space-y-2 flex-1">
          {[
            {
              to: "/supplier/requests",
              label: "Talepler",
              icon: <FaClipboardList size={18} />,
            },
            {
              to: "/supplier",
              label: "Aktif Siparişler",
              icon: <FaShoppingCart size={18} />,
              badge: "28",
            },
            {
              to: "/supplier/analysis",
              label: "Analiz",
              icon: <FaChartLine size={18} />,
            },
            {
              to: "/supplier/payment-methods",
              label: "Ödeme Yöntemleri",
              icon: <FaWallet size={18} />,
            },
            {
              to: "/supplier/business-info",
              label: "İşletme Bilgileri",
              icon: <FaStore size={18} />,
            },
            {
              to: "/supplier/support",
              label: "Destek",
              icon: <FaHeadset size={18} />,
            },
          ].map(({ to, label, icon, badge }) => {
            const isActive = currentPath === to;

            return (
              <NavLink
                key={to}
                to={to}
                className={`relative flex items-center w-full h-10 text-[13px] font-medium px-3 rounded-md transition duration-300 ${
                  isActive
                    ? "bg-blue-100 text-blue-600 border-l-4 border-blue-600"
                    : "text-gray-700 hover:text-blue-600 hover:bg-gray-100"
                }`}
                onClick={() => setMenuOpen(false)} // Close sidebar on mobile
              >
                {icon}
                <span className="ml-3">{label}</span>
                {badge && (
                  <span className="ml-auto mr-2 bg-amber-500 text-white text-[11px] px-2 py-1 rounded-full">
                    {badge}
                  </span>
                )}
              </NavLink>
            );
          })}

          {/* Menu Dropdown with Arrow Icon */}
          <div className="space-y-2">
            <button
              onClick={() => setMenuDropdownOpen(!menuDropdownOpen)}
              className="flex items-center justify-between w-full h-10 text-[13px] font-medium text-gray-700 cursor-pointer hover:text-blue-600 hover:bg-gray-100 px-3 rounded-md transition duration-300 text-left"
            >
              <div className="flex items-center">
                <FaUtensils size={18} />
                <span className="ml-3 flex items-center">Menü</span>
              </div>
              <FaChevronDown
                size={14}
                className={`transition-transform duration-300 ${
                  menuDropdownOpen ? "rotate-180" : "rotate-0"
                }`}
              />
            </button>

            {/* Improved Dropdown Item */}
            {menuDropdownOpen && (
              <div className="ml-2 border-l-4 border-blue-600 pl-3">
                <NavLink
                  to="/supplier/products"
                  className={({ isActive }) =>
                    `block w-full h-10 flex items-center text-[13px] font-medium px-3 rounded-md transition duration-300 ${
                      isActive
                        ? "bg-blue-100 text-blue-600 border-l-4 border-blue-600"
                        : "text-gray-700 hover:text-blue-600 hover:bg-gray-100"
                    }`
                  }
                  onClick={() => setMenuOpen(false)}
                >
                  Ürünler
                </NavLink>
              </div>
            )}
          </div>
        </nav>

        {/* Footer Section */}
        <hr className="mt-3 border-gray-300" />
        <div className="bg-gray-100 p-3 rounded-md mt-3 text-[12px] text-gray-600">
          <p className="font-medium">Version: 1.0.0</p>

          <div className="flex items-center mt-2">
            <FaPhone className="text-gray-500 mr-2" size={14} />
            <p>+90 123 456 78 90</p>
          </div>

          <p className="text-center mt-3 text-gray-500 text-[11px]">
            © {new Date().getFullYear()} Paulih. All rights reserved.
          </p>
        </div>
      </div>
    </>
  );
};

export default SupplierSidebar;
