import React from "react";
import Map, { Marker, NavigationControl } from "react-map-gl";
import { FaArrowLeft, FaPlus, FaMinus } from "react-icons/fa";

interface OrderFoodCartOverviewMapProps {
  venue: {
    name: string;
    location: {
      latitude: number;
      longitude: number;
    };
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

const OrderFoodCartOverviewMap: React.FC<OrderFoodCartOverviewMapProps> = ({
  venue,
  viewport,
  setViewport,
  handleZoomIn,
  handleZoomOut,
  handleMapMove,
}) => {
  if (!venue || !venue.location?.latitude || !venue.location?.longitude) {
    return <p className="text-center text-gray-500">Error loading map.</p>;
  }

  return (
    <div className="relative w-full h-[400px]">
      <div className="relative w-full h-[400px] overflow-hidden">
        <Map
          {...viewport}
          style={{ width: "100vw", height: "100%" }}
          mapStyle="mapbox://styles/mapbox/streets-v11"
          mapboxAccessToken={MAPBOX_TOKEN}
          onMove={handleMapMove}
          attributionControl={false}
        >
          {/* Marker as Rounded Circle */}
          <Marker
            longitude={venue.location.longitude}
            latitude={venue.location.latitude}
            anchor="center"
          >
            <div className="w-6 h-6 bg-green-500 opacity-90 rounded-full border-[3px] border-white shadow-lg"></div>
          </Marker>

          <NavigationControl position="top-right" />

          {/* ✅ Custom Zoom Buttons */}
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
      </div>

      {/* ✅ Checkout Title */}
      <div className="absolute top-10 left-10 text-black">
        <button className="flex items-center bg-white text-black px-4 py-2 rounded-md shadow-md">
          <FaArrowLeft className="mr-2" /> Back
        </button>
        <h1 className="text-4xl font-bold mt-3">Checkout</h1>
        <p className="text-lg font-medium text-gray-700">{venue.name}</p>
      </div>
    </div>
  );
};

export default OrderFoodCartOverviewMap;
