import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { fetchFriends } from "../services/api";

// Set your Mapbox access token
mapboxgl.accessToken =
  "pk.eyJ1IjoicGF1bGloIiwiYSI6ImNtNnRjbjlibDAxeWQyanNnbGpnazAwbzAifQ.b5EiudBGiXOuZdAE6ZxxBA";

// Define the Friend interface (ensure your backend sends these fields)
interface Friend {
  _id: string;
  name: string;
  profileImage: string;
  latitude: number;
  longitude: number;
}

const MapUsers: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const [map, setMap] = useState<mapboxgl.Map | null>(null);
  const [friends, setFriends] = useState<Friend[]>([]);

  // Fetch friends from the API
  useEffect(() => {
    const loadFriends = async () => {
      try {
        const data = await fetchFriends();
        // Ensure the data contains latitude and longitude for each friend.
        setFriends(data);
      } catch (error) {
        console.error("Error fetching friends:", error);
      }
    };
    loadFriends();
  }, []);

  // Initialize Mapbox map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const initializedMap = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [32.734444, 39.867222] as [number, number], // Default center (e.g., Beytepe Campus)
      zoom: 14,
    });

    // Add default navigation control
    initializedMap.addControl(new mapboxgl.NavigationControl(), "top-right");

    setMap(initializedMap);

    return () => {
      initializedMap.remove();
    };
  }, []);

  // Add friend markers when both map and friend data are available.
  useEffect(() => {
    if (!map) return;

    // For each friend with valid coordinates, add a custom marker.
    friends.forEach((friend) => {
      if (friend.latitude && friend.longitude) {
        // Create a custom marker element
        const markerEl = document.createElement("div");
        markerEl.className =
          "w-10 h-10 rounded-full overflow-hidden border-2 border-gray-200 cursor-pointer";
        const imgEl = document.createElement("img");
        // Adjust image URL as needed
        imgEl.src = friend.profileImage
          ? `http://localhost:5001/${friend.profileImage}`
          : "/default-profile.png";
        imgEl.alt = friend.name;
        imgEl.className = "w-full h-full object-cover";
        markerEl.appendChild(imgEl);

        // Create and add the marker to the map
        new mapboxgl.Marker(markerEl)
          .setLngLat([friend.longitude, friend.latitude])
          .setPopup(
            new mapboxgl.Popup({ offset: 25 }).setHTML(
              `<h3 class="text-lg font-semibold">${friend.name}</h3>`
            )
          )
          .addTo(map);
      }
    });
  }, [map, friends]);

  return <div ref={mapContainerRef} className="w-full h-screen" />;
};

export default MapUsers;
