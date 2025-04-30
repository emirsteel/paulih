// src/components/MapUserSmall.tsx
import React, { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

// Replace with your own Mapbox Access Token
mapboxgl.accessToken =
  "pk.eyJ1IjoicGF1bGloIiwiYSI6ImNtNnRjbjlibDAxeWQyanNnbGpnazAwbzAifQ.b5EiudBGiXOuZdAE6ZxxBA";

const MapUserSmall: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize the Mapbox map
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [32.734444, 39.867222], // Initial center (fallback)
      zoom: 16,
    });

    // Create a marker with the initial fallback location
    markerRef.current = new mapboxgl.Marker({ color: "#2563EB" }) // Tailwind blue-600
      .setLngLat([32.734444, 39.867222])
      .addTo(map);

    // Watch the user's position and update the marker accordingly
    let watchId: number;
    if ("geolocation" in navigator) {
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          if (markerRef.current) {
            markerRef.current.setLngLat([longitude, latitude]);
          }
          // Optionally, update the map center to follow the user
          map.setCenter([longitude, latitude]);
        },
        (error) => {
          console.error("Error obtaining location", error);
        },
        { enableHighAccuracy: true }
      );
    }

    // Cleanup on component unmount
    return () => {
      map.remove();
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, []);

  return (
    <div
      className="w-60 h-60 rounded-lg shadow-md overflow-hidden cursor-pointer"
      onClick={() => navigate("/map")}
    >
      <div ref={mapContainerRef} className="w-full h-full" />
    </div>
  );
};

export default MapUserSmall;
