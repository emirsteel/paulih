// src/components/MapUpcomingEvents.tsx
import React, { useState, useEffect } from "react";
import { getAllEvents } from "../services/api";

// Helper: Get image URL from event data (checks image and photo)
const getImageUrl = (event: any) => {
  const rawImage = event.image || event.photo;
  if (!rawImage) return "/default-event.png";
  return rawImage.startsWith("http")
    ? rawImage
    : `http://localhost:5001/uploads/${rawImage}`;
};

const MapUpcomingEvents: React.FC = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventsData = await getAllEvents();
        // Filter out past events based on endTime (or startTime if endTime is missing)
        const now = new Date();
        const upcoming = eventsData.filter((event: any) => {
          if (event.endTime) {
            const eventEnd = new Date(`${event.date}T${event.endTime}`);
            return eventEnd > now;
          } else if (event.startTime) {
            const eventStart = new Date(`${event.date}T${event.startTime}`);
            return eventStart > now;
          }
          return true;
        });
        setEvents(upcoming);
      } catch (error) {
        console.error("Etkinlikler alınırken hata oluştu:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  if (loading) {
    return <p className="text-center text-gray-500">Yükleniyor...</p>;
  }

  if (events.length === 0) {
    return <p className="text-center text-gray-500">Etkinlik bulunamadı.</p>;
  }

  // Use all events; each will use the same design.
  return (
    <div className="space-y-6">
      {events.map((event) => {
        // Format date for badges in Turkish (e.g., "29 Mayıs")
        const dateObj = new Date(event.date);
        const dateBubbleText = dateObj.toLocaleDateString("tr-TR", {
          day: "numeric",
          month: "short",
        });
        // Build time range string (e.g., "10:00 - 12:00")
        const timeRange =
          event.startTime && event.endTime
            ? `${event.startTime} - ${event.endTime}`
            : event.startTime || event.endTime || "";

        return (
          <div
            key={event.id || event._id}
            className="relative mx-auto max-w-[400px] h-72 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow cursor-pointer group"
          >
            {/* Background image */}
            <img
              src={getImageUrl(event)}
              alt={event.title}
              className="w-full h-full object-cover transform transition duration-300 group-hover:scale-105"
            />
            {/* Fade overlay with padding for text */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent p-4 flex flex-col justify-end" />
            {/* Top-left Time Range Badge */}
            {timeRange && (
              <div className="absolute top-2 left-2 bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-semibold z-10">
                {timeRange}
              </div>
            )}
            {/* Top-right Date Badge */}
            <div className="absolute top-2 right-2 bg-blue-50 text-blue-600 px-2 py-1 rounded-full text-xs font-semibold z-10">
              {dateBubbleText}
            </div>
            {/* Bottom Text Overlay */}
            <div className="absolute bottom-2 left-2 right-2 text-white z-10">
              <h2 className="text-2xl font-bold leading-tight">
                {event.title}
              </h2>
              {event.description && (
                <p className="mt-1 text-sm text-gray-300">
                  {event.description}
                </p>
              )}
              <p className="mt-1 text-sm text-gray-300">
                {event.date} • {timeRange}
              </p>
              <p className="text-sm text-gray-200">{event.location}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MapUpcomingEvents;
