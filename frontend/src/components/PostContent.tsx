// src/components/PostContent.tsx
import React, { useState } from "react";
import { FiX } from "react-icons/fi";
import { parseISO, format } from "date-fns";

interface PageInfo {
  _id: string;
  name: string;
  username: string;
  profileImage?: string;
}

interface PostContentProps {
  post: {
    content?: string;
    media?: string[];
    music?: {
      embedUrl: string;
      name?: string;
      artist?: string;
    };
    title?: string;
    date?: string;
    details?: string;
    image?: string;
    page?: PageInfo;
    startTime?: string;
    endTime?: string;
    location?: string;
  };
  isEvent?: boolean;
}

const PostContent: React.FC<PostContentProps> = ({ post, isEvent = false }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedImg, setSelectedImg] = useState<string | null>(null);

  const buildMediaUrl = (url: string) =>
    url.startsWith("http") ? url : `http://localhost:5001/${url}`;

  // ---------- EVENT MODE ----------
  if (isEvent) {
    const formatDayTime = (rawDate?: string, rawTime?: string) => {
      if (!rawDate) return "";
      try {
        const isoString = rawTime ? `${rawDate}T${rawTime}:00` : rawDate;
        const parsed = parseISO(isoString);
        return format(parsed, "EEE p"); // "Thu 10:00 AM"
      } catch {
        return rawDate;
      }
    };

    const formatMonthDay = (rawDate?: string) => {
      if (!rawDate) return "";
      try {
        const parsed = parseISO(rawDate);
        return format(parsed, "MMM dd"); // "Aug 24"
      } catch {
        return rawDate;
      }
    };

    const dayTime = formatDayTime(post.date, post.startTime);
    const monthDay = formatMonthDay(post.date);

    return (
      <div className="bg-white rounded-lg shadow-sm mt-4">
        {/* Event Bubbles */}
        <div className="flex items-center justify-between p-3 text-xs text-gray-600">
          {dayTime && (
            <span className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded-full font-medium">
              {dayTime}
            </span>
          )}
          {monthDay && (
            <span className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded-full font-medium">
              {monthDay}
            </span>
          )}
        </div>

        {/* Event Banner */}
        {post.image && (
          <div className="w-full aspect-video overflow-hidden">
            <img
              src={buildMediaUrl(post.image)}
              alt={post.title || "Event Image"}
              className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage(buildMediaUrl(post.image));
              }}
            />
          </div>
        )}

        {/* Event Details */}
        <div className="p-4">
          {post.title && (
            <h4 className="text-lg font-semibold text-gray-800 mb-1">
              {post.title}
            </h4>
          )}
          {post.page?.name && (
            <p className="text-sm text-gray-500 mb-2">
              Etkinlik sahibi: {post.page.name}
            </p>
          )}
          <p className="text-sm text-gray-500 mb-2">
            {post.location || "Konum belirtilmedi"}
          </p>
          {post.details && (
            <p className="text-sm text-gray-700 mb-3">{post.details}</p>
          )}
        </div>

        {/* Expanded Image Modal */}
        {selectedImage && (
          <div
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
            onClick={() => setSelectedImage(null)}
          >
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <img
                src={selectedImage}
                alt="Expanded media"
                className="max-w-full max-h-screen object-contain rounded-lg shadow-lg"
              />
              <button
                className="absolute top-2 right-2 w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImage(null);
                }}
              >
                <FiX className="text-gray-600" size={20} />
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ---------- NORMAL POST MODE ----------
  const images: string[] = [];
  const videos: string[] = [];

  post.media?.forEach((mediaUrl) => {
    const isImage = /\.(jpeg|jpg|png|gif)$/i.test(mediaUrl);
    const isVideo = /\.(mp4|webm|ogg|mov)$/i.test(mediaUrl);
    if (isImage) images.push(mediaUrl);
    if (isVideo) videos.push(mediaUrl);
  });

  const totalImages = images.length;
  const displayedImages = images.slice(0, 4);

  const renderImageCollage = () => {
    if (displayedImages.length === 0) return null;
    switch (displayedImages.length) {
      case 1:
        return (
          <div className="relative w-full aspect-square overflow-hidden rounded-md">
            <img
              src={buildMediaUrl(displayedImages[0])}
              alt="Post image"
              className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImg(buildMediaUrl(displayedImages[0]));
              }}
            />
          </div>
        );
      case 2:
        return (
          <div className="flex gap-2">
            {displayedImages.map((imgUrl, idx) => (
              <div
                key={idx}
                className="relative flex-1 aspect-square overflow-hidden rounded-md"
              >
                <img
                  src={buildMediaUrl(imgUrl)}
                  alt="Post image"
                  className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImg(buildMediaUrl(imgUrl));
                  }}
                />
              </div>
            ))}
          </div>
        );
      case 3:
        return (
          <div className="grid grid-cols-3 grid-rows-2 gap-2">
            <div className="col-span-2 row-span-2 relative overflow-hidden rounded-md">
              <img
                src={buildMediaUrl(displayedImages[0])}
                alt="Post image"
                className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImg(buildMediaUrl(displayedImages[0]));
                }}
              />
            </div>
            {displayedImages.slice(1).map((imgUrl, idx) => (
              <div key={idx} className="relative overflow-hidden rounded-md">
                <img
                  src={buildMediaUrl(imgUrl)}
                  alt="Post image"
                  className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImg(buildMediaUrl(imgUrl));
                  }}
                />
              </div>
            ))}
          </div>
        );
      case 4:
      default:
        return (
          <div className="grid grid-cols-2 grid-rows-2 gap-2">
            {displayedImages.map((imgUrl, idx) => {
              const showOverlay = idx === 3 && totalImages > 4;
              return (
                <div
                  key={idx}
                  className="relative aspect-square overflow-hidden rounded-md"
                >
                  <img
                    src={buildMediaUrl(imgUrl)}
                    alt="Post image"
                    className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedImg(buildMediaUrl(imgUrl));
                    }}
                  />
                  {showOverlay && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white text-lg font-semibold">
                      +{totalImages - 4}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        );
    }
  };

  return (
    <div className="mt-4">
      {/* Text Content */}
      {post.content && (
        <p
          className="text-gray-800 text-sm mb-4"
          onClick={(e) => e.stopPropagation()}
        >
          {post.content}
        </p>
      )}

      {/* Images */}
      {images.length > 0 && renderImageCollage()}

      {/* Videos */}
      {videos.length > 0 && (
        <div className="flex flex-col gap-4 mt-4">
          {videos.map((vidUrl, idx) => {
            const fullUrl = buildMediaUrl(vidUrl);
            return (
              <div
                key={idx}
                className="relative w-full overflow-hidden rounded-md"
              >
                <video
                  controls
                  className="w-full max-h-[500px] object-contain rounded-md"
                  onClick={(e) => e.stopPropagation()}
                >
                  <source src={fullUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            );
          })}
        </div>
      )}

      {/* Music Embed */}
      {post.music?.embedUrl && (
        <div className="mt-4">
          <iframe
            src={post.music.embedUrl}
            width="100%"
            height="300"
            frameBorder="0"
            allow="encrypted-media"
            className="rounded-md"
          ></iframe>
        </div>
      )}

      {/* Expanded Image Viewer */}
      {selectedImg && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={() => setSelectedImg(null)}
        >
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <img
              src={selectedImg}
              alt="Expanded"
              className="max-w-full max-h-screen object-contain rounded-lg shadow-lg"
            />
            <button
              className="absolute top-2 right-2 w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImg(null);
              }}
            >
              <FiX className="text-gray-600" size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostContent;
