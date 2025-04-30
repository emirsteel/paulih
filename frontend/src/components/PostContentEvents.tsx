// src/components/PostContentEvents.tsx
import React, { useState, useEffect } from "react";
import { Heart, MapPin } from "lucide-react";

/** Helper: Format a time string (24‑hour format) */
function formatTimeHHMM(timeStr?: string) {
  if (!timeStr) return "";
  return timeStr;
}

/** Helper: Format the date */
function formatDate(dateStr?: string) {
  if (!dateStr) return "";
  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    year: "numeric",
  };
  return new Date(dateStr).toLocaleDateString(undefined, options);
}

/** Helper: Combine location details */
function getCombinedLocation(event: any) {
  let locationStr = "";
  if (event.locationType && event.locationType.trim() !== "") {
    const formattedType =
      event.locationType.trim().charAt(0).toUpperCase() +
      event.locationType.trim().slice(1);
    locationStr += formattedType;
  }
  if (event.locationLink && event.locationLink.trim() !== "") {
    if (locationStr) {
      locationStr += ": ";
    }
    locationStr += event.locationLink;
  }
  if (!locationStr && event.location && event.location.trim() !== "") {
    locationStr = event.location;
  }
  return locationStr || "Konum belirtilmedi";
}

interface Event {
  _id: string;
  title: string;
  date: string; // e.g. "2025-07-13"
  details: string; // event description
  image: string; // event banner image
  startTime?: string;
  endTime?: string;
  locationType?: string;
  locationLink?: string;
  category?: string;
  page?: {
    name: string;
    username: string;
    profileImage?: string;
  };
  participants?: Array<
    | {
        _id: string;
        name: string;
        username: string;
        profileImage?: string;
      }
    | string
  >;
}

interface PostContentEventsProps {
  event: Event;
  currentUserId: string;
}

