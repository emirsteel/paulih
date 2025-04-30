import React, { useEffect, useState } from "react";
import Map, { NavigationControl } from "react-map-gl";
import { FaArrowLeft, FaPlus, FaMinus } from "react-icons/fa";

interface OrderCartPaymentMapProps {
  userLocation: {
    latitude: number;
    longitude: number;
  } | null;
  viewport: {
    longitude: number;
    latitude: number;
    zoom: number;
  };
  setViewport: (viewport: any) => void;
  handleZoomIn: () => void;
  handleZoomOut: () => void;
  handleMapMove: (evt: any) => void;
}

const MAPBOX_TOKEN =
  "pk.eyJ1IjoicGF1bGloIiwiYSI6ImNtNnRjbjlibDAxeWQyanNnbGpnazAwbzAifQ.b5EiudBGiXOuZdAE6ZxxBA"; // Replace with your actual Mapbox API key

const OrderCartPaymentMap: React.FC<OrderCartPaymentMapProps> = ({
  userLocation,
  viewport,
  setViewport,
  handleZoomIn,
  handleZoomOut,
  handleMapMove,
}) => {
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  // Ensure the map centers on the user's location
  useEffect(() => {
    if (userLocation && !isMapLoaded) {
      setViewport({
        longitude: userLocation.longitude,
        latitude: userLocation.latitude,
        zoom: 15, // Optimal zoom level
      });
      setIsMapLoaded(true);
    }
  }, [userLocation, setViewport, isMapLoaded]);

  if (!userLocation) {
    return <p className="text-center text-gray-500">Loading map...</p>;
  }

  return (
    <div className="relative w-full h-[450px] overflow-hidden">
      <Map
        {...viewport}
        style={{ width: "100%", height: "100%" }} // ✅ Prevents horizontal scrolling
        mapStyle="mapbox://styles/mapbox/streets-v11"
        mapboxAccessToken={MAPBOX_TOKEN}
        onMove={handleMapMove}
        attributionControl={false}
      >
        <NavigationControl position="top-right" />

        {/* Custom Zoom Buttons */}
        <div className="absolute bottom-4 left-4 flex flex-col space-y-2">
          <button
            onClick={handleZoomIn}
            className="bg-white p-2 rounded-md shadow-md"
          >
            <FaPlus className="text-gray-700" />
          </button>
          <button
            onClick={handleZoomOut}
            className="bg-white p-2 rounded-md shadow-md"
          >
            <FaMinus className="text-gray-700" />
          </button>
        </div>

        {/* Map Attribution */}
        <div className="absolute top-2 right-2 bg-white bg-opacity-75 text-xs px-2 py-1 rounded-md shadow">
          <span>© Mapbox © OpenStreetMap</span>
        </div>
      </Map>

      {/* Checkout Title */}
      <div className="absolute top-10 left-10 text-white">
        <button className="flex items-center bg-black bg-opacity-50 text-white px-4 py-2 rounded-md shadow-md">
          <FaArrowLeft className="mr-2" /> Back
        </button>
        <h1 className="text-4xl text-black font-bold mt-3">Checkout</h1>
        <p className="text-lg text-black font-medium">Your Location</p>
      </div>
    </div>
  );
};

export default OrderCartPaymentMap;
