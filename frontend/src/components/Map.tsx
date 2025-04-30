import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import MapStudentCafeteriaPopup from "./MapStudentCafeteriaPopup";
import MapUpcomingEvents from "./MapUpcomingEvents";
import MapUserLocationPopup from "./MapUserLocationPopup";
import MapBusHours from "./MapBusHours";
import { X, Calendar, MapPin, Bus } from "lucide-react";

// Replace with your own Mapbox Access Token
mapboxgl.accessToken =
  "pk.eyJ1IjoicGF1bGloIiwiYSI6ImNtNnRjbjlibDAxeWQyanNnbGpnazAwbzAifQ.b5EiudBGiXOuZdAE6ZxxBA";

const beytepeCoords: [number, number] = [32.734444, 39.867222];
const sihhiyeCoords: [number, number] = [32.861488, 39.93211];

const Map: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const userLocationMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const [showCafeteriaModal, setShowCafeteriaModal] = useState(false);
  const [showEventsModal, setShowEventsModal] = useState(false);
  const [showUserLocationPopup, setShowUserLocationPopup] = useState(false);
  const [showBusHoursModal, setShowBusHoursModal] = useState(false);
  const [navHeight, setNavHeight] = useState(0);
  // Track the current campus; default is Beytepe.
  const [currentCampus, setCurrentCampus] = useState<"beytepe" | "sihhiye">(
    "beytepe"
  );

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize the Mapbox map with default center at Beytepe.
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: beytepeCoords,
      zoom: 16,
      pitch: 60,
      bearing: -17.6,
    });
    mapRef.current = map;

    // Add navigation control in the top-right.
    map.addControl(new mapboxgl.NavigationControl(), "top-right");

    // Add the geocoder (search bar) control in the top-left corner.
    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl,
      placeholder: "Haritada ara...",
      marker: false,
    });
    map.addControl(geocoder, "top-left");

    map.on("load", () => {
      // Measure the height of the navigation control container for positioning dynamic buttons.
      const navEl = document.querySelector(".mapboxgl-ctrl-top-right");
      if (navEl) {
        setNavHeight(navEl.clientHeight);
      }

      // Add 3D buildings layer.
      const layers = map.getStyle().layers;
      let labelLayerId: string | undefined;
      if (layers) {
        for (let i = 0; i < layers.length; i++) {
          const layer = layers[i];
          if (
            layer.type === "symbol" &&
            layer.layout &&
            (layer.layout as any)["text-field"]
          ) {
            labelLayerId = layer.id;
            break;
          }
        }
      }
      map.addLayer(
        {
          id: "add-3d-buildings",
          source: "composite",
          "source-layer": "building",
          filter: ["==", "extrude", "true"],
          type: "fill-extrusion",
          minzoom: 15,
          paint: {
            "fill-extrusion-color": "#aaa",
            "fill-extrusion-height": [
              "interpolate",
              ["linear"],
              ["zoom"],
              15,
              0,
              15.05,
              ["get", "height"],
            ],
            "fill-extrusion-base": [
              "interpolate",
              ["linear"],
              ["zoom"],
              15,
              0,
              15.05,
              ["get", "min_height"],
            ],
            "fill-extrusion-opacity": 0.6,
          },
        },
        labelLayerId
      );

      // Create a marker for Öğrenci Kafeteryası and attach a click event to open the cafeteria modal.
      const cafeteriaMarker = new mapboxgl.Marker({ color: "#E74C3C" })
        .setLngLat([32.733849, 39.870939] as [number, number])
        .addTo(map);
      cafeteriaMarker.getElement().addEventListener("click", () => {
        setShowCafeteriaModal(true);
      });
    });

    // Realtime User Location: watch user's position and update marker continuously.
    let watchId: number | null = null;
    if ("geolocation" in navigator) {
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { longitude, latitude } = position.coords;
          if (userLocationMarkerRef.current) {
            userLocationMarkerRef.current.setLngLat([longitude, latitude]);
          } else {
            userLocationMarkerRef.current = new mapboxgl.Marker({
              color: "#2563EB", // Tailwind blue-600
            })
              .setLngLat([longitude, latitude])
              .addTo(map);
            userLocationMarkerRef.current
              .getElement()
              .addEventListener("click", () => {
                setShowUserLocationPopup(true);
              });
          }
        },
        (error) => {
          console.error("Error obtaining location", error);
        },
        { enableHighAccuracy: true }
      );
    }

    return () => {
      map.remove();
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, []);

  // Determine the label and target coordinates for the campus toggle button.
  const toggleButtonLabel =
    currentCampus === "beytepe" ? "Sıhhiye Kampüsü" : "Beytepe Kampüsü";
  const targetCoords =
    currentCampus === "beytepe" ? sihhiyeCoords : beytepeCoords;

  const handleCampusToggle = () => {
    // Fly to the target campus coordinates.
    mapRef.current?.flyTo({
      center: targetCoords,
      zoom: 16,
      speed: 1.2,
      curve: 1,
    });
    // Toggle the current campus.
    setCurrentCampus(currentCampus === "beytepe" ? "sihhiye" : "beytepe");
  };

  return (
    <div className="relative">
      {/* Map container */}
      <div ref={mapContainerRef} className="w-full h-screen" />

      {/* Dynamic Buttons Container */}
      <div
        className="absolute right-2 z-10 flex flex-col space-y-2 w-auto"
        style={{ top: navHeight + 10 }}
      >
        {/* Yaklaşan Etkinlikler Button */}
        <button
          onClick={() => setShowEventsModal(true)}
          className={`flex items-center w-auto h-10 px-2 sm:px-3 rounded-md text-[13px] font-medium transition duration-300 ${
            showEventsModal
              ? "bg-blue-50 text-blue-600 border-l-4 border-blue-600"
              : "bg-gray-100 text-black hover:bg-gray-200 hover:text-blue-600 border border-gray-300"
          }`}
        >
          <Calendar className="text-lg" />
          <span className="ml-2 hidden sm:inline">Yaklaşan Etkinlikler</span>
        </button>
        {/* Campus Toggle Button */}
        <button
          onClick={handleCampusToggle}
          className="flex items-center w-auto h-10 px-2 sm:px-3 rounded-md text-[13px] font-medium transition duration-300 bg-gray-100 text-black hover:bg-gray-200 hover:text-blue-600 border border-gray-300"
        >
          <MapPin className="text-lg mr-1" />
          <span className="hidden sm:inline">{toggleButtonLabel}</span>
        </button>
        {/* Ring Saatleri Button */}
        <button
          onClick={() => setShowBusHoursModal(true)}
          className={`flex items-center w-auto h-10 px-2 sm:px-3 rounded-md text-[13px] font-medium transition duration-300 ${
            showBusHoursModal
              ? "bg-blue-50 text-blue-600 border-l-4 border-blue-600"
              : "bg-gray-100 text-black hover:bg-gray-200 hover:text-blue-600 border border-gray-300"
          }`}
        >
          <Bus className="text-lg mr-1" />
          <span className="hidden sm:inline">Ring Saatleri</span>
        </button>
      </div>

      {/* Modal for Öğrenci Kafeteryası Popup */}
      {showCafeteriaModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white rounded-lg w-full max-w-[600px] h-[400px] overflow-y-auto p-4 relative">
            <MapStudentCafeteriaPopup
              onClose={() => setShowCafeteriaModal(false)}
            />
          </div>
        </div>
      )}

      {/* Modal for Upcoming Events */}
      {showEventsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white rounded-lg w-full max-w-[600px] h-[400px] overflow-y-auto p-4 relative">
            <div className="flex items-center justify-between mb-4 px-1">
              <h2 className="text-sm font-semibold text-gray-800">
                Yaklaşan Etkinlikler
              </h2>
              <button
                onClick={() => setShowEventsModal(false)}
                className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 transition-all"
              >
                <X size={16} className="text-gray-600" />
              </button>
            </div>
            <MapUpcomingEvents />
          </div>
        </div>
      )}

      {/* Modal for Bus Hours */}
      {showBusHoursModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white rounded-lg w-full max-w-[600px] h-[400px] overflow-y-auto p-4 relative">
            <div className="flex items-center justify-between mb-4 px-1">
              <h2 className="text-sm font-semibold text-gray-800">
                Hat Saatleri
              </h2>
              <button
                onClick={() => setShowBusHoursModal(false)}
                className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 transition-all"
              >
                <X size={16} className="text-gray-600" />
              </button>
            </div>
            <MapBusHours />
          </div>
        </div>
      )}

      {/* Modal for User Location Popup */}
      {showUserLocationPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white rounded-lg w-full max-w-[500px] h-auto overflow-y-auto p-4 relative">
            <MapUserLocationPopup
              onClose={() => setShowUserLocationPopup(false)}
            />
          </div>
        </div>
      )}

      {/* Fade-in Animation Style */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Map;
