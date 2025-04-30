import React, { useEffect, useState, useContext, useRef } from "react";
import { FaSearch, FaChevronRight, FaChevronDown } from "react-icons/fa";
import { ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import LocationPopup from "./LocationsPopup";
import { getUserAddresses, updateSelectedAddress } from "../services/api";
import { AuthUserContext } from "../context/AuthUserContext";
import OrderFoodMainHeaderCart from "./OrderFoodMainHeaderCart";

interface Venue {
  _id: string;
  name: string;
  category: string;
}

interface MainHeaderProps {
  venues?: Venue[];
  onSelectVenue?: (venueId: string) => void;
}

const getTagIcon = (tag: string) => {
  switch (tag) {
    case "home":
      return "🏡";
    case "heart":
      return "💖";
    case "work":
      return "🏢";
    case "school":
      return "🎓";
    default:
      return "📍";
  }
};

const MainHeader: React.FC<MainHeaderProps> = ({ venues, onSelectVenue }) => {
  const navigate = useNavigate();
  const { user } = useContext(AuthUserContext);

  const [cartCount, setCartCount] = useState<number>(0);
  const [addressTitle, setAddressTitle] = useState<string>("Ev");
  const [addressIcon, setAddressIcon] = useState<string>(getTagIcon("home"));
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Typewriter effect settings for the placeholder
  const placeholderTexts = [
    "Dilediğini ara...",
    "Pizza Ara...",
    "Sushi Ara...",
    "Burger Ara...",
  ];
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [displayedPlaceholder, setDisplayedPlaceholder] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  // Adjust speeds for smoother effect:
  const typingSpeed = 100; // Faster typing
  const deletingSpeed = 70; // Faster deletion
  const pauseTime = 1500; // Shorter pause at full text

  useEffect(() => {
    const currentText = placeholderTexts[placeholderIndex];
    let timer: NodeJS.Timeout;
    if (!isDeleting) {
      if (displayedPlaceholder.length < currentText.length) {
        timer = setTimeout(() => {
          setDisplayedPlaceholder(
            currentText.substring(0, displayedPlaceholder.length + 1)
          );
        }, typingSpeed);
      } else {
        timer = setTimeout(() => {
          setIsDeleting(true);
        }, pauseTime);
      }
    } else {
      if (displayedPlaceholder.length > 0) {
        timer = setTimeout(() => {
          setDisplayedPlaceholder(
            currentText.substring(0, displayedPlaceholder.length - 1)
          );
        }, deletingSpeed);
      } else {
        setIsDeleting(false);
        setPlaceholderIndex((prev) => (prev + 1) % placeholderTexts.length);
      }
    }
    return () => clearTimeout(timer);
  }, [displayedPlaceholder, isDeleting, placeholderIndex]);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLocationPopupOpen, setIsLocationPopupOpen] =
    useState<boolean>(false);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (user?._id) {
      getUserAddresses(user._id).then((addresses) => {
        const selectedAddress = addresses.find((addr: any) => addr.isSelected);
        if (selectedAddress) {
          setAddressTitle(selectedAddress.addressTitle);
          setAddressIcon(getTagIcon(selectedAddress.selectedTag));
        }
      });
    }
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [user]);

  const handleOpenLocationPopup = () => setIsLocationPopupOpen(true);
  const handleCloseLocationPopup = () => setIsLocationPopupOpen(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const getUserInitials = (name: string) => {
    if (!name) return "U";
    const nameParts = name.trim().split(" ");
    return nameParts.length > 1
      ? nameParts[0][0].toUpperCase() + nameParts[1][0].toUpperCase()
      : nameParts[0][0].toUpperCase();
  };

  return (
    <header className="bg-white py-3 px-4 flex flex-col md:flex-row md:items-center md:justify-between shadow-md">
      {/* Top Row: Logo, Search Bar */}
      <div className="flex w-full items-center justify-between">
        {/* Logo */}
        <div className="text-gray-800 text-xl font-bold">PaulihYemek</div>

        {/* Search Bar */}
        <div className="flex items-center bg-gray-100 rounded-full px-3 py-2 w-[50%] md:max-w-lg md:w-auto md:px-4">
          <FaSearch className="text-gray-600 text-lg mr-2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={displayedPlaceholder}
            className="w-full bg-transparent outline-none text-gray-800 text-sm placeholder-gray-500"
          />

          {/* Location Selector - Desktop: Inside Search Bar */}
          <div
            className="hidden md:flex items-center space-x-2 cursor-pointer pl-3 border-l border-gray-300"
            onClick={handleOpenLocationPopup}
          >
            <span className="text-lg">{addressIcon}</span>
            <span className="text-gray-800 text-sm font-medium">
              {addressTitle}
            </span>
            <FaChevronRight className="text-gray-600 text-xs" />
          </div>
        </div>

        {/* Right Section: Shopping Cart & Profile */}
        <div className="flex items-center space-x-3">
          {/* Shopping Cart */}
          <div className="relative flex items-center justify-center bg-gray-200 w-9 h-9 rounded-full text-gray-800 hover:bg-gray-300 transition cursor-pointer">
            <div
              className="relative flex items-center justify-center w-9 h-9 rounded-full text-gray-800 hover:bg-gray-300 transition cursor-pointer"
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingBag size={20} className="text-gray-800" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </div>
            <OrderFoodMainHeaderCart
              isOpen={isCartOpen}
              onClose={() => setIsCartOpen(false)}
              onCartCountChange={(count) => setCartCount(count)}
            />
          </div>

          {/* Profile Section */}
          <div
            className="flex items-center space-x-1 bg-gray-200 px-2 py-1 rounded-full cursor-pointer text-gray-800 hover:bg-gray-300 transition"
            onClick={() => setShowDropdown(!showDropdown)}
            ref={dropdownRef}
          >
            <div className="bg-gray-300 text-gray-800 w-7 h-7 flex items-center justify-center rounded-full font-bold text-sm">
              {getUserInitials(user?.name || "User")}
            </div>
            <FaChevronDown size={12} className="text-gray-800" />
          </div>
        </div>
      </div>

      {/* Mobile: Address moves below the search bar */}
      <div className="md:hidden mt-2 flex justify-start">
        <div
          className="flex items-center space-x-2 cursor-pointer text-gray-800 bg-gray-100 px-3 py-2 rounded-full"
          onClick={handleOpenLocationPopup}
        >
          <span className="text-lg">{addressIcon}</span>
          <span className="text-sm font-medium">{addressTitle}</span>
          <FaChevronRight className="text-gray-600 text-xs" />
        </div>
      </div>

      {/* Location Popup */}
      {isLocationPopupOpen && (
        <LocationPopup
          onClose={handleCloseLocationPopup}
          onNext={(newAddress, newTag) => {
            setAddressTitle(newAddress);
            setAddressIcon(getTagIcon(newTag));
            if (user?._id) {
              getUserAddresses(user._id).then((addresses) => {
                const selectedAddress = addresses.find(
                  (addr: any) => addr.addressTitle === newAddress
                );
                if (selectedAddress) {
                  updateSelectedAddress(user._id, selectedAddress._id);
                }
              });
            }
          }}
        />
      )}

      {/* Profile Dropdown */}
      {showDropdown && (
        <div className="absolute right-4 top-14 w-44 bg-white border border-gray-200 rounded-lg shadow-lg py-3 z-20 text-gray-800">
          <div className="px-4 py-3 border-b border-gray-200">
            <p className="text-sm font-semibold">{user?.name || "Kullanıcı"}</p>
            <p className="text-xs text-gray-500">
              {user?.email || "example@example.com"}
            </p>
          </div>
        </div>
      )}
    </header>
  );
};

export default MainHeader;
