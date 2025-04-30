import React, { useState, useEffect, useContext } from "react";
import {
  FaStar,
  FaRegEdit,
  FaSave,
  FaTimes,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaBicycle,
  FaShoppingCart,
  FaHeart,
  FaClock,
} from "react-icons/fa";
import { toggleVenueLike } from "../services/api";
import { AuthUserContext } from "../context/AuthUserContext";

interface Venue {
  _id: string;
  logo: string;
  photos: string[];
  name: string;
  location: { address: string; city: string };
  rating: number;
  minimumPayment: string;
  discount: string;
  subcategory: string;
  deliveryTime: string;
  deliveryPrice: string;
  likedBy: string[];
}

interface OrderVenueDisplayProps {
  venues: Venue[];
  handleSelectVenue: (id: string) => void;
}

const OrderVenueDisplay: React.FC<OrderVenueDisplayProps> = ({
  venues,
  handleSelectVenue,
}) => {
  const { user } = useContext(AuthUserContext);
  const [sortedVenues, setSortedVenues] = useState<Venue[]>([]);
  const [sortOption, setSortOption] = useState<string>("");
  const [venueLikes, setVenueLikes] = useState<Record<string, boolean>>({});

  // Prepend this base URL to all image filenames.
  const IMAGE_BASE_URL = "http://localhost:5001/uploads/";

  useEffect(() => {
    if (venues.length > 0) {
      setSortedVenues(venues);
    }
  }, [venues]);

  useEffect(() => {
    const initialLikes: Record<string, boolean> = {};
    venues.forEach((venue) => {
      if (venue.likedBy.includes(user?._id)) {
        initialLikes[venue._id] = true;
      }
    });
    setVenueLikes(initialLikes);
  }, [venues, user]);

  // Sorting logic re-runs when sortOption changes
  useEffect(() => {
    if (venues.length > 0) {
      let sorted = [...venues];

      if (sortOption === "name-asc") {
        sorted.sort((a, b) => a.name.localeCompare(b.name));
      } else if (sortOption === "name-desc") {
        sorted.sort((a, b) => b.name.localeCompare(a.name));
      } else if (sortOption === "location") {
        sorted.sort((a, b) => a.location.city.localeCompare(b.location.city));
      } else if (sortOption === "price") {
        sorted.sort(
          (a, b) =>
            parseFloat(a.minimumPayment.replace(/[^0-9.-]+/g, "")) -
            parseFloat(b.minimumPayment.replace(/[^0-9.-]+/g, ""))
        );
      }

      setSortedVenues(sorted);
    }
  }, [venues, sortOption]);

  const handleLike = async (venueId: string) => {
    if (!user?._id) return alert("Oturum açmanız gerekmektedir.");
    try {
      await toggleVenueLike(venueId, user._id);
      setVenueLikes((prev) => ({
        ...prev,
        [venueId]: !prev[venueId],
      }));
    } catch (error) {
      console.error("Like işlemi başarısız:", error);
    }
  };

  return (
    <div className="p-6">
      {/* Top Controls */}
      <div className="flex justify-between items-center mb-4">
        <div className="text-left text-sm font-medium">
          <span className="text-blue-500 font-bold">{sortedVenues.length}</span>{" "}
          restoran gösteriliyor!
        </div>
        <select
          className="text-sm border border-gray-300 rounded-md px-2 py-1"
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
        >
          <option value="" disabled>
            Sırala
          </option>
          <option value="name-asc">İsim (A-Z)</option>
          <option value="name-desc">İsim (Z-A)</option>
          <option value="location">Lokasyon</option>
          <option value="price">Minimum Tutar</option>
        </select>
      </div>

      {/* Venue Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sortedVenues.map((venue) => (
          <div
            key={venue._id}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition cursor-pointer flex flex-col overflow-hidden"
            onClick={() => handleSelectVenue(venue._id)}
          >
            {/* Venue Image Container */}
            <div className="relative w-full h-52">
              <img
                src={venue.photos.length > 0 ? venue.photos[0] : venue.logo}
                alt={venue.name}
                className="absolute w-full h-full object-cover"
              />

              {/* Venue Logo (Bottom Left) */}
              <div className="absolute bottom-2 left-2 bg-white p-1 rounded-full shadow-lg">
                <img
                  src={`${IMAGE_BASE_URL}${venue.logo}`}
                  alt="Mekan Logosu"
                  className="w-10 h-10 rounded-full object-cover"
                />
              </div>

              {/* ♥ Like Button (Top Right) */}
              <button
                className="absolute top-2 right-2 bg-white bg-opacity-75 p-2 rounded-full shadow-md"
                onClick={(e) => {
                  e.stopPropagation();
                  handleLike(venue._id);
                }}
              >
                <FaHeart
                  className={`w-5 h-5 ${venueLikes[venue._id] ? "text-red-500" : "text-gray-400"}`}
                />
              </button>

              {/* Discount Badge (Bottom Right) */}
              {venue.discount && (
                <span className="absolute bottom-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-md shadow-md">
                  {venue.discount}
                </span>
              )}
            </div>

            {/* Venue Info */}
            <div className="p-4 flex flex-col">
              {/* Name and City */}
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-md font-bold truncate">
                  {venue.name} ({venue.location.city})
                </h3>
                <div className="flex items-center border border-gray-100 rounded-md px-2 py-1 text-xs bg-white w-16 justify-center">
                  <FaStar className="text-amber-500 w-3 h-3" />
                  <span className="ml-1 text-gray-600">{venue.rating}</span>
                </div>
              </div>

              {/* Minimum Price, Subcategory, and Sponsor Info */}
              <div className="flex justify-between items-center text-xs text-gray-500">
                <div className="flex items-center truncate">
                  <span>Min. {venue.minimumPayment}</span>
                  <span className="mx-2">•</span>
                  <span>{venue.subcategory}</span>
                </div>
                <div className="text-sm text-amber-500 font-medium">
                  Sponsorlu
                </div>
              </div>

              {/* Delivery Time and Additional Info */}
              <div className="flex justify-between items-center text-xs text-gray-500 mt-2">
                <div className="flex items-center truncate">
                  <FaClock className="text-gray-400 w-4 h-4 mr-1" />
                  <span>{venue.deliveryTime}</span>
                </div>
                <div className="flex items-center bg-purple-100 text-purple-600 px-2 py-1 rounded-md w-auto justify-center">
                  <div className="flex items-center justify-center bg-purple-500 text-white w-6 h-6 rounded-full mr-2">
                    P
                  </div>
                  <span>Permanent Supplier</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderVenueDisplay;