const PostContentEvents: React.FC<PostContentEventsProps> = ({
  event,
  currentUserId,
}) => {
  // Build event image URL (assume non-HTTP images are stored in /uploads)
  const eventImageUrl = event.image?.startsWith("http")
    ? event.image
    : `http://localhost:5001/uploads/${encodeURI(event.image)}`;

  // Construct time range using ISO separator for proper parsing.
  const eventStart = event.startTime
    ? new Date(`${event.date}T${event.startTime}`)
    : null;
  const eventEnd = event.endTime
    ? new Date(`${event.date}T${event.endTime}`)
    : null;
  const timeRange =
    eventStart && eventEnd
      ? `${formatTimeHHMM(event.startTime)} - ${formatTimeHHMM(event.endTime)}`
      : formatTimeHHMM(event.startTime) || formatTimeHHMM(event.endTime) || "";

  // Format date for badges.
  const formattedDate = formatDate(event.date);
  const dateObj = new Date(event.date);
  const dateBubbleText = dateObj.toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "short",
  });

  // Participants state
  const [participants, setParticipants] = useState<Array<any>>(
    event.participants || []
  );
  const isUserParticipating = (pArray: Array<any>, userId: string) =>
    pArray.some((p) =>
      p._id ? p._id.toString() === userId : p.toString() === userId
    );
  const [liked, setLiked] = useState(
    isUserParticipating(participants, currentUserId)
  );
  useEffect(() => {
    setParticipants(event.participants || []);
  }, [event.participants]);
  useEffect(() => {
    setLiked(isUserParticipating(participants, currentUserId));
  }, [participants, currentUserId]);

  const toggleParticipation = async () => {
    try {
      const response = await fetch(
        "http://localhost:5001/api/events/participate",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ eventId: event._id, userId: currentUserId }),
        }
      );
      if (!response.ok) throw new Error("Failed to toggle participation");
      const data = await response.json();
      setParticipants(data.participants);
      setLiked(isUserParticipating(data.participants, currentUserId));
    } catch (error) {
      console.error("Error toggling participation:", error);
    }
  };

  // Countdown timer logic (unchanged)
  const [countdown, setCountdown] = useState("");
  useEffect(() => {
    if (
      event.date &&
      event.startTime &&
      event.endTime &&
      eventStart &&
      eventEnd
    ) {
      const updateCountdown = () => {
        const now = new Date();
        if (now < eventStart) {
          const diff = eventStart.getTime() - now.getTime();
          const diffDays = Math.floor(diff / (1000 * 60 * 60 * 24));
          if (diffDays >= 30) {
            const months = Math.floor(diffDays / 30);
            setCountdown(`${months} ay kaldı`);
          } else if (diffDays >= 7) {
            const weeks = Math.floor(diffDays / 7);
            setCountdown(`${weeks} hafta kaldı`);
          } else if (diffDays >= 1) {
            setCountdown(`${diffDays} gün kaldı`);
          } else {
            if (diff >= 3600000) {
              const hours = Math.floor(diff / (1000 * 60 * 60));
              const remainderAfterHours = diff % (1000 * 60 * 60);
              const minutes = Math.floor(remainderAfterHours / (1000 * 60));
              const seconds = Math.floor(
                (remainderAfterHours % (1000 * 60)) / 1000
              );
              setCountdown(
                `${hours} saat ${minutes} dakika ${seconds} saniye kaldı`
              );
            } else if (diff >= 60000) {
              const minutes = Math.floor(diff / (1000 * 60));
              const seconds = Math.floor((diff % (1000 * 60)) / 1000);
              setCountdown(`${minutes} dakika ${seconds} saniye kaldı`);
            } else {
              setCountdown(`${Math.floor(diff / 1000)} saniye kaldı`);
            }
          }
        } else if (now >= eventStart && now < eventEnd) {
          setCountdown("Etkinlik başladı");
        } else {
          setCountdown("Etkinlik sona erdi");
        }
      };
      updateCountdown();
      const interval = setInterval(updateCountdown, 1000);
      return () => clearInterval(interval);
    } else {
      setCountdown("");
    }
  }, [event.date, event.startTime, event.endTime, eventStart, eventEnd]);

  // Get combined location string
  const locationText = getCombinedLocation(event);

  return (
    <div className="post-content-events bg-white border border-gray-200 rounded-lg shadow-sm max-w-[700px] mx-auto relative overflow-hidden">
      {/* Page info overlay (top-center) */}
      {event.page && (
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 flex items-center space-x-2 bg-white bg-opacity-75 px-3 py-1 rounded-full z-10">
          <img
            src={event.page.profileImage || "/default-profile.png"}
            alt={event.page.name}
            className="w-6 h-6 rounded-full object-cover"
          />
          <div className="text-xs text-gray-800">
            <span className="font-semibold">{event.page.name}</span>
            <span> @{event.page.username}</span>
          </div>
        </div>
      )}

      {/* Banner image container */}
      <div className="relative w-full overflow-hidden">
        <img
          src={eventImageUrl}
          alt={event.title}
          className="w-full h-[240px] object-cover transform transition duration-300 group-hover:scale-105"
        />
        {/* Fade overlay with backdrop blur */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

        {/* Top-left Time Range Badge */}
        {timeRange && (
          <div className="absolute top-2 left-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold z-10">
            {timeRange}
          </div>
        )}

        {/* Top-right Date Badge */}
        {formattedDate && (
          <div className="absolute top-2 right-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold z-10">
            {dateBubbleText}
          </div>
        )}

        {/* Bottom-left Countdown Badge */}
        {countdown && (
          <div className="absolute bottom-2 left-2 bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-xs font-semibold z-10">
            {countdown}
          </div>
        )}

        {/* Participation (Love) Icon on bottom-right */}
        <div className="absolute bottom-2 right-2 z-10">
          <div
            onClick={toggleParticipation}
            className="relative group p-2 bg-gray-100 rounded-full cursor-pointer"
          >
            <Heart
              className="h-6 w-6"
              fill={liked ? "red" : "none"}
              stroke="red"
            />
            <span className="absolute left-1/2 -top-6 transform -translate-x-1/2 bg-gray-700 text-white text-[10px] font-medium rounded px-1 py-0.5 opacity-0 group-hover:opacity-100 transition">
              Katılıyorum
            </span>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4">
        <h4 className="text-lg font-semibold text-gray-800 mb-1">
          {event.title}
        </h4>
        {event.category && (
          <span className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full mb-2">
            {event.category}
          </span>
        )}
        <p className="text-sm text-gray-500 mb-2">Lokasyon • {locationText}</p>
        {event.details && (
          <p className="text-sm text-gray-700 mb-3">{event.details}</p>
        )}
        <div className="flex items-center mt-3">
          {participants && participants.length > 0 ? (
            <>
              {participants.slice(0, 3).map((participant) => (
                <img
                  key={participant._id || participant}
                  className="w-8 h-8 rounded-full border-2 border-white"
                  src={participant.profileImage || "/default-profile.png"}
                  alt={participant.name || "Participant"}
                />
              ))}
              {participants.length > 3 && (
                <span className="text-xs text-gray-500 ml-1">
                  +{participants.length - 3} more
                </span>
              )}
            </>
          ) : (
            <span className="text-xs text-gray-500">No participants</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostContentEvents;
