import React, { useState, useEffect, useContext } from "react";
import {
  Star,
  Bike,
  ShoppingCart,
  Clock,
  Heart,
  Share2,
  ChevronRight,
} from "lucide-react";
import { AuthUserContext } from "../context/AuthUserContext";
import { toggleVenueLike } from "../services/api";
import OrderFoodVenueInfoMorePopup from "./OrderFoodVenueInfoMorePopup";

interface Venue {
  _id: string;
  name: string;
  description: string;
  location: {
    address: string;
    city: string;
    latitude: number;
    longitude: number;
  };
  phone: string;
  email: string;
  logo: string;
  deliveryTime: string;
  minimumPayment: string;
  paymentMethod: string[];
  discount: string;
  rating: number;
  likedBy?: string[];
  banner?: string;
}

const OrderFoodVenueInfo: React.FC<{ venue: Venue }> = ({ venue }) => {
  const { user } = useContext(AuthUserContext);

  // Hardcoded values for demonstration
  const [isOpen] = useState<boolean>(true);
  const [deliveryTime] = useState<string>("30-40 mins");
  const [minOrder] = useState<string>("$10.00");
  const [deliveryFee] = useState<string>("£2.99");
  const [closeTime] = useState<string>("22:00");

  // Use the venue banner if available, otherwise fallback to a default background image
  const heroBackground = venue.banner
    ? `http://localhost:5001/uploads/${venue.banner}`
    : "https://images.pexels.com/photos/1640770/pexels-photo-1640770.jpeg?auto=compress&cs=tinysrgb&w=1200";

  // Local like state
  const [isLiked, setIsLiked] = useState<boolean>(false);
  // State to show/hide the "More" popup
  const [showMore, setShowMore] = useState<boolean>(false);

  useEffect(() => {
    if (user && venue.likedBy) {
      setIsLiked(venue.likedBy.includes(user._id));
    }
  }, [user, venue.likedBy]);

  const handleLike = async () => {
    setIsLiked((prev) => !prev);
    try {
      await toggleVenueLike(venue._id, user?._id || "");
      // Optionally refresh or re-fetch venue data if needed.
    } catch (error) {
      console.error("Error toggling like:", error);
      setIsLiked((prev) => !prev);
    }
  };

  const handleShare = async () => {
    const url = `http://localhost:3000/order/food/venue/${venue._id}`;
    try {
      await navigator.clipboard.writeText(url);
      alert("Link kopyalandı!");
    } catch (error) {
      console.error("Kopyalama hatası:", error);
      alert("Link kopyalanamadı.");
    }
  };

  return (
    <div className="w-full bg-white">
      {/* Hero Banner */}
      <div className="relative w-full h-[300px] md:h-[400px] overflow-hidden">
        {/* Background Image */}
        <img
          src={heroBackground}
          alt="Mekan bannerı"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-60" />

        {/* Share Button (Top Left) */}
        <button
          className="absolute top-2 left-2 bg-white bg-opacity-75 p-2 rounded-full shadow-md z-20"
          onClick={(e) => {
            e.stopPropagation();
            handleShare();
          }}
        >
          <Share2 className="w-5 h-5 text-gray-600" />
        </button>

        {/* ♥ Like Button (Top Right) */}
        <button
          className="absolute top-2 right-2 bg-white bg-opacity-75 p-2 rounded-full shadow-md z-20"
          onClick={(e) => {
            e.stopPropagation();
            handleLike();
          }}
        >
          <Heart
            className={`w-5 h-5 ${isLiked ? "text-red-500" : "text-gray-400"}`}
          />
        </button>

        {/* Content Overlay */}
        <div className="relative z-10 w-full h-full flex items-end pb-6 text-white px-12">
          <div className="w-full flex justify-between items-end">
            {/* Left Column: Venue Logo & Info */}
            <div className="flex items-center">
              <img
                src={`http://localhost:5001/uploads/${venue.logo}`}
                alt="Mekan Logosu"
                className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md mr-4"
              />
              <div>
                <h1 className="text-2xl md:text-3xl font-extrabold drop-shadow-sm">
                  {venue.name}
                </h1>
                <p className="text-sm md:text-base text-gray-200 font-medium">
                  {venue.description || "Sıcak, samimi bir mekan."}
                </p>
                <div className="flex items-center text-xs md:text-sm text-gray-200 mt-2">
                  <div className="flex items-center mr-3">
                    <Star className="text-yellow-500 w-4 h-4 mr-1 fill-current" />
                    <span className="font-semibold">
                      {venue.rating.toFixed(1)}
                    </span>
                  </div>
                  {isOpen ? (
                    <span className="mr-3">
                      • Kapanış: <strong>{closeTime}</strong>
                    </span>
                  ) : (
                    <span className="mr-3">• Kapalı</span>
                  )}
                </div>
              </div>
            </div>
            {/* Right Column: Quick Info Panel */}
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="flex items-center space-x-2">
                <Bike className="w-4 h-4 text-white" />
                <span className="text-sm font-medium">
                  Teslimat {deliveryTime}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">
                  Min. Sipariş {minOrder}
                </span>
                <span className="text-sm font-medium">• {deliveryFee}</span>
              </div>
              <button
                onClick={() => setShowMore(true)}
                className="flex items-center text-white text-sm font-medium hover:underline"
              >
                Daha Fazla <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* More Popup (modal) */}
      <OrderFoodVenueInfoMorePopup
        isOpen={showMore}
        onClose={() => setShowMore(false)}
        venueData={{
          name: venue.name,
          phone: venue.phone,
          email: venue.email,
          address: venue.location.address,
          schedule: [
            { day: "Pazartesi", hours: "Kapalı" },
            { day: "Salı", hours: "11:45–22:00" },
            { day: "Çarşamba", hours: "11:45–22:00" },
            { day: "Perşembe", hours: "11:45–22:00" },
            { day: "Cuma", hours: "11:45–22:00" },
            { day: "Cumartesi", hours: "11:45–22:00" },
            { day: "Pazar", hours: "11:45–22:00" },
          ],
          latitude: venue.location.latitude,
          longitude: venue.location.longitude,
        }}
      />
    </div>
  );
};

export default OrderFoodVenueInfo;
