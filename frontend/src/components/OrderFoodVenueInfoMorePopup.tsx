import React from "react";
import { X } from "lucide-react";

/**
 * Utility to generate a Mapbox static map URL with a pin at (lon, lat).
 *
 * @param lat The venue's latitude
 * @param lon The venue's longitude
 * @returns A fully qualified static map URL
 */
function getMapboxStaticMapURL(lat: number, lon: number): string {
  const accessToken =
    "pk.eyJ1IjoicGF1bGloIiwiYSI6ImNtNnRjbjlibDAxeWQyanNnbGpnazAwbzAifQ.b5EiudBGiXOuZdAE6ZxxBA";

  // Using Mapbox's static images API with the "streets-v11" style,
  // zoom level 14, image size 600x300, and a small red pin.
  return `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/pin-s+ff0000(${lon},${lat})/${lon},${lat},14,0/600x300?access_token=${accessToken}`;
}

interface OrderFoodVenueInfoMorePopupProps {
  isOpen: boolean;
  onClose: () => void;
  venueData: {
    name: string;
    phone: string;
    email: string;
    address: string;
    schedule: {
      day: string;
      hours: string;
    }[];
    latitude: number;
    longitude: number;
  };
}

const OrderFoodVenueInfoMorePopup: React.FC<
  OrderFoodVenueInfoMorePopupProps
> = ({ isOpen, onClose, venueData }) => {
  if (!isOpen) return null;

  // Generate the static map URL using the provided latitude and longitude
  const mapURL = getMapboxStaticMapURL(venueData.latitude, venueData.longitude);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
          onClick={onClose}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Map Section */}
        <div className="relative h-40 w-full overflow-hidden rounded-t-lg mb-4">
          <img
            src={mapURL}
            alt="Map location"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Venue Info Header */}
        <h2 className="text-xl font-bold mb-2">{venueData.name}</h2>
        <p className="text-sm text-gray-600 mb-2">{venueData.address}</p>
        <p className="text-sm text-gray-600 mb-2">Phone: {venueData.phone}</p>
        <p className="text-sm text-gray-600 mb-4">Email: {venueData.email}</p>

        {/* Delivery Information (Example) */}
        <div className="mb-4">
          <h3 className="font-semibold text-gray-800 mb-2">
            Delivery Information
          </h3>
          <p className="text-sm text-gray-700">
            Base delivery fee: £1.79
            <br />
            Small order surcharge limit: £10.00
            <br />
            Delivery range limit: 1 km
            <br />
            Estimated time until delivery: 25 min
          </p>
        </div>

        {/* Schedule (Opening Hours) */}
        <div className="mb-4">
          <h3 className="font-semibold text-gray-800 mb-2">Opening Hours</h3>
          {venueData.schedule.map((item, idx) => (
            <div
              key={idx}
              className="flex justify-between text-sm text-gray-700"
            >
              <span>{item.day}</span>
              <span>{item.hours}</span>
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <p className="text-xs text-gray-500">
          The Partner is committed to only offering products and/or services
          that comply with the applicable laws.
        </p>
      </div>
    </div>
  );
};

export default OrderFoodVenueInfoMorePopup;
