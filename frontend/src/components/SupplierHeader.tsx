import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaBars,
  FaBell,
  FaSignOutAlt,
  FaUserCircle,
  FaUserCog,
  FaHistory,
  FaCog,
  FaClipboardList,
  FaEnvelope,
  FaHome,
} from "react-icons/fa";

interface SupplierHeaderProps {
  venueName?: string;
  setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const SupplierHeader: React.FC<SupplierHeaderProps> = ({
  venueName,
  setMenuOpen,
}) => {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const handleLogout = () => {
    // Clear supplier-related data
    localStorage.removeItem("supplierToken");
    localStorage.removeItem("supplierUsername"); // if applicable
    // Debug: log out what remains
    console.log(
      "After logout, supplierToken:",
      localStorage.getItem("supplierToken")
    );
    // Redirect to supplier login and force page reload
    navigate("/supplier/login", { replace: true });
    window.location.reload();
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex justify-between items-center bg-white px-6 py-4 border-b border-gray-300 shadow-sm">
      {/* Sol: Menü Düğmesi + Logo */}
      <div className="flex items-center space-x-4">
        <button
          className="md:hidden text-gray-700"
          onClick={() => setMenuOpen(true)}
        >
          <FaBars size={24} />
        </button>
        <div className="flex items-center">
          <span className="text-2xl font-extrabold text-gray-900 tracking-wide">
            Paulih
          </span>
          <span className="text-2xl font-semibold text-blue-600 ml-1">
            Yemek
          </span>
        </div>
      </div>

      {/* Sağ: Profil, Bildirimler ve Ayarlar */}
      <div className="flex items-center space-x-4 relative">
        {/* Bildirimler */}
        <div className="flex items-center space-x-3 cursor-pointer hover:bg-gray-100 px-3 py-1.5 rounded-lg transition duration-300">
          <button className="relative text-gray-600 transition duration-200">
            <FaBell size={22} />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] px-1 py-0.5 rounded-full shadow-md leading-none">
              3
            </span>
          </button>
        </div>

        {/* Profil Açılır Menüsü */}
        <div
          ref={dropdownRef}
          className="flex items-center space-x-3 cursor-pointer hover:bg-gray-100 px-3 py-1.5 rounded-lg transition duration-300"
          onClick={() => setShowDropdown(!showDropdown)}
        >
          <FaUserCircle className="text-gray-600" size={26} />
          {venueName && (
            <span className="text-gray-800 font-medium text-sm">
              {venueName}
            </span>
          )}
        </div>
      </div>

      {/* Açılır Menü */}
      {showDropdown && (
        <div className="absolute right-6 top-16 w-64 bg-white border border-gray-200 rounded-lg shadow-lg py-3 z-20 text-gray-800">
          <div className="px-4 py-3 border-b border-gray-200">
            <p className="text-sm font-semibold">{venueName}</p>
            <p className="text-xs text-gray-500">Tedarikçi Paneli</p>
          </div>
          <button
            className="flex items-center px-4 py-2 hover:bg-gray-100 text-sm w-full"
            onClick={() => {
              setShowDropdown(false);
              navigate("/supplier/dashboard");
            }}
          >
            <FaHome className="mr-2" /> Panel
          </button>
          <button
            className="flex items-center px-4 py-2 hover:bg-gray-100 text-sm w-full"
            onClick={() => {
              setShowDropdown(false);
              navigate("/supplier/profile");
            }}
          >
            <FaUserCog className="mr-2" /> Profil Ayarları
          </button>
          <button
            className="flex items-center px-4 py-2 hover:bg-gray-100 text-sm w-full"
            onClick={() => {
              setShowDropdown(false);
              navigate("/supplier/orders");
            }}
          >
            <FaHistory className="mr-2" /> Sipariş Geçmişi
          </button>
          <button
            className="flex items-center px-4 py-2 hover:bg-gray-100 text-sm w-full"
            onClick={() => {
              setShowDropdown(false);
              navigate("/supplier/settings");
            }}
          >
            <FaCog className="mr-2" /> Ayarlar
          </button>
          <button
            className="flex items-center px-4 py-2 hover:bg-gray-100 text-sm w-full"
            onClick={() => {
              setShowDropdown(false);
              navigate("/supplier/messages");
            }}
          >
            <FaEnvelope className="mr-2" /> Mesajlar
          </button>
          <button
            className="flex items-center px-4 py-2 hover:bg-gray-100 text-sm w-full"
            onClick={() => {
              setShowDropdown(false);
              navigate("/supplier/tasks");
            }}
          >
            <FaClipboardList className="mr-2" /> Görevler
          </button>
          <button
            className="flex items-center px-4 py-2 text-red-600 hover:bg-red-50 text-sm w-full"
            onClick={handleLogout}
          >
            <FaSignOutAlt className="mr-2" /> Çıkış Yap
          </button>
        </div>
      )}
    </div>
  );
};

export default SupplierHeader;
